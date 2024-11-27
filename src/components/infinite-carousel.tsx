'use client'

import React, { useEffect, useCallback } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { motion } from 'framer-motion'

type CarouselItem = {
  title: string
  description: string
  image: string
  gradient: string
}

interface InfiniteCarouselProps {
  items: CarouselItem[]
  direction?: 'ltr' | 'rtl'
  className?: string
}

export function InfiniteCarousel({ items, direction = 'ltr', className = '' }: InfiniteCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      direction,
    },
    [
      Autoplay({
        delay: 3000,
        stopOnInteraction: false,
        rootNode: (emblaRoot) => emblaRoot.parentElement,
      }),
    ]
  )

  const duplicatedItems = [...items, ...items]

  const onScroll = useCallback(() => {
    if (!emblaApi) return
    // Adiciona efeito parallax aqui
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('scroll', onScroll)
    onScroll()
    return () => {
      emblaApi.off('scroll', onScroll)
    }
  }, [emblaApi, onScroll])

  return (
    <div className={`overflow-hidden ${className}`} ref={emblaRef}>
      <div className="flex">
        {duplicatedItems.map((item, index) => (
          <motion.div
            key={`${item.title}-${index}`}
            className="relative flex-[0_0_40%] min-w-0 pl-4 aspect-[2/3]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className="relative w-full h-full overflow-hidden rounded-2xl">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform hover:scale-105 duration-700"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${item.gradient} opacity-60`} />
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-white/80 text-sm">{item.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
