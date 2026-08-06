import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useManagerAuth } from '~/context/ManagerAuthContext'
import { useManagerSignIn } from '~/hooks/useManagerSignIn'
import { getApiErrorMessage } from '~/lib/apiError'
import { ROUTES } from '~/constants'

export default function ManagerLoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useManagerAuth()
  const signIn = useManagerSignIn()

  const [passcode, setPasscode] = useState(searchParams.get('passcode') ?? '')
  const [error, setError] = useState('')

  const expired = searchParams.get('reason') === 'expired'
  const autoSubmitted = useRef(false)

  function submit(code: string) {
    setError('')
    signIn.mutate(
      { passcode: code },
      {
        onSuccess: (data) => {
          login(data.token)
          navigate(ROUTES.MANAGER_DASHBOARD, { replace: true })
        },
        onError: (err) => {
          setError(getApiErrorMessage(err, 'Invalid passcode'))
        },
      },
    )
  }

  // A passcode arriving via link (?passcode=...) logs the viewer in right
  // away — that's the whole point of handing them a link instead of a code.
  useEffect(() => {
    const fromLink = searchParams.get('passcode')
    if (fromLink && !autoSubmitted.current) {
      autoSubmitted.current = true
      submit(fromLink)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    submit(passcode)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-medium text-stone-900">RSVP Manager</h1>
          <p className="text-sm text-stone-500">Enter your passcode to view your guests</p>
        </div>

        {expired && (
          <p role="alert" className="text-sm text-amber-700 bg-amber-50 rounded px-3 py-2">
            Session expired — please enter your passcode again.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="passcode" className="block text-sm font-medium text-stone-700">
              Passcode
            </label>
            <input
              id="passcode"
              type="text"
              required
              autoComplete="off"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
              placeholder="Enter your passcode"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={signIn.isPending}
            className="w-full rounded bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 focus:ring-2 focus:ring-stone-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50"
          >
            {signIn.isPending ? 'Checking...' : 'View my guests'}
          </button>
        </form>
      </div>
    </div>
  )
}
