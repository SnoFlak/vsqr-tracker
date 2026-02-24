import { createClient } from '@/utils/server'
import { notFound } from 'next/navigation'
import EditForm from './edit-form'
import Link from 'next/link'
import { ChevronLeft, Download } from 'lucide-react'

export default async function EditCodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: code } = await supabase
    .from('Codes')
    .select('*')
    .eq('id', id)
    .single()

  if (!code) notFound()

  const { data: { publicUrl }} = supabase.storage.from('qrcodes').getPublicUrl(`${id}.png`);
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
        
        {/* Left Side: The Form */}
        <div className="md:col-span-2 space-y-6">
           <h1 className="text-2xl font-bold text-gray-900">Edit QR Code</h1>
           <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
             <EditForm code={code} />
           </div>
        </div>

        {/* Right Side: The QR Preview & Download */}
        <div className="space-y-8">
          <h2 className="font-semibold text-gray-700">QR Code Preview</h2>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col items-center">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={publicUrl} 
                alt="QR Code" 
                className="w-48 h-48 image-render-pixelated"
              />
            </div>
            
            <a 
              href={publicUrl} 
              download={`qr-${code.slug}.png`}
              className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-lg font-medium transition-all"
            >
              <Download size={18} />
              Download PNG
            </a>
          </div>
        </div>

      </div>
    </div>
  )
}