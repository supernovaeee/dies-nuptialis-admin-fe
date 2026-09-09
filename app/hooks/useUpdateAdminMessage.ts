import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { AdminMessageItem } from '@api/schema/AdminMessageItem'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useUpdateAdminMessage() {
  const queryClient = useQueryClient()

  return useMutation<AdminMessageItem, unknown, string>({
    mutationFn: (message) =>
      AxiosClient.adminUpdateMessage({ headers: AUTH_HEADER, body: { message } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ADMIN_MESSAGE })
    },
  })
}
