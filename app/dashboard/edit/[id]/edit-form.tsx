'use client'

import { updateCode } from './actions'
import { useState } from 'react'
import { Save, Loader2, Delete } from 'lucide-react'
import DeleteButton from './delete-button'

export default function EditForm({ code, codeid }: { code: any, codeid: any }) {
  const [loading, setLoading] = useState(false)
  const updateWithId = updateCode.bind(null, code.id)

  const labelStyles = "block text-sm font-semibold text-gray-700 mb-1.5";
  const inputStyles = "w-full bg-white border border-gray-300 rounded-lg p-2.5 text-gray-900 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all shadow-sm";

  return (
    <form action={updateWithId} onSubmit={() => setLoading(true)} className="space-y-6">
      <div>
        <label className={labelStyles}>URL Slug</label>
        <div className="flex shadow-sm rounded-lg">
          <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
            vsqr-tracker.vercel.app/q/
          </span>
          <input
            name="slug"
            className={`${inputStyles} rounded-l-none`}
            placeholder={code.slug}
            disabled
          />
        </div>
        <p className="mt-2 text-xs text-gray-400">This is the short path your QR code will point to.</p>
      </div>

      <div>
        <label className={labelStyles}>Destination URL</label>
        <input
          name="destination_url"
          type="url"
          defaultValue={code.destination}
          className={inputStyles}
          placeholder={code.destination}
          required
        />
        <p className="mt-2 text-xs text-gray-400">Where fans will land after scanning.</p>
      </div>

      <div className="pt-4 flex items-center justify-between gap-4 border-t border-gray-100 mt-6">
        <p className="text-xs text-gray-400 italic">ID: {code.id}</p>
        <DeleteButton id={codeid} />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <Save size={18} />
          )}
          <span>{loading ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>
    </form>
  )
}