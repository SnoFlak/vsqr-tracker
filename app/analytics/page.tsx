import { createClient } from '@/utils/server'
import Link from 'next/link'
import { ChevronLeft, BarChart3, TrendingUp, MousePointer2 } from 'lucide-react'
import ScanChart from './scan-chart'
import AnalyticsFilter from './analytics-filter'

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const { id } = await searchParams
  const supabase = await createClient()

  // 1. Fetch Scans (Filtered by ID if present)
  let query = supabase
    .from('Scans')
    .select('created_at, Codes(slug, id)')
    .order('created_at', { ascending: true })

  if (id) {
    query = query.eq('code_id', id)
  }

  const { data: scans } = await query

  // 2. Fetch all codes for the filter dropdown
  const { data: allCodes } = await supabase
    .from('Codes')
    .select('id, slug')
    .order('slug', { ascending: true })

  // 3. Calculate "Top Performing Links" for the sidebar/summary
  // We'll group the data here on the server
  const topLinks = scans?.reduce((acc: any, scan: any) => {
    const slug = scan.Codes?.slug || 'unknown'
    acc[slug] = (acc[slug] || 0) + 1
    return acc
  }, {})

  console.log(scans)

  const sortedLinks = Object.entries(topLinks || {})
    .sort(([, a]: any, [, b]: any) => b - a)
    .slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 text-gray-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <Link 
              href="/dashboard" 
              className="flex items-center gap-1 text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium mb-2"
            >
              <ChevronLeft size={16} />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="text-blue-600" size={28} />
              Global Analytics
            </h1>
          </div>

          {/* Client-side Filter Component */}
          {/* <AnalyticsFilter allCodes={allCodes || []} currentId={id || ""} /> */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart Card (2/3 width) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-gray-700">Scan Activity</h3>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                {scans?.length || 0} Total Scans
              </span>
            </div>
            <div className="h-[350px] w-full">
              <ScanChart scans={scans || []} />
            </div>
          </div>

          {/* Top Links Sidebar (1/3 width) */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-green-500" />
                Top Performing
              </h3>
              <div className="space-y-4">
                {sortedLinks.length > 0 ? (
                  sortedLinks.map(([slug, count]: any) => (
                    <div key={slug} className="flex items-center justify-between group">
                      <span className="text-sm font-mono text-gray-600 group-hover:text-blue-600 transition-colors">
                        /{slug}
                      </span>
                      <span className="text-sm font-bold text-gray-900">{count}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic">No scan data yet.</p>
                )}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}