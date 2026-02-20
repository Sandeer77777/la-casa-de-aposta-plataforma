import React, { useState } from 'react';
import { useFreebetCalculator, CoverageBet } from '../hooks/useFreebetCalculator';
import { Gift, DollarSign, RotateCcw, Share2, BarChart3, Settings, Percent, TrendingUp, Calculator, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/calculations';

// Custom Toggle Component
const CustomToggle: React.FC<{ 
  checked: boolean; 
  onChange: (checked: boolean) => void; 
  colorClass: string; 
  id: string 
}> = ({ checked, onChange, colorClass, id }) => (
  <label htmlFor={id} className="flex items-center cursor-pointer scale-75">
    <div className="relative">
      <input type="checkbox" id={id} className="sr-only" checked={checked} onChange={e => onChange(e.target.checked)} />
      <div className={`block w-9 h-5 rounded-full transition-colors duration-300 ${checked ? colorClass : 'bg-zinc-800'}`}></div>
      <div className={`dot absolute left-0.5 top-0.5 bg-white w-4 h-4 rounded-full transition-transform duration-300 ${checked ? 'translate-x-4' : 'translate-x-0'}`}></div>
    </div>
  </label>
);

// Card de Cobertura Miniaturizado (2 por linha no Mobile)
const CoverageCard: React.FC<{ 
    index: number;
    bet: CoverageBet;
    stake: number;
    onChange: (index: number, field: keyof CoverageBet, value: string | boolean) => void;
}> = ({ index, bet, stake, onChange }) => {
    const inputBaseClasses = "w-full px-2 py-1.5 bg-black border border-zinc-800 rounded-md focus:ring-1 focus:ring-red-500/50 text-white font-black font-mono text-xs transition-all";

    return (
        <div className="relative bg-[#0E0E10] border border-zinc-800 rounded-xl p-3 hover:border-red-500/40 transition-all duration-300 flex flex-col gap-2 shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-1.5">
               <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">ALVO {index + 1}</span>
               <CustomToggle 
                   id={`cov-lay-${index}`}
                   checked={bet.lay}
                   onChange={checked => onChange(index, 'lay', checked)}
                   colorClass="bg-red-600"
               />
            </div>

            <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <label className="block text-[8px] font-black text-zinc-500 uppercase">Odd</label>
                    <input type="text" inputMode="decimal" value={bet.odd} onChange={e => onChange(index, 'odd', e.target.value.replace(',', '.'))} className={inputBaseClasses} placeholder="1.00"/>
                </div>
                <div className="space-y-1">
                    <label className="block text-[8px] font-black text-zinc-500 uppercase">Taxa %</label>
                    <input type="text" inputMode="decimal" value={bet.commission} onChange={e => onChange(index, 'commission', e.target.value.replace(',', '.'))} className={inputBaseClasses} placeholder="0"/>
                </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/10 rounded-lg p-2 flex flex-col items-center">
                <label className="text-[8px] font-black text-red-500 uppercase mb-0.5">Aporte</label>
                <div className="text-sm font-black text-white font-mono tracking-tighter">
                    {formatCurrency(stake)}
                </div>
            </div>
        </div>
    );
};

export default function FreebetCalculator() {
  const {
    activeMode, setActiveMode,
    numEntradas, setNumEntradas,
    roundStep, setRoundStep,
    promo, handlePromoChange,
    coverageBets,
    handleCoverageChange,
    results,
    clearData,
    shareState
  } = useFreebetCalculator();

  const [showSettings, setShowSettings] = useState(false);
  const inputBaseClasses = "w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg focus:ring-1 focus:ring-red-500/50 text-white font-black text-sm transition-all";

  return (
    <div className="max-w-7xl mx-auto">
    <div className="bg-[#0A0A0A] border-2 border-red-500/10 rounded-2xl md:rounded-[40px] shadow-2xl p-3 md:p-8 relative overflow-hidden">
        
        {/* Header Compacto */}
        <div className="flex items-center justify-between mb-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-600 text-white rounded-lg shadow-lg">
                <Calculator size={18} />
              </div>
              <h2 className="text-sm md:text-xl font-black text-white uppercase tracking-widest">FreeBet Pro</h2>
            </div>
            <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`p-2 rounded-lg border transition-all ${showSettings ? 'bg-red-600 border-red-600 text-white' : 'bg-transparent border-zinc-800 text-zinc-500 hover:text-white'}`}
            >
                <Settings size={18} className={showSettings ? 'rotate-90 transition-transform' : ''} />
            </button>
        </div>

        {/* Configurações Retráteis */}
        {showSettings && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 relative z-10 animate-in slide-in-from-top-2 duration-300">
                <div className="bg-[#0E0E10] border border-zinc-800 rounded-xl p-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[9px] font-black text-red-500 uppercase mb-1.5 ml-1">Frentes</label>
                            <select value={numEntradas} onChange={e => setNumEntradas(Number(e.target.value))} className={`${inputBaseClasses} appearance-none py-1.5 text-xs`}>
                                {[2,3,4,5,6].map(n => <option key={n} value={n} className="bg-zinc-900">{n} Opções</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[9px] font-black text-red-500 uppercase mb-1.5 ml-1">Precisão</label>
                            <select value={roundStep} onChange={e => setRoundStep(Number(e.target.value))} className={`${inputBaseClasses} appearance-none py-1.5 text-xs`}>
                                <option value={0.01} className="bg-zinc-900">R$ 0,01</option>
                                <option value={1.00} className="bg-zinc-900">R$ 1,00</option>
                            </select>
                        </div>
                    </div>
                </div>
                <div className="bg-[#0E0E10] border border-zinc-800 rounded-xl p-4 flex flex-col justify-center">
                    <div className="flex bg-black p-1 rounded-lg border border-zinc-800">
                        <button onClick={() => setActiveMode('freebet')} className={`w-1/2 py-2 rounded-md font-black text-[9px] uppercase transition-all ${activeMode === 'freebet' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500'}`}>Freebet</button>
                        <button onClick={() => setActiveMode('cashback')} className={`w-1/2 py-2 rounded-md font-black text-[9px] uppercase transition-all ${activeMode === 'cashback' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500'}`}>Cashback</button>
                    </div>
                </div>
            </div>
        )}

        {/* Promoção (Mini) */}
        <div className="bg-[#0E0E10] border border-zinc-800 rounded-xl p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="space-y-1">
                    <label className="block text-[8px] font-black text-zinc-500 uppercase">Odd Promo</label>
                    <input type="text" inputMode="decimal" value={promo.promoOdd} onChange={e => handlePromoChange('promoOdd', e.target.value.replace(',', '.'))} className={inputBaseClasses} />
                </div>
                <div className="space-y-1">
                    <label className="block text-[8px] font-black text-zinc-500 uppercase">Taxa %</label>
                    <input type="text" inputMode="decimal" value={promo.promoCommission} onChange={e => handlePromoChange('promoCommission', e.target.value.replace(',', '.'))} className={inputBaseClasses} />
                </div>
                <div className="space-y-1">
                    <label className="block text-[8px] font-black text-zinc-500 uppercase">Stake Qualif.</label>
                    <input type="text" inputMode="decimal" value={promo.qualifyingStake} onChange={e => handlePromoChange('qualifyingStake', e.target.value.replace(',', '.'))} className={inputBaseClasses} />
                </div>
                {activeMode === 'freebet' ? (
                    <>
                        <div className="space-y-1">
                            <label className="block text-[8px] font-black text-zinc-500 uppercase">Vlr Bônus</label>
                            <input type="text" inputMode="decimal" value={promo.freebetValue} onChange={e => handlePromoChange('freebetValue', e.target.value.replace(',', '.'))} className={inputBaseClasses} />
                        </div>
                        <div className="space-y-1">
                            <label className="block text-[8px] font-black text-zinc-500 uppercase">Extr. %</label>
                            <input type="text" inputMode="decimal" value={promo.extractionRate} onChange={e => handlePromoChange('extractionRate', e.target.value.replace(',', '.'))} className={inputBaseClasses} />
                        </div>
                    </>
                ) : (
                    <div className="space-y-1">
                        <label className="block text-[8px] font-black text-zinc-500 uppercase">Cash %</label>
                        <input type="text" inputMode="decimal" value={promo.cashbackRate} onChange={e => handlePromoChange('cashbackRate', e.target.value.replace(',', '.'))} className={inputBaseClasses} />
                    </div>
                )}
            </div>
        </div>

        {/* Alvos de Cobertura (2 por linha no Mobile) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 items-start">
            {coverageBets.map((bet, index) => (
                <CoverageCard key={index} index={index} bet={bet} stake={results.stakes[index] || 0} onChange={handleCoverageChange} />
            ))}
        </div>

        {/* Resultados Slim */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-red-600 rounded-xl p-4 flex flex-col justify-center shadow-xl">
                <h4 className="text-[8px] font-black text-red-200 uppercase tracking-widest mb-1">ROI ESTIMADO</h4>
                <p className="text-3xl font-black text-white tracking-tighter leading-none">{formatPercentage(results.roi)}</p>
            </div>
            
            <div className="lg:col-span-2 bg-[#0E0E10] border border-zinc-800 rounded-xl p-4">
                <div className="flex justify-between items-center mb-4">
                    <h4 className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">CAPITAL TOTAL: <span className="text-white">{formatCurrency(results.totalInvestment)}</span></h4>
                    <div className="flex gap-2">
                        <button onClick={shareState} className="p-1.5 bg-zinc-900 text-white rounded-md hover:bg-red-600 transition-colors"><Share2 size={12}/></button>
                        <button onClick={clearData} className="p-1.5 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors"><RotateCcw size={12}/></button>
                    </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {results.profits.map((profit, index) => (
                        <div key={index} className="bg-black/40 p-2 rounded-lg border border-zinc-800/50">
                            <p className="text-[7px] font-black text-zinc-500 uppercase mb-0.5 truncate">{index === 0 ? 'VITÓRIA' : `ALVO ${index}`}</p>
                            <p className={`text-xs font-black font-mono ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatCurrency(profit)}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
    </div>
  );
}
