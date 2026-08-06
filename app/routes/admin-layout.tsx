import { useEffect, useState } from 'react'
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
  const [sidebarOpen, setSidebarOpen] = useState(false)
  if (!token) return <Navigate to={ROUTES.LOGIN} replace />

  return (
    <div className="min-h-screen bg-stone-50 lg:flex">
      <MobileHeader onMenuClick={() => setSidebarOpen(true)} />
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  )
}

function MobileHeader({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 lg:hidden">
      <h2 className="text-sm font-medium text-stone-900">Dies Admin</h2>
      <button
        onClick={onMenuClick}
        className="rounded p-2 text-stone-600 hover:bg-stone-100"
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
          <path
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 0 1 2.75 4h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 4.75Zm0 5A.75.75 0 0 1 2.75 9h14.5a.75.75 0 0 1 0 1.5H2.75A.75.75 0 0 1 2 9.75Zm0 5a.75.75 0 0 1 .75-.75h14.5a.75.75 0 0 1 0 1.5H2.75a.75.75 0 0 1-.75-.75Z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </header>
  )
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { logout } = useAuth()

  return (
    <>
      <nav className="flex-1 space-y-0.5 px-2 py-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === ROUTES.DASHBOARD}
            onClick={onNavigate}
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
    </>
  )
}

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <>
      {/* Desktop: persistent sidebar */}
      <aside className="hidden w-56 flex-col border-r border-stone-200 bg-white lg:flex">
        <div className="border-b border-stone-200 px-4 py-4">
          <h2 className="text-sm font-medium text-stone-900">Dies Admin</h2>
        </div>
        <SidebarNav />
      </aside>

      {/* Mobile: drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 bg-black/40" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 flex w-64 max-w-[80vw] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-stone-200 px-4 py-4">
              <h2 className="text-sm font-medium text-stone-900">Dies Admin</h2>
              <button
                onClick={onClose}
                className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600"
                aria-label="Close menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
                  <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
                </svg>
              </button>
            </div>
            <SidebarNav onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  )
}
