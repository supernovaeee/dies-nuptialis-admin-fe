import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { T_adminUpdateRsvp_body } from '@api/api/adminUpdateRsvp'
import type { AdminRsvpItem } from '@api/schema/AdminRsvpItem'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

interface UpdateRsvpVars {
  rsvpId: string
  body: T_adminUpdateRsvp_body
}

export function useUpdateRsvp() {
  const queryClient = useQueryClient()

  return useMutation<AdminRsvpItem, unknown, UpdateRsvpVars>({
    mutationFn: ({ rsvpId, body }) =>
      AxiosClient.adminUpdateRsvp({
        headers: AUTH_HEADER,
        path: { rsvp_id: rsvpId },
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rsvps'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RSVP_SUMMARY })
    },
  })
}
