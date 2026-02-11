import React from 'react';
import { Building } from 'lucide-react';
import { regulatedHousesData } from '../data/regulated-houses';
import { AffiliateHouseCard } from '../components/AffiliateHouseCard';

export default function RegulatedHousesPage() {
  return (
    <div className="max-w-[1920px] mx-auto px-4 md:px-10 pt-8 md:pt-16 pb-24 relative z-10">
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
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight text-white mb-6 uppercase">
          Plataformas <span className="text-red-500">Parceiras</span>
        </h1>
        <p className="text-zinc-500 text-lg md:text-xl lg:text-2xl max-w-4xl font-medium tracking-wide leading-relaxed px-4">
          Confira a lista de plataformas recomendadas pela La Casas de Aposta e aproveite benefícios exclusivos. Aliados estratégicos para o seu sucesso.
        </p>
        <div className="flex items-center gap-6 mt-10">
          <div className="h-[2px] w-16 bg-red-500/30" />
          <span className="text-red-500 text-sm font-bold uppercase tracking-[0.4em]">Heist Trusted Global Partners</span>
          <div className="h-[2px] w-16 bg-red-500/30" />
        </div>
      </div>

      {/* Grid of AffiliateHouseCard components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {regulatedHousesData.map((house, index) => (
          <AffiliateHouseCard
            key={index}
            name={house.name}
            logoUrl={house.logoUrl}
            affiliateLink={house.affiliateLink}
          />
        ))}
      </div>
    </div>
  );
}
