'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Loader2 } from 'lucide-react'

interface LoginFormData {
  email: string
  password: string
}

export function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  })
  const [validationErrors, setValidationErrors] = useState<Partial<LoginFormData>>({})
  
  const { signInWithPassword, loading, error, clearError } = useAuth()
  const router = useRouter()

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
    if (error) {
      clearError()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
        <p className="mt-2 text-gray-600">
          Sign in to your CHIDI account
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange('email')}
            placeholder="Enter your email"
            disabled={loading}
            className={validationErrors.email ? 'border-red-500' : ''}
          />
          {validationErrors.email && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange('password')}
            placeholder="Enter your password"
            disabled={loading}
            className={validationErrors.password ? 'border-red-500' : ''}
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign in'
        )}
      </Button>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={() => router.push('/signup')}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
          disabled={loading}
        >
          Don't have an account? Sign up
        </button>
        
        <div>
          <button
            type="button"
            onClick={() => {
              // TODO: Implement forgot password functionality
              alert('Forgot password functionality will be implemented in a future update.')
            }}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
            disabled={loading}
          >
            Forgot your password?
          </button>
        </div>
      </div>
    </form>
  )
}
