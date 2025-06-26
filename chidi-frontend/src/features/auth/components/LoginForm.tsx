'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm() {
  const router = useRouter()
  const { signInWithPassword, signInWithGoogle, loading, error: authError, clearError } = useAuth()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [validationErrors, setValidationErrors] = useState<Partial<LoginFormData>>({})
  const [error, setError] = useState<string | null>(null)

  const validateForm = (): boolean => {
    const errors: Partial<LoginFormData> = {}

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    clearError()
    
    const { error } = await signInWithPassword(formData.email, formData.password)
    
    if (!error) {
      // Redirect to dashboard or home page after successful login
      router.push('/')
    }
  }

  const handleInputChange = (field: keyof LoginFormData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: undefined }))
    }
    // Clear auth error when user makes changes
    if (authError) {
      clearError()
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-6">
        {authError && (
          <Alert variant="destructive">
            <AlertDescription>{authError}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div>
            <Input
              id="email"
              type="text"
              value={formData.email}
              onChange={handleInputChange('email')}
              placeholder="Username or Email"
              disabled={loading}
              className={`rounded-md border border-gray-300 px-4 py-3 text-base ${validationErrors.email ? 'border-red-500' : ''}`}
            />
            {validationErrors.email && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
            )}
          </div>

          <div>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange('password')}
              placeholder="Password"
              disabled={loading}
              className={`rounded-md border border-gray-300 px-4 py-3 text-base ${validationErrors.password ? 'border-red-500' : ''}`}
            />
            {validationErrors.password && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-black hover:bg-gray-800 text-white rounded-full py-6 text-base font-medium"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            'Log in'
          )}
        </Button>
        
        <div className="relative flex items-center justify-center py-2">
          <div className="border-t border-gray-300 w-full"></div>
          <span className="bg-white px-4 text-sm text-gray-500">OR</span>
          <div className="border-t border-gray-300 w-full"></div>
        </div>
        
        <div className="space-y-3">
          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center gap-2 rounded-full py-5 border border-gray-300 text-base font-medium"
            disabled={loading}
            onClick={() => signInWithGoogle()}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting to Google...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Log in with Google
              </>
            )}
          </Button>
        </div>
        
        <div className="text-center mt-4">
          <Link 
            href="/auth/forgot-password"
            className="text-base text-blue-600 hover:text-blue-800 font-medium"
          >
            Forgot Password
          </Link>
        </div>
      </form>
    </div>
  )
}
