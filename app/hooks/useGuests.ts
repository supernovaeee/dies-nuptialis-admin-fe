import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { GuestItem } from '@api/schema/GuestItem'
import type { DeletedResponse } from '@api/schema/DeletedResponse'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useAddGuest() {
  const queryClient = useQueryClient()

  return useMutation<GuestItem, unknown, { familyId: string; name: string }>({
    mutationFn: ({ familyId, name }) =>
      AxiosClient.adminAddGuest({
        headers: AUTH_HEADER,
        path: { family_id: familyId },
        body: { name },
      }),
    onSuccess: (_data, { familyId }) => {
      queryClient.invalidateQueries({ queryKey: ['families'] })
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAMILY(familyId) })
    },
  })
}

export function useUpdateGuest() {
  const queryClient = useQueryClient()

  return useMutation<GuestItem, unknown, { guestId: string; name: string; vegetarian: boolean }>({
    mutationFn: ({ guestId, name, vegetarian }) =>
      AxiosClient.adminUpdateGuest({
        headers: AUTH_HEADER,
        path: { guest_id: guestId },
        body: { name, vegetarian },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] })
      queryClient.invalidateQueries({ queryKey: ['family'] })
    },
  })
}

export function useDeleteGuest() {
  const queryClient = useQueryClient()

  return useMutation<DeletedResponse, unknown, string>({
    mutationFn: (guestId) =>
      AxiosClient.adminDeleteGuest({
        headers: AUTH_HEADER,
        path: { guest_id: guestId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] })
      queryClient.invalidateQueries({ queryKey: ['family'] })
    },
  })
}
