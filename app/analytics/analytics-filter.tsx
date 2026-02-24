'use client'

import { useRouter } from 'next/navigation'

export default function AnalyticsFilter({ 
  allCodes, 
  currentId 
}: { 
  allCodes: any[], 
  currentId: string 
}) {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-semibold text-gray-500 uppercase">Filter by Link</label>
      <select 
        onChange={(e) => {
          const val = e.target.value
          router.push(val ? `/dashboard/analytics?id=${val}` : '/dashboard/analytics')
        }}
        className="bg-white border border-gray-200 rounded-lg p-2 text-sm shadow-sm outline-none focus:ring-2 focus:ring-blue-500/20"
        value={currentId}
      >
        <option value="">All Links</option>
        {allCodes?.map(c => (
          <option key={c.id} value={c.id}>/{c.slug}</option>
        ))}
      </select>
    </div>
  )
}