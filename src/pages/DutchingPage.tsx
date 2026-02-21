import React from 'react';
import DutchingFreebetCalculator from '../components/DutchingFreebetCalculator';
import { Info } from 'lucide-react';
import { MissionDossier } from '../components/MissionDossier';

export default function DutchingPage() {
  return (
    <div className="max-w-[1920px] mx-auto px-4 md:px-10 pt-12 md:pt-16 pb-24 relative z-10">
      <MissionDossier type="dutching" />
      
      {/* Hero Section Padronizada */}
      <div className="flex flex-col items-center text-center mb-12">
        <div className="relative mb-8">
          <div className="absolute -inset-4 bg-red-500/20 blur-2xl rounded-full animate-pulse-slow" />
          <div className="relative w-24 h-24 md:w-28 md:h-28 bg-[#0A0A0A] border-2 border-red-500 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden">
            <img src="/logo-heist.jpg" alt="Logo" className="w-full h-full object-cover" />
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-red-500" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-red-500" />
          </div>
        </div>

        <h2 className="text-3xl md:text-5xl lg:text-7xl font-black text-white mb-8 uppercase tracking-tight">
          Blindagem de <span className="text-red-500">Capital</span>
        </h2>
        <div className="flex items-start gap-6 text-zinc-400 bg-[#0E0E10] p-6 md:p-8 rounded-[32px] md:rounded-[40px] border border-zinc-800 max-w-4xl group hover:border-red-500/30 transition-all shadow-2xl text-left">
            <div className="p-3 md:p-4 bg-red-500/10 rounded-2xl shrink-0">
              <span className="text-red-500"><Info size={24} className="md:w-8 md:h-8" /></span>
            </div>
            <p className="text-sm md:text-xl leading-relaxed">
                <strong>O Cerco Matemático:</strong> Um plano de contingência para dividir o risco entre múltiplos alvos. Estruture sua operação para que todas as saídas levem à preservação e ao lucro real.
            </p>
        </div>
      </div>
      
      <div className="relative w-full">
        <DutchingFreebetCalculator />
      </div>
    </div>
  );
}
