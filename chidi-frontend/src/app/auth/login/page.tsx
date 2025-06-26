'use client'

import { LoginForm } from '@/features/auth/components/LoginForm'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Welcome to CHIDI
          </h1>
          <p className="mt-2 text-gray-600">
            Don't have an account? <Link href="/auth/signup" className="text-blue-600 hover:text-blue-800 font-medium">Sign up for free</Link>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
