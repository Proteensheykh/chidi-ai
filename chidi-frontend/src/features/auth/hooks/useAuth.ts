import { useState, useEffect } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase/client'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

interface AuthActions {
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithPassword: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  clearError: () => void
}

// Helper function to initialize user context in backend
const initializeUserContext = async (session: Session | null) => {
  if (!session?.access_token) {
    console.error('No access token found in session')
    return
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

    console.log('Initializing user context for user:', session.user?.id)
    console.log('******Access token:', session.access_token)
    
    const response = await fetch(`${backendUrl}/users/context`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      console.error('Failed to initialize user context:', response.status, response.statusText)
      return
    }

    const result = await response.json()
    console.log('User context initialized:', result.created ? 'created' : 'retrieved')
  } catch (error) {
    console.error('Error initializing user context:', error)
  }
}

export function useAuth(): AuthState & AuthActions {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      setState(prev => ({
        ...prev,
        session,
        user: session?.user ?? null,
        loading: false,
        error: error?.message ?? null,
      }))

      // Initialize user context if session exists
      if (session) {
        await initializeUserContext(session)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({
          ...prev,
          session,
          user: session?.user ?? null,
          loading: false,
          error: null,
        }))

        // Initialize user context on sign in
        if (event === 'SIGNED_IN' && session) {
          await initializeUserContext(session)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setState(prev => ({
      ...prev,
      loading: false,
      error: error?.message ?? null,
    }))

    return { error }
  }

  const signInWithPassword = async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setState(prev => ({
      ...prev,
      loading: false,
      error: error?.message ?? null,
    }))

    return { error }
  }

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    const { error } = await supabase.auth.signOut()

    setState(prev => ({
      ...prev,
      loading: false,
      error: error?.message ?? null,
    }))

    return { error }
  }
  
  const signInWithGoogle = async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    setState(prev => ({
      ...prev,
      loading: false,
      error: error?.message ?? null,
    }))

    return { error }
  }

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }))
  }

  return {
    ...state,
    signUp,
    signInWithPassword,
    signInWithGoogle,
    signOut,
    clearError,
  }
}
