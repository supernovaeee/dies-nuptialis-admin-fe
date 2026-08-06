import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { ManagerMessageItem } from '@api/schema/ManagerMessageItem'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useUpdateManagerMessage() {
  const queryClient = useQueryClient()

  return useMutation<ManagerMessageItem, unknown, string>({
    mutationFn: (message) =>
      AxiosClient.managerUpdateMessage({ headers: AUTH_HEADER, body: { message } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MANAGER_FAMILIES })
    },
  })
}
