'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../hooks/useAuth'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { Label } from '@/shared/ui/label'
import { Alert, AlertDescription } from '@/shared/ui/alert'
import { Loader2 } from 'lucide-react'

interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
}

export function SignupForm() {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [showSuccess, setShowSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Partial<SignupFormData>>({})
  
  const { signUp, loading, error, clearError } = useAuth()
  const router = useRouter()

  const validateForm = (): boolean => {
    const errors: Partial<SignupFormData> = {}

    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters'
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    clearError()
    
    const { error } = await signUp(formData.email, formData.password)
    
    if (!error) {
      setShowSuccess(true)
      // Reset form
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
      })
    }
  }

  const handleInputChange = (field: keyof SignupFormData) => (
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

  if (showSuccess) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-green-600">Check Your Email!</h2>
          <p className="mt-2 text-gray-600">
            We've sent you a verification link at <strong>{formData.email}</strong>
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Click the link in the email to complete your signup.
          </p>
        </div>
        
        <Button
          onClick={() => setShowSuccess(false)}
          variant="outline"
          className="w-full"
        >
          Sign up another account
        </Button>
        
        <div className="text-center">
          <button
            onClick={() => router.push('/login')}
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Already have an account? Sign in
          </button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-gray-600">
          Get started with CHIDI today
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
            placeholder="Create a password"
            disabled={loading}
            className={validationErrors.password ? 'border-red-500' : ''}
          />
          {validationErrors.password && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleInputChange('confirmPassword')}
            placeholder="Confirm your password"
            disabled={loading}
            className={validationErrors.confirmPassword ? 'border-red-500' : ''}
          />
          {validationErrors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
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
            Creating account...
          </>
        ) : (
          'Create account'
        )}
      </Button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
          disabled={loading}
        >
          Already have an account? Sign in
        </button>
      </div>
    </form>
  )
}
