import { createClient } from '@/utils/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Await the params in Next.js 15+
  const { slug } = await params; 
  const supabase = await createClient()

  // 1. Check if the link exists
  const { data: code, error } = await supabase
    .from('Codes')
    .select('id, destination')
    .eq('slug', slug)
    .single()

    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const ip = (request.headers.get('x-forwarded-for') || '0.0.0.0').split(',')[0].trim()

  // 2. If it doesn't exist, send them to your main site or a custom 404
  if (error || !code) {
    console.log(`Slug not found: ${slug}`)
    return NextResponse.redirect(new URL('/', request.url))
  }

    fetch(`http://ip-api.com/json/${ip}`)
    .then(response => response.json())
    .then(data => {
         supabase
            .from('Scans')
            .insert({
            code_id: code?.id,
            agent: request.headers.get('user-agent') || 'unknown',
            location: data.city,
            })
    });

  // 4. THE REDIRECT
  return NextResponse.redirect(code?.destination)
}