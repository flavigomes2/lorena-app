import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Database } from '@/types/database.types'

type User = Database['public']['Tables']['users']['Row']

export function useProfile() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    async function getUser() {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser()
        
        if (authUser) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single()

          if (error) {
            throw error
          }

          setUser(data)
        }
      } catch (error) {
        console.error('Error loading user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [supabase])

  const updateUser = async (updates: Partial<User>) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) throw new Error('No user logged in')

      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', authUser.id)

      if (error) throw error

      setUser(prev => prev ? { ...prev, ...updates } : null)
      return { error: null }
    } catch (error) {
      console.error('Error updating user:', error)
      return { error }
    }
  }

  return {
    user,
    loading,
    updateUser,
  }
}
