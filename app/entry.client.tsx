import { startTransition } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { HydratedRouter } from 'react-router/dom'
import { setupAxiosInterceptors } from '~/lib/axiosSetup'
import { AxiosClient } from '@api/AxiosClient'
import { API_BASE_URL } from '~/config'

setupAxiosInterceptors()
AxiosClient.BaseURL.instance.set(API_BASE_URL)

startTransition(() => {
  hydrateRoot(document, <HydratedRouter />)
})
