import { useCopyManagerInvite } from '~/hooks/useCopyManagerInvite'

interface ManagerInviteActionButtonsProps {
  manager: { name: string; passcode: string; message?: string }
  className?: string
}

export function ManagerInviteActionButtons({ manager, className = '' }: ManagerInviteActionButtonsProps) {
  const { copyLink, copyMessage } = useCopyManagerInvite()

  return (
    <div className={`flex flex-wrap items-center gap-1 ${className}`}>
      <button
        onClick={() => copyLink(manager)}
        className="flex items-center gap-1 rounded px-2 py-1 text-xs text-stone-600 hover:bg-stone-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-3.5 w-3.5"
          aria-hidden="true"
        >
          <path d="M12.232 4.232a2.5 2.5 0 0 1 3.536 3.536l-1.225 1.224a.75.75 0 0 0 1.061 1.06l1.224-1.224a4 4 0 0 0-5.656-5.656l-3 3a4 4 0 0 0 .225 5.865.75.75 0 0 0 .977-1.138 2.5 2.5 0 0 1-.142-3.667l3-3Z" />
          <path d="M11.603 7.603a.75.75 0 0 0-.977 1.138 2.5 2.5 0 0 1 .142 3.667l-3 3a2.5 2.5 0 0 1-3.536-3.536l1.225-1.224a.75.75 0 0 0-1.061-1.06l-1.224 1.224a4 4 0 1 0 5.656 5.656l3-3a4 4 0 0 0-.225-5.865Z" />
        </svg>
        Copy Link
      </button>
      <button
        onClick={() => copyMessage(manager)}
        className="flex items-center gap-1 rounded px-2 py-1 text-xs text-stone-600 hover:bg-stone-100"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-3.5 w-3.5"
          aria-hidden="true"
        >
          <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h9A1.5 1.5 0 0 1 14 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12.5v-9Z" />
          <path d="M6 6.5a1.5 1.5 0 0 1 1.5-1.5h9A1.5 1.5 0 0 1 18 6.5v9a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 15.5v-9Z" />
        </svg>
        Copy Message
      </button>
    </div>
  )
}
