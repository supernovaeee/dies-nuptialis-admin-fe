import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { DeletedResponse } from '@api/schema/DeletedResponse'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useDeleteFamily() {
  const queryClient = useQueryClient()

  return useMutation<DeletedResponse, unknown, string>({
    mutationFn: (familyId) =>
      AxiosClient.adminDeleteFamily({
        headers: AUTH_HEADER,
        path: { family_id: familyId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] })
    },
  })
}
