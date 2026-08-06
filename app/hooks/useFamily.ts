import { useQuery } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { AdminFamilyItem } from '@api/schema/AdminFamilyItem'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useFamily(familyId: string | undefined) {
  return useQuery<AdminFamilyItem>({
    queryKey: QUERY_KEYS.FAMILY(familyId ?? ''),
    queryFn: () =>
      AxiosClient.adminGetFamily({
        headers: AUTH_HEADER,
        path: { family_id: familyId! },
      }),
    enabled: !!familyId,
  })
}
