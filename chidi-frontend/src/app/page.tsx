'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { ArrowUp } from 'lucide-react'

export default function HomePage() {
  const [chatInput, setChatInput] = useState('')
  const router = useRouter()

  const handleGetStarted = () => {
    router.push('/signup')
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to signup to encourage registration
    router.push('/signup')
  }

  const handleSuggestionClick = (suggestion: string) => {
    setChatInput(suggestion)
    // Redirect to signup to encourage registration
    router.push('/signup')
  }

  const chatSuggestions = [
    "Help me respond to customer complaints on Instagram",
    "Create automated responses for my online store",
    "Manage my WhatsApp Business conversations",
    "What can CHIDI do for my business?"
  ]

  return (
    <div className="min-h-screen bg-white font-sans w-full">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        {/* CHIDI Logo */}
        <div className="text-xl font-medium tracking-tight">
          <span className="text-black">chidi</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#features" className="text-black hover:text-gray-600 text-sm font-medium uppercase tracking-wider">
            FEATURES
          </a>
          <a href="#pricing" className="text-black hover:text-gray-600 text-sm font-medium uppercase tracking-wider">
            PRICING
          </a>
          <a href="#about" className="text-black hover:text-gray-600 text-sm font-medium uppercase tracking-wider">
            ABOUT
          </a>
        </nav>

        <Button 
          onClick={handleGetStarted}
          className="bg-black text-white hover:bg-gray-800 px-6 py-2.5 rounded-full text-sm font-medium border-0"
        >
          Get Started
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center px-6 py-24 max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-24">
          <h1 className="text-5xl md:text-6xl font-normal text-black mb-12 leading-tight tracking-tight">
            How may I be of
            <br />
            assistance?
          </h1>
          <p className="text-xl text-gray-600 mb-16 max-w-2xl mx-auto font-normal">
            Start managing your business with AI-powered assistance.
          </p>
        </div>

        {/* Chat Interface */}
        <div className="w-full max-w-3xl mb-20">
          <form onSubmit={handleChatSubmit} className="relative mb-12">
            <div className="bg-gray-900 rounded-full p-2 pr-3 shadow-lg">
              <div className="flex items-center">
                <div className="flex-1 pl-4">
                  <Input
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="What are we doing today?"
                    className="bg-transparent border-none text-white placeholder-gray-400 text-xl py-4 focus:ring-0 focus:outline-none h-auto font-normal w-full"
                  />
                </div>
                <button
                  type="submit"
                  className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors ml-2"
                >
                  <ArrowUp className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          </form>

          {/* Chat Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 mb-16">
            {chatSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-left px-0 py-6 text-gray-600 hover:text-black transition-colors border-0 border-b border-gray-200 font-normal text-base"
              >
                {suggestion}
              </button>
            ))}
          </div>

          {/* Footer Text */}
          <p className="text-sm text-gray-500 text-center max-w-3xl mx-auto font-normal leading-relaxed">
            By getting started, you agree to our{' '}
            <a href="#terms" className="text-gray-700 hover:underline">
              Terms of Use
            </a>{' '}
            and acknowledge that you have read and understand our{' '}
            <a href="#privacy" className="text-gray-700 hover:underline">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="bg-white py-32">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-6xl font-normal text-black mb-8 tracking-tight">
              AI-powered business
              <br />
              communication.
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-normal">
              CHIDI is an AI business assistant that learns your business context and 
              automates customer interactions across social media platforms with confidence-based escalation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-12 rounded-3xl border border-gray-100">
              <div className="w-16 h-16 bg-blue-50 rounded-3xl flex items-center justify-center mb-10">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-black mb-6">Smart Conversations</h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                AI learns your business context and handles customer conversations naturally across Instagram and WhatsApp.
              </p>
            </div>

            <div className="bg-white p-12 rounded-3xl border border-gray-100">
              <div className="w-16 h-16 bg-green-50 rounded-3xl flex items-center justify-center mb-10">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-black mb-6">Confidence-Based Escalation</h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                Automatically escalates complex queries to human agents when AI confidence is low, ensuring quality responses.
              </p>
            </div>

            <div className="bg-white p-12 rounded-3xl border border-gray-100">
              <div className="w-16 h-16 bg-purple-50 rounded-3xl flex items-center justify-center mb-10">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-medium text-black mb-6">Real-time Integration</h3>
              <p className="text-gray-600 leading-relaxed font-normal">
                Seamlessly integrates with your existing social media accounts and business tools for instant automation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-black">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-6xl font-normal text-white mb-12 leading-tight tracking-tight">
            Ready to transform your
            <br />
            customer conversations?
          </h2>
          <p className="text-xl text-gray-300 mb-16 max-w-3xl mx-auto leading-relaxed font-normal">
            Join thousands of businesses using CHIDI to automate their customer service 
            and focus on what matters most - growing their business.
          </p>
          <Button 
            onClick={handleGetStarted}
            className="bg-white text-black hover:bg-gray-100 px-12 py-4 rounded-full text-lg font-medium border-0"
          >
            Get Started Free
          </Button>
        </div>
      </section>
    </div>
  )
}
