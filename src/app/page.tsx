'use client'

import { ThemeCarousel } from '@/components/theme-carousel'
import { ParticleField } from '@/components/particle-field'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'

const glowVariants = {
  initial: { opacity: 0.5, scale: 1 },
  animate: {
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.2, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

const textVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.2
    }
  }
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  return (
    <main className="flex min-h-screen flex-col bg-background overflow-hidden">
      <ParticleField />
      
      {/* Hero Section */}
      <div className="relative min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial="initial"
          animate="animate"
          variants={containerVariants}
          className="relative z-10 text-center space-y-8 p-8"
        >
          {/* Glow Effect */}
          <motion.div
            variants={glowVariants}
            className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"
          />
          
          <motion.div variants={textVariants}>
            <motion.h1 
              className="text-6xl font-bold tracking-tight"
              style={{
                background: "linear-gradient(to right, #fff, #fff, var(--primary))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Ora, ora, {user?.email?.split('@')[0] || 'visitante'}
            </motion.h1>
          </motion.div>

          <motion.p 
            variants={textVariants}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Bem vinda à Lorena AI
            <span className="block mt-2">
              Explore, aprenda e evolua com IA.
            </span>
          </motion.p>

          <motion.div
            variants={textVariants}
            className="flex justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium"
            >
              Começar Agora
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-full bg-muted text-muted-foreground font-medium"
            >
              Saiba Mais
            </motion.button>
          </motion.div>
        </motion.div>

        <Link 
          href="/profile" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity absolute top-4 right-4"
        >
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
            <Image
              src="/lorena-avatar.jpg"
              alt="Avatar do usuário"
              fill
              className="object-cover"
            />
          </div>
        </Link>
      </div>

      {/* Carousel Section */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
        className="w-full max-w-7xl mx-auto px-4 py-12"
      >
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-2xl font-semibold mb-8 text-center bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent"
        >
          Escolha um tema para começar
        </motion.h2>
        <ThemeCarousel />
      </motion.div>
    </main>
  )
}
