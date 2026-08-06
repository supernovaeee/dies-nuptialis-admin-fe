import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { DeletedResponse } from '@api/schema/DeletedResponse'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useDeleteFamily() {
  const queryClient = useQueryClient()

  return useMutation<DeletedResponse, unknown, string>({
    mutationFn: (familyId) =>
      AxiosClient.adminDeleteFamily({
        headers: AUTH_HEADER,
        path: { family_id: familyId },
      }),
    onSuccess: (_data, familyId) => {
      queryClient.invalidateQueries({ queryKey: ['families'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAMILY(familyId) })
    },
  })
}
