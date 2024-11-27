import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    
    const response = await fetch(process.env.NEXT_PUBLIC_FLOWISE_API_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_FLOWISE_API_KEY}`,
      },
      body: JSON.stringify({
        question: body.question,
        streaming: true
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      if (errorText.includes('resource_exhausted') || errorText.includes('rate limit exceeded')) {
        return NextResponse.json(
          { error: 'Limite de requisições excedido. Por favor, tente novamente em alguns minutos.' },
          { status: 429 }
        )
      }
      throw new Error(`Erro na API: ${errorText}`)
    }

    // Retorna o stream diretamente
    return new NextResponse(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })

  } catch (error) {
    console.error('Error in chat API route:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
