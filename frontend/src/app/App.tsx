import { Component, useEffect } from 'react'
import type { ReactNode } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../features/auth/store'
import { AuthPage } from '../features/auth/components/AuthPage'
import { AppShell } from '../components/AppShell'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
})

// Catches render errors so the user sees a message instead of a blank page
class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="h-screen flex items-center justify-center bg-apple-bg p-6">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-card p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-2">Something went wrong</h2>
            <pre className="text-xs text-red-600 bg-red-50 rounded-lg p-3 whitespace-pre-wrap break-all">
              {this.state.error.message}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 w-full py-2 bg-apple-blue text-white text-sm font-semibold rounded-lg hover:bg-blue-600 transition-colors"
            >
              Reload
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

function AuthGate() {
  const { user, loading, setUser, setLoading } = useAuthStore()

  useEffect(() => {
    // Initial session check — .catch ensures loading is cleared even if getSession() rejects
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })
      .catch(() => {
        setUser(null)
        setLoading(false)
      })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
      // Clear cached data on sign-out
      if (!session) queryClient.clear()
    })

    return () => subscription.unsubscribe()
  }, [setUser, setLoading])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-apple-bg">
        <div className="w-8 h-8 rounded-full border-2 border-apple-blue border-t-transparent animate-spin" />
      </div>
    )
  }

  return user ? <AppShell /> : <AuthPage />
}

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthGate />
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
