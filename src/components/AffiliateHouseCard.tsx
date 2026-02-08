import React from 'react';

interface AffiliateHouseCardProps {
  name: string;
  logoUrl: string;
  affiliateLink: string;
}

export const AffiliateHouseCard: React.FC<AffiliateHouseCardProps> = ({ name, logoUrl, affiliateLink }) => {
  return (
    <div className="group relative bg-[#0E0E10] border-2 border-zinc-800 rounded-[32px] p-8 hover:border-red-500/40 transition-all duration-500 flex flex-col items-center gap-6 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="w-full h-32 bg-black/40 rounded-2xl flex items-center justify-center p-4 border border-zinc-800 group-hover:border-zinc-700 transition-colors">
        <img src={logoUrl} alt={`${name} logo`} className="max-h-full max-w-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500" />
      </div>
      
      <div className="text-center">
        <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-1 block">Plataforma</span>
        <h3 className="text-xl font-black text-white uppercase tracking-tight">{name}</h3>
      </div>

      <a
        href={affiliateLink}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all duration-300 bg-red-600 text-white shadow-[0_10px_20px_rgba(220,38,38,0.2)] hover:bg-white hover:text-black active:scale-95"
      >
        Acessar Agora
      </a>
    </div>
  );
};