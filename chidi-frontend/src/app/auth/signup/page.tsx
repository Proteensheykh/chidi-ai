'use client'

import { SignupForm } from '@/features/auth/components/SignupForm'
import Link from 'next/link'

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Create an account
          </h1>
          <p className="mt-2 text-gray-600">
            Already have an account? <Link href="/auth/login" className="text-blue-600 hover:text-blue-800 font-medium">Log in</Link>
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
