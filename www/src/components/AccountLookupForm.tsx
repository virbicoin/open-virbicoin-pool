"use client";

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MagnifyingGlassIcon, UserCircleIcon } from '@heroicons/react/24/outline'

export default function AccountLookupForm() {
  const [address, setAddress] = useState('')
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (address) {
      router.push(`/account/${address}`)
    }
  }

  return (
    <div className="w-full max-w-screen-2xl mx-auto bg-gray-800 border border-gray-700 rounded-lg p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-100 mb-2 flex items-center gap-2 justify-center">
        <UserCircleIcon className="w-7 h-7" />
        <span>Your Stats & Payment History</span>
      </h2>
      <p className="text-gray-400 text-center mb-4">Enter your wallet address to check your stats.</p>
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-4">
        <input
          type="text"
          className="flex-1 min-w-0 bg-[#0a1626] border border-gray-600 text-gray-200 rounded px-3 py-2 placeholder-gray-400 focus:border-blue-500 outline-none"
          placeholder="Enter your wallet address..."
          value={address}
          onChange={e => setAddress(e.target.value)}
        />
        <button type="submit" className="btn-primary flex items-center gap-2">
          <MagnifyingGlassIcon className="w-5 h-5" />
          Lookup
        </button>
      </form>
    </div>
  )
}