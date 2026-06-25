import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { LetterResponse } from '@api/schema/LetterResponse'
import { QUERY_KEYS } from '~/constants'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useLetter(familyId: string) {
  return useQuery<LetterResponse>({
    queryKey: QUERY_KEYS.FAMILY_LETTER(familyId),
    queryFn: () =>
      AxiosClient.adminGetLetter({
        headers: AUTH_HEADER,
        path: { family_id: familyId },
      }),
    enabled: !!familyId,
  })
}

export function useUpsertLetter(familyId: string) {
  const queryClient = useQueryClient()

  return useMutation<LetterResponse, unknown, string>({
    mutationFn: (letterText) =>
      AxiosClient.adminUpsertLetter({
        headers: AUTH_HEADER,
        path: { family_id: familyId },
        body: { letter_text: letterText },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FAMILY_LETTER(familyId),
      })
    },
  })
}
