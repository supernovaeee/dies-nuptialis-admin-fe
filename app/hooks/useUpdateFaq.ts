import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { T_adminUpdateFaq_body } from '@api/api/adminUpdateFaq'
import type { AdminFaqItem } from '@api/schema/AdminFaqItem'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

interface UpdateFaqVars {
  faqId: string
  body: T_adminUpdateFaq_body
}

export function useUpdateFaq() {
  const queryClient = useQueryClient()

  return useMutation<AdminFaqItem, unknown, UpdateFaqVars>({
    mutationFn: ({ faqId, body }) =>
      AxiosClient.adminUpdateFaq({
        headers: AUTH_HEADER,
        path: { faq_id: faqId },
        body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAQS })
    },
  })
}
