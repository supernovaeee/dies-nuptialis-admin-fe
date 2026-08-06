import { useToast } from '~/context/ToastContext'
import { buildManagerLink, buildManagerMessage } from '~/lib/managerInvite'

interface InviteManager {
  name: string
  passcode: string
  message?: string
}

export function useCopyManagerInvite() {
  const toast = useToast()

  async function copyLink(manager: Pick<InviteManager, 'passcode'>) {
    try {
      await navigator.clipboard.writeText(buildManagerLink(manager))
      toast.success('Manager link copied to clipboard')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  async function copyMessage(manager: InviteManager) {
    try {
      await navigator.clipboard.writeText(buildManagerMessage(manager))
      toast.success('Manager message copied to clipboard')
    } catch {
      toast.error('Failed to copy message')
    }
  }

  return { copyLink, copyMessage }
}
