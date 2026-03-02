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
    // Start the IP lookup
    fetch(`http://ip-api.com/json/${ip}`)
    .then(res => res.json())
    .then(ipData => {
    // NOW insert into Supabase once we actually have the location
        return supabase
        .from('Scans')
        .insert({
            code_id: code?.id,
            agent: userAgent,
            location: ipData.city || "Unknown", // Use the data from the fetch
        })
    })
    .catch(err => console.error("Logging failed:", err))
  } else {
    console.log("Bot tried to hit link");
  }

  return NextResponse.redirect(code?.destination)
}