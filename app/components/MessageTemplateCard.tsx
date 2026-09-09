import { useEffect, useState } from 'react'

interface MessageTemplateCardProps {
  message?: string
  isSaving: boolean
  onSave: (message: string) => void
  description: string
}

export function MessageTemplateCard({ message, isSaving, onSave, description }: MessageTemplateCardProps) {
  const [value, setValue] = useState(message ?? '')
  const [dirty, setDirty] = useState(false)

  useEffect(() => {
    setValue(message ?? '')
    setDirty(false)
  }, [message])

  return (
    <div className="space-y-2 rounded-lg border border-stone-200 bg-white p-4">
      <label htmlFor="message_template" className="block text-sm font-medium text-stone-700">
        Message Template
      </label>
      <textarea
        id="message_template"
        rows={5}
        placeholder={"Dear {{name}},\n\nYou're invited to our wedding! Please RSVP here:\n\n{{link}}"}
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          setDirty(true)
        }}
        className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
      />
      <p className="text-xs text-stone-500">
        {description} Leave blank to use the default message. Use{' '}
        <code className="rounded bg-stone-100 px-1">{'{{name}}'}</code> and{' '}
        <code className="rounded bg-stone-100 px-1">{'{{link}}'}</code> as placeholders — they'll be filled in per guest.
      </p>
      <div className="flex justify-end">
        <button
          onClick={() => onSave(value)}
          disabled={isSaving || !dirty}
          className="rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}
