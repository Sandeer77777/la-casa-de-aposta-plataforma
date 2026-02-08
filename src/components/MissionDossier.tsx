import React, { useState } from 'react';
import { BookOpen, X, ShieldAlert, Target, Crosshair } from 'lucide-react';

interface MissionDossierProps {
  type: 'arbipro' | 'freepro' | 'dutching';
}

export const MissionDossier: React.FC<MissionDossierProps> = ({ type }) => {
  const [isOpen, setIsOpen] = useState(false);

  const content = {
    arbipro: {
      title: "Protocolo de Arbitragem",
      sections: [
        {
          title: "Aumento de Potencial (Odds Boost)",
          icon: <Target className="w-5 h-5 text-red-500" />,
          text: "Operativo, atenção. Se a casa oferecer um aumento de cotação (Boost), insira-o no campo 'Aumento de Odd'. Isso distorce a matemática a nosso favor. Exemplo: Uma odd de 2.50 com 25% de aumento vira 2.88 na prática. Use isso para sangrar o sistema."
        },
        {
          title: "Modo Lay (Contra-Ataque)",
          icon: <ShieldAlert className="w-5 h-5 text-red-500" />,
          text: "Ao operar contra a casa (Exchange), ative o modo 'LAY'. O sistema calculará automaticamente a responsabilidade (o quanto você precisa ter em caixa) para cobrir a aposta. A comissão média é de 2.8% a 6.5%. Não esqueça de configurar isso."
        },
        {
          title: "Operação Duplo Green",
          icon: <Crosshair className="w-5 h-5 text-red-500" />,
          text: "Para tentar lucrar em dois cenários simultaneamente, configure 3 casas. Simule: Casa 1 (Time A), Casa 2 (Empate/Exchange), Casa 3 (Time B). O objetivo é cercar todas as saídas."
        }
      ]
    },
    freepro: {
      title: "Protocolo de Conversão",
      sections: [
        {
          title: "Extração de Bônus (Freebet)",
          icon: <Target className="w-5 h-5 text-red-500" />,
          text: "O objetivo aqui é perder na casa que deu o bônus para ganhar na cobertura (Exchange). Configure a 'Taxa de Extração' para 70% (padrão ouro). Se o cenário bater na Exchange, o lucro é limpo. Se bater na casa do bônus, você converteu o papel em saldo real."
        },
        {
          title: "Seguro Cashback",
          icon: <ShieldAlert className="w-5 h-5 text-red-500" />,
          text: "Use este módulo para promoções do tipo 'Se perder, devolvemos X%'. Configure o valor da aposta e a taxa de devolução. O sistema dirá exatamente quanto apostar na cobertura para garantir lucro mesmo se você perder a aposta principal."
        }
      ]
    },
    dutching: {
      title: "Protocolo de Divisão",
      sections: [
        {
          title: "Cobertura Total",
          icon: <Crosshair className="w-5 h-5 text-red-500" />,
          text: "Ideal para quando não podemos usar Exchange. Dividimos o valor do bônus (Freebet) entre várias opções (ex: Casa A, Casa B, Casa C). O sistema garante que, independente de quem ganhe, o retorno cubra o investimento e gere lucro."
        },
        {
          title: "Eficiência Tática",
          icon: <Target className="w-5 h-5 text-red-500" />,
          text: "Observe o indicador de eficiência nos cards. Buscamos sempre acima de 70%. Se estiver abaixo, aborte a missão ou procure odds melhores."
        }
      ]
    }
  };

  const data = content[type];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[9999] group flex items-center gap-3 px-5 py-4 md:px-7 md:py-5 bg-[#0A0A0A] border-2 border-red-500/50 hover:border-red-500 rounded-full shadow-[0_0_50px_rgba(220,38,38,0.4)] transition-all hover:scale-105 active:scale-95"
      >
        <div className="relative">
          <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full animate-ping" />
          <div className="absolute -top-1 -right-1 w-2 h-2 md:w-3 md:h-3 bg-red-600 rounded-full" />
          <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-red-500 group-hover:text-white transition-colors" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.2em] text-white hidden sm:block">
            Dossiê Tático
          </span>
          <span className="text-[7px] md:text-[8px] font-bold uppercase tracking-[0.1em] text-red-500 group-hover:text-white hidden sm:block">
            Abrir Instruções
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#0E0E10] border-2 border-zinc-800 rounded-[32px] overflow-hidden shadow-2xl relative">
            
            {/* Header */}
            <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-black/40">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-500/10 rounded-xl">
                    <BookOpen className="w-6 h-6 text-red-500" />
                </div>
                <div>
                    <h2 className="text-xl font-black text-white uppercase tracking-wide">{data.title}</h2>
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.3em] mt-1">Instruções do Professor</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-zinc-800 rounded-lg text-zinc-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {data.sections.map((section, idx) => (
                    <div key={idx} className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 hover:border-red-500/20 transition-colors">
                        <div className="flex items-center gap-3 mb-3">
                            {section.icon}
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">{section.title}</h3>
                        </div>
                        <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                            {section.text}
                        </p>
                    </div>
                ))}
            </div>

            {/* Footer Decorativo */}
            <div className="h-2 w-full bg-gradient-to-r from-red-900 via-red-600 to-red-900" />
          </div>
        </div>
      )}
    </>
  );
};
