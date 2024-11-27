'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Database } from '@/types/database.types'
import { toast } from 'sonner'
import { User } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import { InfiniteCarousel } from '@/components/infinite-carousel'
import Image from 'next/image'

const brandingItems = [
  {
    title: "Personal Branding Elite",
    description: "Construa uma marca pessoal poderosa e influente",
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop",
    gradient: "from-[#861A22]/80 to-black/20"
  },
  {
    title: "Luxury Lifestyle",
    description: "Eleve seu estilo de vida ao próximo nível",
    image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&auto=format&fit=crop",
    gradient: "from-[#861A22]/80 to-black/20"
  },
  {
    title: "High-End Networking",
    description: "Conecte-se com a elite empresarial global",
    image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=800&auto=format&fit=crop",
    gradient: "from-[#861A22]/80 to-black/20"
  }
]

const influenceItems = [
  {
    title: "Digital Influence",
    description: "Maximize seu impacto nas redes sociais",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&auto=format&fit=crop",
    gradient: "from-black/20 to-[#861A22]/80"
  },
  {
    title: "Business Empire",
    description: "Estratégias para expandir seu império",
    image: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&auto=format&fit=crop",
    gradient: "from-black/20 to-[#861A22]/80"
  },
  {
    title: "Global Leadership",
    description: "Lidere com influência e poder",
    image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&auto=format&fit=crop",
    gradient: "from-black/20 to-[#861A22]/80"
  }
]

export default function HomePage() {
  const [greeting, setGreeting] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userImage, setUserImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: profile } = await supabase
          .from('users')
          .select('first_name, last_name, avatar_url')
          .eq('id', user.id)
          .single()

        if (profile?.first_name) {
          setFirstName(profile.first_name)
        }
        if (profile?.last_name) {
          setLastName(profile.last_name)
        }
        if (profile?.avatar_url) {
          setUserImage(profile.avatar_url)
        }

        const hour = new Date().getHours()
        if (hour >= 5 && hour < 12) setGreeting('Bom dia')
        else if (hour >= 12 && hour < 18) setGreeting('Boa tarde')
        else setGreeting('Boa noite')

      } catch (error) {
        toast.error('Erro ao carregar dados do usuário')
      } finally {
        setLoading(false)
      }
    }

    getUser()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Lorena</h1>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <button 
              onClick={() => router.push('/profile')}
              className="p-2 rounded-full hover:bg-accent/10 transition-colors"
              aria-label="Perfil"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-16">
        {/* Greeting Section */}
        <div className="container mx-auto px-4 mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-8"
          >
            {/* Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-accent/20 overflow-hidden flex-shrink-0 bg-accent/5"
            >
              {userImage ? (
                <Image
                  src={userImage}
                  alt={`${firstName} ${lastName}`}
                  fill
                  className="object-cover"
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center text-4xl md:text-5xl font-semibold text-accent/40">
                    {firstName.charAt(0).toUpperCase()}
                  </div>
                </>
              )}
            </motion.div>

            {/* Greeting Text */}
            <div className="flex-grow">
              <div className="space-y-1">
                <h2 className="text-4xl md:text-6xl font-bold">
                  <span className="text-accent">{firstName}</span>
                  {lastName && (
                    <span className="text-foreground/80"> {lastName}</span>
                  )}
                </h2>
                <p className="text-2xl md:text-3xl font-medium text-foreground/80">
                  {greeting}!
                </p>
                <p className="text-lg md:text-xl text-muted-foreground mt-2">
                  Bem-vinda ao seu espaço exclusivo de poder e influência
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* First Carousel - Branding */}
        <section className="mb-16">
          <div className="container mx-auto px-4 mb-8">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl md:text-2xl font-semibold"
            >
              Branding & Lifestyle
            </motion.h3>
          </div>
          <InfiniteCarousel items={brandingItems} direction="ltr" />
        </section>

        {/* Second Carousel - Influence */}
        <section>
          <div className="container mx-auto px-4 mb-8">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl md:text-2xl font-semibold"
            >
              Poder & Influência
            </motion.h3>
          </div>
          <InfiniteCarousel items={influenceItems} direction="rtl" />
        </section>
      </main>
    </div>
  )
}
