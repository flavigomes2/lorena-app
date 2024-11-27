'use client'

import { ParticleField } from '@/components/particle-field'
import { Input } from '@/components/ui/input'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const containerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { theme } = useTheme()
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        toast.success('Login realizado com sucesso!')
        router.refresh() // Atualiza o estado da sessão
        router.replace('/home') // Usa replace em vez de push
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      toast.error('Email ou senha incorretos')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error)
      toast.error('Ocorreu um erro ao fazer login com Google')
    } finally {
      setLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) throw error
    } catch (error) {
      console.error('Erro ao fazer login com Github:', error)
      toast.error('Ocorreu um erro ao fazer login com Github')
    } finally {
      setLoading(false)
    }
  }

  const buttonStyle = mounted ? {
    backgroundColor: theme === 'dark' ? 'white' : 'black',
    color: theme === 'dark' ? 'black' : 'white',
  } : {
    backgroundColor: 'black',
    color: 'white',
  }

  const gradientStyle = mounted ? {
    backgroundImage: theme === 'dark' 
      ? 'linear-gradient(to right, rgba(255,255,255,0), rgba(0,0,0,0.1), rgba(255,255,255,0))'
      : 'linear-gradient(to right, rgba(0,0,0,0), rgba(255,255,255,0.1), rgba(0,0,0,0))'
  } : {
    backgroundImage: 'linear-gradient(to right, rgba(0,0,0,0), rgba(255,255,255,0.1), rgba(0,0,0,0))'
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden p-4">
      <ParticleField />
      
      {/* Lorena's Image with Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute -right-32 top-1/2 -translate-y-1/2 w-[500px] h-[600px] hidden lg:block"
      >
        <div className="relative w-full h-full">
          <div className="absolute inset-0 bg-gradient-to-l from-background via-background/20 to-transparent z-10" />
          <Image
            src="https://ksqwslydemigairyivqf.supabase.co/storage/v1/object/public/lorena/lorena1001.webp"
            alt="Lorena AI Assistant"
            fill
            className="object-cover rounded-l-[80px] select-none"
            priority
            sizes="(max-width: 768px) 0vw, 500px"
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent opacity-60 mix-blend-overlay rounded-l-[80px]"
            animate={{
              opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row justify-center items-center lg:gap-16">
          {/* Form Container */}
          <motion.div
            variants={containerVariants}
            initial="initial"
            animate="animate"
            className="w-full max-w-md space-y-6 relative"
          >
            {/* Glow Effects */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-1/2 -left-1/2 w-full h-full bg-primary/20 rounded-full blur-[100px]"
              />
              <motion.div
                animate={{
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1.2, 1, 1.2],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-primary/20 rounded-full blur-[100px]"
              />
            </div>

            {/* Login Container */}
            <div className="backdrop-blur-xl bg-background/30 p-8 rounded-2xl border border-white/10 shadow-2xl">
              {/* Logo and Title */}
              <motion.div variants={itemVariants} className="text-center mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Bem-vindo à Lorena
                </h1>
                <p className="text-muted-foreground mt-2">
                  Continue sua jornada de aprendizado
                </p>
              </motion.div>

              {/* Form */}
              <motion.form variants={itemVariants} className="space-y-6" onSubmit={handleLogin}>
                <Input 
                  label="Email" 
                  type="email" 
                  icon={Mail}
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="text-black dark:text-white"
                />
                <div className="relative">
                  <Input 
                    label="Senha" 
                    type={showPassword ? "text" : "password"}
                    icon={Lock}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="text-black dark:text-white"
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-black dark:text-white hover:opacity-70 transition-opacity"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-6 h-6" />
                    ) : (
                      <Eye className="w-6 h-6" />
                    )}
                  </motion.button>
                </div>

                <motion.div
                  variants={itemVariants}
                  className="flex items-center justify-between text-sm"
                >
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <div className="relative">
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded border-muted bg-background/50 backdrop-blur-sm focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all duration-200" 
                      />
                      <motion.div
                        className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-20 rounded transition-opacity"
                      />
                    </div>
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                      Lembrar-me
                    </span>
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    Esqueceu a senha?
                  </Link>
                </motion.div>

                <motion.button
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full h-12 rounded-lg font-medium relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                  style={buttonStyle}
                  disabled={loading}
                >
                  <span className="relative z-10">
                    {loading ? 'Entrando...' : 'Entrar'}
                  </span>
                  <motion.div
                    className="absolute inset-0"
                    style={gradientStyle}
                    animate={{
                      x: ['0%', '200%'],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.button>
                <motion.p variants={itemVariants} className="text-center text-sm">
                  Não tem uma conta?{' '}
                  <Link
                    href="/criar-conta"
                    className="text-primary hover:underline font-medium"
                  >
                    Criar conta
                  </Link>
                </motion.p>
              </motion.form>

              {/* Social Login */}
              <motion.div variants={itemVariants} className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Ou continue com
                    </span>
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 h-12 bg-background/50 backdrop-blur-sm border border-muted rounded-lg flex items-center justify-center text-black dark:text-white hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleGoogleLogin}
                    disabled={loading}
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  </motion.button>

                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 h-12 bg-background/50 backdrop-blur-sm border border-muted rounded-lg flex items-center justify-center text-black dark:text-white hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleGithubLogin}
                    disabled={loading}
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.49.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                      />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>

              {/* Sign Up Link */}
              <motion.p
                variants={itemVariants}
                className="mt-8 text-center text-sm text-muted-foreground"
              >
                Não tem uma conta?{' '}
                <Link
                  href="/criar-conta"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  Criar conta
                </Link>
              </motion.p>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}
