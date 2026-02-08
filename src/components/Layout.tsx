import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {Menu, X, TrendingUp, Gift, Building, Calculator, Divide, ShieldCheck} from 'lucide-react'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()

  const navigation = [
    { name: 'ArbiPro', href: '/arbipro', icon: TrendingUp },
    { name: 'FreePro', href: '/freepro', icon: Gift },
    { name: 'Dutching Freebet', href: '/dutching', icon: Divide },
    { name: 'Duplo Green 50/50', href: '/double-green', icon: ShieldCheck },
    { name: 'Casas Regulamentadas', href: '/casas-regulamentadas', icon: Building }
  ]

  const isActive = (href: string) => location.pathname === href

  return (
    <div className="min-h-screen bg-[#020202] text-white font-sans selection:bg-red-500/40 relative overflow-x-hidden">
      {/* Background Grid Sutil */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-red-500/5 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="bg-black/80 backdrop-blur-md border-b border-red-500/20 sticky top-0 z-50">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group relative">
              <div className="absolute -inset-2 bg-red-500/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="w-10 h-10 md:w-12 md:h-12 bg-[#0A0A0A] border border-red-500/30 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.1)] group-hover:border-red-500 transition-all duration-300 relative overflow-hidden">
                <img src="/logo-heist.jpg" alt="Logo" className="w-full h-full object-cover" />
                <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-red-500" />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-red-500" />
              </div>
              <div className="block">
                <h1 className="text-base md:text-xl font-black tracking-tighter text-white uppercase leading-none">
                  LA CASA <span className="text-red-500">DE APOSTAS</span>
                </h1>
                <p className="text-[7px] md:text-[9px] font-bold tracking-[0.2em] md:tracking-[0.3em] text-red-600 uppercase">Execução Estratégica</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-3">
              {navigation.map((item) => {
                const Icon = item.icon
                const active = isActive(item.href)
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`px-4 py-2 md:px-6 md:py-3 rounded-lg font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 flex items-center gap-2 border ${
                      active
                        ? 'bg-red-600 border-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                        : 'bg-transparent border-zinc-800 text-zinc-400 hover:border-red-500/50 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                    {item.name === 'Casas Regulamentadas' ? 'Parceiros' : item.name}
                  </Link>
                )
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg border border-zinc-800 text-red-500 hover:bg-red-500/10 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-zinc-800 animate-in fade-in slide-in-from-top-4 bg-black/95 absolute left-0 right-0 px-4 border-b shadow-2xl">
              <nav className="flex flex-col gap-3">
                {navigation.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center gap-4 px-6 py-4 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 border ${
                        active
                          ? 'bg-red-600 border-red-600 text-white'
                          : 'bg-[#0A0A0A] border-zinc-800 text-zinc-400'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-[#050505] border-t border-zinc-900 py-12 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 mb-6">
               <div className="w-10 h-10 bg-[#0A0A0A] border border-red-500/20 rounded-lg flex items-center justify-center overflow-hidden">
                <img src="/logo-heist.jpg" alt="Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase">
                LA CASA <span className="text-red-500">DE APOSTAS</span>
              </span>
            </div>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest text-center">
              © 2024 La Casa de Apostas - O Plano Perfeito para o seu Lucro
            </p>
            <div className="mt-4 flex gap-6">
              <div className="h-[1px] w-12 bg-zinc-800" />
              <span className="text-red-500/40 text-[10px] uppercase font-bold tracking-[0.2em]">O Plano é o Lucro</span>
              <div className="h-[1px] w-12 bg-zinc-800" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
