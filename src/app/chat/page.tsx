'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import Link from 'next/link'
import { ChevronLeft, Send, Copy, ThumbsUp, ThumbsDown, RefreshCcw } from 'lucide-react'
import { useTheme } from 'next-themes'
import { ThemeToggle } from '@/components/theme-toggle'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  loading?: boolean
}

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()

  // Scroll para a última mensagem
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Scroll automático quando novas mensagens são adicionadas
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Adiciona a mensagem do usuário
    const userMessage: ChatMessage = { 
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, 
      role: 'user', 
      content: input.trim() 
    }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    
    // Adiciona uma mensagem vazia do assistente que será atualizada com o streaming
    const assistantMessageId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setMessages(prev => [...prev, {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      loading: true
    }])

    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: input.trim() }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Erro ao processar sua mensagem')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      if (!reader) {
        throw new Error('Não foi possível iniciar o streaming')
      }

      try {
        while (true) {
          const { done, value } = await reader.read()
          
          if (done) {
            break
          }

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')
          
          for (const line of lines) {
            if (line.startsWith('message:') || line.trim() === '') continue
            if (line.startsWith('data:')) {
              const data = line.slice(5).trim() // Remove 'data: '
              if (data === '[DONE]') continue
              
              try {
                const parsed = JSON.parse(data)
                if (parsed.event === 'token' && parsed.data) {
                  fullResponse += parsed.data
                  // Atualiza a mensagem do assistente com o conteúdo atual
                  setMessages(prev => prev.map(msg => 
                    msg.id === assistantMessageId
                      ? { ...msg, content: fullResponse, loading: false }
                      : msg
                  ))
                }
              } catch (e) {
                console.error('Erro ao processar chunk:', e)
              }
            }
          }
        }
      } finally {
        reader.releaseLock()
      }

    } catch (error) {
      console.error('Error:', error)
      // Remove a mensagem do assistente em loading
      setMessages(prev => prev.filter(msg => msg.id !== assistantMessageId))
      
      // Adiciona mensagem de erro
      const errorMessage: ChatMessage = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        role: 'system',
        content: error instanceof Error 
          ? error.message 
          : 'Ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.'
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex flex-col h-screen">
      {/* Header */}
      <div className="p-4 border-b bg-background">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="p-2 rounded-full hover:bg-muted transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img
                  src="https://ksqwslydemigairyivqf.supabase.co/storage/v1/object/public/lorena/profile2.webp"
                  alt="Lorena Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                  style={{ width: '2rem', height: '2rem' }}
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
              </div>
              <div>
                <h1 className="font-semibold text-lg">Lorena</h1>
                <p className="text-sm text-muted-foreground">Sua mentora 24 horas</p>
              </div>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-5xl mx-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0">
                  <img
                    src="https://ksqwslydemigairyivqf.supabase.co/storage/v1/object/public/lorena/profile2.webp"
                    alt="Lorena Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                    style={{ width: '2rem', height: '2rem' }}
                  />
                </div>
              )}
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.role === 'assistant'
                    ? 'bg-white/10 backdrop-blur-sm text-foreground shadow-md'
                    : 'bg-background/20 backdrop-blur-sm text-foreground shadow-md'
                }`}
              >
                {message.loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-current opacity-40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-current opacity-40 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-current opacity-40 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none dark:prose-invert prose-strong:font-extrabold prose-strong:text-black dark:prose-strong:text-white">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                )}
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Container */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-background/50 backdrop-blur-sm border-t border-border/40">
        <div className="max-w-4xl mx-auto flex items-center space-x-2">
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="relative">
              <input 
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="w-full p-3 pr-12 rounded-xl bg-muted/50 text-foreground border border-border/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all duration-300"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary/10 hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <Send 
                  className={`w-5 h-5 ${
                    isLoading || !input.trim() 
                      ? 'text-muted-foreground' 
                      : 'text-primary hover:scale-110'
                  } transition-all`} 
                />
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
