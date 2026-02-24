'use client'

import { useState } from 'react'
import { deleteCode } from './actions'
import { Trash2, Loader2 } from 'lucide-react'

export default function DeleteButton({ id }: { id: string }) {
  const [isPending, setIsPending] = useState(false)

  const handleDelete = async () => {
    if (confirm("Are you sure? This will delete all scan analytics for this link forever.")) {
      setIsPending(true)
      try {
        await deleteCode(id)
      } catch (e) {
        alert("Something went wrong.")
        setIsPending(false)
      }
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
    >
      {isPending ? <Loader2 className="animate-spin" size={18} /> : <Trash2 size={18} />}
      {isPending ? 'Deleting...' : 'Delete QR Code'}
    </button>
  )
}