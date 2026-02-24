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