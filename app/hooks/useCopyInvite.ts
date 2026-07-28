import { useToast } from '~/context/ToastContext'
import { buildInviteLink, buildInviteMessage } from '~/lib/invite'

interface InviteFamily {
  fam_name: string
  invite_code: string
}

export function useCopyInvite() {
  const toast = useToast()

  async function copyLink(family: Pick<InviteFamily, 'invite_code'>) {
    try {
      await navigator.clipboard.writeText(buildInviteLink(family))
      toast.success('Invite link copied to clipboard')
    } catch {
      toast.error('Failed to copy link')
    }
  }

  async function copyMessage(family: InviteFamily) {
    try {
      await navigator.clipboard.writeText(buildInviteMessage(family))
      toast.success('Invite message copied to clipboard')
    } catch {
      toast.error('Failed to copy message')
    }
  }

  return { copyLink, copyMessage }
}
