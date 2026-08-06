import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { T_adminUpdateRsvpManager_body } from '@api/api/adminUpdateRsvpManager'
import type { AdminRsvpManagerItem } from '@api/schema/AdminRsvpManagerItem'
import { AUTH_HEADER } from '~/lib/authHeader'

interface UpdateRsvpManagerVars {
  managerId: string
  body: T_adminUpdateRsvpManager_body
}

export function useUpdateRsvpManager() {
  const queryClient = useQueryClient()

  return useMutation<AdminRsvpManagerItem, unknown, UpdateRsvpManagerVars>({
    mutationFn: ({ managerId, body }) =>
      AxiosClient.adminUpdateRsvpManager({
        headers: AUTH_HEADER,
        path: { manager_id: managerId },
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rsvp-managers'] })
    },
  })
}
