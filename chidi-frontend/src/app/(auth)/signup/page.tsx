import { SignupForm } from '@/features/auth/components/SignupForm'

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <SignupForm />
        </div>
      </div>
    </div>
  )
}

export const metadata = {
  title: 'Sign Up - CHIDI',
  description: 'Create your CHIDI account to get started with AI-powered business assistance.',
}
