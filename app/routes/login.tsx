import { useState, type FormEvent } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useAuth } from '~/context/AuthContext'
import { useSignIn } from '~/hooks/useSignIn'
import { getApiErrorMessage } from '~/lib/apiError'
import { ROUTES } from '~/constants'

export default function LoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const signIn = useSignIn()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const expired = searchParams.get('reason') === 'expired'

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    signIn.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          login(data.token)
          navigate(ROUTES.DASHBOARD, { replace: true })
        },
        onError: (err) => {
          setError(getApiErrorMessage(err, 'Sign in failed'))
        },
      },
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <div className="w-full max-w-sm space-y-6 rounded-lg border border-stone-200 bg-white p-8 shadow-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-xl font-medium text-stone-900">Admin Portal</h1>
          <p className="text-sm text-stone-500">Sign in to manage your event</p>
        </div>

        {expired && (
          <p role="alert" className="text-sm text-amber-700 bg-amber-50 rounded px-3 py-2">
            Session expired — please sign in again.
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="block text-sm font-medium text-stone-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
              placeholder="admin@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="block text-sm font-medium text-stone-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-stone-300 px-3 py-2 text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-500 focus:ring-1 focus:ring-stone-500 focus:outline-none"
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
            {signIn.isPending ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
