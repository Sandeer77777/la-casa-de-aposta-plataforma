import React, { useState } from 'react';
import { useFreebetCalculator, CoverageBet } from '../hooks/useFreebetCalculator';
import { Gift, DollarSign, RotateCcw, Share2, BarChart3, Settings, Percent, TrendingUp, Calculator, SlidersHorizontal, ChevronDown, ChevronUp, ExternalLink, Zap, Lock, Unlock, Target, ArrowRight } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/calculations';

// Custom Toggle Component (Estilo ArbiPro)
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

const inputBaseClasses = "w-full px-2 py-1.5 bg-black border border-zinc-800 rounded-lg focus:ring-1 focus:ring-red-500/50 focus:border-red-500 text-white font-black font-mono text-xs transition-all placeholder:text-zinc-800";

// Card de Cobertura (Estilo ArbiPro)
const CoverageCard: React.FC<{ 
    index: number;
    bet: CoverageBet;
    stake: number;
    responsibility: number;
    onChange: (index: number, field: keyof CoverageBet, value: string | boolean) => void;
}> = ({ index, bet, stake, responsibility, onChange }) => {
    const [showAdvanced, setShowAdvanced] = useState(false);

    return (
        <div className="relative bg-[#0E0E10] border border-zinc-800 rounded-xl p-3 md:p-5 hover:border-red-500/40 transition-all duration-500 flex flex-col gap-3 group shadow-xl">
            <div className="flex flex-col border-b border-zinc-800 pb-2">
                <span className="text-[8px] md:text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">ALVO {index + 2}</span>
                <input
                    type="text"
                    value={bet.name}
                    onChange={(e) => onChange(index, 'name', e.target.value)}
                    className="bg-transparent text-sm md:text-base font-black text-white placeholder-zinc-800 focus:outline-none uppercase truncate"
                    placeholder={`CASA`}
                />
            </div>

            <div className="space-y-3">
                <div className="space-y-1.5">
                    <input type="text" value={bet.market || ''} onChange={e => onChange(index, 'market', e.target.value)} className="w-full px-2 py-1 bg-red-500/5 border border-red-500/10 rounded text-white font-bold text-[9px] md:text-[10px] uppercase" placeholder="MERCADO..."/>
                    <div className="flex gap-1">
                        <input type="text" value={bet.link || ''} onChange={e => onChange(index, 'link', e.target.value)} className="w-full px-2 py-1 bg-black border border-zinc-800 rounded text-white font-medium text-[9px]" placeholder="URL LINK"/>
                        {bet.link && <a href={bet.link} target="_blank" rel="noopener noreferrer" className="p-1 bg-red-600 rounded text-white shrink-0 flex items-center justify-center"><ExternalLink size={10} /></a>}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <label className="block text-[8px] font-black text-zinc-500 uppercase">ODD</label>
                        <input type="text" inputMode="decimal" value={bet.odd} onChange={(e) => onChange(index, 'odd', e.target.value.replace(',', '.'))} className={inputBaseClasses} placeholder="1.00" />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[8px] font-black text-zinc-500 uppercase">COTAÇÃO</label>
                        <div className="w-full px-2 py-1.5 bg-zinc-900 border border-zinc-800 rounded-md text-red-500 font-black font-mono text-xs text-center">
                            {(parseFloat(bet.odd || '0')).toFixed(2)}
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between items-center">
                        <label className="text-[8px] font-black text-zinc-500 uppercase">{bet.lay ? 'APOSTA' : 'STAKE'} (R$)</label>
                        <div className="flex items-center gap-1">
                            <span className="text-[7px] font-bold text-zinc-600 uppercase tracking-tighter">LAY MODO</span>
                            <CustomToggle id={`lay-${index}`} checked={bet.lay} onChange={(checked) => onChange(index, 'lay', checked)} colorClass="bg-red-600" />
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-2.5 rounded-lg text-center shadow-inner">
                        <p className="text-lg font-black text-white font-mono tracking-tighter">
                            {formatCurrency(stake)}
                        </p>
                    </div>
                    
                    {bet.lay && (
                        <div className="animate-in slide-in-from-top-1 duration-200">
                            <label className="block text-[8px] font-black text-red-500 uppercase mb-1">Responsabilidade (Risco)</label>
                            <div className="w-full px-2 py-1.5 bg-red-500/5 border border-red-500/20 rounded-md text-red-500 font-black font-mono text-xs text-center">
                                {formatCurrency(responsibility)}
                            </div>
                        </div>
                    )}
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
                            <span className="flex items-center gap-1.5"><Percent size={10} className="text-red-500"/> TAXA COMISSÃO</span>
                            <input type="text" inputMode="decimal" value={bet.commission} onChange={(e) => onChange(index, 'commission', e.target.value.replace(',', '.'))} className="w-16 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-white text-[9px] font-mono text-center" placeholder="0%"/>
                        </div>
                    </div>
                )}
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
  const [showPromoAdvanced, setShowPromoAdvanced] = useState(false);

  return (
    <div className="max-w-7xl mx-auto">
        <div className="bg-[#0A0A0A] border-2 border-red-500/10 rounded-2xl md:rounded-[40px] shadow-2xl p-3 md:p-8 relative overflow-hidden">
            
            {/* Header (Estilo ArbiPro) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 relative z-10">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-red-600 text-white rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)]">
                        <Zap size={20} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-widest">Protocolo Free Pro</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em]">Extração em Tempo Real</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="bg-[#0E0E10] border border-zinc-800 rounded-xl p-1 flex">
                        <button onClick={() => setActiveMode('freebet')} className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase transition-all ${activeMode === 'freebet' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Freebet</button>
                        <button onClick={() => setActiveMode('cashback')} className={`px-4 py-2 rounded-lg font-black text-[10px] uppercase transition-all ${activeMode === 'cashback' ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}>Cashback</button>
                    </div>
                </div>
            </div>

            {/* Parâmetros de Operação Persistent (Estilo ArbiPro) */}
            <div className="relative z-10 bg-[#0E0E10] border border-zinc-800 rounded-xl p-3 mb-6 group hover:border-red-500/20 transition-all shadow-lg">
                <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                        <label className="block text-[8px] font-black text-red-500 uppercase tracking-widest mb-1.5 ml-1">Alvos Totais (Mercados)</label>
                        <select 
                            value={numEntradas} 
                            onChange={e => setNumEntradas(Number(e.target.value))} 
                            className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-md text-white font-bold text-[10px] appearance-none focus:border-red-500 outline-none transition-all cursor-pointer"
                        >
                            {[2,3,4,5,6,7,8,9,10,11,12].map(n => <option key={n} value={n}>{n} Entradas Operacionais</option>)}
                        </select>
                    </div>
                    <div className="relative">
                        <label className="block text-[8px] font-black text-red-500 uppercase tracking-widest mb-1.5 ml-1">Precisão Arredondamento</label>
                        <select 
                            value={roundStep} 
                            onChange={e => setRoundStep(Number(e.target.value))} 
                            className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-md text-white font-bold text-[10px] appearance-none focus:border-red-500 outline-none transition-all cursor-pointer"
                        >
                            <option value={0.01}>Centavos (R$ 0,01)</option>
                            <option value={1.00}>Inteiros (R$ 1,00)</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Grid de Cards (Especial: O Primeiro é o Promo) */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8 items-start">
                
                {/* CARD ESPECIAL: OPERAÇÃO PRINCIPAL / PROMO */}
                <div className="relative bg-[#0E0E10] border-2 border-red-500/30 rounded-2xl p-4 md:p-6 shadow-[0_0_40px_rgba(220,38,38,0.1)] flex flex-col gap-4 group col-span-2 md:col-span-1 ring-1 ring-red-500/20 animate-in fade-in duration-700">
                    <div className="absolute -top-3 left-4 px-3 py-1 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1.5">
                        <Gift size={10} /> OP. PRINCIPAL (PROMO)
                    </div>

                    <div className="flex flex-col border-b border-zinc-800 pb-3 mt-1">
                        <input
                            type="text"
                            value={promo.promoMarket}
                            onChange={e => handlePromoChange('promoMarket', e.target.value)}
                            className="bg-transparent text-base md:text-lg font-black text-white placeholder-zinc-800 focus:outline-none uppercase"
                            placeholder="CASA (NOME)"
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="space-y-1.5">
                            <input 
                                type="text" 
                                value={promo.promoMarket} 
                                onChange={e => handlePromoChange('promoMarket', e.target.value)} 
                                className="w-full px-2 py-1 bg-red-500/5 border border-red-500/10 rounded text-white font-bold text-[9px] md:text-[10px] uppercase focus:border-red-500/30 transition-all" 
                                placeholder="MERCADO..."
                            />
                            <div className="flex gap-1">
                                <input 
                                    type="text" 
                                    value={promo.promoLink} 
                                    onChange={e => handlePromoChange('promoLink', e.target.value)} 
                                    className="w-full px-2 py-1 bg-black border border-zinc-800 rounded text-white font-medium text-[9px] focus:border-red-500/30 transition-all" 
                                    placeholder="URL LINK"
                                />
                                {promo.promoLink && (
                                    <a href={promo.promoLink} target="_blank" rel="noopener noreferrer" className="p-1 bg-red-600 rounded text-white shrink-0 flex items-center justify-center hover:bg-red-500 transition-all">
                                        <ExternalLink size={10} />
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="block text-[8px] font-black text-zinc-500 uppercase">ODD PROMO</label>
                                <input type="text" inputMode="decimal" value={promo.promoOdd} onChange={e => handlePromoChange('promoOdd', e.target.value.replace(',', '.'))} className={inputBaseClasses} placeholder="1.00" />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-[8px] font-black text-red-500 uppercase">Stake Qualificação</label>
                                <input type="text" inputMode="decimal" value={promo.qualifyingStake} onChange={e => handlePromoChange('qualifyingStake', e.target.value.replace(',', '.'))} className={`${inputBaseClasses} border-red-500/40 text-red-500 shadow-[0_0_10px_rgba(220,38,38,0.05)]`} placeholder="0.00" />
                            </div>
                        </div>

                        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-3 space-y-3 relative overflow-hidden">
                            <div className="grid grid-cols-2 gap-3 relative z-10">
                                {activeMode === 'freebet' ? (
                                    <>
                                        <div className="space-y-1">
                                            <label className="block text-[8px] font-black text-zinc-400 uppercase">Valor da Freebet</label>
                                            <input type="text" inputMode="decimal" value={promo.freebetValue} onChange={e => handlePromoChange('freebetValue', e.target.value.replace(',', '.'))} className={inputBaseClasses} placeholder="0.00" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-[8px] font-black text-zinc-400 uppercase">Extração (%)</label>
                                            <input type="text" inputMode="decimal" value={promo.extractionRate} onChange={e => handlePromoChange('extractionRate', e.target.value.replace(',', '.'))} className={inputBaseClasses} placeholder="70" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-1 col-span-2">
                                        <label className="block text-[8px] font-black text-zinc-400 uppercase">Valor do Cashback (%)</label>
                                        <input type="text" inputMode="decimal" value={promo.cashbackRate} onChange={e => handlePromoChange('cashbackRate', e.target.value.replace(',', '.'))} className={inputBaseClasses} placeholder="100" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowPromoAdvanced(!showPromoAdvanced)}
                        className={`w-full py-1.5 px-2 rounded-md flex items-center justify-between transition-all border ${
                            showPromoAdvanced ? 'bg-red-600/10 border-red-500/30 text-red-500' : 'bg-zinc-900/50 border-zinc-800 text-zinc-500'
                        }`}
                    >
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal size={10} />
                            <span className="text-[8px] font-black uppercase tracking-[0.1em]">Config. Promoção</span>
                        </div>
                        {showPromoAdvanced ? <ChevronUp size={10} /> : <ChevronDown size={10} />}
                    </button>

                    {showPromoAdvanced && (
                        <div className="bg-black/40 rounded-lg p-3 border border-zinc-800 space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-[8px] font-black text-zinc-400 uppercase">Comissão Casa (%)</span>
                                <input type="text" inputMode="decimal" value={promo.promoCommission} onChange={e => handlePromoChange('promoCommission', e.target.value.replace(',', '.'))} className="w-16 px-2 py-1 bg-zinc-900 border border-zinc-800 rounded text-white text-[9px] font-mono text-center" />
                            </div>
                        </div>
                    )}
                </div>

                {/* CARDS DE COBERTURA (ALVOS) */}
                {coverageBets.map((bet, index) => (
                    <CoverageCard 
                        key={index} 
                        index={index} 
                        bet={bet} 
                        stake={results.stakes[index] || 0} 
                        responsibility={results.responsibilities[index] || 0}
                        onChange={handleCoverageChange} 
                    />
                ))}
            </div>

            {/* NOVO PAINEL DE RESULTADOS (LIMPO E ALINHADO) */}
            <div className="bg-[#0E0E10] border border-zinc-800 rounded-2xl p-5 mb-8 relative overflow-hidden group hover:border-red-500/10 transition-all shadow-xl">
                
                {/* Resumo Superior Slim */}
                <div className="flex flex-wrap items-center justify-between gap-6 mb-6 pb-6 border-b border-zinc-800/50">
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col">
                            <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">Stake Total</span>
                            <span className="text-xl md:text-2xl font-black text-white font-mono tracking-tighter">{formatCurrency(results.totalInvestment)}</span>
                        </div>
                        <div className="h-10 w-[1px] bg-zinc-800 hidden md:block" />
                        <div className="flex flex-col">
                            <span className={`text-[9px] font-black uppercase tracking-widest ${results.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>ROI Estimado</span>
                            <span className={`text-xl md:text-2xl font-black font-mono tracking-tighter ${results.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatPercentage(results.roi)}</span>
                        </div>
                    </div>
                </div>

                {/* Tabela de Operação (Padrão ArbiPro) */}
                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-black/40 shadow-inner">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr className="bg-zinc-900/50 border-b border-zinc-800">
                                <th className="px-4 py-3 text-[9px] font-black text-red-500 uppercase tracking-widest">Mercado</th>
                                <th className="px-4 py-3 text-[9px] font-black text-red-500 uppercase tracking-widest">Odd</th>
                                <th className="px-4 py-3 text-[9px] font-black text-red-500 uppercase tracking-widest">Comissão</th>
                                <th className="px-4 py-3 text-[9px] font-black text-red-500 uppercase tracking-widest">Stake</th>
                                <th className="px-4 py-3 text-[9px] font-black text-red-500 uppercase tracking-widest">Déficit</th>
                                <th className="px-4 py-3 text-[9px] font-black text-red-500 uppercase tracking-widest text-right">Lucro</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-900/50">
                            {/* Linha 1: Casa Promo */}
                            {(() => {
                                const s1 = Utils.parseFlex(promo.qualifyingStake);
                                const o1 = Utils.parseFlex(promo.promoOdd);
                                const c1 = Utils.parseFlex(promo.promoCommission) / 100;
                                const o1_eff = 1 + (o1 - 1) * (1 - c1);
                                const betReturn = s1 * o1_eff;
                                const deficit = betReturn - results.totalInvestment;

                                return (
                                    <tr className="hover:bg-red-500/[0.02] transition-colors">
                                        <td className="px-4 py-3.5">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-white uppercase truncate max-w-[150px]">{promo.promoMarket || 'CASA PROMO'}</span>
                                                <span className="text-[8px] font-bold text-red-500/60 uppercase">OPERADOR PRINCIPAL</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 font-mono text-xs font-black text-zinc-400">{o1.toFixed(2)}</td>
                                        <td className="px-4 py-3.5 font-mono text-xs font-bold text-zinc-500">{promo.promoCommission ? `${promo.promoCommission}%` : '0.00%'}</td>
                                        <td className="px-4 py-3.5 font-mono text-xs font-black text-white">{formatCurrency(s1)}</td>
                                        <td className={`px-4 py-3.5 font-mono text-xs font-bold ${deficit >= 0 ? 'text-zinc-600' : 'text-red-500/70'}`}>
                                            {deficit >= 0 ? '—' : formatCurrency(deficit)}
                                        </td>
                                        <td className={`px-4 py-3.5 font-mono text-xs font-black text-right ${results.profits[0] >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {formatCurrency(results.profits[0] || 0)}
                                        </td>
                                    </tr>
                                );
                            })()}

                            {/* Linhas de Cobertura */}
                            {coverageBets.map((bet, index) => {
                                const s = results.stakes[index] || 0;
                                const o = Utils.parseFlex(bet.odd);
                                const c = Utils.parseFlex(bet.commission) / 100;
                                const o_eff = bet.lay ? 1 : (1 + (o - 1) * (1 - c));
                                // Para LAY, o "retorno" da aposta seca é a Stake (se ganhar o Lay) ou -Responsabilidade (se perder)
                                // Mas no Dutching, o "Déficit" costuma comparar o retorno bruto da aposta vs investimento total
                                const betReturn = bet.lay ? (s * (1 - c)) : (s * o_eff);
                                const deficit = betReturn - results.totalInvestment;

                                return (
                                    <tr key={index} className="hover:bg-red-500/[0.02] transition-colors">
                                        <td className="px-4 py-3.5">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-white uppercase truncate max-w-[150px]">{bet.name || `CASA ${index + 2}`} - {bet.market || 'ALVO'}</span>
                                                {bet.lay && <span className="text-[8px] font-bold text-red-500 uppercase">MODO LAY (RISCO)</span>}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 font-mono text-xs font-black text-zinc-400">{o.toFixed(2)}</td>
                                        <td className="px-4 py-3.5 font-mono text-xs font-bold text-zinc-500">{bet.commission ? `${bet.commission}%` : '0.00%'}</td>
                                        <td className="px-4 py-3.5 font-mono text-xs font-black text-white">{formatCurrency(s)}</td>
                                        <td className={`px-4 py-3.5 font-mono text-xs font-bold ${deficit >= 0 ? 'text-green-500/70' : 'text-red-500/70'}`}>
                                            {formatCurrency(deficit)}
                                        </td>
                                        <td className={`px-4 py-3.5 font-mono text-xs font-black text-right ${results.profits[index + 1] >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {formatCurrency(results.profits[index + 1] || 0)}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center relative z-10">
                <button onClick={shareState} className="flex items-center justify-center gap-3 px-8 py-3.5 bg-red-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-red-500 active:scale-95 shadow-[0_5px_20px_rgba(220,38,38,0.3)] group">
                    <Share2 size={14} className="group-hover:rotate-12 transition-transform" /> Exportar Protocolo
                </button>
                <button onClick={clearData} className="flex items-center justify-center gap-3 px-8 py-3.5 bg-zinc-900 text-zinc-400 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-zinc-800 active:scale-95 border border-zinc-800">
                    <RotateCcw size={14} /> Limpar Dados
                </button>
            </div>
        </div>
    </div>
  );
}

// Helper local para evitar dependência circular se necessário
const Utils = {
    parseFlex: (value: any): number => {
      if (typeof value === 'number') return value;
      if (!value || typeof value !== 'string') return 0;
      const n = parseFloat(value.replace(',', '.'));
      return isNaN(n) ? 0 : n;
    }
};
