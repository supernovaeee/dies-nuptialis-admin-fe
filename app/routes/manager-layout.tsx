import { Navigate, Outlet } from 'react-router'
import { useManagerAuth } from '~/context/ManagerAuthContext'
import { ROUTES } from '~/constants'

export default function ManagerLayout() {
  // Reads through context (not a raw localStorage.getItem) so that calling
  // logout() re-renders this guard immediately instead of leaving stale
  // content on screen until an unrelated re-render happens to pick it up.
  const { isAuthenticated } = useManagerAuth()
  if (!isAuthenticated) return <Navigate to={ROUTES.MANAGER_LOGIN} replace />

  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main className="mx-auto max-w-3xl p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}

function Header() {
  const { logout } = useManagerAuth()

  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-white px-6 py-4">
      <h1 className="text-sm font-medium text-stone-900">Your Guests</h1>
      <button
        onClick={logout}
        className="rounded px-3 py-1.5 text-sm text-stone-600 hover:bg-stone-100 hover:text-stone-900"
      >
        Sign out
      </button>
    </header>
  )
}
