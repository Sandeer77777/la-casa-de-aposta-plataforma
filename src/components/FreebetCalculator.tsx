import React from 'react';
import { useFreebetCalculator, CoverageBet, DutchingResult } from '../hooks/useFreebetCalculator';
import { Gift, DollarSign, RotateCcw, Share2, BarChart3, Settings, Percent, TrendingUp } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/calculations';

// Custom Toggle Component (reused from BettingHouseCard)
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

// Subcomponente para o Card de Cobertura (reestilizado)
const CoverageCard: React.FC<{ 
    index: number;
    bet: CoverageBet;
    stake: number;
    onChange: (index: number, field: keyof CoverageBet, value: string | boolean) => void;
}> = ({ index, bet, stake, onChange }) => {
    const inputBaseClasses = "w-full px-4 py-3 bg-black border border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 text-white font-black font-mono text-lg transition-all";

    return (
        <div className="relative bg-[#0E0E10] border-2 border-zinc-800 rounded-[32px] p-6 hover:border-red-500/40 transition-all duration-500 flex flex-col gap-5 group overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
               <div>
                  <span className="text-[12px] font-black text-red-500 uppercase tracking-[0.2em]">COBERTURA</span>
                  <h4 className="font-black text-white text-xl uppercase tracking-tight">ALVO {index + 1}</h4>
               </div>
               <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">LAY</span>
                  <CustomToggle 
                      id={`coverage-lay-toggle-${index}`}
                      checked={bet.lay}
                      onChange={checked => onChange(index, 'lay', checked)}
                      colorClass="bg-red-600"
                  />
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-[12px] font-black text-zinc-500 uppercase tracking-widest">Odd</label>
                    <input type="text" value={bet.odd} onChange={e => onChange(index, 'odd', e.target.value)} className={inputBaseClasses} placeholder="1.00"/>
                </div>
                <div className="space-y-2">
                    <label className="block text-[12px] font-black text-zinc-500 uppercase tracking-widest">Taxa (%)</label>
                    <input type="text" value={bet.commission} onChange={e => onChange(index, 'commission', e.target.value)} className={inputBaseClasses} placeholder="0"/>
                </div>
            </div>

            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5 mt-2">
                <label className="block text-[12px] font-black text-red-500 uppercase tracking-widest mb-2">Aporte Recomendado</label>
                <div className="text-3xl font-black text-white font-mono tracking-tighter">
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
    coverageBets, handleCoverageChange,
    results,
    clearData,
    shareState
  } = useFreebetCalculator();

  const inputBaseClasses = "w-full px-5 py-4 bg-black border border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 text-white font-black text-lg transition-all";

  return (
    <div className="bg-[#0A0A0A] border-2 border-red-500/10 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 sm:p-10 relative overflow-hidden">
        {/* Decorativo de fundo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[80px] -mr-32 -mt-32 rounded-full" />

        {/* Configurações e Modo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 relative z-10">
            <div className="bg-[#0E0E10] border border-zinc-800 rounded-3xl p-8 group hover:border-red-500/30 transition-colors">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-red-500/10 rounded-xl">
                    <Settings className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-widest">Configurações</h3>
                </div>
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-black text-red-500 uppercase tracking-[0.2em] mb-3">Mercados</label>
                        <select value={numEntradas} onChange={e => setNumEntradas(Number(e.target.value))} className={`${inputBaseClasses} appearance-none`}>
                            {[2,3,4,5,6].map(n => <option key={n} value={n} className="bg-zinc-900">{n} Frentes</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-black text-red-500 uppercase tracking-[0.2em] mb-3">Precisão</label>
                        <select value={roundStep} onChange={e => setRoundStep(Number(e.target.value))} className={`${inputBaseClasses} appearance-none`}>
                            <option value={0.01} className="bg-zinc-900">R$ 0,01</option>
                            <option value={0.10} className="bg-zinc-900">R$ 0,10</option>
                            <option value={0.50} className="bg-zinc-900">R$ 0,50</option>
                            <option value={1.00} className="bg-zinc-900">R$ 1,00</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="bg-[#0E0E10] border border-zinc-800 rounded-3xl p-8 group hover:border-red-500/30 transition-colors">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-3 bg-red-500/10 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-widest">Estratégia</h3>
                </div>
                <div className="flex bg-black p-1.5 rounded-2xl border border-zinc-800">
                    <button 
                      onClick={() => setActiveMode('freebet')} 
                      className={`w-1/2 py-5 rounded-xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 ${activeMode === 'freebet' ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'text-zinc-500 hover:text-white'}`}
                    >
                      <Gift size={18}/> Freebet
                    </button>
                    <button 
                      onClick={() => setActiveMode('cashback')} 
                      className={`w-1/2 py-5 rounded-xl font-black text-sm uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-300 ${activeMode === 'cashback' ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]' : 'text-zinc-500 hover:text-white'}`}
                    >
                      <DollarSign size={18}/> Cashback
                    </button>
                </div>
            </div>
        </div>

        {/* Casa Promoção */}
        <div className="bg-[#0E0E10] border-2 border-zinc-800 rounded-[32px] p-8 mb-10 relative overflow-hidden group hover:border-red-500/20 transition-all duration-500">
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <Gift className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest">Dados do Bônus ({activeMode === 'freebet' ? 'Freebet' : 'Cashback'})</h3>
            </div>
            
            {activeMode === 'freebet' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                    <div className="space-y-3"><label className="block text-[13px] font-black text-zinc-500 uppercase tracking-widest">Odd Promo</label><input type="text" value={promo.promoOdd} onChange={e => handlePromoChange('promoOdd', e.target.value)} className={inputBaseClasses} placeholder="3.00"/></div>
                    <div className="space-y-3"><label className="block text-[13px] font-black text-zinc-500 uppercase tracking-widest">Taxa (%)</label><input type="text" value={promo.promoCommission} onChange={e => handlePromoChange('promoCommission', e.target.value)} className={inputBaseClasses} placeholder="0"/></div>
                    <div className="space-y-3"><label className="block text-[13px] font-black text-zinc-500 uppercase tracking-widest">Stake Qualif.</label><input type="text" value={promo.qualifyingStake} onChange={e => handlePromoChange('qualifyingStake', e.target.value)} className={inputBaseClasses} placeholder="50"/></div>
                    <div className="space-y-3"><label className="block text-[13px] font-black text-zinc-500 uppercase tracking-widest">Valor Bônus</label><input type="text" value={promo.freebetValue} onChange={e => handlePromoChange('freebetValue', e.target.value)} className={inputBaseClasses} placeholder="50"/></div>
                    <div className="space-y-3"><label className="block text-[13px] font-black text-zinc-500 uppercase tracking-widest">Extração (%)</label><input type="text" value={promo.extractionRate} onChange={e => handlePromoChange('extractionRate', e.target.value)} className={inputBaseClasses} placeholder="70"/></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="space-y-3"><label className="block text-[13px] font-black text-zinc-500 uppercase tracking-widest">Odd Promo</label><input type="text" value={promo.promoOdd} onChange={e => handlePromoChange('promoOdd', e.target.value)} className={inputBaseClasses} placeholder="3.00"/></div>
                    <div className="space-y-3"><label className="block text-[13px] font-black text-zinc-500 uppercase tracking-widest">Taxa (%)</label><input type="text" value={promo.promoCommission} onChange={e => handlePromoChange('promoCommission', e.target.value)} className={inputBaseClasses} placeholder="0"/></div>
                    <div className="space-y-3"><label className="block text-[13px] font-black text-zinc-500 uppercase tracking-widest">Stake Qualif.</label><input type="text" value={promo.qualifyingStake} onChange={e => handlePromoChange('qualifyingStake', e.target.value)} className={inputBaseClasses} placeholder="50"/></div>
                    <div className="space-y-3"><label className="block text-[13px] font-black text-zinc-500 uppercase tracking-widest">Cashback (%)</label><input type="text" value={promo.cashbackRate} onChange={e => handlePromoChange('cashbackRate', e.target.value)} className={inputBaseClasses} placeholder="100"/></div>
                </div>
            )}
        </div>

        {/* Coberturas */}
        <div className="mb-10">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <TrendingUp className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-widest">Alvos de Cobertura</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {coverageBets.map((bet, index) => (
                    <CoverageCard key={index} index={index} bet={bet} stake={results.stakes[index] || 0} onChange={handleCoverageChange} />
                ))}
            </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10 relative z-10">
            <button onClick={shareState} className="flex items-center justify-center gap-3 px-10 py-5 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-[0_10px_30px_rgba(220,38,38,0.2)] active:scale-95">
                <Share2 size={18}/> Gerar Link de Operação
            </button>
            <button onClick={clearData} className="flex items-center justify-center gap-3 px-10 py-5 bg-[#0E0E10] text-white border-2 border-zinc-800 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:border-red-500 hover:text-red-500 transition-all active:scale-95">
                <RotateCcw size={18}/> Limpar Estratégia
            </button>
        </div>

        {/* Resultados */}
        <div className="bg-[#0E0E10] border-2 border-zinc-800 rounded-[32px] p-8 relative overflow-hidden group hover:border-red-500/20 transition-all duration-500">
            <div className="flex items-center gap-4 mb-10">
                <div className="p-3 bg-red-500/10 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-widest">Resumo da Extração</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                <div className="bg-black/50 border border-zinc-800 rounded-2xl p-8 transition-colors hover:border-zinc-700">
                    <h4 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Capital em Jogo</h4>
                    <p className="text-4xl font-black text-white tracking-tighter">{formatCurrency(results.totalInvestment)}</p>
                </div>
                <div className={`bg-black/50 border rounded-2xl p-8 transition-all duration-500 ${results.roi >= 0 ? 'border-green-500/20' : 'border-red-500/20'}`}>
                    <h4 className={`text-xs font-black uppercase tracking-[0.2em] mb-4 ${results.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ROI Estimado
                    </h4>
                    <p className={`text-4xl font-black tracking-tighter ${results.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatPercentage(results.roi)}
                    </p>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl border border-zinc-800">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-zinc-900/50 border-b border-zinc-800">
                            <th className="px-6 py-5 text-xs font-black text-red-500 uppercase tracking-[0.2em]">Cenário de Vitória</th>
                            <th className="px-6 py-5 text-xs font-black text-red-500 uppercase tracking-[0.2em] text-right">Lucro Líquido</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900 bg-black/20">
                        {results.profits.map((profit, index) => (
                            <tr key={index} className="hover:bg-red-500/[0.02] transition-colors">
                                <td className="px-6 py-5 font-bold text-white uppercase tracking-tight text-sm">
                                  {index === 0 ? 'Vitória na Casa Promo' : `Vitória no Alvo ${index}`}
                                </td>
                                <td className={`px-6 py-5 font-black text-right text-lg ${profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {formatCurrency(profit)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}