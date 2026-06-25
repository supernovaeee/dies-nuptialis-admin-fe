# Plan: Wire NAIV Admin API into dies-admin

## Context

The `dies-admin` project is the admin portal for a wedding website (dies-nuptialis). Codegen has been run successfully — 18 admin API endpoints, 2 enums, 7 model tables, and 19 schema types are generated in `/api/`. The project is a fresh React Router v7 scaffold with nothing wired yet. This plan maps out how to build the infrastructure, hooks, and pages to consume the admin API.

---

## Phase 0: Configuration

| Change | Why |
|--------|-----|
| `react-router.config.ts` → `ssr: false` | Admin portal is fully authenticated (localStorage tokens). No SSR benefit, no SEO need. `localStorage` unavailable during SSR would break everything. |
| `npm install axios @tanstack/react-query` | Runtime deps required by playbook architecture |
| `tsconfig.json` — add `"@api/*": ["./api/*"]` path alias | `api/` is at project root, outside `app/`. Existing `~/*` alias can't reach it. Vite picks it up via `tsconfigPaths: true`. |
| Create `.env` with `VITE_API_URL=http://localhost:3000` | AxiosClient base_url already patched to read this |

**Verify:** `npm run typecheck` passes, `npm run dev` starts without errors.

---

## Phase 1: Infrastructure Layer

### Files to create:

- **`app/config.ts`** — validates `VITE_API_URL`, exports `API_BASE_URL`. Single source of truth.
- **`app/constants.ts`** — `TOKEN_KEY` (`dies_admin_token`), `ROUTES` object, `QUERY_KEYS` factory functions.
- **`app/lib/axiosSetup.ts`** — Axios request interceptor (injects Bearer token from localStorage) + response interceptor (401 → clear token → redirect to `/login?reason=expired`).
- **`app/lib/authHeader.ts`** — exports `AUTH_HEADER = { authorization: '' }`. Placeholder that satisfies generated type signatures; the interceptor overwrites it with the real token at request time.
- **`app/lib/apiError.ts`** — `getApiErrorMessage(err, fallback)` utility. Extracts `{ error: string }` from Axios errors.
- **`app/entry.client.tsx`** — Init order: `setupAxiosInterceptors()` → `AxiosClient.BaseURL.instance.set(API_BASE_URL)` → React render.

**Verify:** `npm run typecheck`, dev server starts.

---

## Phase 2: Auth + Login

- **`app/context/AuthContext.tsx`** — holds token state, `login(token)` / `logout()` / `isAuthenticated`. Reads initial token from localStorage.
- **`app/hooks/useSignIn.ts`** — mutation hook calling `AxiosClient.adminSignIn`. Only unauthenticated endpoint.
- **`app/routes/login.tsx`** — email/password form. On success → `auth.login(token)` → navigate to dashboard. Error inline.

**Verify:** Login page renders, successful sign-in stores token and redirects.

---

## Phase 3: App Shell + Routing

- **Update `app/root.tsx`** — wrap `<Outlet />` in `QueryClientProvider` + `AuthProvider`.
- **Update `app/routes.ts`** — full route tree:
  ```
  /login          → routes/login.tsx
  / (layout)      → routes/admin-layout.tsx (protected)
    /              → routes/dashboard.tsx
    /families      → routes/families.tsx
    /families/:id  → routes/family-detail.tsx
    /rsvps         → routes/rsvps.tsx
    /wishes        → routes/wishes.tsx
    /carousel      → routes/carousel.tsx
  ```
- **`app/routes/admin-layout.tsx`** — protected layout: checks token, redirects to `/login` if absent. Contains sidebar nav (Dashboard, Families, RSVPs, Wishes, Carousel) + logout button + `<Outlet />`.

**Verify:** Unauthenticated → redirected to login. Authenticated → sidebar renders, navigation works between placeholder pages.

---

## Phase 4: Families Domain (6 endpoints)

### Hooks:
| Hook | Endpoint | Type |
|------|----------|------|
| `useFamilies(q?, limit, offset)` | `adminGetFamilies` | query → `AdminFamilyList` |
| `useCreateFamily()` | `adminCreateFamily` | mutation → invalidates families |
| `useUpdateFamily()` | `adminUpdateFamily` | mutation → invalidates families |
| `useDeleteFamily()` | `adminDeleteFamily` | mutation → invalidates families |
| `useAddGuest(familyId)` | `adminAddGuest` | mutation → invalidates families |
| `useUpdateGuest()` | `adminUpdateGuest` | mutation → invalidates families |
| `useDeleteGuest()` | `adminDeleteGuest` | mutation → invalidates families |
| `useLetter(familyId)` | `adminGetLetter` | query → `LetterResponse` |
| `useUpsertLetter(familyId)` | `adminUpsertLetter` | mutation → invalidates letter |

