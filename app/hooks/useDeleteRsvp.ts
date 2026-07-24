import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { DeletedResponse } from '@api/schema/DeletedResponse'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useDeleteRsvp() {
  const queryClient = useQueryClient()

  return useMutation<DeletedResponse, unknown, string>({
    mutationFn: (rsvpId) =>
      AxiosClient.adminDeleteRsvp({
        headers: AUTH_HEADER,
        path: { rsvp_id: rsvpId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rsvps'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RSVP_SUMMARY })
    },
  })
}
