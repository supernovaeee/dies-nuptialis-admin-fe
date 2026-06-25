import axios, { type AxiosError } from 'axios'

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (axios.isAxiosError(err)) {
    return (err as AxiosError<{ error: string }>).response?.data?.error ?? fallback
  }
  return fallback
}
