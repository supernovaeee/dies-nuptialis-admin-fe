import { GUEST_SITE_URL } from '~/constants'

interface InviteFamily {
  fam_name: string
  invite_code: string
}

export function buildInviteLink(family: Pick<InviteFamily, 'invite_code'>): string {
  return `${GUEST_SITE_URL}/${family.invite_code}`
}

export function buildInviteMessage(family: InviteFamily): string {
  const link = buildInviteLink(family)
  return `Dear ${family.fam_name},

It is with great joy and honor that we invite you to our wedding.

As we stand before God to make our sacred vows to one another, we would be overjoyed to have you there standing at the pews to witness and celebrate this special day with us.

So, allow us to invite you to our holy matrimony and garden reception on:

🗓️ Saturday, November 7, 2026
🕝 2.45 PM
📍⛪️ Armenian Church of St. Gregory the Illuminator, 60 Hill St, Singapore

You may visit the unique link below for RSVP and further event details:

${link}

Kindly RSVP by 07 August 2026.

We hope to see you at the pews!

With love,
Azza & Marcel`
}
