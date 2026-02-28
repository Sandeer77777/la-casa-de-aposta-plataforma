import React, { useState, useEffect } from 'react';
import { X, Calculator, Trash2, Zap, TrendingUp, Percent, ArrowRightLeft, Shield, Rocket, PlusCircle, Check, Gift } from 'lucide-react';
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
  isPromo: boolean;
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
  onSave: (entradas: any[], resumo: { lucro: number; investido: number; retorno: number }) => void;
  faseIndex?: number;
  estrategiaOperacao: string;
  faseParaEditar?: any;
}

// --- HELPER ---
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
    const inputClass = "w-full bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:ring-1 focus:ring-cyan-500 outline-none placeholder-slate-600 transition-all";
    const labelClass = "text-xs font-bold text-slate-400 uppercase mb-1.5 block tracking-wide";
    const isModeFreebet = estrategiaOperacao === 'freebet' || estrategiaOperacao === 'extracao';
    
    return (
      <div className={`p-4 space-y-4 bg-slate-900 rounded-xl border ${entrada.isPromo ? 'border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'border-slate-800'} relative group shadow-lg transition-all`}>
        
        {index > 0 && (
            <button 
                type="button" 
                onClick={() => onRemove(index)} 
                className="absolute top-0 right-0 h-8 w-8 flex items-center justify-center rounded-bl-xl rounded-tr-xl bg-slate-800 border-l border-b border-slate-700 text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all z-10"
                title="Excluir Casa"
            >
                <Trash2 size={16} />
            </button>
        )}
        
        {/* Linha 1: Casa e Mercado */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className={labelClass}>Casa</label>
                <select 
                    value={entrada.casa} 
                    onChange={e => onUpdate(index, 'casa', e.target.value)} 
                    className={inputClass}
                >
                    <option value="">Selecione...</option>
                    <option value="BET365">BET365</option>
                    <option value="BETANO">BETANO</option>
                    <option value="BETBRA">BETBRA</option>
                    <option value="PINNACLE">PINNACLE</option>
                    <option value="FAIRCHANGE">FAIRCHANGE</option>
                    <option value="BETFAIR">BETFAIR</option>
                    <option value="JOGO DE OURO">JOGO DE OURO</option>
                    <option value="SUPERBET">SUPERBET</option>
                    <option value="KTO">KTO</option>
                    <option value="ESTRELABET">ESTRELABET</option>
                </select>
            </div>
            <div>
                <label className={labelClass}>Mercado</label>
                <input 
                    type="text" 
                    value={entrada.mercado} 
                    onChange={e => onUpdate(index, 'mercado', e.target.value)} 
                    className={inputClass} 
                    placeholder="Ex: Over 2.5" 
                />
            </div>
        </div>

        {/* Linha 2: Stake e Odd */}
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className={labelClass}>Stake {entrada.isPromo && isModeFreebet && "(Freebet)"}</label>
                <input 
                    type="text" 
                    value={entrada.stake} 
                    onChange={e => onUpdate(index, 'stake', e.target.value)} 
                    className={`${inputClass} font-mono font-medium ${entrada.isPromo && isModeFreebet ? 'text-emerald-400 border-emerald-500/30' : ''}`} 
                    placeholder="100.00" 
                />
            </div>
            <div>
                <label className={labelClass}>Odd</label>
                <input 
                    type="text" 
                    value={entrada.odd} 
                    onChange={e => onUpdate(index, 'odd', e.target.value)} 
                    className={`${inputClass} font-mono font-medium ${entrada.isLay ? 'border-red-500/50 text-red-100 focus:ring-red-500' : ''}`} 
                    placeholder="2.00" 
                />
            </div>
        </div>
        
        {/* Toolbar de Ações */}
        <div className="flex items-center gap-2 pt-1">
            {/* Lógica do Botão Dourado Freebet */}
            {isModeFreebet ? (
                <button 
                    type="button" 
                    onClick={() => onUpdate(index, 'isPromo', !entrada.isPromo)}
                    className={`flex-1 py-2 flex items-center justify-center border transition-all rounded-lg text-xs font-bold uppercase tracking-wider ${
                        entrada.isPromo 
                            ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.3)]' 
                            : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                >
                    <Gift size={14} className="mr-1.5" /> FreeBet
                </button>
            ) : (
                <button 
                    type="button" 
                    onClick={() => onUpdate(index, 'showBoost', !entrada.showBoost)}
                    className={`flex-1 py-2 flex items-center justify-center border transition-all rounded-lg text-xs font-bold uppercase tracking-wider ${
                        entrada.showBoost ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                    }`}
                >
                    <Rocket size={14} className="mr-1.5" /> Aumento
                </button>
            )}

            <button 
                type="button" 
                onClick={() => onUpdate(index, 'showCommission', !entrada.showCommission)}
                className={`flex-1 py-2 flex items-center justify-center border transition-all rounded-lg text-xs font-bold uppercase tracking-wider ${entrada.showCommission ? 'bg-blue-500/20 text-blue-300 border-blue-500/50' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
            >
                <Percent size={14} className="mr-1.5" /> Comissão
            </button>
            <button 
                type="button" 
                onClick={() => onUpdate(index, 'isLay', !entrada.isLay)}
                className={`flex-1 py-2 flex items-center justify-center border transition-all rounded-lg text-xs font-bold uppercase tracking-wider ${entrada.isLay ? 'bg-red-500/20 text-red-300 border-red-500/50' : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'}`}
            >
                <ArrowRightLeft size={14} className="mr-1.5" /> Lay
            </button>
        </div>

        {/* Seções Condicionais */}
        {(estrategiaOperacao === 'rainbow' && entrada.isPromo) && (
            <div className="grid grid-cols-2 gap-3 p-3 bg-yellow-500/5 rounded-lg border border-yellow-500/20 mt-3 animate-in fade-in slide-in-from-top-2">
                 <div>
                    <label className="text-[10px] text-yellow-500 font-bold uppercase mb-1 flex items-center gap-1">
                        <Zap size={12} /> Reembolso (R$)
                    </label>
                    <input type="text" value={entrada.valorReembolso} onChange={e => onUpdate(index, 'valorReembolso', e.target.value)} className="w-full bg-slate-950 border border-yellow-500/30 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-yellow-500" placeholder="100.00" />
                 </div>
                 <div>
                    <label className="text-[10px] text-yellow-500 font-bold uppercase mb-1">Taxa (%)</label>
                    <input type="text" value={entrada.taxaExtracao} onChange={e => onUpdate(index, 'taxaExtracao', e.target.value)} className="w-full bg-slate-950 border border-yellow-500/30 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-yellow-500" placeholder="70" />
                </div>
            </div>
        )}

        {entrada.showCommission && (
            <div className="pt-3 border-t border-slate-800/50 mt-3 animate-in fade-in">
                <label className="text-[10px] text-blue-400 font-bold uppercase mb-1">Comissão (%)</label>
                <input type="text" value={entrada.comissao} onChange={e => onUpdate(index, 'comissao', e.target.value)} className="w-full bg-slate-950 border border-blue-500/30 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-blue-500" placeholder="6.5" />
            </div>
        )}

        {entrada.showBoost && !isModeFreebet && (
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800/50 mt-3 animate-in fade-in">
                <div>
                    <label className="text-[10px] text-purple-400 font-bold uppercase mb-1">Aumento (%)</label>
                    <input type="text" value={entrada.percentualBoost} onChange={e => onUpdate(index, 'percentualBoost', e.target.value)} className="w-full bg-slate-950 border border-purple-500/30 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-purple-500" placeholder="25" />
                </div>
                <div>
                    <label className="text-[10px] text-slate-500 font-bold uppercase mb-1">Odd Final</label>
                    <div className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-xs text-slate-300 font-mono">
                        {entrada.oddFinal || '-'}
                    </div>
                </div>
            </div>
        )}
      </div>
    );
};

// --- COMPONENTE PRINCIPAL ---
export const AddFaseModal: React.FC<AddFaseModalProps> = ({ 
  isOpen = true, onClose, onSave, faseIndex, estrategiaOperacao, faseParaEditar 
}) => {
  const [entradas, setEntradas] = useState<EntradaState[]>([
    { id: nanoid(), casa: 'BET365', mercado: '', odd: '', stake: '', comissao: '', isPromo: true, isLay: false, showCommission: false, showBoost: false, percentualBoost: '', valorReembolso: '', taxaExtracao: '', oddFinal: '', lucro: '', retorno: '' },
    { id: nanoid(), casa: 'BETANO', mercado: '', odd: '', stake: '', comissao: '', isPromo: false, isLay: false, showCommission: false, showBoost: false, percentualBoost: '', valorReembolso: '', taxaExtracao: '', oddFinal: '', lucro: '', retorno: '' },
  ]);

  // --- 1. CARGA DE DADOS ---
  useEffect(() => {
    if (faseParaEditar && (faseParaEditar.entradas || faseParaEditar.fases)) {
      const listaEntradas = faseParaEditar.entradas || [];
      if(listaEntradas.length > 0) {
        const dados = listaEntradas.map((e: any) => ({
            id: nanoid(),
            ...e,
            stake: e.stake ? String(e.stake) : '',
            odd: e.odd ? String(e.odd) : '',
            percentualBoost: e.percentualBoost ? String(e.percentualBoost) : '',
            comissao: e.comissao ? String(e.comissao) : '',
            valorReembolso: e.valorReembolso ? String(e.valorReembolso) : '',
            taxaExtracao: e.taxaExtracao ? String(e.taxaExtracao) : '',
            isLay: !!e.isLay, isPromo: !!e.isPromo,
            showBoost: !!e.showBoost, showCommission: !!e.showCommission
        }));
        setEntradas(dados);
      }
    } else if (!faseParaEditar) {
       setEntradas([
        { id: nanoid(), casa: 'BET365', mercado: '', odd: '', stake: '', comissao: '', isPromo: true, isLay: false, showCommission: false, showBoost: false, percentualBoost: '', valorReembolso: '', taxaExtracao: '', oddFinal: '', lucro: '', retorno: '' },
        { id: nanoid(), casa: 'BETANO', mercado: '', odd: '', stake: '', comissao: '', isPromo: false, isLay: false, showCommission: false, showBoost: false, percentualBoost: '', valorReembolso: '', taxaExtracao: '', oddFinal: '', lucro: '', retorno: '' }
       ]);
    }
  }, [faseParaEditar]);

  // --- 2. MOTOR DE CÁLCULO ---
  useEffect(() => {
    const mestre = entradas[0];
    if (!mestre || !mestre.stake || clean(mestre.stake) <= 0) return;

    const isFreebetMode = estrategiaOperacao === 'freebet' || estrategiaOperacao === 'extracao';
    let houveMudanca = false;

    // Passo 1: Calcular Odds Efetivas
    const entradasCalc = entradas.map(item => {
        const oddBase = clean(item.odd);
        const comissao = clean(item.comissao) / 100;
        const boost = clean(item.percentualBoost) / 100;
        let oddFinal = oddBase;
        let oddParaCalculo = oddBase;

        if (item.isLay) {
             if (oddBase > 0) oddParaCalculo = oddBase - comissao; 
        } else {
             if (boost > 0) oddFinal = oddBase + ((oddBase - 1) * boost);
             
             // Lógica Freebet (SNR)
             if (isFreebetMode && item.isPromo) {
                 oddParaCalculo = (oddFinal - 1) * (1 - comissao); 
             } else {
                 oddParaCalculo = 1 + ((oddFinal - 1) * (1 - comissao));
             }
        }
        return { ...item, oddFinal, oddParaCalculo };
    });

    const mestreCalc = entradasCalc[0];
    
    // Passo 2: Calcular Retorno Alvo e Distribuir Stakes
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
  }, [entradas.map(e => e.stake).join(','), entradas.map(e => e.odd).join(','), entradas.map(e => e.percentualBoost).join(','), entradas.map(e => e.comissao).join(','), entradas.map(e => e.valorReembolso).join(','), entradas.map(e => e.taxaExtracao).join(','), estrategiaOperacao, entradas.map(e => e.isPromo).join(',')]);

  const handleUpdate = (index: number, field: keyof EntradaState, value: any) => {
    let temp = entradas.map((e, i) => i === index ? { ...e, [field]: value } : e);
    if (field === 'isPromo' && value === true) temp = temp.map((e, i) => ({ ...e, isPromo: i === index }));
    if (field === 'showCommission' && value === false) temp[index].comissao = '';
    if (field === 'showBoost' && value === false) temp[index].percentualBoost = '';
    if (field === 'isLay' && value === true) { temp[index].showBoost = false; temp[index].percentualBoost = ''; }
    setEntradas(temp);
  };

  const handleAdd = () => setEntradas([...entradas, { id: nanoid(), casa: '', mercado: '', odd: '', stake: '', comissao: '', isPromo: false, isLay: false, showCommission: false, showBoost: false, percentualBoost: '', valorReembolso: '', taxaExtracao: '', oddFinal: '', lucro: '', retorno: '' }]);
  const handleRemove = (index: number) => setEntradas(entradas.filter((_, i) => i !== index));

  if (!isOpen) return null;

  // --- 3. CÁLCULOS FINAIS VISUAIS PARA TABELA E SALVAMENTO ---
  // Esta variável é a fonte da verdade. O que aparece aqui é o que deve ser salvo.
  const entradasRender = entradas.map(item => {
      const oddBase = clean(item.odd);
      let oddFinal = oddBase;
      let oddParaCalculo = oddBase;
      const comissao = clean(item.comissao) / 100;
      const boost = clean(item.percentualBoost) / 100;
      let investimento = clean(item.stake);
      const isModeFreebet = estrategiaOperacao === 'freebet' || estrategiaOperacao === 'extracao';
      
      if (item.isLay) { 
          if (oddBase > 0) { 
              oddParaCalculo = oddBase - comissao; 
              investimento = clean(item.stake) * (oddBase - 1); 
            } 
        } else { 
            if (boost > 0) oddFinal = oddBase + ((oddBase - 1) * boost); 
            
            if (isModeFreebet && item.isPromo) {
                oddParaCalculo = (oddFinal - 1) * (1 - comissao);
            } else {
                oddParaCalculo = 1 + ((oddFinal - 1) * (1 - comissao)); 
            }
        }
      
      return { ...item, oddFinalDisplay: oddFinal > 0 ? oddFinal.toFixed(2) : '-', oddParaCalculo, investimento, cleanStake: clean(item.stake), comissaoVal: comissao };
  });
  
  const totalInv = entradasRender.reduce((acc, cur) => acc + cur.investimento, 0);
  const primeiraPerna = entradasRender.find(e => e.cleanStake > 0 && e.oddParaCalculo > 0);
  const totalRetornoGlobal = primeiraPerna ? primeiraPerna.cleanStake * primeiraPerna.oddParaCalculo : 0;
  // Lucro Global que aparece no rodapé
  const totalLucro = totalRetornoGlobal - totalInv;

  // --- 4. FUNÇÃO DE SALVAMENTO CORRIGIDA (O PULO DO GATO) ---
  const handleSalvarComCalculos = () => {
    // Em vez de salvar 'entradas' (que podem não ter o lucro calculado ainda no state),
    // salvamos o resultado de 'entradasRender', que é EXATAMENTE o que o usuário vê na tela.
    
    const dadosParaSalvar = entradasRender.map(item => {
        // Calcula o lucro individual deste cenário:
        // Se essa aposta bater, eu ganho o Retorno Dela - O Investimento Total que fiz em todas
        const lucroCenario = (item.cleanStake * item.oddParaCalculo) - totalInv;
        
        return {
            ...item,
            // Forçamos o valor calculado para dentro do objeto que vai pro banco
            lucro: lucroCenario.toFixed(2),
            retorno: (item.cleanStake * item.oddParaCalculo).toFixed(2),
            stake: item.cleanStake.toString(), // Garante formato string limpo
            investimento: item.investimento.toFixed(2) // Salva o custo real dessa perna
        };
    });

    const resumo = {
      lucro: totalLucro,
      investido: totalInv,
      retorno: totalRetornoGlobal,
    };

    // Envia os dados "mastigados" para o pai
    onSave(dadosParaSalvar, resumo);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-950 w-full max-w-6xl rounded-2xl shadow-2xl border border-slate-800 flex flex-col max-h-[95vh] animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <Calculator className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Editar Entradas</h2>
                <p className="text-sm text-slate-400 font-medium">Gerenciamento de {estrategiaOperacao.toUpperCase()}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"><X className="w-6 h-6" /></button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-slate-950">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {entradas.map((entrada, index) => (
                <CardEntrada 
                    key={entrada.id} 
                    entrada={entrada} 
                    index={index} 
                    onUpdate={handleUpdate} 
                    onRemove={handleRemove} 
                    estrategiaOperacao={estrategiaOperacao}
                />
            ))}
          </div>
          
          <div className="mt-6 flex justify-center">
            <button onClick={handleAdd} className="px-6 py-3 rounded-xl border border-dashed border-slate-700 text-slate-400 hover:text-cyan-400 hover:border-cyan-500 hover:bg-cyan-500/5 transition-all flex items-center gap-2 font-semibold group w-full md:w-auto">
                <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" /> Adicionar Nova Casa
            </button>
          </div>

          {/* TABELA DE RESULTADOS */}
          <div className="mt-8 bg-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><span className="text-cyan-500">●</span> Simulação de Resultados</h3>
              <span className="text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700">{estrategiaOperacao}</span>
            </div>
            
            <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
                <table className="w-full text-sm text-left text-slate-300">
                    <thead className="text-xs font-bold text-slate-400 uppercase bg-slate-800 border-b border-slate-700">
                        <tr>
                            <th className="px-4 py-3">Casa</th>
                            <th className="px-4 py-3 text-center">Odd Final</th>
                            <th className="px-4 py-3 text-right">Stake</th>
                            <th className="px-4 py-3 text-right">Retorno</th>
                            <th className="px-4 py-3 text-right">Lucro</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                        {entradasRender.map((item, index) => {
                            // Cálculo simplificado de lucro por linha para display
                            const lucroCenario = (item.cleanStake * item.oddParaCalculo) - totalInv;
                            const lucroClass = lucroCenario >= 0 ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold';
                            
                            return (
                                <tr key={index} className="hover:bg-slate-800/50 transition-colors">
                                    <td className="px-4 py-3 font-medium text-white flex items-center gap-2">
                                        {item.casa || `Casa ${index + 1}`}
                                        {item.isPromo && (estrategiaOperacao === 'freebet' || estrategiaOperacao === 'extracao') && <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">FREEBET</span>}
                                        {item.isLay && <span className="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20 font-bold">LAY</span>}
                                    </td>
                                    <td className="px-4 py-3 text-center text-slate-400 font-mono">{item.oddFinalDisplay}</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-200">R$ {item.cleanStake.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-right font-mono text-slate-300">R$ {(item.cleanStake * item.oddParaCalculo).toFixed(2)}</td>
                                    <td className={`px-4 py-3 text-right font-mono ${lucroClass}`}>{lucroCenario >= 0 ? '+' : ''}R$ {lucroCenario.toFixed(2)}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot className="bg-slate-950/80 border-t-2 border-slate-700">
                        <tr>
                            <td colSpan={2} className="px-4 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Totais</td>
                            <td className="px-4 py-4 text-right"><div className="flex flex-col items-end"><span className="text-[10px] text-slate-500 font-bold uppercase">Investido (Risco)</span><span className="text-lg font-bold text-slate-200">R$ {totalInv.toFixed(2)}</span></div></td>
                            <td className="px-4 py-4 text-right"><div className="flex flex-col items-end"><span className="text-[10px] text-slate-500 font-bold uppercase">Retorno Médio</span><span className="text-lg font-bold text-blue-400">R$ {totalRetornoGlobal.toFixed(2)}</span></div></td>
                            <td className="px-4 py-4 text-right"><div className="flex flex-col items-end"><span className="text-[10px] text-slate-500 font-bold uppercase">Resultado</span><div className={`text-xl font-black ${totalLucro >= 0 ? 'text-emerald-400' : 'text-red-500'}`}>R$ {totalLucro.toFixed(2)}</div></div></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-slate-800">
            <button onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors border border-slate-700">Cancelar</button>
            <button onClick={handleSalvarComCalculos} className="px-8 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-900/20 transition-all transform hover:scale-105 active:scale-95 flex items-center gap-2">
                <Check size={18} /> Salvar Alterações
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AddFaseModal;
