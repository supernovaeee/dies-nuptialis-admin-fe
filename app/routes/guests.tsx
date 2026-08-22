import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { useGuestList } from '~/hooks/useGuestList'
import { useDebounce } from '~/hooks/useDebounce'
import { ROUTES } from '~/constants'
import { EmptyState } from '~/components/ui/EmptyState'
import { Pagination } from '~/components/ui/Pagination'

const LIMIT = 50
const FILTER_CONTROL_CLASS =
  'rounded border border-stone-300 px-2.5 py-1.5 text-sm text-stone-900 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none'

export default function GuestsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search)
  const [page, setPage] = useState(0)

  const vegetarianFilter = searchParams.get('vegetarian') ?? ''
  const hasActiveFilters = !!vegetarianFilter

  function setVegetarianFilter(value: string) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set('vegetarian', value)
    else next.delete('vegetarian')
    setSearchParams(next)
    setPage(0)
  }

  function clearAllFilters() {
    const next = new URLSearchParams(searchParams)
    next.delete('vegetarian')
    setSearchParams(next)
    setPage(0)
  }

  const { data, isLoading, error } = useGuestList(
    {
      q: debouncedSearch || undefined,
      vegetarian: vegetarianFilter ? vegetarianFilter === 'true' : undefined,
    },
    page,
    LIMIT,
  )

  const guests = data?.data ?? []

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-lg font-medium text-stone-900">Guests</h1>
      </div>

      <div className="space-y-3">
        <input
          type="search"
          placeholder="Search guests..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setPage(0)
          }}
          className="w-full max-w-sm rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
        />

        <div className="flex flex-wrap items-end gap-3 rounded-lg border border-stone-200 bg-stone-50/60 p-3">
          <div className="space-y-1">
            <label htmlFor="filter-vegetarian" className="block text-xs font-medium text-stone-500">
              Vegetarian
            </label>
            <select
              id="filter-vegetarian"
              value={vegetarianFilter}
              onChange={(e) => setVegetarianFilter(e.target.value)}
              className={FILTER_CONTROL_CLASS}
            >
              <option value="">Any</option>
              <option value="true">Vegetarian only</option>
              <option value="false">Non-vegetarian only</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="rounded px-2 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-100 hover:text-stone-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {error && (
        <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load guests.
        </div>
      )}

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded bg-stone-100" />
          ))}
        </div>
      )}

      {!isLoading && data && guests.length === 0 && (
        <EmptyState
          title="No matching guests"
          description={
            hasActiveFilters || debouncedSearch
              ? 'Try adjusting or clearing the search and filters.'
              : 'Guests will appear here once families are added.'
          }
          action={
            hasActiveFilters ? (
              <button
                onClick={clearAllFilters}
                className="rounded border border-stone-300 px-3 py-1.5 text-sm text-stone-700 hover:bg-stone-50"
              >
                Clear filters
              </button>
            ) : undefined
          }
        />
      )}

      {!isLoading && data && guests.length > 0 && (
        <>
          {/* Mobile/tablet: card list */}
          <div className="space-y-3 md:hidden">
            {guests.map((guest) => (
              <div key={guest.id} className="rounded-lg border border-stone-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium text-stone-900">{guest.name}</p>
                  <VegetarianBadge vegetarian={guest.vegetarian} />
                </div>
                <Link
                  to={ROUTES.FAMILY_DETAIL(guest.family_id)}
                  className="mt-1 block text-sm text-stone-500 hover:underline"
                >
                  {guest.fam_name}
                </Link>
              </div>
            ))}
          </div>

          {/* Desktop: table */}
          <div className="hidden overflow-x-auto rounded-lg border border-stone-200 md:block">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-stone-200 bg-stone-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-stone-600">Name</th>
                  <th className="px-4 py-3 font-medium text-stone-600">Family</th>
                  <th className="px-4 py-3 font-medium text-stone-600 text-center">Vegetarian</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {guests.map((guest) => (
                  <tr key={guest.id} className="hover:bg-stone-50">
                    <td className="px-4 py-3 font-medium text-stone-900">{guest.name}</td>
                    <td className="px-4 py-3">
                      <Link
                        to={ROUTES.FAMILY_DETAIL(guest.family_id)}
                        className="text-stone-700 hover:underline"
                      >
                        {guest.fam_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <VegetarianBadge vegetarian={guest.vegetarian} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination page={page} total={data.total} limit={LIMIT} onPageChange={setPage} />
        </>
      )}
    </div>
  )
}

function VegetarianBadge({ vegetarian }: { vegetarian: boolean }) {
  if (!vegetarian) return <span className="text-stone-300">—</span>
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
      Vegetarian
    </span>
  )
}
