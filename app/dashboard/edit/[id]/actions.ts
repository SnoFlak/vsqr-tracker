'use server'

import { createClient } from '@/utils/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateCode(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const updates = {
    destination: formData.get('destination_url') as string,
  }

  const { error } = await supabase
    .from('Codes')
    .update(updates)
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function deleteCode(id: string) {
  const supabase = await createClient()

  // 1. Delete the database record (Scans will cascade delete)
  const { error: dbError } = await supabase
    .from('Codes')
    .delete()
    .eq('id', id)

  if (dbError) throw new Error("Failed to delete record")

  // 2. Delete the QR code image from Storage
  await supabase.storage
    .from('qrcodes')
    .remove([`${id}.png`])

  revalidatePath('/dashboard')
  redirect('/dashboard')
}