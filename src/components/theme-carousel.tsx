'use client'

import useEmblaCarousel from 'embla-carousel-react'
import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'

const themes = [
  {
    id: 1,
    title: 'Desenvolvimento Web',
    description: 'Tire suas dúvidas sobre programação web',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=1200&fit=crop',
  },
  {
    id: 2,
    title: 'Inteligência Artificial',
    description: 'Explore o mundo da IA e Machine Learning',
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=1200&fit=crop',
  },
  {
    id: 3,
    title: 'Design UX/UI',
    description: 'Aprenda sobre design de interfaces',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=1200&fit=crop',
  },
  {
    id: 4,
    title: 'Mobile Development',
    description: 'Desenvolvimento de apps mobile',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&h=1200&fit=crop',
  },
  {
    id: 5,
    title: 'Cloud Computing',
    description: 'Computação em nuvem e DevOps',
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=1200&fit=crop',
  },
]

const cardVariants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  tap: {
    scale: 0.95
  }
}

const overlayVariants = {
  initial: { opacity: 0 },
  hover: { 
    opacity: 1,
    transition: {
      duration: 0.2
    }
  }
}

const textVariants = {
  initial: { y: 20, opacity: 0 },
  hover: { 
    y: 0, 
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
}

export function ThemeCarousel() {
  const router = useRouter()
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    dragFree: true,
    containScroll: 'trimSnaps',
    align: 'start',
  })

  const [autoplayInterval, setAutoplayInterval] = useState<NodeJS.Timeout | null>(
    null,
  )

  const startAutoplay = useCallback(() => {
    if (autoplayInterval) return

    const interval = setInterval(() => {
      if (emblaApi) emblaApi.scrollNext()
    }, 4000)

    setAutoplayInterval(interval)
  }, [emblaApi, autoplayInterval])

  const stopAutoplay = useCallback(() => {
    if (autoplayInterval) {
      clearInterval(autoplayInterval)
      setAutoplayInterval(null)
    }
  }, [autoplayInterval])

  useEffect(() => {
    startAutoplay()
    return () => stopAutoplay()
  }, [startAutoplay, stopAutoplay])

  const handleCardClick = (themeId: number) => {
    router.push(`/chat?theme=${themeId}`)
  }

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex -ml-4">
        {themes.map((theme, index) => (
          <motion.div
            key={theme.id}
            className="flex-[0_0_300px] min-w-0 pl-4 relative cursor-pointer"
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            whileTap="tap"
            transition={{ delay: index * 0.1 }}
            onClick={() => handleCardClick(theme.id)}
            onMouseEnter={stopAutoplay}
            onMouseLeave={startAutoplay}
          >
            <div className="relative aspect-[2/3] rounded-lg overflow-hidden">
              <Image
                src={theme.image}
                alt={theme.title}
                fill
                className="object-cover"
                sizes="(max-width: 300px) 100vw, 300px"
              />
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"
                variants={overlayVariants}
              >
                <motion.div 
                  className="absolute bottom-0 left-0 right-0 p-6 text-white"
                  variants={textVariants}
                >
                  <h3 className="text-xl font-bold bg-gradient-to-r from-white to-primary-foreground bg-clip-text text-transparent">
                    {theme.title}
                  </h3>
                  <p className="text-sm mt-2 text-white/80">
                    {theme.description}
                  </p>
                  <div className="mt-4 flex items-center text-xs text-white/60">
                    <span className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-primary mr-2 animate-pulse" />
                      Clique para começar
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
