import React from 'react';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold mb-8">
          Welcome to{' '}
          <span className="text-blue-600">
            Chidi
          </span>
        </h1>

        <p className="text-2xl mb-8">
          A modern full-stack application built with Next.js and FastAPI
        </p>

        <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
          <a
            href="https://nextjs.org/docs"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Frontend &rarr;</h3>
            <p className="mt-4 text-xl">
              Next.js 14 with App Router and TypeScript
            </p>
          </a>

          <a
            href="https://fastapi.tiangolo.com/"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Backend &rarr;</h3>
            <p className="mt-4 text-xl">
              FastAPI with Python 3.11 and Poetry
            </p>
          </a>

          <a
            href="https://supabase.com/docs"
            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
          >
            <h3 className="text-2xl font-bold">Database &rarr;</h3>
            <p className="mt-4 text-xl">
              Supabase for database, auth, and storage
            </p>
          </a>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <p>
          Powered by{' '}
          <span className="font-bold">Chidi</span>
        </p>
      </footer>
    </div>
  );
}
