'use server'

import { createClient } from '@/utils/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

// Add 'prevState: any' as the first argument
export async function createLink(prevState: any, formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const slug = formData.get('slug') as string
  const destination = formData.get('destination_url') as string

  const { error } = await supabase
    .from('links')
    .insert({
      slug,
      destination_url: destination,
      user_id: user.id
    })

  if (error) {
    return { error: "That slug is already taken!" }
  }

  revalidatePath('/dashboard')
  redirect('/dashboard')
}