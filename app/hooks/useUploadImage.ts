import { useMutation } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { UploadResponse } from '@api/schema/UploadResponse'
import { AUTH_HEADER } from '~/lib/authHeader'

export function useUploadImage() {
  return useMutation<UploadResponse, unknown, string>({
    mutationFn: (data) =>
      AxiosClient.adminUploadImage({
        headers: AUTH_HEADER,
        body: { data },
      }),
  })
}
