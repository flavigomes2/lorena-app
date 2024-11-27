'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      alpha: number
    }> = []

    const createParticle = (x: number, y: number) => {
      return {
        x,
        y,
        size: Math.random() * 2 + 0.1,
        speedX: Math.random() * 2 - 1,
        speedY: Math.random() * 2 - 1,
        alpha: Math.random() * 0.5 + 0.1,
      }
    }

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const init = () => {
      resize()
      for (let i = 0; i < 100; i++) {
        particles.push(
          createParticle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
          ),
        )
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(var(--primary-rgb), ${particle.alpha})`
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    init()
    animate()

    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-50"
    />
  )
}
