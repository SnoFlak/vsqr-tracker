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
    const ip = request.headers.get('x-forwarded-for') || '0.0.0.0'
    let location = "";

    fetch(`http://ip-api.com/json/${ip}`)
    .then(response => response.json())
    .then(data => {
        location = data.city;
    });

  // 2. If it doesn't exist, send them to your main site or a custom 404
  if (error || !code) {
    console.log(`Slug not found: ${slug}`)
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 3. Log the scan (The "Fire and Forget" method)
  // This happens in the background so the user doesn't wait
  supabase
    .from('Scans')
    .insert({
      code_id: code?.id,
      agent: request.headers.get('user-agent') || 'unknown',
      location: location,
    })
    .then()

  // 4. THE REDIRECT
  return NextResponse.redirect(code?.destination)
}