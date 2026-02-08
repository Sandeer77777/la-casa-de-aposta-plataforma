
import React, { useState } from 'react';
import ArbitrageCalculator from '../components/ArbitrageCalculator';
import { MissionDossier } from '../components/MissionDossier';
import AddFaseModal from '../components/AddFaseModal';

export default function ArbiProPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fases, setFases] = useState<any[]>([]);

  const handleSaveFase = (novasEntradas: any) => {
    console.log('Fase salva:', novasEntradas);
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-[1920px] mx-auto px-4 md:px-10 pt-8 md:pt-16 pb-24 relative z-10">
      <MissionDossier type="arbipro" />
      
      {/* Hero Section Padronizada */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="relative mb-8">
          <div className="absolute -inset-4 bg-red-500/20 blur-2xl rounded-full animate-pulse-slow" />
          <div className="relative w-24 h-24 md:w-28 md:h-28 bg-[#0A0A0A] border-2 border-red-500 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden">
            <img src="/logo-heist.jpg" alt="Logo" className="w-full h-full object-cover" />
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-red-500" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-red-500" />
          </div>
        </div>
        
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-black tracking-tight text-white mb-6 uppercase">
          Plano de <span className="text-red-500">Execução</span>
        </h1>
        <p className="text-zinc-500 text-base md:text-lg lg:text-2xl max-w-4xl font-medium tracking-wide leading-relaxed px-4">
          Assim como o Professor, analisamos cada detalhe. Identificamos as menores brechas no mercado para garantir que cada entrada seja matematicamente perfeita e o resultado, previsível.
        </p>
        <div className="flex items-center gap-6 mt-10">
          <div className="h-[2px] w-16 bg-red-500/30" />
          <span className="text-red-500 text-sm font-bold uppercase tracking-[0.4em]">Sistema de Engenharia de Precisão</span>
          <div className="h-[2px] w-16 bg-red-500/30" />
        </div>
      </div>

      <div className="flex justify-center mb-16">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="group relative px-10 py-5 bg-white hover:bg-red-600 text-black hover:text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all duration-300 shadow-[0_20px_40px_rgba(0,0,0,0.3)] hover:shadow-red-500/20 hover:-translate-y-1 active:scale-95"
        >
          <span className="relative z-10 flex items-center gap-3">
            Adicionar Fase Tática
            <div className="w-6 h-6 bg-black/10 rounded-lg flex items-center justify-center group-hover:bg-black/20 group-hover:text-white">
              <span className="text-xl">+</span>
            </div>
          </span>
        </button>
      </div>

      {isModalOpen && (
        <AddFaseModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveFase}
          estrategiaOperacao="freebet"
        />
      )}

      <div className="relative w-full">
        <ArbitrageCalculator />
      </div>
    </div>
  );
}
