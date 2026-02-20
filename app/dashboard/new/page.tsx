import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import CreateForm from './create-form'

export default function NewCodePage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-900">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium mb-2"
          >
            <ChevronLeft size={16} />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create New QR Code</h1>
          <p className="text-gray-500 text-sm">Set up a new dynamic redirect for your band.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-semibold text-gray-700">Link Configuration</h2>
          </div>
          <div className="p-6">
            <CreateForm />
          </div>
        </div>
      </div>
    </div>
  )
}