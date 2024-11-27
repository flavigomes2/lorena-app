'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useUser } from '@/contexts/user-context'
import { toast } from 'sonner'
import { Camera, Instagram, Linkedin, Edit2, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { profile, loading, updateProfile, updateAvatar } = useUser()
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    first_name: '',
    last_name: '',
    bio: '',
    instagram: '',
    linkedin: ''
  })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    if (profile) {
      setEditForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        bio: profile.bio || '',
        instagram: profile.instagram || '',
        linkedin: profile.linkedin || ''
      })
    }
  }, [profile])

  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      await updateAvatar(file)
    } catch (error) {
      console.error('Error updating avatar:', error)
    }
  }

  const handleSaveProfile = async () => {
    try {
      await updateProfile(editForm)
      setIsEditing(false)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
      toast.error('Erro ao fazer logout')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-accent/10">
          <div className="animate-pulse">
            <div className="flex flex-col items-center gap-6 mb-8">
              <div className="w-48 h-48 rounded-full bg-muted" />
              <div className="space-y-2 text-center">
                <div className="h-8 w-48 bg-muted rounded" />
                <div className="h-6 w-64 bg-muted rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-accent/10">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-500">Erro ao carregar perfil</h1>
            <p className="text-muted-foreground mt-2">Tente fazer login novamente</p>
            <Button
              className="mt-4"
              onClick={() => router.push('/login')}
            >
              Ir para Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-black/20 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-accent/10"
      >
        <div className="flex flex-col items-center gap-6 mb-8">
          {/* Avatar Grande com Efeito de Hover */}
          <motion.div 
            className="relative group"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-accent/20 cursor-pointer"
                 onClick={handleAvatarClick}>
              <Image
                src={profile.avatar_url || "/lorena-avatar.jpg"}
                alt="Avatar do usuário"
                fill
                className="object-cover transition-transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white" />
              </div>
            </div>
            <motion.div 
              className="absolute -bottom-2 -right-2 w-12 h-12 bg-accent rounded-full flex items-center justify-center cursor-pointer"
              whileHover={{ scale: 1.1 }}
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="w-6 h-6 text-white" />
            </motion.div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </motion.div>

          {/* Informações do Usuário */}
          <div className="text-center space-y-2">
            {isEditing ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4 w-full max-w-md"
              >
                <div className="flex gap-4">
                  <Input
                    placeholder="Nome"
                    value={editForm.first_name}
                    onChange={e => setEditForm(prev => ({ ...prev, first_name: e.target.value }))}
                  />
                  <Input
                    placeholder="Sobrenome"
                    value={editForm.last_name}
                    onChange={e => setEditForm(prev => ({ ...prev, last_name: e.target.value }))}
                  />
                </div>
                <Textarea
                  placeholder="Bio"
                  value={editForm.bio}
                  onChange={e => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                  className="min-h-[100px]"
                />
                <div className="flex gap-4">
                  <div className="flex-1 relative">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Instagram"
                      value={editForm.instagram}
                      onChange={e => setEditForm(prev => ({ ...prev, instagram: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex-1 relative">
                    <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="LinkedIn"
                      value={editForm.linkedin}
                      onChange={e => setEditForm(prev => ({ ...prev, linkedin: e.target.value }))}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={handleSaveProfile}
                  >
                    Salvar
                  </Button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <h1 className="text-4xl font-bold bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">
                  {profile.first_name} {profile.last_name}
                </h1>
                {profile.bio && (
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {profile.bio}
                  </p>
                )}
                <div className="flex justify-center gap-6">
                  {profile.instagram && (
                    <a 
                      href={`https://instagram.com/${profile.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a 
                      href={profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Botão de Logout */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            variant="ghost"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </motion.div>
      </motion.div>
    </div>
  )
}
