'use server'

import { createClient } from '@/utils/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateCode(id: string, formData: FormData) {
  const supabase = await createClient()
  
  const updates = {
    slug: formData.get('slug') as string,
    destination_url: formData.get('destination_url') as string,
  }

  const { error } = await supabase
    .from('links')
    .update(updates)
    .eq('id', id)

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  redirect('/dashboard')
}