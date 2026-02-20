import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {Menu, X, TrendingUp, Gift, Building, Calculator, Divide, ShieldCheck, Zap} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'O PLANO', href: '/', icon: Zap },
    { name: 'ArbiPro', href: '/arbipro', icon: TrendingUp },
    { name: 'FreePro', href: '/freepro', icon: Gift },
    { name: 'Dutching Freebet', href: '/dutching', icon: Divide },
    { name: 'Duplo Green 50/50', href: '/double-green', icon: ShieldCheck }
  ]

  const isActive = (href: string) => location.pathname === href

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-red-500/40 relative overflow-x-hidden grain-overlay flex flex-col">
      {/* 3. Profundidade e Atmosfera - Gradiente Radial Global */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_0%,#450a0a_0%,#050505_100%)] opacity-40 pointer-events-none" />
      
      {/* 4. Glassmorphism - Header de Vidro */}
      <header className="bg-black/40 backdrop-blur-2xl border-b border-white/5 sticky top-0 z-50 flex-shrink-0">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* 1. Tipografia Fluida no Logo */}
            <Link to="/" className="flex items-center gap-3 group relative active:scale-95 transition-transform">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0A0A0A] border border-white/10 rounded-xl flex items-center justify-center shadow-2xl group-hover:border-red-500/50 transition-all duration-300 relative overflow-hidden">
                <img src="/logo-heist.jpg" alt="Logo" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-red-600/10 group-hover:bg-transparent transition-colors" />
              </div>
              <div className="block">
                <h1 className="text-base md:text-xl font-black tracking-tighter text-white uppercase leading-none">
                  LA CASAS <span className="text-red-500">DE</span> APOSTA
                </h1>
                <p className="text-[7px] md:text-[9px] font-bold tracking-[0.3em] text-zinc-500 uppercase">Execução Estratégica</p>
              </div>
            </Link>

            {/* Desktop Navigation - Glassmorphism Items */}
            <nav className="hidden md:flex items-center gap-2">
              {navigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-5 py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center gap-2 border active:scale-95 ${
                      active
                        ? 'bg-red-600/20 border-red-500/30 text-white shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                        : 'bg-transparent border-transparent text-zinc-500 hover:text-white hover:bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${active ? 'text-red-500' : ''}`} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-red-500 active:scale-90 transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation - Glassmorphism Drawer */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-white/5 animate-in fade-in slide-in-from-top-4 bg-black/95 absolute left-0 right-0 px-4 border-b shadow-2xl backdrop-blur-3xl">
              <nav className="flex flex-col gap-2">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-4 px-6 py-5 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border active:scale-95 ${
                        active
                          ? 'bg-red-600/20 border-red-500/40 text-white'
                          : 'bg-white/5 border-white/5 text-zinc-400'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${active ? 'text-red-500' : ''}`} />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content - 7. Espaçamento de Luxo */}
      <main className="relative z-10 py-8 md:py-16 flex-grow">
        {children}
      </main>

      {/* Footer Cinematográfico */}
      <footer className="bg-[#050505] border-t border-white/5 py-8 relative z-10 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 mb-4 opacity-50">
               <div className="w-8 h-8 bg-black border border-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/logo-heist.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-base font-black tracking-tighter text-white uppercase">
                LA CASAS <span className="text-red-500">DE</span> APOSTA
              </span>
            </div>
            <p className="text-zinc-600 text-[8px] font-bold uppercase tracking-[0.4em] text-center mb-4">
              © 2026 La Casas de Aposta - O Plano é o Lucro
            </p>
            <div className="flex gap-4 opacity-10">
                <div className="h-[1px] w-12 bg-white" />
                <div className="w-1.5 h-1.5 rounded-full border border-white" />
                <div className="h-[1px] w-12 bg-white" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
