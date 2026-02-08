import React, { useState, useEffect, useMemo } from 'react';
import { X, Calculator, Trash2, Zap, TrendingUp, Percent, ArrowRightLeft, Gift, PlusCircle, Check } from 'lucide-react';
import { nanoid } from 'nanoid';

// --- TYPE DEFINITIONS ---
interface EntradaState {
  id: string;
  casa: string;
  mercado: string;
  stake: string;
  odd: string;
  retorno: string;
  lucro: string;
  isPromo: boolean; // Usado para Rainbow/Reembolso
  isFreebet: boolean; // NOVO: Usado para FreeBet SnR
  valorReembolso: string;
  taxaExtracao: string;
  comissao: string;
  percentualBoost: string;
  oddFinal: string;
  showCommission: boolean;
  showBoost: boolean;
  isLay: boolean;
  responsabilidade?: string | null;
  deficit?: string | null;
}

interface AddFaseModalProps {
  isOpen?: boolean;
  onClose: () => void;
  onSave: (entradas: any[]) => void;
  faseIndex?: number;
  estrategiaOperacao: string;
  faseParaEditar?: any;
}

const clean = (val: any) => {
    if (!val) return 0;
    const str = String(val).replace(',', '.');
    const num = parseFloat(str);
    return isNaN(num) ? 0 : num;
};

