import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { AdminFaqList } from '@api/schema/AdminFaqList'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useFaqs() {
  return useQuery<AdminFaqList>({
    queryKey: QUERY_KEYS.FAQS,
    queryFn: () => AxiosClient.adminGetFaqs({ headers: AUTH_HEADER }),
  })
}
