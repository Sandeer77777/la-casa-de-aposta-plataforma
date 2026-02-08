import React from 'react';
import { useArbitrageCalculator } from '../hooks/useArbitrageCalculator';
import { BettingHouseCard } from './BettingHouseCard';
import { Settings, BarChart3, TrendingUp, Share2, RotateCcw } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/calculations';

export default function ArbitrageCalculator() {
  const { houses, numberOfHouses, results, roundingValue, actions } = useArbitrageCalculator();

  return (
    <div className="bg-[#0A0A0A] border-2 border-red-500/10 rounded-[32px] md:rounded-[40px] shadow-[0_0_50px_rgba(0,0,0,0.5)] p-4 sm:p-10 relative overflow-hidden">
        {/* Decorativo de fundo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 blur-[80px] -mr-32 -mt-32 rounded-full" />
        
        {/* Configurações */}
        <div className="relative z-10 bg-[#0E0E10] border border-zinc-800 rounded-3xl p-5 md:p-8 mb-10 group hover:border-red-500/30 transition-colors">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-red-500/10 rounded-xl border border-red-500/20">
              <Settings className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Configurações da Operação</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-black text-red-500 uppercase tracking-[0.2em] mb-3">Número de Casas de Aposta</label>
              <div className="relative">
                <select
                  value={numberOfHouses}
                  onChange={(e) => actions.setNumberOfHouses(Number(e.target.value))}
                  className="w-full px-6 py-5 bg-black border border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 text-white font-bold text-lg appearance-none transition-all"
                >
                  {[2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num} className="bg-zinc-900 text-white">{num} Mercados Estratégicos</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                  <RotateCcw className="w-5 h-5 rotate-180" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-black text-red-500 uppercase tracking-[0.2em] mb-3">Arredondamento do Plano</label>
              <div className="relative">
                <select
                  value={roundingValue}
                  onChange={(e) => actions.setRoundingValue(Number(e.target.value))}
                  className="w-full px-6 py-5 bg-black border border-zinc-800 rounded-xl focus:ring-2 focus:ring-red-500/50 focus:border-red-500 text-white font-bold text-lg appearance-none transition-all"
                >
                  <option value={0.01} className="bg-zinc-900">R$ 0,01 (Cálculo Preciso)</option>
                  <option value={0.10} className="bg-zinc-900">R$ 0,10</option>
                  <option value={0.50} className="bg-zinc-900">R$ 0,50</option>
                  <option value={1.00} className="bg-zinc-900">R$ 1,00 (Modo Discreto)</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-500">
                   <RotateCcw className="w-5 h-5 rotate-180" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards das Casas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {houses.slice(0, numberOfHouses).map((house, index) => (
            <BettingHouseCard
              key={house.id}
              house={house}
              index={index}
              actions={actions}
            />
          ))}
        </div>

        {/* Cenários e Resultados */}
        <div className="bg-[#0E0E10] border-2 border-zinc-800 rounded-[32px] p-8 mb-10 relative overflow-hidden group hover:border-red-500/20 transition-all duration-500">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-red-500/10 rounded-xl">
              <BarChart3 className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="text-xl font-black text-white uppercase tracking-widest">Plano de Resultados</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="bg-black/50 border border-zinc-800 rounded-2xl p-6 md:p-8 transition-colors hover:border-zinc-700">
                <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-4">Total da Operação</h4>
                <p className="text-2xl md:text-4xl font-black text-white tracking-tighter">{formatCurrency(results.totalStake)}</p>
            </div>
            <div className={`bg-black/50 border rounded-2xl p-6 md:p-8 transition-all duration-500 ${results.roi >= 0 ? 'border-green-500/20 shadow-[0_0_30px_rgba(34,197,94,0.05)]' : 'border-red-500/20'}`}>
                <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${results.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    Retorno Estimado (ROI)
                </h4>
                <div className="flex items-baseline gap-3">
                  <p className={`text-3xl md:text-5xl font-black tracking-tighter ${results.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatPercentage(results.roi)}
                  </p>
                  {results.roi >= 0 && <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-green-500 animate-bounce" />}
                </div>
            </div>
          </div>

          <div className="overflow-x-auto -mx-2 px-2 md:mx-0 md:px-0 rounded-2xl border border-zinc-800">
            <table className="w-full text-left min-w-[500px] md:min-w-0">
              <thead>
                <tr className="bg-zinc-900/50 border-b border-zinc-800">
                  <th className="px-6 py-5 text-xs font-black text-red-500 uppercase tracking-[0.2em]">Cenário de Vitória</th>
                  <th className="px-6 py-5 text-xs font-black text-red-500 uppercase tracking-[0.2em]">Odd</th>
                  <th className="px-6 py-5 text-xs font-black text-red-500 uppercase tracking-[0.2em]">Aposta</th>
                  <th className="px-6 py-5 text-xs font-black text-red-500 uppercase tracking-[0.2em] text-right">Lucro Real</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 bg-black/20">
                {houses.slice(0, numberOfHouses).map((house, index) => (
                  <tr key={house.id} className="hover:bg-red-500/[0.02] transition-colors">
                    <td className="px-6 py-5 font-bold text-white uppercase tracking-tight text-sm">{house.name || `Casa de Aposta ${index + 1}`}</td>
                    <td className="px-6 py-5 font-black text-zinc-400 font-mono">{house.finalOdd.toFixed(2)}</td>
                    <td className="px-6 py-5 font-black text-white">{formatCurrency(parseFloat(house.stake) || 0)}</td>
                    <td className={`px-6 py-5 font-black text-right text-lg ${results.profits[index] >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {formatCurrency(results.profits[index] || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
          <button
            onClick={actions.shareState}
            className="flex items-center justify-center gap-3 px-10 py-5 bg-red-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all shadow-[0_10px_30px_rgba(220,38,38,0.2)] active:scale-95"
          >
            <Share2 size={18} />
            Gerar Link Seguro
          </button>
          <button
            onClick={actions.clearAllData}
            className="flex items-center justify-center gap-3 px-10 py-5 bg-[#0E0E10] text-white border-2 border-zinc-800 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:border-red-500 hover:text-red-500 transition-all active:scale-95"
          >
            <RotateCcw size={18} />
            Limpar Plano
          </button>
        </div>
    </div>
  );
}
