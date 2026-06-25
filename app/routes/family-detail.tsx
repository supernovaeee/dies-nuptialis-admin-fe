import { useParams } from 'react-router'

export default function FamilyDetailPage() {
  const { familyId } = useParams()

  return (
    <div>
      <h1 className="text-lg font-medium text-stone-900">Family #{familyId}</h1>
      <p className="mt-1 text-sm text-stone-500">Family detail coming soon.</p>
    </div>
  )
}
