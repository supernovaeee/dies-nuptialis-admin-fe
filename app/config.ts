const apiUrl = import.meta.env.VITE_API_URL
if (!apiUrl) throw new Error('VITE_API_URL is not set. Add it to .env')
export const API_BASE_URL: string = apiUrl
