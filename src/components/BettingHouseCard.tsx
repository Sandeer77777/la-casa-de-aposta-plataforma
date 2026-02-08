import React from 'react';
import type { House } from '../types/calculator';
import { Lock, Unlock, Percent, TrendingUp, Zap, Gift, ExternalLink } from 'lucide-react';

interface BettingHouseCardProps {
  house: House;
  index: number;
  actions: {
    updateHouse: (index: number, patch: Partial<House>) => void;
    handleStakeChange: (index: number, value: string) => void;
    setFixedStake: (index: number) => void;
  };
}

const inputBaseClasses = "w-full px-4 py-3 bg-black border border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 text-white font-black font-mono text-lg transition-all";

// Custom Toggle Component
const CustomToggle: React.FC<{ 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  colorClass: string; 
  id: string 
}> = ({ checked, onChange, colorClass, id }) => (
  <label htmlFor={id} className="flex items-center cursor-pointer">
    <div className="relative">
      <input type="checkbox" id={id} className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
      <div className={`block w-12 h-6 rounded-full transition-colors duration-300 ${checked ? colorClass : 'bg-zinc-800'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-0'}`}></div>
    </div>
  </label>
);

export const BettingHouseCard: React.FC<BettingHouseCardProps> = ({ house, index, actions }) => {

  const handleInputChange = (field: keyof House, value: string | number | boolean | null) => {
    actions.updateHouse(index, { [field]: value });
  };

  const handleCheckboxChange = (field: keyof House, checked: boolean, defaultValue: number | null) => {
    actions.updateHouse(index, { [field]: checked ? (defaultValue ?? 0) : null });
  };

  return (
    <div className="relative bg-[#0E0E10] border-2 border-zinc-800 rounded-[32px] p-6 hover:border-red-500/40 transition-all duration-500 flex flex-col gap-6 group overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      {/* Detalhe Superior */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      {/* Header Simplificado */}
      <div className="flex flex-col border-b border-zinc-800 pb-4">
        <span className="text-[12px] font-black text-red-500 uppercase tracking-[0.2em] mb-1">ALVO {index + 1}</span>
        <input
          type="text"
          value={house.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="bg-transparent text-xl font-black text-white placeholder-zinc-800 focus:outline-none uppercase tracking-tight"
          placeholder={`CASAS DE APOSTA`}
        />
      </div>

      {/* MERCADO DE ATUAÇÃO */}
      <div className="space-y-2">
        <label className="block text-[12px] font-black text-red-500 uppercase tracking-widest">MERCADO / SELEÇÃO</label>
        <input 
          type="text" 
          value={house.market || ''} 
          onChange={(e) => handleInputChange('market', e.target.value)} 
          className="w-full px-4 py-3 bg-red-500/5 border border-red-500/20 rounded-xl focus:ring-2 focus:ring-red-500/50 text-white font-black uppercase placeholder-zinc-800"
          placeholder="EX: EMPATE / TIME A"
        />
      </div>

      {/* LINK DA APOSTA */}
      <div className="space-y-2">
        <label className="block text-[12px] font-black text-zinc-500 uppercase tracking-widest">LINK DO ALVO</label>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={house.link || ''} 
            onChange={(e) => handleInputChange('link', e.target.value)} 
            className="w-full px-4 py-3 bg-black border border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-500/50 text-white font-medium text-xs placeholder-zinc-800"
            placeholder="COLE O LINK AQUI"
          />
          {house.link && (
            <a 
              href={house.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-3 bg-red-600 hover:bg-white text-white hover:text-black rounded-xl transition-all shadow-lg flex items-center justify-center shrink-0"
              title="Acessar Plataforma"
            >
              <ExternalLink size={18} />
            </a>
          )}
        </div>
      </div>

      {/* Odds */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="block text-[12px] font-black text-zinc-500 uppercase tracking-widest">ODD ATUAL</label>
          <input type="text" inputMode="decimal" value={house.odd} onChange={(e) => handleInputChange('odd', e.target.value.replace(',', '.'))} className={inputBaseClasses} placeholder="1.00" />
        </div>
        <div className="space-y-2">
          <label className="block text-[12px] font-black text-zinc-500 uppercase tracking-widest">ODD FINAL</label>
          <div className="w-full px-4 py-3 bg-zinc-900 border border-zinc-800 rounded-xl text-red-500 font-black font-mono text-xl text-center">
            {house.finalOdd.toFixed(2).replace('.', ',')}
          </div>
        </div>
      </div>

      {/* Stake & LAY Juntos */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-[12px] font-black text-zinc-500 uppercase tracking-widest">STAKE (INVESTIMENTO)</label>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-widest ${house.lay ? 'text-red-500' : 'text-zinc-600'}`}>MODO LAY</span>
            <CustomToggle 
              id={`house-lay-toggle-${index}`}
              checked={house.lay}
              onChange={(checked) => handleInputChange('lay', checked)}
              colorClass="bg-red-600"
            />
          </div>
        </div>
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-black text-lg">R$</div>
          <input type="text" inputMode="decimal" value={house.stake} onChange={(e) => actions.handleStakeChange(index, e.target.value.replace(',', '.'))} className={`${inputBaseClasses} pl-12 text-xl ${house.fixedStake ? 'border-red-500 text-red-500 shadow-[0_0_15px_rgba(220,38,38,0.1)]' : ''}`} placeholder="0.00" />
        </div>
      </div>
      
      {house.lay && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <label className="block text-[12px] font-black text-red-500 uppercase tracking-widest mb-2">RESPONSABILIDADE TOTAL</label>
          <div className="w-full px-4 py-3 bg-red-500/5 border border-red-500/20 rounded-xl text-red-500 font-black font-mono text-xl">
            {house.responsibility ? `R$ ${house.responsibility.replace('.', ',')}` : 'R$ 0,00'}
          </div>
        </div>
      )}

      {/* Checkboxes */}
      <div className="bg-black/40 rounded-2xl p-5 border border-zinc-800 space-y-5">
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-3 cursor-pointer text-[12px] font-black text-zinc-300 uppercase tracking-widest">
            <Percent className="w-5 h-5 text-red-500"/>
            TAXA DE OPERAÇÃO
          </label>
          <CustomToggle 
            id={`commission-toggle-${index}`}
            checked={house.commission !== null}
            onChange={(checked) => handleCheckboxChange('commission', checked, 5)}
            colorClass="bg-red-600"
          />
        </div>
        {house.commission !== null && (
            <div className="relative animate-in zoom-in-95 duration-200">
               <input type="text" inputMode="decimal" value={house.commission || ''} onChange={(e) => handleInputChange('commission', e.target.value.replace(',', '.'))} className={`${inputBaseClasses} py-3 text-base pr-10`} placeholder="5"/>
               <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-black text-sm">%</span>
            </div>
        )}
        
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-3 cursor-pointer text-[12px] font-black text-zinc-300 uppercase tracking-widest">
            <TrendingUp className="w-5 h-5 text-red-500"/>
            BOOST DE ODD (%)
          </label>
          <CustomToggle 
            id={`increase-toggle-${index}`}
            checked={house.increase !== null}
            onChange={(checked) => handleCheckboxChange('increase', checked, 10)}
            colorClass="bg-red-600"
          />
        </div>
        {house.increase !== null && (
             <div className="relative animate-in zoom-in-95 duration-200">
                <input type="text" inputMode="decimal" value={house.increase || ''} onChange={(e) => handleInputChange('increase', e.target.value.replace(',', '.'))} className={`${inputBaseClasses} py-3 text-base pr-10`} placeholder="10"/>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 font-black text-sm">%</span>
             </div>
        )}
        
        <div className="flex justify-between items-center">
          <label className="flex items-center gap-3 cursor-pointer text-[12px] font-black text-zinc-300 uppercase tracking-widest">
            <Gift className="w-5 h-5 text-red-500"/>
            USAR FREEBET
          </label>
          <CustomToggle 
            id={`freebet-toggle-${index}`}
            checked={house.freebet}
            onChange={(checked) => handleInputChange('freebet', checked)}
            colorClass="bg-red-600"
          />
        </div>
      </div>

      {/* Botão Fixar */}
      <div className="mt-auto">
        <button 
          onClick={() => actions.setFixedStake(index)} 
          className={`w-full py-5 rounded-xl font-black text-[12px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 ${
            house.fixedStake 
            ? 'bg-red-600 text-white shadow-[0_10px_20px_rgba(220,38,38,0.2)]' 
            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white border border-zinc-700'
          }`}
        >
            {house.fixedStake ? <Lock size={16} /> : <Unlock size={16} />}
            {house.fixedStake ? 'STAKE FIXADA' : 'FIXAR STAKE'}
        </button>
      </div>
    </div>
  );
};
