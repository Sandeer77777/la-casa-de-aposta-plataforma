import React from 'react';
import { useArbitrageCalculator } from '../hooks/useArbitrageCalculator';
import { BettingHouseCard } from './BettingHouseCard';
import { Settings, BarChart3, TrendingUp, Share2, RotateCcw } from 'lucide-react';
import { formatCurrency, formatPercentage } from '../utils/calculations';

const parseFlex = (value: any): number => {
  if (typeof value === 'number') return value;
  if (!value || typeof value !== 'string') return 0;
  const n = parseFloat(value.replace(',', '.'));
  return isNaN(n) ? 0 : n;
};

export default function ArbitrageCalculator() {
  const { houses, numberOfHouses, results, roundingValue, actions } = useArbitrageCalculator();

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-[#0A0A0A] border-2 border-red-500/10 rounded-2xl md:rounded-[32px] shadow-[0_0_60px_rgba(0,0,0,0.6)] p-3 md:p-6 relative overflow-hidden">
          
          {/* Configurações Ultra-Slim */}
          <div className="relative z-10 bg-[#0E0E10] border border-zinc-800 rounded-xl p-3 mb-4 group hover:border-red-500/20 transition-colors">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <label className="block text-[8px] font-black text-red-500 uppercase tracking-widest mb-1 ml-1">Mercados</label>
                <select value={numberOfHouses} onChange={(e) => actions.setNumberOfHouses(Number(e.target.value))} className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-md text-white font-bold text-[10px] appearance-none transition-all">
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (<option key={num} value={num}>{num} Alvos</option>))}
                </select>
              </div>
              <div className="relative">
                <label className="block text-[8px] font-black text-red-500 uppercase tracking-widest mb-1 ml-1">Arredondamento</label>
                <select value={roundingValue} onChange={(e) => actions.setRoundingValue(Number(e.target.value))} className="w-full px-3 py-2 bg-black border border-zinc-800 rounded-md text-white font-bold text-[10px] appearance-none transition-all">
                  <option value={0.01}>R$ 0,01</option>
                  <option value={1.00}>R$ 1,00</option>
                </select>
              </div>
            </div>
          </div>

          {/* Grid de Cards com alinhamento independente (items-start) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8 items-start">
            {houses.slice(0, numberOfHouses).map((house, index) => (
              <BettingHouseCard key={house.id} house={house} index={index} actions={actions} />
            ))}
          </div>

          {/* Painel de Resultados Compacto */}
          <div className="bg-[#0E0E10] border border-zinc-800 rounded-xl p-4 mb-6 relative overflow-hidden group hover:border-red-500/10 transition-all">
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-black/50 border border-zinc-800 rounded-lg p-3">
                  <h4 className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mb-1">Total da Operação</h4>
                  <p className="text-lg md:text-xl font-black text-white tracking-tighter">{formatCurrency(results.totalStake)}</p>
              </div>
              <div className={`bg-black/50 border rounded-lg p-3 ${results.roi >= 0 ? 'border-green-500/20' : 'border-red-500/20'}`}>
                  <h4 className={`text-[8px] font-black uppercase tracking-widest mb-1 ${results.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>ROI Estimado</h4>
                  <p className={`text-lg md:text-xl font-black tracking-tighter ${results.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>{formatPercentage(results.roi)}</p>
              </div>
            </div>

            <div className="overflow-x-auto rounded-lg border border-zinc-800">
              <table className="w-full text-left">
                <thead className="bg-zinc-900/50 border-b border-zinc-800 text-[9px]">
                  <tr>
                    <th className="px-3 py-2 font-black text-red-500 uppercase">Cenário</th>
                    <th className="px-3 py-2 font-black text-red-500 uppercase">Odd</th>
                    <th className="px-3 py-2 font-black text-red-500 uppercase">Taxa</th>
                    <th className="px-3 py-2 font-black text-red-500 uppercase">Risco (Lay)</th>
                    <th className="px-3 py-2 font-black text-red-500 uppercase text-right">Lucro Real</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 bg-black/20 text-[10px]">
                  {houses.slice(0, numberOfHouses).map((house, index) => (
                    <tr key={house.id} className="hover:bg-red-500/[0.01]">
                      <td className="px-3 py-2 font-bold text-white uppercase truncate max-w-[80px]">
                        {house.name || `C${index + 1}`}
                        {house.lay && <span className="ml-1 text-[8px] text-red-500">(LAY)</span>}
                      </td>
                      <td className="px-3 py-2 font-black text-zinc-400 font-mono">{house.finalOdd.toFixed(2)}</td>
                      <td className="px-3 py-2 font-bold text-zinc-500">{house.commission ? `${house.commission}%` : '—'}</td>
                      <td className="px-3 py-2 font-bold text-zinc-500">
                        {house.lay ? formatCurrency(parseFlex(house.responsibility)) : '—'}
                      </td>
                      <td className={`px-3 py-2 font-black text-right ${results.profits[index] >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatCurrency(results.profits[index] || 0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex gap-2 justify-center">
            <button onClick={actions.shareState} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg font-black text-[9px] uppercase transition-all active:scale-95">
              <Share2 size={12} /> Link
            </button>
            <button onClick={actions.clearAllData} className="flex items-center justify-center gap-2 px-4 py-2.5 bg-zinc-900 text-zinc-400 rounded-lg font-black text-[9px] uppercase transition-all active:scale-95">
              <RotateCcw size={12} /> Limpar
            </button>
          </div>
      </div>
    </div>
  );
}
