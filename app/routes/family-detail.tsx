import { useState, type FormEvent } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { useFamilies } from '~/hooks/useFamilies'
import { useUpdateFamily } from '~/hooks/useUpdateFamily'
import { useDeleteFamily } from '~/hooks/useDeleteFamily'
import { useAddGuest, useUpdateGuest, useDeleteGuest } from '~/hooks/useGuests'
import { useLetter, useUpsertLetter } from '~/hooks/useLetter'
import { useToast } from '~/context/ToastContext'
import { getApiErrorMessage } from '~/lib/apiError'
import { ROUTES } from '~/constants'
import { Modal } from '~/components/ui/Modal'
import { ConfirmDialog } from '~/components/ui/ConfirmDialog'
import type { AdminFamilyItem } from '@api/schema/AdminFamilyItem'
import type { GuestItem } from '@api/schema/GuestItem'

export default function FamilyDetailPage() {
  const { familyId } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const { data, isLoading, error } = useFamilies()
  const family = data?.data.find((f) => String(f.id) === familyId)

  const deleteFamily = useDeleteFamily()
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  function handleDeleteFamily() {
    if (!familyId) return
    deleteFamily.mutate(familyId, {
      onSuccess: () => {
        toast.success('Family deleted')
        navigate(ROUTES.FAMILIES, { replace: true })
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, 'Failed to delete family'))
      },
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-6 w-48 animate-pulse rounded bg-stone-100" />
        <div className="h-40 animate-pulse rounded bg-stone-100" />
        <div className="h-40 animate-pulse rounded bg-stone-100" />
      </div>
    )
  }

  if (error || !family) {
    return (
      <div className="space-y-4">
        <Link to={ROUTES.FAMILIES} className="text-sm text-stone-500 hover:text-stone-700">
          &larr; Back to Families
        </Link>
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error ? 'Failed to load family data.' : 'Family not found.'}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link to={ROUTES.FAMILIES} className="text-sm text-stone-500 hover:text-stone-700">
            &larr; Back to Families
          </Link>
          <h1 className="mt-1 text-lg font-medium text-stone-900">{family.fam_name}</h1>
          <p className="font-mono text-xs text-stone-400">{family.invite_code}</p>
        </div>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="rounded border border-red-300 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
        >
          Delete Family
        </button>
      </div>

      <FamilyInfoSection family={family} />
      <GuestSection family={family} />
      <LetterSection familyId={familyId!} />

      <ConfirmDialog
        open={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteFamily}
        title="Delete Family"
        description={`This will permanently delete "${family.fam_name}" and all associated data. This cannot be undone.`}
        loading={deleteFamily.isPending}
      />
    </div>
  )
}

function FamilyInfoSection({ family }: { family: AdminFamilyItem }) {
  const toast = useToast()
  const updateFamily = useUpdateFamily()
  const [editing, setEditing] = useState(false)
  const [famName, setFamName] = useState(family.fam_name)
  const [paxAllowed, setPaxAllowed] = useState(family.pax_allowed)
  const [afterParty, setAfterParty] = useState(family.after_party_allowed)

  function handleSave(e: FormEvent) {
    e.preventDefault()
    updateFamily.mutate(
      {
        familyId: String(family.id),
        body: {
          fam_name: famName,
          pax_allowed: paxAllowed,
          after_party_allowed: afterParty,
        },
      },
      {
        onSuccess: () => {
          toast.success('Family updated')
          setEditing(false)
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, 'Failed to update'))
        },
      },
    )
  }

  function handleCancel() {
    setFamName(family.fam_name)
    setPaxAllowed(family.pax_allowed)
    setAfterParty(family.after_party_allowed)
    setEditing(false)
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-stone-700">Family Info</h2>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="rounded px-2 py-1 text-xs text-stone-600 hover:bg-stone-100"
          >
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="edit_fam_name" className="block text-xs font-medium text-stone-600">
              Family Name
            </label>
            <input
              id="edit_fam_name"
              type="text"
              required
              value={famName}
              onChange={(e) => setFamName(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-1.5 text-sm focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor="edit_pax" className="block text-xs font-medium text-stone-600">
              Pax Allowed
            </label>
            <input
              id="edit_pax"
              type="number"
              min={1}
              value={paxAllowed}
              onChange={(e) => setPaxAllowed(Number(e.target.value))}
              className="w-full rounded border border-stone-300 px-3 py-1.5 text-sm focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="edit_after_party"
              type="checkbox"
              checked={afterParty}
              onChange={(e) => setAfterParty(e.target.checked)}
              className="h-4 w-4 rounded border-stone-300"
            />
            <label htmlFor="edit_after_party" className="text-sm text-stone-700">
              After party allowed
            </label>
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={updateFamily.isPending}
              className="rounded bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-50"
            >
              {updateFamily.isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="rounded border border-stone-300 px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <dl className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <dt className="text-xs text-stone-500">Pax Allowed</dt>
            <dd className="mt-0.5 text-stone-900">{family.pax_allowed}</dd>
          </div>
          <div>
            <dt className="text-xs text-stone-500">After Party</dt>
            <dd className="mt-0.5 text-stone-900">
              {family.after_party_allowed ? 'Yes' : 'No'}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-stone-500">RSVP</dt>
            <dd className="mt-0.5 text-stone-900">
              {family.has_rsvp ? 'Submitted' : 'Pending'}
            </dd>
          </div>
        </dl>
      )}
    </section>
  )
}

