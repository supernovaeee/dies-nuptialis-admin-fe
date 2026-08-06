import axios from 'axios'
import { TOKEN_KEY, MANAGER_TOKEN_KEY, ROUTES } from '~/constants'

// The manager passcode-login flow is a second, independent auth system that
// shares this same axios instance with the admin flow — requests to
// /manager/* or /auth/manager must carry the manager token, not the admin one.
function isManagerRequest(url: string | undefined): boolean {
  if (!url) return false
  const pathname = url.startsWith('http') ? new URL(url).pathname : url
  return pathname.startsWith('/manager') || pathname === '/auth/manager'
}

export function setupAxiosInterceptors(): void {
  axios.interceptors.request.use((config) => {
    const tokenKey = isManagerRequest(config.url) ? MANAGER_TOKEN_KEY : TOKEN_KEY
    const token = localStorage.getItem(tokenKey)
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  })

  axios.interceptors.response.use(
    (res) => res,
    (error) => {
      if (error.response?.status === 401) {
        if (isManagerRequest(error.config?.url)) {
          localStorage.removeItem(MANAGER_TOKEN_KEY)
          window.location.href = `${ROUTES.MANAGER_LOGIN}?reason=expired`
        } else {
          localStorage.removeItem(TOKEN_KEY)
          window.location.href = `${ROUTES.LOGIN}?reason=expired`
        }
      }
      return Promise.reject(error)
    },
  )
}
