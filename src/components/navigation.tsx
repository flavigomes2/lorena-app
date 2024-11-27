'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-lg border-b border-gray-200/10 dark:border-gray-800/10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-12">
            <div className="text-2xl font-light text-accent">L</div>
            <div className="flex space-x-8">
              <Link 
                href="/"
                className={`relative text-lg font-light transition-colors hover:text-accent group
                  ${pathname === '/' ? 'text-accent' : 'text-gray-600 dark:text-gray-300'}`}
              >
                <span>Home</span>
                <span className={`absolute -bottom-1 left-0 w-full h-[1px] bg-accent transform origin-left transition-transform duration-300
                  ${pathname === '/' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
              <Link 
                href="/chat"
                className={`relative text-lg font-light transition-colors hover:text-accent group
                  ${pathname === '/chat' ? 'text-accent' : 'text-gray-600 dark:text-gray-300'}`}
              >
                <span>Chat</span>
                <span className={`absolute -bottom-1 left-0 w-full h-[1px] bg-accent transform origin-left transition-transform duration-300
                  ${pathname === '/chat' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
              <Link 
                href="/perfil"
                className={`relative text-lg font-light transition-colors hover:text-accent group
                  ${pathname === '/perfil' ? 'text-accent' : 'text-gray-600 dark:text-gray-300'}`}
              >
                <span>Perfil</span>
                <span className={`absolute -bottom-1 left-0 w-full h-[1px] bg-accent transform origin-left transition-transform duration-300
                  ${pathname === '/perfil' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