function GuestSection({ family }: { family: AdminFamilyItem }) {
  const toast = useToast()
  const addGuest = useAddGuest()
  const updateGuest = useUpdateGuest()
  const deleteGuest = useDeleteGuest()

  const [showAdd, setShowAdd] = useState(false)
  const [newGuestName, setNewGuestName] = useState('')
  const [editingGuest, setEditingGuest] = useState<GuestItem | null>(null)
  const [editName, setEditName] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<GuestItem | null>(null)

  function handleAddGuest(e: FormEvent) {
    e.preventDefault()
    addGuest.mutate(
      { familyId: String(family.id), name: newGuestName },
      {
        onSuccess: () => {
          toast.success('Guest added')
          setNewGuestName('')
          setShowAdd(false)
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, 'Failed to add guest'))
        },
      },
    )
  }

  function handleUpdateGuest(e: FormEvent) {
    e.preventDefault()
    if (!editingGuest) return
    updateGuest.mutate(
      { guestId: String(editingGuest.id), name: editName },
      {
        onSuccess: () => {
          toast.success('Guest updated')
          setEditingGuest(null)
        },
        onError: (err) => {
          toast.error(getApiErrorMessage(err, 'Failed to update guest'))
        },
      },
    )
  }

  function handleDeleteGuest() {
    if (!deleteTarget) return
    deleteGuest.mutate(String(deleteTarget.id), {
      onSuccess: () => {
        toast.success('Guest removed')
        setDeleteTarget(null)
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, 'Failed to remove guest'))
      },
    })
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-stone-700">
          Guests ({family.guests.length})
        </h2>
        <button
          onClick={() => setShowAdd(true)}
          className="rounded px-2 py-1 text-xs text-stone-600 hover:bg-stone-100"
        >
          Add Guest
        </button>
      </div>

      {family.guests.length === 0 ? (
        <p className="text-sm text-stone-500">No guests added yet.</p>
      ) : (
        <ul className="divide-y divide-stone-100">
          {family.guests.map((guest) => (
            <li key={guest.id} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2">
                <span className="text-sm text-stone-900">{guest.name}</span>
                {guest.vegetarian && (
                  <span className="rounded bg-green-100 px-1.5 py-0.5 text-[10px] font-medium text-green-700">
                    Vegetarian
                  </span>
                )}
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditingGuest(guest)
                    setEditName(guest.name)
                  }}
                  className="rounded px-2 py-1 text-xs text-stone-600 hover:bg-stone-100"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(guest)}
                  className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Guest">
        <form onSubmit={handleAddGuest} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="guest_name" className="block text-sm font-medium text-stone-700">
              Name *
            </label>
            <input
              id="guest_name"
              type="text"
              required
              value={newGuestName}
              onChange={(e) => setNewGuestName(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="rounded border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={addGuest.isPending}
              className="rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
            >
              {addGuest.isPending ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        open={!!editingGuest}
        onClose={() => setEditingGuest(null)}
        title="Edit Guest"
      >
        <form onSubmit={handleUpdateGuest} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="edit_guest_name" className="block text-sm font-medium text-stone-700">
              Name *
            </label>
            <input
              id="edit_guest_name"
              type="text"
              required
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditingGuest(null)}
              className="rounded border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateGuest.isPending}
              className="rounded bg-stone-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-stone-800 disabled:opacity-50"
            >
              {updateGuest.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteGuest}
        title="Remove Guest"
        description={`Remove "${deleteTarget?.name}" from this family?`}
        confirmLabel="Remove"
        loading={deleteGuest.isPending}
      />
    </section>
  )
}

function LetterSection({ familyId }: { familyId: string }) {
  const toast = useToast()
  const { data, isLoading } = useLetter(familyId)
  const upsertLetter = useUpsertLetter(familyId)
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState('')

  function startEditing() {
    setText(data?.letter_text ?? '')
    setEditing(true)
  }

  function handleSave(e: FormEvent) {
    e.preventDefault()
    upsertLetter.mutate(text, {
      onSuccess: () => {
        toast.success('Letter saved')
        setEditing(false)
      },
      onError: (err) => {
        toast.error(getApiErrorMessage(err, 'Failed to save letter'))
      },
    })
  }

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-stone-700">Letter</h2>
        {!editing && (
          <button
            onClick={startEditing}
            className="rounded px-2 py-1 text-xs text-stone-600 hover:bg-stone-100"
          >
            {data?.letter_text ? 'Edit' : 'Write Letter'}
          </button>
        )}
      </div>

      {isLoading && (
        <div className="h-20 animate-pulse rounded bg-stone-100" />
      )}

      {!isLoading && !editing && (
        <p className="text-sm text-stone-600 whitespace-pre-wrap">
          {data?.letter_text || 'No letter written yet.'}
        </p>
      )}

      {editing && (
        <form onSubmit={handleSave} className="space-y-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
            placeholder="Write a personal letter for this family..."
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={upsertLetter.isPending}
              className="rounded bg-stone-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-stone-800 disabled:opacity-50"
            >
              {upsertLetter.isPending ? 'Saving...' : 'Save Letter'}
            </button>
            <button
              type="button"
              onClick={() => setEditing(false)}
              className="rounded border border-stone-300 px-3 py-1.5 text-xs text-stone-700 hover:bg-stone-50"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  )
}
