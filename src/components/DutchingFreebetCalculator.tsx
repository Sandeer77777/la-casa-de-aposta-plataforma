import React from 'react';
import { useDutchingFreebetCalculator } from '../hooks/useDutchingFreebetCalculator';
import { Settings, BarChart3, Calculator, DollarSign, RotateCcw, Percent, CheckCircle2, TrendingUp, Zap, AlertTriangle, Gift, ExternalLink, Share2 } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/calculations';

const DutchingHouseCard = ({ house, index, updateHouse }: any) => {
    const isFreebet = house.betType === 'freebet';
    const isEfficient = house.efficiency >= 70;
    const inputBaseClasses = "w-full px-4 py-3 bg-black border border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 text-white font-black font-mono text-lg outline-none transition-all";

    return (
        <div className={`relative bg-[#0E0E10] border-2 rounded-[32px] p-6 hover:border-red-500/40 transition-all duration-500 flex flex-col gap-5 group overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.3)] ${
            isFreebet ? 'border-zinc-800' : 'border-blue-500/10'
        }`}>
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div className="flex flex-col">
                  <span className="text-[12px] font-black text-red-500 uppercase tracking-[0.2em] mb-1">OPÇÃO {index + 1}</span>
                  <input
                      type="text"
                      value={house.name}
                      onChange={(e) => updateHouse(index, 'name', e.target.value)}
                      className="bg-transparent text-xl font-black text-white placeholder-zinc-800 focus:outline-none uppercase tracking-tight"
                      placeholder={`NOME DA CASA`}
                  />
                </div>
                <div className="flex gap-2">
                    {house.betType && (
                        <span className={`px-3 py-1 text-[11px] font-black rounded-lg flex items-center gap-2 tracking-widest ${
                            isFreebet ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-400'
                        }`}>
                            {isFreebet ? <Gift size={12}/> : <DollarSign size={12}/>}
                            {isFreebet ? 'BÔNUS' : 'REAL'}
                        </span>
                    )}
                    <span className="px-3 py-1 text-[11px] font-black rounded-lg bg-green-500 text-white tracking-widest shadow-[0_0_15px_rgba(34,197,94,0.2)]">
                        BACK
                    </span>
                </div>
            </div>

            {/* Mercado e Link */}
            <div className="space-y-3">
                <div>
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">MERCADO</label>
                    <input type="text" value={house.market || ''} onChange={e => updateHouse(index, 'market', e.target.value)} className="w-full px-3 py-2 bg-red-500/5 border border-red-500/20 rounded-lg text-white font-bold text-xs" placeholder="Ex: Cruzeiro"/>
                </div>
                <div>
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-1">LINK</label>
                    <div className="flex gap-2">
                        <input type="text" value={house.link || ''} onChange={e => updateHouse(index, 'link', e.target.value)} className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-lg text-white text-xs" placeholder="URL..."/>
                        {house.link && <a href={house.link} target="_blank" rel="noopener" className="p-2 bg-red-600 rounded-lg text-white"><ExternalLink size={14}/></a>}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="block text-[12px] font-black text-zinc-500 uppercase tracking-widest">Odd</label>
                    <input type="number" value={house.odd} onChange={(e) => updateHouse(index, 'odd', e.target.value)} className={inputBaseClasses} placeholder="1.00" />
                </div>
                <div className="space-y-2">
                    <label className="block text-[12px] font-black text-zinc-500 uppercase tracking-widest">Taxa %</label>
                    <input type="number" value={house.commission} onChange={(e) => updateHouse(index, 'commission', e.target.value)} className={inputBaseClasses} placeholder="0" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-5">
                    <label className="block text-[12px] font-black text-red-500 uppercase tracking-widest mb-2">Aporte Recomendado</label>
                    <div className="text-3xl font-black text-white font-mono tracking-tighter">
                        {formatCurrency(parseFloat(house.stake))}
                    </div>
                </div>
                {isFreebet && house.odd > 1 && (
                    <div className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-widest ${isEfficient ? 'text-green-500' : 'text-red-500/60'}`}>
                        {isEfficient ? <TrendingUp size={12}/> : <AlertTriangle size={12}/>}
                        <span>Eficiência: {house.efficiency.toFixed(1)}%</span>
                    </div>
                )}
                <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-zinc-800">
                     <span className="text-[11px] font-black text-zinc-500 uppercase tracking-widest">Retorno Líquido:</span>
                     <span className={`text-lg font-black tracking-tight ${house.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatCurrency(house.profit)}
                     </span>
                </div>
            </div>
        </div>
    );
};

export default function DutchingFreebetCalculator() {
  const { totalFreebet, setTotalFreebet, numberOfHouses, setNumberOfHouses, houses, results, updateHouse, clearAllData, shareState, roundingValue, setRoundingValue, optimizationMode, setOptimizationMode } = useDutchingFreebetCalculator();
  const inputBaseClasses = "w-full px-6 py-5 bg-black border border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 text-white font-black text-lg transition-all";

  return (
    <div className="bg-[#0A0A0A] border-2 border-red-500/10 rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-6 sm:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[80px] -mr-32 -mt-32 rounded-full" />
        <div className="bg-[#0E0E10] border border-zinc-800 rounded-[32px] p-5 md:p-8 mb-10 group hover:border-red-500/30 transition-colors relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-xl"><Settings className="w-6 h-6 text-red-500" /></div>
                <h3 className="text-xl font-black text-white uppercase tracking-widest">Configuração de Divisão</h3>
            </div>
            <button onClick={() => setOptimizationMode(!optimizationMode)} className={`flex items-center gap-3 px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] transition-all ${optimizationMode ? 'bg-red-600 text-white shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}`}>
                <Zap size={16} className={optimizationMode ? "fill-current" : ""} />
                {optimizationMode ? "Modo Híbrido Ativado" : "Ativar Modo Híbrido"}
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <label className="block text-[13px] font-black text-red-500 uppercase tracking-[0.2em]">Valor Bônus Total (R$)</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 font-black text-lg">R$</div>
                <input type="number" value={totalFreebet} onChange={(e) => setTotalFreebet(e.target.value)} className={`${inputBaseClasses} pl-12 text-xl`} placeholder="100.00" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="block text-[13px] font-black text-red-500 uppercase tracking-[0.2em]">Quantidade de Alvos</label>
              <div className="relative">
                <select value={numberOfHouses} onChange={(e) => setNumberOfHouses(Number(e.target.value))} className={`${inputBaseClasses} appearance-none text-xl`}>
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (<option key={num} value={num} className="bg-zinc-900">{num} Opções</option>))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"><RotateCcw className="w-5 h-5 rotate-180" /></div>
              </div>
            </div>
            <div className="space-y-3">
               <label className="block text-[13px] font-black text-red-500 uppercase tracking-[0.2em]">Precisão de Cálculo</label>
               <div className="relative">
                 <select value={roundingValue} onChange={(e) => setRoundingValue(Number(e.target.value))} className={`${inputBaseClasses} appearance-none text-xl`}>
                    <option value={0.01} className="bg-zinc-900">R$ 0,01 (Preciso)</option>
                    <option value={0.10} className="bg-zinc-900">R$ 0,10</option>
                    <option value={0.50} className="bg-zinc-900">R$ 0,50</option>
                    <option value={1.00} className="bg-zinc-900">R$ 1,00</option>
                 </select>
                 <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500"><RotateCcw className="w-5 h-5 rotate-180" /></div>
               </div>
            </div>
          </div>
          {optimizationMode && (
             <div className="mt-8 p-6 md:p-8 bg-red-500/[0.03] border border-red-500/10 rounded-2xl flex flex-col md:flex-row gap-4 md:gap-6 text-sm">
                <div className="p-3 bg-red-500/10 rounded-xl h-fit w-fit"><TrendingUp size={24} className="text-red-500"/></div>
                <p className="text-zinc-400 leading-relaxed font-medium text-base md:text-lg">O sistema alocará automaticamente a <strong className="text-white">Unidade Bônus</strong> nas melhores odds e sugerirá cobertura com <strong className="text-white">Capital Real</strong> nas piores para maximizar a sua blindagem.</p>
             </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 text-xl">
          {houses.map((house, index) => (<DutchingHouseCard key={house.id} house={house} index={index} updateHouse={updateHouse} />))}
        </div>

        <div className="bg-[#0E0E10] border-2 border-zinc-800 rounded-[32px] p-5 md:p-8 mb-10 relative overflow-hidden group hover:border-red-500/20 transition-all duration-500">
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-red-500/10 rounded-xl"><BarChart3 className="w-6 h-6 text-red-500" /></div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Análise de Lucratividade</h3>
          </div>
          <div className={`grid grid-cols-1 md:grid-cols-2 ${optimizationMode ? 'lg:grid-cols-3' : ''} gap-8`}>
             <div className="bg-black/50 border border-zinc-800 rounded-2xl p-6 md:p-8 transition-colors hover:border-zinc-700">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Lucro Líquido Real</h4>
                <p className="text-2xl md:text-4xl font-black text-white tracking-tighter">{formatCurrency(results.guaranteedProfit)}</p>
                <div className="mt-2 h-1 w-12 bg-red-500/30 rounded-full" />
            </div>
            {optimizationMode && (
                 <div className="bg-black/50 border border-zinc-800 rounded-2xl p-6 md:p-8 transition-colors hover:border-zinc-700">
                    <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4">Aporte Necessário</h4>
                    <p className="text-2xl md:text-4xl font-black text-white tracking-tighter">{formatCurrency(results.totalInvestment)}</p>
                    <div className="mt-2 h-1 w-12 bg-blue-500/30 rounded-full" />
                </div>
            )}
            <div className={`bg-black/50 border rounded-2xl p-6 md:p-8 transition-all duration-500 ${results.roi >= 0 ? 'border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.05)]' : 'border-red-500/20'}`}>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${results.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>{optimizationMode ? "ROI da Operação" : "Conversão Freebet"}</h4>
                <p className={`text-2xl md:text-4xl font-black tracking-tighter ${results.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatPercentage(results.roi)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
            <button onClick={shareState} className="flex items-center justify-center gap-3 px-10 py-5 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-[0_10px_30px_rgba(220,38,38,0.2)] active:scale-95">
                <Share2 size={18}/> Gerar Link de Plano
            </button>
            <button onClick={clearAllData} className="flex items-center justify-center gap-3 px-10 py-5 bg-[#0E0E10] text-white border-2 border-zinc-800 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:border-red-500 hover:text-red-500 transition-all active:scale-95">
                <RotateCcw size={18} /> Reiniciar Plano
            </button>
        </div>
    </div>
  );
}
