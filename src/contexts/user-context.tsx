'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface UserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  avatar_url: string | null
  email: string | null
  bio: string | null
  instagram: string | null
  linkedin: string | null
}

interface UserContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>
  updateAvatar: (file: File) => Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  // Carrega o perfil do cache local apenas no lado do cliente
  useEffect(() => {
    const cached = localStorage.getItem('userProfile')
    if (cached) {
      setProfile(JSON.parse(cached))
    }
  }, [])

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          setLoading(false)
          return
        }

        setUser(session.user)
        const { data: profileData, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          console.error('Error fetching profile:', profileError)
          toast.error('Erro ao carregar perfil')
        } else {
          setProfile(profileData)
          // Atualiza o cache local
          localStorage.setItem('userProfile', JSON.stringify(profileData))
        }
      } catch (error) {
        console.error('Error getting session:', error)
        toast.error('Erro ao verificar sessão')
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user)
        const { data } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .single()
        setProfile(data)
      } else {
        setUser(null)
        setProfile(null)
      }
      router.refresh()
    })

    return () => subscription.unsubscribe()
  }, [supabase, router])

  useEffect(() => {
    if (profile) {
      localStorage.setItem('userProfile', JSON.stringify(profile))
    }
  }, [profile])

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('No user')

    try {
      const { error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id)

      if (error) throw error
      setProfile(prev => prev ? { ...prev, ...updates } : null)
      toast.success('Perfil atualizado com sucesso')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Erro ao atualizar perfil')
      throw error
    }
  }

  const updateAvatar = async (file: File) => {
    if (!user) throw new Error('No user')

    try {
      // Validar o arquivo
      if (!file.type.startsWith('image/')) {
        throw new Error('Por favor, selecione uma imagem válida')
      }

      // Limitar o tamanho do arquivo (por exemplo, 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('A imagem deve ter menos de 5MB')
      }

      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const filePath = `${user.id}/profile.${fileExt}`

      // Upload para o bucket 'users'
      const { error: uploadError, data } = await supabase.storage
        .from('users')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type 
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw new Error('Erro ao fazer upload da imagem')
      }

      // Pegar a URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('users')
        .getPublicUrl(filePath)

      // Atualizar o perfil com a nova URL
      await updateProfile({ avatar_url: publicUrl })
      toast.success('Foto atualizada com sucesso')
    } catch (error) {
      console.error('Error updating avatar:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar foto')
      throw error
    }
  }

  return (
    <UserContext.Provider value={{ user, profile, loading, updateProfile, updateAvatar }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
