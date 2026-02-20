import React from 'react'
import FreebetCalculator from '../components/FreebetCalculator'
import { MissionDossier } from '../components/MissionDossier';

export default function FreeProPage() {
  return (
    <div className="max-w-[1920px] mx-auto px-4 md:px-10 pt-28 md:pt-36 pb-24 relative z-10">
      <MissionDossier type="freepro" />
      
      {/* Hero Section Padronizada para UX Mobile */}
      <div className="flex flex-col items-center text-center mb-12 md:mb-16">
        <div className="relative mb-6 md:mb-8">
          <div className="absolute -inset-4 bg-red-500/20 blur-2xl rounded-full animate-pulse" />
          <div className="relative w-20 h-20 md:w-28 md:h-28 bg-[#0A0A0A] border-2 border-red-500 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden">
            <img src="/logo-heist.jpg" alt="Logo" className="w-full h-full object-cover" />
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-red-500" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl md:text-5xl lg:text-7xl font-black tracking-tight text-white mb-4 md:mb-6 uppercase leading-none">
          Protocolo de <span className="text-red-500">Conversão</span>
        </h1>
        <p className="text-zinc-500 text-sm md:text-lg lg:text-2xl max-w-4xl font-medium tracking-wide leading-relaxed px-4">
          Transforme bônus em capital líquido com a precisão de um plano bem traçado. Cada movimento é calculado para maximizar a extração de valor.
        </p>
        <div className="flex items-center gap-4 md:gap-6 mt-8 md:mt-10">
          <div className="h-[1px] w-10 md:w-16 bg-red-500/30" />
          <span className="text-red-500 text-[10px] md:text-sm font-bold uppercase tracking-[0.3em] md:tracking-[0.4em]">Protocolo de Extração</span>
          <div className="h-[1px] w-10 md:w-16 bg-red-500/30" />
        </div>
      </div>

      <div className="relative w-full">
        <FreebetCalculator />
      </div>
    </div>
  )
}
