/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false
  },
  images: {
    domains: ['images.unsplash.com', 'ksqwslydemigairyivqf.supabase.co'],
  },
  output: 'standalone', // Adicionar suporte para standalone
  experimental: {
    outputFileTracingRoot: __dirname, // Ajudar na geração do standalone
  },
}

module.exports = nextConfig
