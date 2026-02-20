import { createClient } from '@/utils/server'
import { notFound } from 'next/navigation'
import EditForm from './edit-form'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function EditCodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: code } = await supabase
    .from('Codes')
    .select('*')
    .eq('id', id)
    .single()

  if (!code) notFound()

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-900">
      <div className="max-w-2xl mx-auto">
        {/* Navigation / Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium mb-2"
          >
            <ChevronLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit QR Code</h1>
          <p className="text-gray-500 text-sm">Update the routing for your dynamic link.</p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-semibold text-gray-700">Link Details</h2>
          </div>
          <div className="p-6">
            <EditForm code={code} />
          </div>
        </div>
      </div>
    </div>
  )
}