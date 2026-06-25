# Front End Development Playbook

> This playbook is the primary context document for a Claude agent working on front-end code in this project. Read it in full before writing any code. Every rule here is authoritative — when in doubt, follow the playbook over general instinct.

---

## Table of Contents

1. [What this playbook covers](#1-what-this-playbook-covers)
2. [NAIV — FE Codegen & API Contract](#2-naiv--fe-codegen--api-contract)
3. [Project Structure](#3-project-structure)
4. [Data Fetching Architecture](#4-data-fetching-architecture)
5. [State Management](#5-state-management)
6. [Authentication & Session](#6-authentication--session)
7. [Error Handling](#7-error-handling)
8. [Component Design](#8-component-design)
9. [UI/UX Best Practices](#9-uiux-best-practices)
10. [Performance](#10-performance)
11. [Accessibility](#11-accessibility)
12. [Testing](#12-testing)
13. [Code Quality & Tooling](#13-code-quality--tooling)
14. [Common Mistakes to Avoid](#14-common-mistakes-to-avoid)

---

## 1. What this playbook covers

This document covers everything needed to work correctly on the front-end codebase. It covers the NAIV API contract, the data-fetching layer, state management, component patterns, UI/UX standards, accessibility, and testing.

**The golden rule for FE:** The `/api` directory is generated output — a typed contract delivered by the BE team. You consume it; you do not rewrite it. All network calls go through `AxiosClient`. All type imports come from `/api`. You never hand-write types for API shapes.

---

## 2. NAIV — FE Codegen & API Contract

### What NAIV generates for the FE

NAIV's codegen produces a fully-typed HTTP client and a three-layer type system. The output lives in `/api` and is regenerated every time the BE team updates their `.naiv` design files. Running `npm run codegen:api` pulls the latest from the BE repo and patches it for FE use.

### The /api directory structure

```
/api/
  AxiosClient.ts          # Generated typed HTTP client — the only way to make API calls
  api/                    # One file per endpoint — T_* request/response types
  model/
    table/                # TypeScript interfaces for every database table
    enum/                 # TypeScript enums (ChallengeType, GameStatus, etc.)
  schema/                 # Composed response types that join multiple model types
```

**None of these files are yours to edit.** They are regenerated on every `npm run codegen:api` run. Any manual edits will be overwritten.

### The three type layers and when to use each

| Layer | Location | Use when |
|-------|----------|----------|
| **Contract types** | `/api/api/T_*.ts` | Typing the arguments you pass to `AxiosClient.*` |
| **Model types** | `/api/model/table/*.ts` | Typing domain objects in business logic |
| **Schema types** | `/api/schema/*.ts` | Typing what a hook returns from the API |
| **Enum types** | `/api/model/enum/*.ts` | Comparing or assigning any enum field |
| **Local UI types** | `src/types/` | Component props, UI state — things that don't come from the API |

**Never create a type in `src/types/` that duplicates something in `/api`.** If the shape already exists, import it.

### The `otm_*` relation fields

Model types include `otm_*` fields (e.g. `otm_created_by?: User`). These are ORM relation artefacts — they will never be present in real API responses. **Never use `otm_*` fields in FE code.** They exist only to describe the relational structure; treat them as documentation.

### 2.1 Setting up codegen

The codegen script copies NAIV design output from the BE repo and patches it for the FE environment.

**In `package.json`:**
```json
{
  "scripts": {
    "codegen:api": "npx @naiv/codegen-axios-client@latest -d ../your-be-repo/design -o api && node scripts/patch-axios-base-url.mjs"
  }
}
```

The `-d` flag points to the BE repo's `/design` directory. The `-o` flag sets the output directory (`api`). The patch script runs immediately after to fix the `base_url` default.

### 2.2 The AxiosClient base_url patch

The generated `AxiosClient.ts` has a hardcoded `base_url` default that won't work in a Vite project. The patch script replaces it with a reference to the `VITE_API_URL` environment variable:

```javascript
// scripts/patch-axios-base-url.mjs
import fs from 'node:fs'
import path from 'node:path'

const targetFile = path.join(process.cwd(), 'api', 'AxiosClient.ts')

if (!fs.existsSync(targetFile)) {
  console.error(`AxiosClient not found at: ${targetFile}`)
  process.exit(1)
}

const source = fs.readFileSync(targetFile, 'utf8')
const replacement = "public base_url: string = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';"

if (source.includes(replacement)) {
  console.log('AxiosClient base_url already patched.')
  process.exit(0)
}

const patched = source.replace(/public\s+base_url:\s*string\s*=\s*[^;]+;/, replacement)
fs.writeFileSync(targetFile, patched, 'utf8')
console.log('Patched AxiosClient base_url with VITE_API_URL fallback.')
```

Write this patch script to `scripts/patch-axios-base-url.mjs` and reference it in `codegen:api`. If additional patches are needed (e.g. interceptor injection points), add them as additional patch scripts chained with `&&` in the npm script.

### 2.3 Running codegen:api

```
Step 1 — Run the command
         npm run codegen:api

Step 2 — Review the output
         Check /api/api/ — do new T_* files appear for new endpoints?
         Check /api/model/ — are new table/enum interfaces correct?
         Check /api/schema/ — are new schema types present?
         Check /api/AxiosClient.ts — do new methods appear at the bottom?
         Verify the patch was applied (look for VITE_API_URL in AxiosClient.ts)

Step 3 — Update affected hooks and components
         Any hook that called a renamed or changed endpoint must be updated
         Any type import that references a changed schema must be updated
         Run the TypeScript compiler (tsc --noEmit) to find every breakage
```

Run `codegen:api` whenever the BE team tells you the API has changed, or whenever you pull from the BE repo and see changes to `design/*.naiv` files.

### 2.4 Calling the AxiosClient

**Every API call uses `AxiosClient.<methodName>()`**. Never call `axios` or `fetch` directly. Never call `AxiosClient` inside a component body — all calls go through custom hooks.

```typescript
// In a custom hook — not in a component
import { AxiosClient } from '@/api/AxiosClient'
import { T_adminGetChallengesByStationID_path } from '@/api/api/adminGetChallengesByStationID'
import { T_adminGetChallengesByStationID_query } from '@/api/api/adminGetChallengesByStationID'

// Pattern: named shape, explicit types
const response = await AxiosClient.adminGetChallengesByStationID({
  headers: { authorization: UserUtility.getAuthHeader() },
  path:    { station_id: stationId },           // T_*_path
  query:   { limit: 50, offset: 0 },            // T_*_query
})
```

The auth header utility (`UserUtility.getAuthHeader()` or equivalent) reads the token from `localStorage` at call time — not at module load time. This ensures logout takes effect immediately.

### 2.5 Auth header injection via Axios interceptor

Rather than passing headers manually to every call, wire up a single Axios request interceptor. Set this up once in `src/lib/axiosSetup.ts` and call it before rendering:

```typescript
// src/lib/axiosSetup.ts
import axios from 'axios'
import { TOKEN_KEY, ROUTES } from '@/constants'

export function setupAxiosInterceptors(): void {
  axios.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  axios.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem(TOKEN_KEY)
        window.location.href = `${ROUTES.LOGIN}?reason=expired`
      }
      return Promise.reject(error)
    }
  )
}
```

When the interceptor is in place, you can omit `headers: { authorization: ... }` from individual `AxiosClient` calls — the interceptor adds it to every request automatically.

---

## 3. Project Structure

```
/api/                         # Generated — never edit
  AxiosClient.ts
  api/                        # T_* types
  model/table/ model/enum/    # Domain model types
  schema/                     # Response schema types

/scripts/
  patch-axios-base-url.mjs    # Run as part of codegen:api

/src/
  lib/
    axiosSetup.ts             # Axios interceptors — auth + 401 redirect
  hooks/                      # Custom hooks — one file per data concern
    useChallenge.ts
    useStation.ts
    useGame.ts
    useDebounce.ts
    ...
  components/                 # Shared UI components (Button, Modal, Skeleton, Toast, ...)
  pages/                      # Route-level page components (lazy-imported in App.tsx)
  context/
    AuthContext.tsx            # Token + user state — nothing else
  types/                      # Local-only types: component props, UI state shapes
  constants.ts                # TOKEN_KEY, ROUTES, QUERY_KEYS — no magic strings
  config.ts                   # Validated env vars — throws on missing VITE_API_URL
  App.tsx                     # Route definitions, lazy imports, error boundaries
  main.tsx                    # setupAxiosInterceptors(), AxiosClient.BaseURL.instance.set(), render
```

### Initialisation order in main.tsx

```typescript
// main.tsx — strict order matters
import { setupAxiosInterceptors } from '@/lib/axiosSetup'
import { AxiosClient } from '@/api/AxiosClient'
import { API_BASE_URL } from '@/config'

setupAxiosInterceptors()                    // 1. Interceptors first
AxiosClient.BaseURL.instance.set(API_BASE_URL)  // 2. Then base URL

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
```

---

## 4. Data Fetching Architecture

### The three-layer call chain

```
Component / Page
      ↓  calls hook
Custom Hook (src/hooks/)
      ↓  calls AxiosClient
AxiosClient (api/AxiosClient.ts)
      ↓  HTTP request
Back End API
```

Components never skip a layer. A page component does not import `AxiosClient` directly. A hook does not render JSX.

### Custom hook structure

Every hook that fetches data follows this pattern:

```typescript
// src/hooks/useChallenges.ts
import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AxiosClient } from '@/api/AxiosClient'
import { QUERY_KEYS, ROUTES } from '@/constants'
import { AdminChallengeResult } from '@/api/schema/AdminChallengeResult'

export function useChallenges(stationId: number) {
  const navigate = useNavigate()

  return useQuery<AdminChallengeResult>({
    queryKey: QUERY_KEYS.CHALLENGES(stationId),
    queryFn: async () => {
      try {
        return await AxiosClient.adminGetChallengesByStationID({
          path:  { station_id: stationId },
          query: { limit: 50, offset: 0 },
        })
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 404) {
          navigate(ROUTES.STATIONS, { replace: true })
        }
        throw err
      }
    },
    enabled: stationId > 0,
  })
}
```

### Custom mutation hook structure

```typescript
// src/hooks/useCreateChallenge.ts
import { useMutation, useQueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'
import { AxiosClient } from '@/api/AxiosClient'
import { T_adminCreateChallenge_body } from '@/api/api/adminCreateChallenge'
import { QUERY_KEYS } from '@/constants'

export function useCreateChallenge(stationId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: T_adminCreateChallenge_body) =>
      AxiosClient.adminCreateChallenge({ body }),

    onSuccess: () => {
      // Always invalidate the list that contains this resource
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.CHALLENGES(stationId) })
    },

    onError: (err: unknown) => {
      const message = axios.isAxiosError(err)
        ? (err as AxiosError<{ error: string }>).response?.data?.error ?? 'Failed to create'
        : 'Failed to create'
      // Forward to your toast system
      console.error('[useCreateChallenge]', message)
    },
  })
}
```

### Query key management

All query keys live in `src/constants.ts`. Never inline query key strings.

```typescript
// src/constants.ts
export const QUERY_KEYS = {
  CHALLENGES:  (stationId: number)                   => ['challenges', stationId]         as const,
  CHALLENGE:   (id: number)                           => ['challenge', id]                 as const,
  STATIONS:    (moduleId: number)                     => ['stations', moduleId]            as const,
  STATION:     (id: number)                           => ['station', id]                   as const,
  GAME:        (id: number)                           => ['game', id]                      as const,
  GAMES:                                                 'games'                           as const,
  LEADERBOARD: (gameId: number)                       => ['game', gameId, 'leaderboard']  as const,
} as const
```

---

## 5. State Management

### Classify every piece of state before writing code

| Kind | Definition | Storage |
|------|-----------|---------|
| **Server state** | Anything fetched from the API | TanStack Query cache only |
| **Auth state** | Current user + token | `AuthContext` |
| **Global UI state** | Toast queue, theme | Context or Zustand |
| **Local UI state** | Modal open, form input, loading indicator | `useState` / `useReducer` |
| **URL state** | Selected ID, filters, page | URL query params / path |
| **Derived state** | Computed from other state | Inline `useMemo` — never `useState` |

### Hard rules

- Never copy API response data into `useState` to "make it editable". Use TanStack Query's optimistic update or keep local edits in a controlled form and submit to the mutation.
- Never store the result of transforming server state into another `useState`. Use `useMemo`.
- The URL is state. If a filter or selection should survive a page refresh, put it in the URL.
- `AuthContext` holds the token and the current user object. Nothing else.

---

## 6. Authentication & Session

### Token storage and reading

The token lives in `localStorage` under `TOKEN_KEY`. Read it at call time — not captured at module load.

```typescript
// src/constants.ts
export const TOKEN_KEY = 'mun_wiki_token'   // or your project's key
```

### Session expiry

The Axios response interceptor (Section 2.5) handles every 401 globally. It clears the token and redirects to `/login?reason=expired`. The login page reads this query param and shows "Session expired — please sign in again."

No individual hook or component should handle 401 — the interceptor catches it first.

### Protected routes

The app-level layout component checks for a token on render. If none exists, redirect immediately to `/login`. Do not rely on API calls returning 401 to trigger the redirect — check the token synchronously on mount.

```typescript
// src/pages/AppLayout.tsx
import { Navigate } from 'react-router-dom'
import { TOKEN_KEY, ROUTES } from '@/constants'

export function AppLayout({ children }) {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return <Navigate to={ROUTES.LOGIN} replace />
  return children
}
```

---

## 7. Error Handling

### Reading the server error message

The BE always returns `{ "error": "message" }`. Access it safely:

```typescript
function getApiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return (err as AxiosError<{ error: string }>).response?.data?.error ?? fallback
  }
  return fallback
}
```

### Status code handling

| Status | What to do |
|--------|-----------|
| 400 | Show the error message inline near the triggering field |
| 401 | Handled by interceptor — never handle in a hook |
| 404 | Navigate away or show an empty/not-found state |
| 409 | Show the server's `error` message as a toast warning |
| 422 | Show the server's `error` message inline or as a toast |
| Network error | Show "Network error — check your connection" toast |
| 500 | Show generic "Something went wrong" toast; log detail to console |

### Every mutation needs an onError handler

No mutation is fire-and-forget. Every `useMutation` has `onError`. Every `onError` surfaces a message to the user — never swallows the error silently.

---

## 8. Component Design

### File organisation

One concern per file. A page component orchestrates; it does not contain business logic or inline styles.

```
src/pages/ChallengePage.tsx      # Route component — calls hooks, renders layout
src/hooks/useChallenges.ts       # Data fetching + cache
src/hooks/useCreateChallenge.ts  # Mutation
src/components/ChallengeList.tsx # Presentational — receives data + callbacks as props
src/components/ChallengeForm.tsx # Controlled form — calls mutation on submit
```

### Props are a public API

Every component's props have an explicit interface. No anonymous inline types on component declarations.

```typescript
// ✅
interface ChallengeCardProps {
  challenge: Challenge
  onEdit: (id: number) => void
  onDelete: (id: number) => void
}
export function ChallengeCard({ challenge, onEdit, onDelete }: ChallengeCardProps) { ... }

// ❌ No anonymous inline types
export function ChallengeCard({ challenge, onEdit, onDelete }: {
  challenge: Challenge; onEdit: (id: number) => void; ...
}) { ... }
```

### No prop drilling beyond two levels

If a value must pass through three or more component layers, it belongs in context or the consumer component should query for it directly via its own hook.

### Use React.memo on list items

List-item components that receive stable props should be wrapped in `React.memo`. This prevents the entire list re-rendering when only one item changes.

```typescript
export const ChallengeCard = React.memo(function ChallengeCard({ challenge, onEdit }: Props) {
  // ...
})
```

---

## 9. UI/UX Best Practices

### Design philosophy

The UI must support the user's task, not showcase itself. Every element earns its place. When in doubt, remove rather than add. These principles apply regardless of the specific visual design of your project.

### Loading states

- **Lists** use skeleton loaders — placeholder elements matching the shape and approximate dimensions of real content. Never a spinner inside a list container.
- **Buttons** that trigger mutations show a loading indicator (spinner replacing the label) for the duration of the in-flight request. The button is disabled during this period.
- **Pages** use a skeleton layout matching the page structure. Use `aria-busy="true"` on the loading container.

### Empty states

Every list surface must have a designed empty state. A blank white box is not an empty state.

Each empty state should: name what is missing, explain why (if not obvious), and offer an action if one is available. Example: "No challenges yet — add one to get started." with an Add button.

### Error states

- Inline errors (form field validation, 400 responses): appear immediately below the relevant input, in the error colour, using `role="alert"`.
- Toast notifications: used for action feedback (success / failure of a mutation), network errors, and session expiry warnings. Auto-dismiss success toasts after ~4 s. Require explicit dismissal for error toasts.
- Page-level errors (404, 500): full-page error state with a clear headline, a human-readable explanation, and a recovery action ("Go back", "Try again").

### Feedback for user actions

Every mutation should produce visible feedback:
- **Success**: a success toast or an inline "Saved ✓" indicator near the triggering element.
- **Failure**: an error toast or inline error message.
- **In-progress**: a loading indicator on the triggering element.

Never leave the user wondering whether their action did anything.

### Confirmation dialogs

Destructive or irreversible actions (delete, reset progress, end a game) must require confirmation before executing. The dialog must: name the resource being affected, describe the consequence clearly and specifically, use a danger-styled confirm button, and offer a cancel option. It must be dismissible via Escape.

### Forms

- Every input has a visible label (not just a placeholder — placeholders disappear on focus and are not a substitute for labels).
- Validation runs on submit; field-level validation runs on blur. Never run field validation on every keystroke.
- Required fields are indicated (asterisk + legend, or equivalent).
- The submit button is disabled while a mutation is in flight to prevent double-submission.
- After a successful form submission, clear the form and show success feedback.

### Navigation and information architecture

- The active page, section, or item in any navigation structure must be visually distinct from inactive items.
- Breadcrumbs or back links must appear wherever the user has navigated more than one level deep.
- Destructive actions are never placed adjacent to safe actions of similar visual weight — separate them spatially or visually.

### Responsive design

- Define breakpoints in your design token system and use them consistently.
- Test on at least three viewport sizes: mobile (360–390px), tablet (768px), and desktop (1280px+).
- Touch targets must be at least 44×44px on mobile.
- Sidebars collapse to a drawer on mobile. Tables that cannot fit degrade to card layouts.
- Never hide functionality on mobile that is available on desktop — adapt the presentation, not the capability.

### Interaction consistency

- One visual style for each interaction type: one button style for primary actions, one for secondary, one for danger. Mix these and users stop trusting the UI.
- Interactive elements show hover, focus, active, and disabled states. Never style only the default state.
- Keyboard shortcuts for power users (e.g. Ctrl+S to save, Escape to close) are acceptable additions but must not be the only path to an action.

### Typography and spacing

- Limit to two font weights in the app chrome: regular (400) and medium/semibold (500). Reserve bold (700) for genuine emphasis, not decoration.
- Maintain consistent vertical rhythm — derive spacing from a base unit (4px or 8px) and use multiples.
- Line length for body text: 60–80 characters. Wider than 80 characters reduces readability on desktop.

---

## 10. Performance

### Code splitting

Every page component is a lazy import in `App.tsx`. This is the minimum viable code-splitting strategy and it is non-negotiable.

```typescript
// App.tsx
const ChallengePage = lazy(() => import('@/pages/ChallengePage'))
const GamePage      = lazy(() => import('@/pages/GamePage'))

// Each route is wrapped in Suspense
<Suspense fallback={<PageSkeleton />}>
  <Route path="/challenges/:id" element={<ChallengePage />} />
</Suspense>
```

### Debouncing

Inputs that trigger network calls (search, filter) must be debounced at 250–400 ms. Use a shared `useDebounce` hook — do not duplicate debounce logic inline.

```typescript
// src/hooks/useDebounce.ts
export function useDebounce<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])
  return debounced
}
```

### Stable keys

Never use array index as a React key for a list that can be reordered, filtered, or paginated. Always use the item's stable unique identifier (`id`).

### Memoisation

Apply `React.memo` to list-item components with stable props. Apply `useMemo` to expensive computed values derived from large datasets. Do not wrap everything by default — only apply where there is a demonstrated re-render problem.

---

## 11. Accessibility

### The minimum bar

Every screen must be fully operable with a keyboard alone. Tab through the entire UI and verify that: every interactive element receives focus, focus order follows visual order, and no focus is trapped except inside open modals.

### Semantic HTML

Use the correct element for the job. `<button>` for actions, `<a>` for navigation, `<form>` for forms. Never attach `onClick` to a `<div>` or `<span>`. Never use a `<div>` as a button.

### Focus management

- All interactive elements have a visible focus ring. Never `outline: none` without a replacement.
- Modals trap focus. Focus returns to the trigger element when the modal closes.
- After navigation or significant content change, move focus to the relevant heading or first interactive element.

### ARIA

- `aria-live="polite"` on regions that update asynchronously (toasts, save indicators, search results).
- `role="alert"` on error messages that appear after user action.
- `aria-expanded` on collapsible elements (accordions, dropdowns, tree nodes).
- `aria-label` on icon-only buttons.
- `aria-busy="true"` on loading containers.

### Colour contrast

All text must meet WCAG AA (4.5:1 for body text, 3:1 for large text and UI components) in both light and dark mode. Check every colour combination in your design system — not just defaults, but hover, active, disabled, and error states.

---

## 12. Testing

### What to test

- **Hooks**: test all three states (loading, success, error) using `renderHook` + React Testing Library. Mock the network with MSW — never stub `axios` directly.
- **Components**: test user-facing behaviour (form submit, error display, loading state) not implementation details (internal state variable names, CSS classes).
- **Integration**: test complete user flows — fill a form, submit, verify the success state.

### MSW for network mocking

```typescript
// tests/mocks/handlers.ts
import { http, HttpResponse } from 'msw'
import { API_BASE_URL } from '@/config'

export const handlers = [
  http.get(`${API_BASE_URL}/challenges/:station_id`, () => {
    return HttpResponse.json({ total: 1, challenges: [{ id: 1, title: 'Test Challenge' }] })
  }),
  http.post(`${API_BASE_URL}/challenge`, async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 2, ...body }, { status: 201 })
  }),
]
```

### Test the three states every time

For any async operation, write a test for: the loading state (skeleton or spinner is visible), the success state (data renders correctly), and the error state (error message is shown). The error state is the most important and most frequently skipped.

### Co-locate tests

`useChallenge.ts` and `useChallenge.test.ts` live in the same directory.

---

## 13. Code Quality & Tooling

### npm scripts reference

| Script | What it does |
|--------|-------------|
| `npm run codegen:api` | Pulls latest BE design output + patches AxiosClient |
| `npm run dev` | Starts the Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview the production build locally |
| `npm run test` | Runs all tests |
| `npm run lint` | ESLint — must pass with zero warnings |
| `npm run typecheck` | `tsc --noEmit` — runs after every codegen:api to catch type breakages |

### After every `codegen:api` run

1. Run `npm run typecheck` immediately.
2. Fix every TypeScript error before writing any new code.
3. Never suppress a type error caused by an API contract change — update the consuming code.

### TypeScript configuration

`tsconfig.json` must have `"strict": true`. Never use `any`. Prefer `unknown` at untrusted boundaries and narrow explicitly. Never cast with `as T` unless you have confirmed the shape.

### Path aliases

Configure `@/` to resolve to `src/` in both `vite.config.ts` and `tsconfig.json`. Import from `@/hooks/useChallenge` not from `../../hooks/useChallenge`.

### Environment variables

```typescript
// src/config.ts
const apiUrl = import.meta.env.VITE_API_URL
if (!apiUrl) throw new Error('VITE_API_URL is not set. Add it to .env')
export const API_BASE_URL: string = apiUrl
```

Never access `import.meta.env.*` directly in hooks or components — always through `config.ts`.

### Constants file — mandatory shape

```typescript
// src/constants.ts

export const TOKEN_KEY = 'your_project_token'   // localStorage key for the JWT

export const ROUTES = {
  LOGIN:        '/login',
  HOME:         '/',
  DASHBOARD:    '/dashboard',
  // Add routes as your app grows — never hardcode path strings elsewhere
} as const

export const QUERY_KEYS = {
  // Example pattern — replace with your project's actual resources
  CHALLENGES:  (stationId: number) => ['challenges', stationId]  as const,
  CHALLENGE:   (id: number)        => ['challenge', id]          as const,
  GAME:        (id: number)        => ['game', id]               as const,
} as const
```

---

## 14. Common Mistakes to Avoid

**Editing files in `/api/`.** These are generated. Your changes will be lost on the next `npm run codegen:api`. Never edit them.

**Calling `AxiosClient` directly in a component.** All calls go through a custom hook. Components call hooks.

**Duplicating types from `/api/`.** If a type exists in `/api/model/`, `/api/schema/`, or `/api/api/`, import it. Do not re-declare it in `src/types/`.

**Using `otm_*` fields.** They are ORM artefacts, never present in API responses. Delete any code that reads them.

**Not running `typecheck` after `codegen:api`.** API changes break consuming code silently until the TypeScript compiler tells you. Run `tsc --noEmit` immediately after every codegen run.

**Storing server state in `useState`.** Server state lives in TanStack Query. Copying it into local state creates two sources of truth that diverge on mutation.

**Fire-and-forget mutations.** Every `useMutation` has `onError`. Every error produces user-visible feedback.

**Using array index as a React key.** Use the item's `id`. Index keys cause incorrect renders when lists are filtered, sorted, or updated.

**Not debouncing search inputs.** A request on every keystroke creates a poor UX and hammers the server. Debounce at 250–400 ms using the shared `useDebounce` hook.

**Skipping empty and error states.** Every list must handle empty. Every async operation must handle error. These are not optional edge cases — they are the most common states your users will see.