// --- SUB-COMPONENT: CARD DE ENTRADA ---
const CardEntrada = ({ entrada, index, onUpdate, onRemove, estrategiaOperacao }: { 
    entrada: EntradaState; 
    index: number; 
    onUpdate: (idx: number, field: keyof EntradaState, val: any) => void;
    onRemove: (idx: number) => void;
    estrategiaOperacao: string;
}) => {
    // Classes visuais
    const isFreebet = entrada.isFreebet;
    const isRainbow = estrategiaOperacao === 'rainbow' && entrada.isPromo;
    
    // Borda dinâmica: Vermelho para FreeBet e Rainbow
    let borderClass = 'border-zinc-800';
    if (isFreebet || isRainbow) borderClass = 'border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.15)]';

    const stakeLabel = isFreebet ? 'Valor Bônus' : 'Investimento';
    const stakeColor = isFreebet ? 'text-red-500' : 'text-zinc-500';
    const stakeInputClass = isFreebet 
        ? 'border-red-500/50 text-red-100 focus:ring-red-500' 
        : 'border-zinc-700 text-white focus:ring-red-500';

    return (
      <div className={`p-6 space-y-6 bg-[#0E0E10] rounded-3xl border ${borderClass} relative group shadow-2xl transition-all duration-300`}>
        
        {index > 0 && (
            <button type="button" onClick={() => onRemove(index)} className="absolute top-0 right-0 h-10 w-10 flex items-center justify-center rounded-bl-2xl rounded-tr-3xl bg-zinc-900 border-l border-b border-zinc-800 text-zinc-600 hover:bg-red-500/10 hover:text-red-500 transition-all z-10"><Trash2 size={18} /></button>
        )}
        
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block tracking-widest">Plataforma</label>
                <select value={entrada.casa} onChange={e => onUpdate(index, 'casa', e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-red-500 outline-none transition-all appearance-none font-bold">
                    <option value="">Selecione...</option>
                    <option value="BET365">BET365</option>
                    <option value="BETANO">BETANO</option>
                    <option value="BETBRA">BETBRA</option>
                    <option value="PINNACLE">PINNACLE</option>
                    <option value="FAIRCHANGE">FAIRCHANGE</option>
                </select>
            </div>
            <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block tracking-widest">Mercado de Atuação</label>
                <input type="text" value={entrada.mercado} onChange={e => onUpdate(index, 'mercado', e.target.value)} className="w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:ring-1 focus:ring-red-500 outline-none transition-all font-bold placeholder-zinc-800" placeholder="EX: OVER 2.5" />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className={`text-[10px] font-black uppercase mb-2 block tracking-widest ${stakeColor}`}>{stakeLabel}</label>
                <input type="text" value={entrada.stake} onChange={e => onUpdate(index, 'stake', e.target.value)} className={`w-full bg-black border rounded-xl px-4 py-3 text-sm font-black font-mono focus:ring-1 outline-none transition-all ${stakeInputClass}`} placeholder="100.00" />
            </div>
            <div>
                <label className="text-[10px] font-black text-zinc-500 uppercase mb-2 block tracking-widest">Odd da Unidade</label>
                <input type="text" value={entrada.odd} onChange={e => onUpdate(index, 'odd', e.target.value)} className={`w-full bg-black border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white font-black font-mono focus:ring-1 focus:ring-red-500 outline-none ${entrada.isLay ? 'border-red-500/50 text-red-500' : ''}`} placeholder="2.00" />
            </div>
        </div>
        
        {/* TOOLBAR DE AÇÕES */}
        <div className="flex items-center gap-2 pt-2 overflow-x-auto">
            {/* BOTÃO FREEBET */}
            {estrategiaOperacao === 'freebet' && (
                <button 
                    onClick={() => onUpdate(index, 'isFreebet', !entrada.isFreebet)} 
                    className={`flex-1 py-3 flex items-center justify-center border transition-all rounded-xl text-[10px] font-black uppercase tracking-widest min-w-[100px] ${entrada.isFreebet ? 'bg-red-600 text-white border-red-600 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-white'}`}
                >
                    <Gift size={14} className="mr-2" /> Unidade Bônus
                </button>
            )}

            <button onClick={() => onUpdate(index, 'showBoost', !entrada.showBoost)} className={`flex-1 py-3 flex items-center justify-center border transition-all rounded-xl text-[10px] font-black uppercase tracking-widest min-w-[100px] ${entrada.showBoost ? 'bg-red-500/10 text-red-500 border-red-500/40' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-white'}`}><TrendingUp size={14} className="mr-2" /> Potencializar</button>
            <button onClick={() => onUpdate(index, 'showCommission', !entrada.showCommission)} className={`flex-1 py-3 flex items-center justify-center border transition-all rounded-xl text-[10px] font-black uppercase tracking-widest min-w-[100px] ${entrada.showCommission ? 'bg-red-500/10 text-red-500 border-red-500/40' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-white'}`}><Percent size={14} className="mr-2" /> Taxa</button>
            <button onClick={() => onUpdate(index, 'isLay', !entrada.isLay)} className={`flex-1 py-3 flex items-center justify-center border transition-all rounded-xl text-[10px] font-black uppercase tracking-widest min-w-[100px] ${entrada.isLay ? 'bg-red-600 text-white border-red-600' : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:bg-zinc-800 hover:text-white'}`}><ArrowRightLeft size={14} className="mr-2" /> Modo Proteção</button>
        </div>

        {/* INPUTS CONDICIONAIS */}
        
        {/* Rainbow (Reembolso) */}
        {(estrategiaOperacao === 'rainbow' && entrada.isPromo) && (
            <div className="grid grid-cols-2 gap-4 p-4 bg-red-500/5 rounded-2xl border border-red-500/10 mt-4 animate-in fade-in zoom-in-95">
                 <div><label className="text-[10px] text-red-500 font-black uppercase mb-2 flex items-center gap-2"><Zap size={12} /> Reembolso Estimado (R$)</label><input type="text" value={entrada.valorReembolso} onChange={e => onUpdate(index, 'valorReembolso', e.target.value)} className="w-full bg-black border border-red-500/20 rounded-lg px-3 py-2 text-xs text-white font-bold outline-none focus:border-red-500" placeholder="100.00" /></div>
                 <div><label className="text-[10px] text-red-500 font-black uppercase mb-2">Taxa de Conversão (%)</label><input type="text" value={entrada.taxaExtracao} onChange={e => onUpdate(index, 'taxaExtracao', e.target.value)} className="w-full bg-black border border-red-500/20 rounded-lg px-3 py-2 text-xs text-white font-bold outline-none focus:border-red-500" placeholder="70" /></div>
            </div>
        )}

        {entrada.showCommission && (<div className="pt-4 border-t border-zinc-800/50 mt-4 animate-in fade-in"><label className="text-[10px] text-red-500 font-black uppercase mb-2 block">Taxa de Operação (%)</label><input type="text" value={entrada.comissao} onChange={e => onUpdate(index, 'comissao', e.target.value)} className="w-full bg-black border border-red-500/20 rounded-lg px-3 py-2 text-xs text-white font-bold outline-none focus:border-red-500" placeholder="6.5" /></div>)}
        {entrada.showBoost && (<div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800/50 mt-4 animate-in fade-in"><div><label className="text-[10px] text-red-500 font-black uppercase mb-2 block">Aumento Aplicado (%)</label><input type="text" value={entrada.percentualBoost} onChange={e => onUpdate(index, 'percentualBoost', e.target.value)} className="w-full bg-black border border-red-500/20 rounded-lg px-3 py-2 text-xs text-white font-bold outline-none focus:border-red-500" placeholder="25" /></div><div><label className="text-[10px] text-zinc-600 font-black uppercase mb-2 block">Odd Final do Plano</label><div className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-red-500 font-black font-mono">{entrada.oddFinal || '-'}</div></div></div>)}
      </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export const AddFaseModal: React.FC<AddFaseModalProps> = ({ isOpen = true, onClose, onSave, faseIndex, estrategiaOperacao, faseParaEditar }) => {
  const [entradas, setEntradas] = useState<EntradaState[]>([
    { id: nanoid(), casa: 'BET365', mercado: '', odd: '', stake: '', comissao: '', isPromo: true, isFreebet: false, isLay: false, showCommission: false, showBoost: false, percentualBoost: '', valorReembolso: '', taxaExtracao: '', oddFinal: '', lucro: '', retorno: '' },
    { id: nanoid(), casa: 'BETANO', mercado: '', odd: '', stake: '', comissao: '', isPromo: false, isFreebet: false, isLay: false, showCommission: false, showBoost: false, percentualBoost: '', valorReembolso: '', taxaExtracao: '', oddFinal: '', lucro: '', retorno: '' },
  ]);

  // --- 1. CARGA DE DADOS ---
  useEffect(() => {
    if (faseParaEditar && faseParaEditar.entradas) {
      setEntradas(faseParaEditar.entradas.map((e: any) => ({
        id: nanoid(), ...e,
        stake: String(e.stake || ''), odd: String(e.odd || ''), percentualBoost: String(e.percentualBoost || ''),
        comissao: String(e.comissao || ''), valorReembolso: String(e.valorReembolso || ''), taxaExtracao: String(e.taxaExtracao || ''),
        isLay: !!e.isLay, isPromo: !!e.isPromo, isFreebet: !!e.isFreebet, showBoost: !!e.showBoost, showCommission: !!e.showCommission
      })));
    } else if (!faseParaEditar) {
       // Reset
       setEntradas([
        { id: nanoid(), casa: 'BET365', mercado: '', odd: '', stake: '', comissao: '', isPromo: true, isFreebet: false, isLay: false, showCommission: false, showBoost: false, percentualBoost: '', valorReembolso: '', taxaExtracao: '', oddFinal: '', lucro: '', retorno: '' },
        { id: nanoid(), casa: 'BETANO', mercado: '', odd: '', stake: '', comissao: '', isPromo: false, isFreebet: false, isLay: false, showCommission: false, showBoost: false, percentualBoost: '', valorReembolso: '', taxaExtracao: '', oddFinal: '', lucro: '', retorno: '' }
       ]);
    }
  }, [faseParaEditar]);

  // --- 2. MOTOR DE CÁLCULO ---
  useEffect(() => {
    const mestre = entradas[0];
    if (!mestre || !mestre.stake || clean(mestre.stake) <= 0) return;

    let houveMudanca = false;
    const entradasCalc = entradas.map(item => {
        const oddBase = clean(item.odd);
        const comissao = clean(item.comissao) / 100;
        const boost = clean(item.percentualBoost) / 100;
        let oddFinal = oddBase;
        let oddParaCalculo = oddBase;

        if (boost > 0) oddFinal = oddBase + ((oddBase - 1) * boost);

        if (item.isFreebet) {
            oddParaCalculo = oddFinal - 1; 
        } else if (item.isLay) {
             if (oddBase > 0) oddParaCalculo = oddBase - comissao; 
        } else {
             oddParaCalculo = 1 + ((oddFinal - 1) * (1 - comissao));
        }
        return { ...item, oddFinal, oddParaCalculo };
    });

    const mestreCalc = entradasCalc[0];
    
    if (mestreCalc.oddParaCalculo > 0) {
        let retornoAlvo = clean(mestreCalc.stake) * mestreCalc.oddParaCalculo;
        
        if (estrategiaOperacao === 'rainbow' && mestreCalc.isPromo) {
            const reembolso = clean(mestreCalc.valorReembolso);
            const taxa = clean(mestreCalc.taxaExtracao) / 100;
            const bonus = reembolso * (taxa > 0 ? taxa : 0);
            retornoAlvo = retornoAlvo - bonus;
        }

        const novasEntradas = entradasCalc.map((item, index) => {
            if (index === 0) return item; 
            if (item.oddParaCalculo > 0) {
                const novaStake = retornoAlvo / item.oddParaCalculo;
                const stakeAtual = clean(item.stake);
                if (Math.abs(novaStake - stakeAtual) > 0.02) {
                    houveMudanca = true;
                    return { ...item, stake: novaStake.toFixed(2), oddFinal: item.oddFinal > 0 ? item.oddFinal.toFixed(2) : '' };
                }
            }
            return item;
        });

        if (houveMudanca) {
            setEntradas(prev => prev.map((old, idx) => ({
                ...old, stake: novasEntradas[idx].stake, oddFinal: novasEntradas[idx].oddFinal ? String(novasEntradas[idx].oddFinal) : ''
            })));
        }
    }
  }, [entradas.map(e => e.stake + e.odd + e.percentualBoost + e.comissao + e.isPromo + e.isFreebet).join(','), estrategiaOperacao]);

  const handleUpdate = (index: number, field: keyof EntradaState, value: any) => {
    let temp = entradas.map((e, i) => i === index ? { ...e, [field]: value } : e);
    
    if (field === 'isPromo' && value === true) temp = temp.map((e, i) => ({ ...e, isPromo: i === index }));
    if (field === 'isFreebet' && value === true) {
        temp = temp.map((e, i) => ({ ...e, isFreebet: i === index })); 
        temp[index].isLay = false;
        temp[index].isPromo = false; 
    }
    if (field === 'isLay' && value === true) temp[index].isFreebet = false;

    if (field === 'showCommission' && value === false) temp[index].comissao = '';
    if (field === 'showBoost' && value === false) temp[index].percentualBoost = '';
    
    setEntradas(temp);
  };

  const handleAdd = () => setEntradas([...entradas, { id: nanoid(), casa: '', mercado: '', odd: '', stake: '', comissao: '', isPromo: false, isFreebet: false, isLay: false, showCommission: false, showBoost: false, percentualBoost: '', valorReembolso: '', taxaExtracao: '', oddFinal: '', lucro: '', retorno: '' }]);
  const handleRemove = (index: number) => setEntradas(entradas.filter((_, i) => i !== index));

  if (!isOpen) return null;

  // --- CÁLCULOS FINAIS VISUAIS ---
  const entradasRender = entradas.map(item => {
      const oddBase = clean(item.odd);
      let oddFinal = oddBase;
      let oddParaCalculo = oddBase;
      const comissao = clean(item.comissao) / 100;
      const boost = clean(item.percentualBoost) / 100;
      let investimento = clean(item.stake); 

      if (item.isFreebet) {
          investimento = 0; 
          if (boost > 0) oddFinal = oddBase + ((oddBase - 1) * boost);
          oddParaCalculo = oddFinal - 1; 
      } 
      else if (item.isLay) { 
          if (oddBase > 0) { 
              oddParaCalculo = oddBase - comissao; 
              investimento = clean(item.stake) * (oddBase - 1); 
          } 
      } 
      else { 
          if (boost > 0) oddFinal = oddBase + ((oddBase - 1) * boost); 
          oddParaCalculo = 1 + ((oddFinal - 1) * (1 - comissao)); 
      }
      
      return { ...item, oddFinalDisplay: oddFinal > 0 ? oddFinal.toFixed(2) : '-', oddParaCalculo, investimento, cleanStake: clean(item.stake) };
  });
  
  const totalInv = entradasRender.reduce((acc, cur) => acc + cur.investimento, 0); 
  const valorFreebetTotal = entradasRender.filter(e => e.isFreebet).reduce((acc, cur) => acc + cur.cleanStake, 0);
  const primeiraPerna = entradasRender.find(e => e.cleanStake > 0 && e.oddParaCalculo > 0);
  const totalRetornoGlobal = primeiraPerna ? primeiraPerna.cleanStake * primeiraPerna.oddParaCalculo : 0;
  const totalLucro = totalRetornoGlobal - totalInv;
  
  let roiPerc = 0;
  let labelROI = "ROI";
  
  if (valorFreebetTotal > 0) {
      roiPerc = (totalLucro / valorFreebetTotal) * 100; 
      labelROI = "Extração";
  } else if (totalInv > 0) {
      roiPerc = (totalLucro / totalInv) * 100;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-[#020202] w-full max-w-6xl rounded-[40px] shadow-[0_0_100px_rgba(0,0,0,0.8)] border-2 border-zinc-900 flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-300 relative overflow-hidden">
        
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-5 md:p-8 border-b border-zinc-900 bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-20">
          <div className="flex items-center gap-3 md:gap-5">
            <div className="p-3 md:p-4 bg-red-500/10 rounded-2xl border border-red-500/20"><Calculator className="w-6 h-6 md:w-8 md:h-8 text-red-500" /></div>
            <div><h2 className="text-lg md:text-2xl font-black text-white tracking-tight uppercase">Protocolo de Execução</h2><p className="text-[8px] md:text-[10px] text-red-500 font-black uppercase tracking-[0.2em] mt-1">Estratégia do Professor: {estrategiaOperacao}</p></div>
          </div>
          <button onClick={onClose} className="p-2 md:p-3 bg-zinc-900 hover:bg-zinc-800 rounded-xl text-zinc-500 hover:text-white transition-all border border-zinc-800"><X className="w-5 h-5 md:w-6 md:h-6" /></button>
        </div>

        {/* BODY */}
        <div className="p-5 md:p-8 overflow-y-auto flex-1 custom-scrollbar bg-black/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {entradas.map((entrada, index) => (
                <CardEntrada key={entrada.id} entrada={entrada} index={index} onUpdate={handleUpdate} onRemove={handleRemove} estrategiaOperacao={estrategiaOperacao} />
            ))}
          </div>
          
          <div className="mt-10 flex justify-center">
            <button onClick={handleAdd} className="px-10 py-5 rounded-[24px] border-2 border-dashed border-zinc-800 text-zinc-500 hover:text-red-500 hover:border-red-500/50 hover:bg-red-500/5 transition-all flex items-center gap-3 font-black text-xs uppercase tracking-widest group w-full md:w-auto">
                <PlusCircle className="w-5 h-5 group-hover:scale-125 transition-transform" /> Adicionar Unidade Estratégica
            </button>
          </div>

          {/* TABELA DE RESULTADOS */}
          <div className="mt-12 bg-[#0E0E10] p-8 rounded-[32px] border-2 border-zinc-900 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-[50px] rounded-full" />
            
            <div className="flex items-center justify-between mb-8 relative z-10">
              <h3 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3"><span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" /> Projeção de Resultados</h3>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-lg bg-black text-red-500 border border-red-500/20">{estrategiaOperacao} analysis</span>
            </div>
            
            <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 rounded-2xl border border-zinc-800 bg-black/40 relative z-10">
                <table className="w-full text-left text-zinc-400 min-w-[600px] md:min-w-0">
                    <thead className="bg-zinc-900/50 border-b border-zinc-800">
                        <tr>
                            <th className="px-8 py-6 text-[12px] font-black text-red-500 uppercase tracking-widest">Cenário / Unidade</th>
                            <th className="px-8 py-6 text-[12px] font-black text-red-500 uppercase tracking-widest text-center">Odd Final</th>
                            <th className="px-8 py-6 text-[12px] font-black text-red-500 uppercase tracking-widest text-right">Alocação</th>
                            {entradas.some(e => e.isLay) && <th className="px-8 py-6 text-[12px] font-black text-red-500 uppercase tracking-widest text-right">Risco</th>}
                            <th className="px-8 py-6 text-[12px] font-black text-red-500 uppercase tracking-widest text-right">Retorno Bruto</th>
                            <th className="px-8 py-6 text-[12px] font-black text-red-500 uppercase tracking-widest text-right">Saldo Líquido</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-900">
                        {entradasRender.map((item, index) => {
                            const lucroVal = totalLucro;
                            const lucroClass = lucroVal >= 0 ? 'text-green-500' : 'text-red-500';
                            
                            return (
                                <tr key={index} className="hover:bg-red-500/[0.02] transition-colors">
                                    <td className="px-8 py-6 font-black text-white uppercase tracking-tight text-base">
                                        <div className="flex items-center gap-4">
                                          {item.casa || `Unidade ${index + 1}`}
                                          {item.isLay && <span className="text-[10px] px-2 py-1 rounded bg-red-500 text-white font-black tracking-widest">SEC</span>}
                                          {item.isFreebet && <span className="text-[10px] px-2 py-1 rounded bg-red-500 text-white font-black tracking-widest">BONUS</span>}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-center text-zinc-500 font-black font-mono text-lg">{item.oddFinalDisplay}</td>
                                    <td className="px-8 py-6 text-right font-black font-mono text-zinc-300 text-lg">R$ {item.cleanStake.toFixed(2)}</td>
                                    {entradas.some(e => e.isLay) && <td className="px-8 py-6 text-right font-black font-mono text-sm text-red-500/80">R$ {(item.investimento || 0).toFixed(2)}</td>}
                                    <td className="px-8 py-6 text-right font-black font-mono text-zinc-300 text-lg">R$ {item.oddParaCalculo > 0 ? (item.cleanStake * item.oddParaCalculo).toFixed(2) : '0.00'}</td>
                                    <td className={`px-8 py-6 text-right font-black font-mono text-2xl ${lucroClass}`}>{totalLucro >= 0 ? '+' : ''}R$ {totalLucro.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="bg-zinc-900/30 border-t-2 border-zinc-800">
                        <tr>
                            <td colSpan={2} className="px-6 py-6 text-[10px] font-black text-zinc-600 uppercase tracking-[0.3em]">Balanço do Plano</td>
                            
                            <td className="px-6 py-6 text-right">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Aporte Total</span>
                                    <span className={`text-xl font-black font-mono tracking-tighter ${valorFreebetTotal > 0 ? 'text-red-500' : 'text-white'}`}>
                                        R$ {valorFreebetTotal > 0 ? valorFreebetTotal.toFixed(2) : totalInv.toFixed(2)}
                                    </span>
                                </div>
                            </td>

                            {entradas.some(e => e.isLay) && <td></td>}
                            
                            <td className="px-6 py-6 text-right"><div className="flex flex-col items-end"><span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Previsão Bruta</span><span className="text-xl font-black font-mono text-white tracking-tighter">R$ {totalRetornoGlobal.toFixed(2)}</span></div></td>
                            
                            <td className="px-6 py-6 text-right">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-1">Lucro Consolidado</span>
                                    <div className={`text-3xl font-black font-mono tracking-tighter ${totalLucro >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                        R$ {totalLucro.toFixed(2)}
                                    </div>
                                    <div className={`text-[10px] mt-2 px-3 py-1 rounded-full font-black uppercase tracking-widest ${totalLucro >= 0 ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                        {labelROI}: {roiPerc.toFixed(2)}%
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-12 pt-8 border-t border-zinc-900 relative z-10">
            <button onClick={onClose} className="px-8 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 hover:text-white bg-zinc-900/50 hover:bg-zinc-800 rounded-2xl transition-all border border-zinc-800">Cancelar</button>
            <button onClick={() => onSave(entradas)} className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-red-600 hover:bg-white hover:text-black rounded-2xl shadow-[0_10px_30px_rgba(220,38,38,0.2)] transition-all transform active:scale-95 flex items-center gap-3">
                <Check size={18} /> Validar Plano
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddFaseModal;