### Pages:
- **`app/routes/families.tsx`** — searchable (debounced) paginated table. Create button → modal form. Row click → detail page. Each row: fam_name, invite_code, pax_allowed, after_party_allowed, guest count, RSVP/letter status badges.
- **`app/routes/family-detail.tsx`** — family info (editable), guest list with add/edit/delete, letter editor (textarea + save). No dedicated "get single family" endpoint — reads from TanStack Query cache or re-fetches list.

### Shared components:
- `FamilyForm`, `FamilyRow`, `GuestList`, `GuestForm`, `LetterEditor`

**Verify:** List loads, search filters, CRUD works, guests add/edit/delete, letter upserts.

---

## Phase 5: RSVP Domain (3 endpoints)

### Hooks:
| Hook | Endpoint | Type |
|------|----------|------|
| `useRsvps(limit, offset)` | `adminGetRsvps` | query → `AdminRsvpList` |
| `useRsvpSummary()` | `adminGetRsvpSummary` | query → `AdminRsvpSummary` |
| `useExportRsvp()` | `adminExportRsvp` | mutation → triggers CSV download |

### Pages:
- **`app/routes/dashboard.tsx`** — RSVP summary cards (9 counters), quick action links.
- **`app/routes/rsvps.tsx`** — summary cards + paginated table (family, statuses with color-coded badges, vegetarian, notes, email, date) + CSV export button.

**Verify:** Dashboard shows live counters, RSVP table paginates, CSV downloads.

---

## Phase 6: Wishes Domain (2 endpoints)

### Hooks:
| Hook | Endpoint | Type |
|------|----------|------|
| `useWishes(limit, offset, status?)` | `adminGetWishes` | query → `AdminWishList` |
| `useModerateWish()` | `adminModerateWish` | mutation → invalidates wishes |

### Page:
- **`app/routes/wishes.tsx`** — filter by status (ALL/PUBLIC/PRIVATE), paginated list, moderate toggle button per wish.

**Verify:** Filter changes query, moderation toggles status, list refreshes.

---

## Phase 7: Carousel Domain (5 endpoints + image upload)

### Hooks:
| Hook | Endpoint | Type |
|------|----------|------|
| `useCarouselCards()` | `adminGetCarouselCards` | query → `CarouselCardList` |
| `useCreateCarouselCard()` | `adminCreateCarouselCard` | mutation |
| `useUpdateCarouselCard()` | `adminUpdateCarouselCard` | mutation |
| `useDeleteCarouselCard()` | `adminDeleteCarouselCard` | mutation |
| `useReorderCarouselCards()` | `adminReorderCarouselCards` | mutation (optimistic update) |
| `useUploadImage()` | `adminUploadImage` | mutation → returns URL |

### Page:
- **`app/routes/carousel.tsx`** — visual card grid, create/edit via modal (with image upload), reorder via up/down arrows or drag-and-drop, delete with confirmation.

**Verify:** Cards CRUD works, image uploads return URL and display, reorder persists.

---

## Phase 8: Shared UI Components

Built as needed across phases 4–7, consolidated here:

- `app/hooks/useDebounce.ts` — 300ms debounce for search inputs
- `app/components/ui/Button.tsx` — primary/secondary/danger, loading spinner, disabled
- `app/components/ui/Modal.tsx` — focus-trapping, Escape to dismiss, `aria-modal`
- `app/components/ui/ConfirmDialog.tsx` — wraps Modal for destructive actions
- `app/context/ToastContext.tsx` + `app/components/ui/Toast.tsx` — success auto-dismiss 4s, error manual dismiss
- `app/components/ui/Skeleton.tsx` — loading placeholders
- `app/components/ui/EmptyState.tsx` — title, description, optional action
- `app/components/ui/Pagination.tsx` — offset-based prev/next + range display
- `app/components/ui/DataTable.tsx` — configurable table with headers

---

## Key Decisions

1. **SPA mode** — no SSR. Admin portal + localStorage auth = client-only.
2. **`@api/*` alias** — clean imports for generated code outside `app/`.
3. **`AUTH_HEADER` placeholder** — satisfies generated TS signatures; interceptor injects real token.
4. **Toast at component level** — hooks stay pure. Components pass `onSuccess`/`onError` to `mutate()`.
5. **No single-family endpoint** — detail page reads from TanStack Query cache.
6. **Offset pagination in URL** — page number in URL params, computed as `offset = page * limit`.

---

## Build Order

```
Phase 0 (config)  →  Phase 1 (infra)  →  Phase 2 (auth/login)  →  Phase 3 (shell/routing)
                                                                         ↓
Phase 8 (UI components, built incrementally)  ←  Phase 4 (families)  →  Phase 5 (RSVPs)
                                                                         ↓
                                                 Phase 6 (wishes)  →  Phase 7 (carousel)
```

Each phase ends with `npm run typecheck` + manual verification against the running BE.
