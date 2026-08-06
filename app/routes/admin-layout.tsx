import { Navigate, NavLink, Outlet } from 'react-router'
import { useAuth } from '~/context/AuthContext'
import { TOKEN_KEY, ROUTES } from '~/constants'

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', end: true },
  { to: ROUTES.FAMILIES, label: 'Families' },
  { to: ROUTES.RSVPS, label: 'RSVPs' },
  { to: ROUTES.RSVP_MANAGERS, label: 'RSVP Managers' },
  { to: ROUTES.WISHES, label: 'Wishes' },
  { to: ROUTES.CAROUSEL, label: 'Carousel' },
  { to: ROUTES.FAQ, label: 'FAQ' },
] as const

export default function AdminLayout() {
  const token = localStorage.getItem(TOKEN_KEY)
  if (!token) return <Navigate to={ROUTES.LOGIN} replace />

  return (
    <div className="flex min-h-screen bg-stone-50">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}

function Sidebar() {
  const { logout } = useAuth()

  return (
    <aside className="flex w-56 flex-col border-r border-stone-200 bg-white">
      <div className="border-b border-stone-200 px-4 py-4">
        <h2 className="text-sm font-medium text-stone-900">Dies Admin</h2>
      </div>

      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === ROUTES.DASHBOARD}
            className={({ isActive }) =>
              `block rounded px-3 py-2 text-sm ${
                isActive
                  ? 'bg-stone-100 font-medium text-stone-900'
                  : 'text-stone-600 hover:bg-stone-50 hover:text-stone-900'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-stone-200 px-2 py-3">
        <button
          onClick={logout}
          className="w-full rounded px-3 py-2 text-left text-sm text-stone-600 hover:bg-stone-50 hover:text-stone-900"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
