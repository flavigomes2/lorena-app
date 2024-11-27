'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Database } from '@/types/database.types'
import { toast } from 'sonner'

type User = Database['public']['Tables']['users']['Row']

type Step = {
  title: string
  fields: {
    name: keyof User
    label: string
    type: string
    placeholder: string
    required?: boolean
  }[]
}

const steps: Step[] = [
  {
    title: 'Informações Básicas',
    fields: [
      {
        name: 'name',
        label: 'Nome completo',
        type: 'text',
        placeholder: 'Digite seu nome completo',
        required: true
      },
      {
        name: 'whatsapp',
        label: 'WhatsApp',
        type: 'tel',
        placeholder: '(11) 99999-9999',
        required: true
      }
    ]
  },
  {
    title: 'Seu Negócio',
    fields: [
      {
        name: 'niche',
        label: 'Nicho de atuação',
        type: 'text',
        placeholder: 'Ex: Moda, Beleza, Saúde...',
        required: true
      }
    ]
  }
]

export default function ContinuarCadastro() {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState<Partial<User>>({})
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    let retryCount = 0;
    const maxRetries = 5;
    const retryInterval = 2000; // 2 segundos

    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const checkUserData = async () => {
          const { data: userData, error } = await supabase
            .from('users')
            .select()
            .eq('id', user.id)
            .single()

          if (error) {
            if (retryCount < maxRetries) {
              retryCount++;
              console.log(`Tentativa ${retryCount} de ${maxRetries}...`);
              setTimeout(checkUserData, retryInterval);
            } else {
              console.error('Erro após várias tentativas:', error);
              toast.error('Erro ao carregar dados do usuário. Por favor, recarregue a página.');
              setInitialLoading(false);
            }
            return;
          }

          if (userData?.name) {
            router.push('/perfil')
            return
          }

          setInitialLoading(false)
        }

        // Primeira tentativa após 2 segundos
        setTimeout(checkUserData, retryInterval);

      } catch (error) {
        console.error('Error:', error)
        toast.error('Erro ao carregar dados do usuário')
        setInitialLoading(false)
      }
    }
    
    checkUser()
  }, [router, supabase])

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmitStep = async () => {
    const currentFields = steps[currentStep].fields
    const hasEmptyRequired = currentFields.some(
      field => field.required && !formData[field.name]
    )

    if (hasEmptyRequired) {
      toast.error('Por favor, preencha todos os campos obrigatórios')
      return
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1)
      return
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Usuário não encontrado')

      const { error } = await supabase
        .from('users')
        .update(formData)
        .eq('id', user.id)

      if (error) throw error

      toast.success('Cadastro completado com sucesso!')
      router.push('/home')
    } catch (error) {
      console.error('Error:', error)
      toast.error('Erro ao atualizar perfil')
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Estamos criando seu cadastro...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto bg-card rounded-lg shadow-lg p-8"
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center mb-2">
            {steps[currentStep].title}
          </h1>
          <div className="flex gap-2 justify-center mb-4">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full flex-1 max-w-[100px] ${
                  index <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        <form onSubmit={e => e.preventDefault()} className="space-y-6">
          {steps[currentStep].fields.map(field => (
            <div key={field.name} className="space-y-2">
              <label className="block text-sm font-medium">
                {field.label}
                {field.required && <span className="text-destructive"> *</span>}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={e => handleInputChange(field.name, e.target.value)}
                className="w-full px-3 py-2 rounded-md border bg-background text-black"
                required={field.required}
              />
            </div>
          ))}

          <button
            onClick={handleSubmitStep}
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                Processando...
              </span>
            ) : currentStep === steps.length - 1 ? (
              'Concluir Cadastro'
            ) : (
              'Próximo'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
