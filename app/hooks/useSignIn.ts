import { useMutation } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { T_adminSignIn_body } from '@api/api/adminSignIn'
import type { AdminAuthResponse } from '@api/schema/AdminAuthResponse'

export function useSignIn() {
  return useMutation<AdminAuthResponse, unknown, T_adminSignIn_body>({
    mutationFn: (body) => AxiosClient.adminSignIn({ body }),
  })
}
