'use server'

import { createClient } from '@/utils/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

var QRCode = require('qrcode');

// Add 'prevState: any' as the first argument
export async function createLink(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const slug = formData.get('slug') as string
  const destination = formData.get('destination_url') as string

  const { data, error } = await supabase
    .from('Codes')
    .insert({
      slug,
      destination: destination
    })
    .select()
    .single()

  if (error) {
    return { error: "That slug is already taken!" }
  }

  const qrBuffer = await QRCode.toBuffer(`https://vsqr-tracker.vercel.app/q/${slug}`);
  await supabase.storage
    .from('qrcodes')
    .upload(`${data.id}.png`, qrBuffer, {
      contentType: 'image/png',
    })

  revalidatePath('/dashboard')
  redirect('/dashboard')
}