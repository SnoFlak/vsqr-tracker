import React from 'react';
import { createClient } from '@/utils/server';
import Link from 'next/link';
import { Plus, BarChart3, Link as LinkIcon, ExternalLink } from 'lucide-react'; // Optional: npm install lucide-react

export default async function Dashboard() {

    const supabase = await createClient();
    const { data: codes, error } = await supabase
    .from('Codes')
    .select('*, Scans(count)')
    .order('created_at', { ascending: false});

    let totalScans = 0;
    codes?.forEach(code => {
        totalScans += code.Scans[0].count;
    })

    console.log(codes, error);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Band QR Manager</h1>
          <p className="text-gray-500 text-sm">Manage your dynamic links and scans</p>
        </div>
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-sm">
          <Plus size={18} />
            <span>
                <Link href="/dashboard/new">
                    New Code
                </Link>
            </span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto grid gap-6">
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-gray-500 text-sm font-medium mb-1">Total Scans</div>
            <div className="text-3xl font-bold text-gray-900">{totalScans}</div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-gray-500 text-sm font-medium mb-1">Active Links</div>
            <div className="text-3xl font-bold text-gray-900">{codes?.length || 0}</div>
          </div>
          {/* <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="text-gray-500 text-sm font-medium mb-1">Top Link</div>
            <div className="text-xl font-bold text-blue-600 truncate">/merch-drop-2026</div>
          </div> */}
        </div>

        {/* QR Links Table/List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="font-semibold text-gray-700">Your QR Codes</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase text-gray-400 font-semibold bg-gray-50/50">
                  <th className="px-6 py-3">Slug</th>
                  <th className="px-6 py-3">Destination</th>
                  <th className="px-6 py-3 text-center">Scans</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {/* Mock Row 1 */}
                {
                    codes?.map((code, index) => (
                        <tr key={index} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-mono text-sm text-blue-600 font-bold">/{code.slug}</td>
                            <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs">{code.destination}</td>
                            <td className="px-6 py-4 text-center text-sm font-medium text-gray-700">{code.Scans[0].count}</td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-gray-400 hover:text-gray-600 px-2">
                                    <Link href={`/dashboard/edit/${code.id}`}>
                                        Edit
                                    </Link>
                                </button>
                            </td>
                        </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}