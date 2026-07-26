import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { DeletedResponse } from '@api/schema/DeletedResponse'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useDeleteFaq() {
  const queryClient = useQueryClient()

  return useMutation<DeletedResponse, unknown, string>({
    mutationFn: (faqId) =>
      AxiosClient.adminDeleteFaq({
        headers: AUTH_HEADER,
        path: { faq_id: faqId },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.FAQS })
    },
  })
}
