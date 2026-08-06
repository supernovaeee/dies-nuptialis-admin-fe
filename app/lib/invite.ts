import { GUEST_SITE_URL } from '~/constants'

interface InviteFamily {
  fam_name: string
  invite_code: string
}

export function buildInviteLink(family: Pick<InviteFamily, 'invite_code'>): string {
  return `${GUEST_SITE_URL}/${family.invite_code}`
}

function defaultInviteMessage(family: InviteFamily, link: string): string {
  return `Dear ${family.fam_name},

It is with great joy and honor that we invite you to our wedding.

As we stand before God to make our sacred vows to one another, we would be overjoyed to have you there standing at the pews to witness and celebrate this special day with us.

So, allow us to invite you to our Holy Matrimony and Garden Reception on:

🗓️ Saturday, November 7, 2026
🕝 2.45 PM
📍⛪️ Armenian Church of St. Gregory the Illuminator, 60 Hill St, Singapore

You may visit the unique link below for RSVP and further event details:

${link}

Kindly RSVP by 07 September 2026.

We hope to see you at the pews!

With love,
Azza & Marcel`
}

// When an RSVP manager has configured their own template (see
// manager-dashboard.tsx), it takes over the "Copy Message" button for the
// families tagged to them. {{name}} and {{link}} are substituted per family.
export function buildInviteMessage(family: InviteFamily, template?: string): string {
  const link = buildInviteLink(family)
  if (template?.trim()) {
    return template.replaceAll('{{name}}', family.fam_name).replaceAll('{{link}}', link)
  }
  return defaultInviteMessage(family, link)
}
