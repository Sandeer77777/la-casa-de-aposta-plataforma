import React, { useState } from 'react';
import type { House } from '../types/calculator';
import { Lock, Unlock, Percent, TrendingUp, Zap, Gift, ExternalLink, ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';

interface BettingHouseCardProps {
  house: House;
  index: number;
  actions: {
    updateHouse: (index: number, patch: Partial<House>) => void;
    handleStakeChange: (index: number, value: string) => void;
    handleResponsibilityChange: (index: number, value: string) => void;
    setFixedStake: (index: number) => void;
  };
}

const inputBaseClasses = "w-full px-2 py-1.5 bg-black border border-zinc-800 rounded-lg focus:ring-1 focus:ring-red-500/50 focus:border-red-500 text-white font-black font-mono text-xs md:text-sm transition-all";

const CustomToggle: React.FC<{ 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  colorClass: string; 
  id: string 
}> = ({ checked, onChange, colorClass, id }) => (
  <label htmlFor={id} className="flex items-center cursor-pointer scale-75 md:scale-90">
    <div className="relative">
      <input type="checkbox" id={id} className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
      <div className={`block w-10 h-5 rounded-full transition-colors duration-300 ${checked ? colorClass : 'bg-zinc-800'}`}></div>
      <div className={`dot absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`}></div>
    </div>
  </label>
);

export const BettingHouseCard: React.FC<BettingHouseCardProps> = ({ house, index, actions }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleInputChange = (field: keyof House, value: string | number | boolean | null) => {
    actions.updateHouse(index, { [field]: value });
  };

  const handleCheckboxChange = (field: keyof House, checked: boolean, defaultValue: number | null) => {
    actions.updateHouse(index, { [field]: checked ? (defaultValue ?? 0) : null });
  };

  return (
    <div className="relative bg-[#0E0E10] border border-zinc-800 rounded-xl p-3 md:p-5 hover:border-red-500/40 transition-all duration-500 flex flex-col gap-3 group shadow-xl">
      
      <div className="flex flex-col border-b border-zinc-800 pb-2">
        <span className="text-[8px] md:text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">ALVO {index + 1}</span>
        <input
          type="text"
          value={house.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          className="bg-transparent text-sm md:text-base font-black text-white placeholder-zinc-800 focus:outline-none uppercase truncate"
          placeholder={`CASA`}
        />
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <input type="text" value={house.market || ''} onChange={e => handleInputChange('market', e.target.value)} className="w-full px-2 py-1 bg-red-500/5 border border-red-500/10 rounded text-white font-bold text-[9px] md:text-[10px] uppercase" placeholder="MERCADO..."/>
          <div className="flex gap-1">
            <input type="text" value={house.link || ''} onChange={e => handleInputChange('link', e.target.value)} className="w-full px-2 py-1 bg-black border border-zinc-800 rounded text-white font-medium text-[9px]" placeholder="URL LINK"/>
            {house.link && <a href={house.link} target="_blank" rel="noopener noreferrer" className="p-1 bg-red-600 rounded text-white shrink-0 flex items-center justify-center"><ExternalLink size={10} /></a>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="block text-[8px] font-black text-zinc-500 uppercase">ODD</label>
            <input type="text" inputMode="decimal" value={house.odd} onChange={(e) => handleInputChange('odd', e.target.value.replace(',', '.'))} className={inputBaseClasses} placeholder="1.00" />
          </div>
          <div className="space-y-1">
            <label className="block text-[8px] font-black text-zinc-500 uppercase tracking-widest">FINAL</label>
            <div className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-red-500 font-black font-mono text-xs md:text-sm text-center">
              {house.finalOdd.toFixed(2)}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-[8px] font-black text-zinc-500 uppercase">{house.lay ? 'APOSTA' : 'STAKE'} (R$)</label>
            <div className="flex items-center gap-1">
              <span className="text-[7px] font-bold text-zinc-600 uppercase">LAY</span>
              <CustomToggle id={`lay-${index}`} checked={house.lay} onChange={(checked) => handleInputChange('lay', checked)} colorClass="bg-red-600" />
            </div>
          </div>
          <div className="space-y-2">
            <input 
              type="text" 
              inputMode="decimal" 
              value={house.stake} 
              onChange={(e) => actions.handleStakeChange(index, e.target.value.replace(',', '.'))} 
              className={`${inputBaseClasses} font-bold ${house.fixedStake ? 'border-red-500 text-red-500 shadow-[0_0_10px_rgba(220,38,38,0.1)]' : ''}`} 
              placeholder="0.00" 
            />
            
            {house.lay && (
              <div className="animate-in slide-in-from-top-1 duration-200">
                <label className="block text-[8px] font-black text-red-500 uppercase mb-1">Responsabilidade (Risco)</label>
                <input 
                  type="text" 
                  inputMode="decimal" 
                  value={house.responsibility} 
                  onChange={(e) => actions.handleResponsibilityChange(index, e.target.value.replace(',', '.'))} 
                  className={`${inputBaseClasses} border-red-500/30 text-red-500 bg-red-500/5`} 
                  placeholder="0.00" 
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 space-y-2">
        <button 
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`w-full py-1.5 px-2 rounded-md flex items-center justify-between transition-all border ${
            showAdvanced 
            ? 'bg-red-600/10 border-red-500/30 text-red-500' 
            : 'bg-zinc-900/50 border-zinc-800 text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={10} />
            <span className="text-[8px] font-black uppercase tracking-[0.1em]">Ajustes Táticos</span>
          </div>
          {showAdvanced ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
        </button>

        {showAdvanced && (
          <div className="animate-in slide-in-from-top-2 duration-300 bg-black/40 rounded-lg p-2 border border-zinc-800 space-y-2">
            <div className="flex justify-between items-center text-[8px] font-black text-zinc-400 uppercase">
              <span className="flex items-center gap-1.5"><Percent size={10} className="text-red-500"/> TAXA</span>
              <CustomToggle id={`comm-${index}`} checked={house.commission !== null} onChange={(c) => handleCheckboxChange('commission', c, 5)} colorClass="bg-red-600" />
            </div>
            {house.commission !== null && (
              <input type="text" inputMode="decimal" value={house.commission || ''} onChange={(e) => handleInputChange('commission', e.target.value.replace(',', '.'))} className="w-full px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-white text-[9px] font-mono text-center" placeholder="5%"/>
            )}
            
            <div className="flex justify-between items-center text-[8px] font-black text-zinc-400 uppercase">
              <span className="flex items-center gap-1.5"><TrendingUp size={10} className="text-red-500"/> BOOST</span>
              <CustomToggle id={`inc-${index}`} checked={house.increase !== null} onChange={(c) => handleCheckboxChange('increase', c, 10)} colorClass="bg-red-600" />
            </div>
            {house.increase !== null && (
              <input type="text" inputMode="decimal" value={house.increase || ''} onChange={(e) => handleInputChange('increase', e.target.value.replace(',', '.'))} className="w-full px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-white text-[9px] font-mono text-center" placeholder="10%"/>
            )}
            
            <div className="flex justify-between items-center text-[8px] font-black text-zinc-400 uppercase">
              <span className="flex items-center gap-1.5"><Gift size={10} className="text-red-500"/> FREEBET</span>
              <CustomToggle id={`fb-${index}`} checked={house.freebet} onChange={(c) => handleInputChange('freebet', c)} colorClass="bg-red-600" />
            </div>
          </div>
        )}

        <button 
          onClick={() => actions.setFixedStake(index)} 
          className={`w-full py-2 rounded-lg font-black text-[8px] md:text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
            house.fixedStake ? 'bg-red-600 text-white shadow-lg' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'
          }`}
        >
          {house.fixedStake ? <Lock size={10} /> : <Unlock size={10} />}
          {house.fixedStake ? 'FIXADA' : 'FIXAR'}
        </button>
      </div>
    </div>
  );
};
