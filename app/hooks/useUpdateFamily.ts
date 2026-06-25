import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { T_adminUpdateFamily_body } from '@api/api/adminUpdateFamily'
import type { AdminFamilyItem } from '@api/schema/AdminFamilyItem'
import { AUTH_HEADER } from '~/lib/authHeader'

interface UpdateFamilyVars {
  familyId: string
  body: T_adminUpdateFamily_body
}

export function useUpdateFamily() {
  const queryClient = useQueryClient()

  return useMutation<AdminFamilyItem, unknown, UpdateFamilyVars>({
    mutationFn: ({ familyId, body }) =>
      AxiosClient.adminUpdateFamily({
        headers: AUTH_HEADER,
        path: { family_id: familyId },
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] })
    },
  })
}
