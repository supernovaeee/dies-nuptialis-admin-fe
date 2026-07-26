import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { T_adminCreateFaq_body } from '@api/api/adminCreateFaq'
import type { AdminFaqItem } from '@api/schema/AdminFaqItem'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useCreateFaq() {
  const queryClient = useQueryClient()

  return useMutation<AdminFaqItem, unknown, T_adminCreateFaq_body>({
    mutationFn: (body) =>
      AxiosClient.adminCreateFaq({ headers: AUTH_HEADER, body }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAQS })
    },
  })
}
