import { useState, type FormEvent } from 'react'
import { useFaqs } from '~/hooks/useFaqs'
import { useCreateFaq } from '~/hooks/useCreateFaq'
import { useUpdateFaq } from '~/hooks/useUpdateFaq'
import { useDeleteFaq } from '~/hooks/useDeleteFaq'
import { useToast } from '~/context/ToastContext'
import { getApiErrorMessage } from '~/lib/apiError'
import { Modal } from '~/components/ui/Modal'
import { ConfirmDialog } from '~/components/ui/ConfirmDialog'
import { EmptyState } from '~/components/ui/EmptyState'
import type { AdminFaqItem } from '@api/schema/AdminFaqItem'

export default function FaqPage() {
  const toast = useToast()
  const { data, isLoading, error } = useFaqs()
  const updateFaq = useUpdateFaq()
  const deleteFaq = useDeleteFaq()

  const [showCreate, setShowCreate] = useState(false)
  const [editTarget, setEditTarget] = useState<AdminFaqItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<AdminFaqItem | null>(null)

  const faqs = data?.data ?? []

  function handleToggleArchive(faq: AdminFaqItem) {
    updateFaq.mutate(
      { faqId: String(faq.id), body: { archived: !faq.archived } },
      {
        onSuccess: () => {
          toast.success(faq.archived ? 'FAQ unarchived' : 'FAQ archived')
        },
        onError: (err) =>
          toast.error(getApiErrorMessage(err, 'Failed to update FAQ')),
      },
    )
  }

  function handleDelete() {
    if (!deleteTarget) return
    deleteFaq.mutate(String(deleteTarget.id), {
      onSuccess: () => {
        toast.success('FAQ deleted')
        setDeleteTarget(null)
      },
      onError: (err) =>
        toast.error(getApiErrorMessage(err, 'Failed to delete FAQ')),
    })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-medium text-stone-900">FAQ</h1>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
        >
          Add FAQ
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          Failed to load FAQs.
        </div>
      )}

      {isLoading && (
        <div className="space-y-3" aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-stone-100" />
          ))}
        </div>
      )}

      {data && faqs.length === 0 && (
        <EmptyState
          title="No FAQs yet"
          description="Add a question to display on the invitation site."
          action={
            <button
              onClick={() => setShowCreate(true)}
              className="rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800"
            >
              Add FAQ
            </button>
          }
        />
      )}

      {faqs.length > 0 && (
        <div className="space-y-3">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className={`rounded-lg border border-stone-200 bg-white p-4 ${
                faq.archived ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-medium text-stone-900">
                      {faq.question}
                    </h3>
                    {faq.archived && (
                      <span className="shrink-0 rounded bg-stone-900/80 px-2 py-0.5 text-xs font-medium text-white">
                        Archived
                      </span>
                    )}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-stone-500">
                    {faq.answer}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button
                    onClick={() => setEditTarget(faq)}
                    className="rounded px-2 py-1 text-xs text-stone-600 hover:bg-stone-100"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleToggleArchive(faq)}
                    disabled={updateFaq.isPending}
                    className="rounded px-2 py-1 text-xs text-stone-600 hover:bg-stone-100 disabled:opacity-50"
                  >
                    {faq.archived ? 'Unarchive' : 'Archive'}
                  </button>
                  <button
                    onClick={() => setDeleteTarget(faq)}
                    className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <FaqFormModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        mode="create"
      />

      {editTarget && (
        <FaqFormModal
          open
          onClose={() => setEditTarget(null)}
          mode="edit"
          faq={editTarget}
        />
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete FAQ"
        description={`Delete "${deleteTarget?.question ?? ''}" from the FAQ list?`}
        loading={deleteFaq.isPending}
      />
    </div>
  )
}

function FaqFormModal({
  open,
  onClose,
  mode,
  faq,
}: {
  open: boolean
  onClose: () => void
  mode: 'create' | 'edit'
  faq?: AdminFaqItem
}) {
  const toast = useToast()
  const createFaq = useCreateFaq()
  const updateFaq = useUpdateFaq()

  const [question, setQuestion] = useState(faq?.question ?? '')
  const [answer, setAnswer] = useState(faq?.answer ?? '')
  const [touched, setTouched] = useState(false)

  const isPending = createFaq.isPending || updateFaq.isPending
  const isValid = question.trim().length > 0 && answer.trim().length > 0

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setTouched(true)
    if (!isValid) return

    const body = { question: question.trim(), answer: answer.trim() }

    if (mode === 'create') {
      createFaq.mutate(body, {
        onSuccess: () => {
          toast.success('FAQ created')
          onClose()
        },
        onError: (err) =>
          toast.error(getApiErrorMessage(err, 'Failed to create FAQ')),
      })
    } else if (faq) {
      updateFaq.mutate(
        { faqId: String(faq.id), body },
        {
          onSuccess: () => {
            toast.success('FAQ updated')
            onClose()
          },
          onError: (err) =>
            toast.error(getApiErrorMessage(err, 'Failed to update FAQ')),
        },
      )
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'create' ? 'Add FAQ' : 'Edit FAQ'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label
            htmlFor="faq_question"
            className="block text-sm font-medium text-stone-700"
          >
            Question <span className="text-red-600">*</span>
          </label>
          <input
            id="faq_question"
            type="text"
            required
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onBlur={() => setTouched(true)}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
          />
          {touched && question.trim().length === 0 && (
            <p role="alert" className="text-xs text-red-600">
              Question is required.
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="faq_answer"
            className="block text-sm font-medium text-stone-700"
          >
            Answer <span className="text-red-600">*</span>
          </label>
          <textarea
            id="faq_answer"
            required
            rows={4}
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onBlur={() => setTouched(true)}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
          />
          {touched && answer.trim().length === 0 && (
            <p role="alert" className="text-xs text-red-600">
              Answer is required.
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
          >
            {isPending ? 'Saving...' : mode === 'create' ? 'Create' : 'Save'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
