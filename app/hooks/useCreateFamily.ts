import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { T_adminCreateFamily_body } from '@api/api/adminCreateFamily'
import type { AdminFamilyItem } from '@api/schema/AdminFamilyItem'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useCreateFamily() {
  const queryClient = useQueryClient()

  return useMutation<AdminFamilyItem, unknown, T_adminCreateFamily_body>({
    mutationFn: (body) =>
      AxiosClient.adminCreateFamily({ headers: AUTH_HEADER, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] })
    },
  })
}
