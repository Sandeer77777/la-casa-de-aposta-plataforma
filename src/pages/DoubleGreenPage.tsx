import React, { useState, useEffect } from 'react'
import { Activity, Shield, TrendingUp, Gauge, CheckCircle2 } from 'lucide-react'

export default function DoubleGreenPage() {
  const [lucroDGTotal, setLucroDGTotal] = useState<string>('')
  
  // States
  const [oddStep1, setOddStep1] = useState<string>('')
  const [stake1, setStake1] = useState<number>(0)
  const [step1Confirmed, setStep1Confirmed] = useState(false)

  const [oddStep2, setOddStep2] = useState<string>('')
  const [stake2, setStake2] = useState<number>(0)
  const [step2Confirmed, setStep2Confirmed] = useState(false)

  // Calculations
  const formatCurrency = (val: number) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
  const lucroValue = parseFloat(lucroDGTotal.replace(',', '.')) || 0
  const odd1Value = parseFloat(oddStep1.replace(',', '.')) || 0
  const odd2Value = parseFloat(oddStep2.replace(',', '.')) || 0

  const PERC_STEP1 = 0.35
  const PERC_STEP2 = 0.15

  useEffect(() => {
    if (lucroValue && odd1Value > 1) setStake1((lucroValue * PERC_STEP1) / odd1Value)
    else setStake1(0)
  }, [lucroValue, odd1Value])

  useEffect(() => {
    if (lucroValue && odd2Value > 1) setStake2((lucroValue * PERC_STEP2) / odd2Value)
    else setStake2(0)
  }, [lucroValue, odd2Value])

  return (
    <div className="max-w-[1920px] mx-auto px-4 md:px-8 pt-12 md:pt-16 pb-20 relative z-10">
      
      {/* Hero Section */}
      <div className="flex flex-col items-center text-center mb-12 md:mb-16">
        <div className="relative mb-6 md:mb-8">
          <div className="absolute -inset-4 bg-red-500/20 blur-2xl rounded-full animate-pulse" />
          <div className="relative w-20 h-20 md:w-28 md:h-28 bg-[#0A0A0A] border-2 border-red-500 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(239,68,68,0.2)] overflow-hidden">
            <img src="/logo-heist.jpg" alt="Logo" className="w-full h-full object-cover" />
            <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-red-500" />
            <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-red-500" />
          </div>
        </div>
        
        <h1 className="text-2xl md:text-5xl lg:text-7xl font-black tracking-tight text-white mb-4 md:mb-6 uppercase leading-none">
          Protocolo de <span className="text-red-500">Segurança</span>
        </h1>
        <p className="text-zinc-500 text-sm md:text-xl lg:text-2xl max-w-4xl font-medium tracking-wide leading-relaxed px-4">
          A estratégia de proteção máxima do Professor. Estruture seu lucro no objetivo principal, garantindo uma saída estratégica com o capital preservado.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-0 md:px-6 relative z-10">
        
        {/* === 1. FONTE DE LUCRO (Input Principal) === */}
        <div className="flex flex-col items-center mb-10 md:mb-20">
          <div className="relative p-6 md:p-12 bg-[#0A0A0A] border-2 border-red-500/20 rounded-[24px] md:rounded-[40px] shadow-[0_0_50px_rgba(239,68,68,0.1)] w-full max-w-3xl group hover:border-red-500/40 transition-all duration-500">
            {/* Cantoneiras Decorativas */}
            <div className="absolute -top-1 -left-1 w-8 h-8 md:w-12 md:h-12 border-t-4 border-l-4 border-red-500" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 md:w-12 md:h-12 border-b-4 border-r-4 border-red-500" />
            
            <div className="text-center">
              <label className="text-[10px] md:text-[13px] font-black tracking-[0.3em] text-red-500 uppercase mb-6 md:mb-10 block border-b border-red-500/10 pb-4 md:pb-6 mx-auto w-max">
                DEFINIÇÃO DE LUCRO ALVO
              </label>
              <div className="flex items-center justify-center gap-4 md:gap-8 my-6 md:my-10">
                <span className="text-2xl md:text-6xl text-zinc-700 font-black">R$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  value={lucroDGTotal}
                  onChange={(e) => setLucroDGTotal(e.target.value)}
                  placeholder="0.00"
                  className="bg-transparent text-4xl md:text-8xl lg:text-9xl font-black text-center text-white outline-none focus:text-red-500 transition-all w-full placeholder-zinc-900 tracking-tighter"
                />
              </div>
              
              {/* Box Explicativo Legível */}
              <div className="inline-block bg-zinc-900/50 border border-zinc-800 px-6 py-4 md:px-10 md:py-5 rounded-2xl w-full md:w-auto">
                <p className="text-zinc-400 text-[10px] md:text-base font-bold uppercase tracking-widest">
                  Determine o lucro líquido esperado no <strong className="text-white text-xs md:text-lg block md:inline">Objetivo Principal</strong>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* === 2. MÓDULOS DE OPERAÇÃO === */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-12 mb-12 md:mb-20">
          
          {/* MÓDULO 01 */}
          <div className={`
            relative bg-[#0E0E10] border-2 p-6 md:p-12 rounded-[24px] md:rounded-[40px] transition-all duration-500 flex flex-col justify-between shadow-2xl
            ${step1Confirmed 
              ? 'border-green-500/40 shadow-[0_0_30px_rgba(34,197,94,0.1)]' 
              : 'border-zinc-800 hover:border-red-500/40'}
          `}>
            <div>
              <div className="flex justify-between items-start mb-8 md:mb-12 border-b border-zinc-800 pb-6 md:pb-10">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className={`p-4 md:p-5 rounded-2xl ${step1Confirmed ? 'bg-green-500/20' : 'bg-red-500/10 border border-red-500/30'}`}>
                    <Activity className={`w-8 h-8 md:w-10 md:h-10 ${step1Confirmed ? 'text-green-500' : 'text-red-500'}`} />
                  </div>
                  <div>
                    <h3 className="text-[10px] md:text-sm font-black tracking-[0.2em] text-red-500 uppercase mb-1 md:mb-3">Fase Alpha</h3>
                    <p className="text-xl md:text-3xl font-black text-white uppercase tracking-tight">Primeiro Desvio</p>
                  </div>
                </div>
              </div>

              <div className="mb-8 md:mb-12 bg-black/40 border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <span className="text-[10px] md:text-[13px] font-black text-zinc-500 uppercase tracking-widest">Meta de Retorno (35%)</span>
                  <span className="text-xl md:text-3xl font-black text-white">{formatCurrency(lucroValue * PERC_STEP1)}</span>
              </div>

              <div className="mb-8 md:mb-12">
                <label className="block text-[10px] md:text-[13px] font-black text-zinc-500 uppercase tracking-widest mb-4 md:mb-5">
                  Odd da Unidade em Vantagem
                </label>
                <div className="bg-black border border-zinc-800 rounded-[20px] md:rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
                  <input 
                    type="number" 
                    inputMode="decimal"
                    value={oddStep1}
                    onChange={(e) => setOddStep1(e.target.value)}
                    disabled={step1Confirmed}
                    placeholder="0.00"
                    className="bg-transparent text-4xl md:text-6xl font-black text-white outline-none w-full md:w-40 text-center md:text-left focus:text-red-500 transition-colors tracking-tighter"
                  />
                  {stake1 > 0 && (
                     <div className="text-center md:text-right w-full md:w-auto border-t md:border-t-0 border-zinc-800 pt-4 md:pt-0">
                       <span className="block text-[10px] md:text-[12px] font-black text-red-500 uppercase mb-1 md:mb-2">Aporte Sugerido</span>
                       <span className="text-2xl md:text-4xl font-black text-white block leading-none tracking-tighter">{formatCurrency(stake1)}</span>
                     </div>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep1Confirmed(!step1Confirmed)}
              className={`w-full py-5 md:py-7 rounded-[20px] md:rounded-[24px] font-black text-[10px] md:text-sm tracking-[0.2em] uppercase transition-all duration-300 shadow-xl active:scale-95 ${
                step1Confirmed ? 'bg-green-600 text-white' : 'bg-white text-black hover:bg-red-600 hover:text-white'
              }`}
            >
              {step1Confirmed ? <span className="flex items-center justify-center gap-4"><CheckCircle2 className="w-5 h-5"/> Plano Consolidado</span> : 'Validar Entrada'}
            </button>
          </div>

          {/* MÓDULO 02 */}
          <div className={`
            relative bg-[#0E0E10] border-2 p-6 md:p-12 rounded-[24px] md:rounded-[40px] transition-all duration-500 flex flex-col justify-between shadow-2xl
            ${!step1Confirmed ? 'opacity-40 grayscale pointer-events-none' : 'hover:border-red-500/40'}
            ${step2Confirmed ? 'border-green-500/40 shadow-[0_0_30px_rgba(34,197,94,0.1)] opacity-100 grayscale-0' : 'border-zinc-800'}
          `}>
             <div>
               <div className="flex justify-between items-start mb-8 md:mb-12 border-b border-zinc-800 pb-6 md:pb-10">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className={`p-4 md:p-5 rounded-2xl ${step2Confirmed ? 'bg-green-500/20' : 'bg-red-500/10 border border-red-500/30'}`}>
                    <Shield className={`w-8 h-8 md:w-10 md:h-10 ${step2Confirmed ? 'text-green-500' : 'text-red-500'}`} />
                  </div>
                  <div>
                    <h3 className="text-[10px] md:text-sm font-black tracking-[0.2em] text-red-500 uppercase mb-1 md:mb-3">Fase Beta</h3>
                    <p className="text-xl md:text-3xl font-black text-white uppercase tracking-tight">Equilíbrio Ativo</p>
                  </div>
                </div>
              </div>

               <div className="mb-8 md:mb-12 bg-black/40 border border-zinc-800 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <span className="text-[10px] md:text-[13px] font-black text-zinc-500 uppercase tracking-widest">Meta de Segurança (15%)</span>
                  <span className="text-xl md:text-3xl font-black text-white">{formatCurrency(lucroValue * PERC_STEP2)}</span>
              </div>

              <div className="mb-8 md:mb-12">
                <label className="block text-[10px] md:text-[13px] font-black text-zinc-500 uppercase tracking-widest mb-4 md:mb-5">
                  Odd Atual do Cenário de Segurança
                </label>
                 <div className="bg-black border border-zinc-800 rounded-[20px] md:rounded-[24px] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4">
                  <input 
                    type="number" 
                    inputMode="decimal"
                    value={oddStep2}
                    onChange={(e) => setOddStep2(e.target.value)}
                    disabled={step2Confirmed}
                    placeholder="0.00"
                    className="bg-transparent text-4xl md:text-6xl font-black text-white outline-none w-full md:w-40 text-center md:text-left focus:text-red-500 transition-colors tracking-tighter"
                  />
                   {stake2 > 0 && (
                     <div className="text-center md:text-right w-full md:w-auto border-t md:border-t-0 border-zinc-800 pt-4 md:pt-0">
                       <span className="block text-[10px] md:text-[12px] font-black text-red-500 uppercase mb-1 md:mb-2">Aporte Sugerido</span>
                       <span className="text-2xl md:text-4xl font-black text-white block leading-none tracking-tighter">{formatCurrency(stake2)}</span>
                     </div>
                  )}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setStep2Confirmed(!step2Confirmed)}
              className={`w-full py-5 md:py-7 rounded-[20px] md:rounded-[24px] font-black text-[10px] md:text-sm tracking-[0.2em] uppercase transition-all duration-300 shadow-xl active:scale-95 ${
                step2Confirmed ? 'bg-green-600 text-white' : 'bg-zinc-900 text-white border border-zinc-800 hover:bg-red-600'
              }`}
            >
              {step2Confirmed ? <span className="flex items-center justify-center gap-4"><CheckCircle2 className="w-5 h-5"/> Plano Consolidado</span> : 'Validar Entrada'}
            </button>
          </div>

        </div>

        {/* PAINEL DE RESULTADOS */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-10 border-t-2 border-zinc-900 pt-12 md:pt-20">
          <div className="bg-[#0A0A0A] border-2 border-zinc-800 p-6 md:p-10 rounded-[24px] md:rounded-[40px] flex flex-col md:flex-row items-center justify-between group hover:border-red-500/20 transition-all text-center md:text-left gap-6">
            <div className="flex items-center gap-4 md:gap-8">
               <div className="p-4 md:p-6 bg-zinc-900 rounded-3xl text-zinc-600 group-hover:text-red-500 transition-colors">
                  <TrendingUp className="w-8 h-8 md:w-12 md:h-12" />
               </div>
               <div>
                  <h4 className="text-[10px] md:text-[13px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-1 md:mb-2">Cenário: Alvo Atingido</h4>
                  <p className="text-[10px] md:text-sm text-zinc-700 font-bold uppercase tracking-widest">Total Recuperado</p>
               </div>
            </div>
            <div className="text-3xl md:text-5xl font-black text-white tracking-tighter">
              {formatCurrency((lucroValue * (oddStep1 ? PERC_STEP1 : 0)) + (lucroValue * (oddStep2 ? PERC_STEP2 : 0)))}
            </div>
          </div>

           <div className="bg-[#0A0A0A] border-2 border-zinc-800 p-6 md:p-10 rounded-[24px] md:rounded-[40px] flex flex-col md:flex-row items-center justify-between group hover:border-red-500/20 transition-all text-center md:text-left gap-6">
            <div className="flex items-center gap-4 md:gap-8">
               <div className="p-4 md:p-6 bg-zinc-900 rounded-3xl text-zinc-600 group-hover:text-red-500 transition-colors">
                  <Gauge className="w-8 h-8 md:w-12 md:h-12" />
               </div>
               <div>
                  <h4 className="text-[10px] md:text-[13px] font-black text-red-500 uppercase tracking-[0.2em] mb-1 md:mb-2">Cenário: Equilíbrio</h4>
                  <p className="text-[10px] md:text-sm text-zinc-700 font-bold uppercase tracking-widest">Lucro Consolidado</p>
               </div>
            </div>
            <div className="text-4xl md:text-6xl font-black text-red-500 tracking-tighter">
              {formatCurrency(lucroValue - ((oddStep1 ? stake1 : 0) + (oddStep2 ? stake2 : 0)))}
            </div>
          </div>
        </div>
        
        <div className="h-20"></div>

      </div>
    </div>
  )
}
