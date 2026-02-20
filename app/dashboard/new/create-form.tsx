'use client'

import { createLink } from './actions'
import { useState, useActionState } from 'react' // Import useActionState
import { Sparkles, Loader2, Link as LinkIcon, AlertCircle } from 'lucide-react'

export default function CreateForm() {
  const [slug, setSlug] = useState('')
  
  // state will contain whatever your action returns (the error)
  // formAction is what you'll pass to the form
  // isPending replaces your manual 'loading' state
  const [state, formAction, isPending] = useActionState(createLink, null)

  const generateRandomSlug = () => {
    const random = Math.random().toString(36).substring(2, 8)
    setSlug(random)
  }

  return (
    <form action={formAction} className="space-y-6">
      {/* Show Error Message if it exists */}
      {state?.error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle size={16} />
          {state.error}
        </div>
      )}

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Short Slug</label>
        <div className="flex gap-2">
          <div className="flex shadow-sm rounded-lg flex-1">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
              /q/
            </span>
            <input
              name="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full bg-white border border-gray-300 rounded-r-lg p-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              placeholder="tour-2026"
              required
            />
          </div>
          <button 
            type="button"
            onClick={generateRandomSlug}
            className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <Sparkles size={20} />
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Destination URL</label>
        <input
          name="destination_url"
          type="url"
          className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm"
          placeholder="https://spotify.com/..."
          required
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-md disabled:opacity-50"
      >
        {isPending ? <Loader2 className="animate-spin" /> : <LinkIcon size={18} />}
        <span>{isPending ? 'Creating...' : 'Create QR Link'}</span>
      </button>
    </form>
  )
}