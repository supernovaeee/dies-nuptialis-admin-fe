import { useMutation } from '@tanstack/react-query'
import { AxiosClient } from '@api/AxiosClient'
import type { T_authRsvpManager_body } from '@api/api/authRsvpManager'
import type { RsvpManagerAuthResponse } from '@api/schema/RsvpManagerAuthResponse'

export function useManagerSignIn() {
  return useMutation<RsvpManagerAuthResponse, unknown, T_authRsvpManager_body>({
    mutationFn: (body) => AxiosClient.authRsvpManager({ body }),
  })
}
