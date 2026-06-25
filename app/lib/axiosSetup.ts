import axios from 'axios'
import { TOKEN_KEY, ROUTES } from '~/constants'

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
    },
  )
}
