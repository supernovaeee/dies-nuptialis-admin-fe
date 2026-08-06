interface InviteManager {
  name: string
  passcode: string
}

export function buildManagerLink(manager: Pick<InviteManager, 'passcode'>): string {
  return `${window.location.origin}/manager/login?passcode=${manager.passcode}`
}

export function buildManagerMessage(manager: InviteManager): string {
  const link = buildManagerLink(manager)
  return `Hi ${manager.name},

You can view the RSVP status of the guests under your name here:

${link}

Just open the link and you'll see it right away — no need to remember a password.`
}
