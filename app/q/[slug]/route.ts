import { createClient } from '@/utils/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  // Await the params in Next.js 15+
  const { slug } = await params; 
  const supabase = await createClient()

  // Check if the link exists
  const { data: code, error } = await supabase
    .from('Codes')
    .select('id, destination')
    .eq('slug', slug)
    .single()

    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const isBot = /bot|spider|crawler|preview|facebookexternalhit|whatsapp|slurp|t-mobile|vzw/i.test(userAgent);
    const ip = (request.headers.get('x-forwarded-for') || '0.0.0.0').split(',')[0].trim()

  // If it doesn't exist, send them to your main site or a custom 404
  if (error || !code) {
    console.log(`Slug not found: ${slug}`)
    return NextResponse.redirect(new URL('/', request.url))
  }

  if(!isBot){
    // Direct insert - no external fetch to fail or rate-limit
    const { error } = await supabase
    .from('Scans')
    .insert({
      code_id: code?.id,
      agent: userAgent,
      // Optional: Store timezone as a proxy for location without an API call
      location: Intl.DateTimeFormat().resolvedOptions().timeZone || "Unknown"
    })
    if (error) console.error("Logging failed:", error);
  } else {
    console.log("Bot tried to hit link");
  }

  return NextResponse.redirect(code?.destination)
}