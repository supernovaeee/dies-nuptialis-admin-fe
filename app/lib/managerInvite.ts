interface InviteManager {
  name: string
  passcode: string
  message?: string
}

export function buildManagerLink(manager: Pick<InviteManager, 'passcode'>): string {
  return `${window.location.origin}/manager/login?passcode=${manager.passcode}`
}

function defaultManagerMessage(manager: InviteManager, link: string): string {
  return `Hi ${manager.name},

You can view the RSVP status of the guests under your name here:

${link}

Just open the link and you'll see it right away — no need to remember a password.`
}

export function buildManagerMessage(manager: InviteManager): string {
  const link = buildManagerLink(manager)
  if (manager.message?.trim()) {
    return manager.message.replaceAll('{{link}}', link).replaceAll('{{name}}', manager.name)
  }
  return defaultManagerMessage(manager, link)
}
