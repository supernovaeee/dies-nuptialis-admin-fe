import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import { MANAGER_TOKEN_KEY } from '~/constants'

interface ManagerAuthContextValue {
  token: string | null
  login: (token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const ManagerAuthContext = createContext<ManagerAuthContextValue | null>(null)

export function ManagerAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(MANAGER_TOKEN_KEY),
  )

  const login = useCallback((newToken: string) => {
    localStorage.setItem(MANAGER_TOKEN_KEY, newToken)
    setToken(newToken)
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(MANAGER_TOKEN_KEY)
    setToken(null)
  }, [])

  return (
    <ManagerAuthContext.Provider
      value={{ token, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </ManagerAuthContext.Provider>
  )
}

export function useManagerAuth(): ManagerAuthContextValue {
  const ctx = useContext(ManagerAuthContext)
  if (!ctx) throw new Error('useManagerAuth must be used within ManagerAuthProvider')
  return ctx
}
