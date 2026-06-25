import { useMutation } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useExportRsvp() {
  return useMutation({
    mutationFn: async () => {
      const csv = await AxiosClient.adminExportRsvp({ headers: AUTH_HEADER })
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rsvp-export-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
    },
  })
}
