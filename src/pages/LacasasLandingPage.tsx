import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Fingerprint, Users, Instagram, TrendingUp, Gift, Divide, ShieldCheck, Zap, Menu, X } from 'lucide-react';

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className} 
    fill="currentColor" 
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.411.001 12.045c0 2.12.554 4.189 1.605 6.046L0 24l6.103-1.602a11.83 11.83 0 005.943 1.603h.005c6.634 0 12.043-5.411 12.046-12.045a11.83 11.83 0 00-3.535-8.503" />
  </svg>
);

const LacasasLandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.title = "LA CASAS DE APOSTA - O PLANO";
    const img = new Image();
    img.src = "/hero-oficial.jpg";
    img.onload = () => setImageLoaded(true);
  }, []);

  const navigation = [
    { name: 'O PLANO', href: '/', icon: Zap },
    { name: 'ArbiPro', href: '/arbipro', icon: TrendingUp },
    { name: 'FreePro', href: '/freepro', icon: Gift },
    { name: 'Dutching', href: '/dutching', icon: Divide },
    { name: 'DoubleGreen', href: '/double-green', icon: ShieldCheck }
  ];

  const isActive = (href: string) => location.pathname === href;

  const LINKS = {
    FREE: "https://t.me/+B0ezx3HgyfRiOWUx",
    VIP: "https://eproductpage.com/lacasas",
    WPP: "https://api.whatsapp.com/send?phone=5521995587423&text=Ol%C3%A1%21+Vim+pelo+site+do+LaCasas+VIP.%0AQuero+tirar+uma+d%C3%BAvida",
    INSTA: "https://www.instagram.com/lacasasdeaposta/"
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white font-sans selection:bg-[#FF0000]/30 relative">
      
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap');
        .font-archivo { font-family: 'Archivo Black', sans-serif; }
        
        .heist-border-glow { 
          border: 1px solid rgba(255, 0, 0, 0.5); 
          box-shadow: inset 0 0 15px rgba(255, 0, 0, 0.05), 0 0 15px rgba(255, 0, 0, 0.2); 
        }

        @keyframes rotate-beam {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes breathing-pulse {
          0%, 100% { opacity: 0.6; filter: brightness(1); transform: translateX(-50%) scaleX(1); }
          50% { opacity: 1; filter: brightness(1.6); transform: translateX(-50%) scaleX(1.05); }
        }

        @keyframes title-aura {
          0%, 100% { text-shadow: 0 0 20px rgba(255, 0, 0, 0); }
          50% { text-shadow: 0 0 30px rgba(255, 0, 0, 0.2); }
        }
        
        .btn-beam-container {
          position: relative;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.03);
        }

        .btn-beam-light {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 270deg, #FF0000 0%, #FF0000 10%, transparent 40%);
          animation: rotate-beam 3s linear infinite;
          z-index: 0;
          filter: blur(8px);
        }

        .btn-beam-overlay {
          position: absolute;
          inset: 1.5px;
          background: #000;
          border-radius: 7px;
          z-index: 1;
        }

        .btn-beam-content {
          position: relative;
          z-index: 2;
        }

        .mask-gradient-mobile { mask-image: linear-gradient(to bottom, black 85%, transparent 100%); }
        .mask-gradient-desktop { mask-image: linear-gradient(to right, black 85%, transparent 100%); }
      `}} />

      {/* CABEÇALHO COM ALTURA FIXA E Z-INDEX MÁXIMO */}
      <header className="fixed top-0 left-0 w-full h-16 md:h-20 z-[200] bg-black/60 backdrop-blur-2xl border-b border-white/5">
        <div className="max-w-[1920px] mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 md:gap-3 group active:scale-95 transition-transform shrink-0">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-[#0A0A0A] border border-white/10 rounded-lg flex items-center justify-center shadow-2xl overflow-hidden">
              <img src="/logo-heist.jpg" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col text-left">
              <h1 className="text-xs md:text-sm font-black tracking-tighter text-white uppercase leading-none">
                LA CASAS <span className="text-red-500">DE</span> APOSTA
              </h1>
              <p className="text-[6px] md:text-[8px] font-bold tracking-[0.2em] text-zinc-500 uppercase">OFFICIAL</p>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all duration-500 flex items-center gap-2 border active:scale-95 ${
                    active ? 'bg-red-600/20 border-red-500/30 text-white shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'bg-transparent border-transparent text-zinc-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-red-500' : ''}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-red-500">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        <div className={`lg:hidden absolute top-full left-0 w-full bg-black/95 backdrop-blur-3xl border-b border-white/5 transition-all duration-500 ${isMenuOpen ? 'max-h-[500px] opacity-100 py-6 px-6' : 'max-h-0 opacity-0 pointer-events-none'}`}>
          <nav className="flex flex-col gap-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link key={item.name} to={item.href} onClick={() => setIsMenuOpen(false)} className={`flex items-center gap-4 px-6 py-5 rounded-2xl font-bold text-[10px] uppercase tracking-widest transition-all ${active ? 'bg-red-600/20 text-white' : 'text-zinc-400'}`}>
                  <Icon className="w-5 h-5 text-red-500" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* CONTAINER PRINCIPAL COM FLEX-ROW E ESPAÇAMENTO DE TOPO (DEFINITIVO) */}
      <div className="flex flex-col lg:flex-row w-full flex-grow pt-16 md:pt-20">
        
        {/* LADO DA IMAGEM: NUNCA FICARÁ ATRÁS DO HEADER */}
        <div className={`relative w-full lg:w-[45%] h-[50vh] lg:h-[calc(100vh-80px)] shrink-0 lg:fixed lg:left-0 lg:top-20 z-0 transition-opacity duration-1000 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 mask-gradient-mobile lg:mask-gradient-desktop overflow-hidden">
            <img 
              src="/hero-oficial.jpg" 
              alt="Professor" 
              className="w-full h-full object-cover object-top grayscale-[5%] contrast-[1.1] brightness-[0.9]"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent lg:hidden" />
          <div className="absolute inset-0 hidden lg:block bg-gradient-to-r from-transparent via-[#050505]/40 to-[#050505]" />
        </div>

        {/* LADO DO CONTEÚDO */}
        <div className="flex-grow flex flex-col items-center justify-start px-6 lg:ml-[45%] min-h-[50vh] lg:min-h-[calc(100vh-80px)] z-10 bg-[#050505] pb-12 pt-12 md:pt-16">
          <div className="w-full max-w-xl flex flex-col items-center text-center">
            <div className="mb-12 lg:mb-16 w-full">
              <h1 className="font-archivo text-[clamp(2.5rem,8vw,5.5rem)] leading-[0.85] tracking-tighter uppercase animate-[title-aura_5s_infinite_ease-in-out]">
                <span className="text-white">LA CASAS</span><br />
                <span className="text-[#FF0000] drop-shadow-[0_0_10px_rgba(255,0,0,0.3)]">DE</span> <span className="text-white">APOSTA</span>
              </h1>
            </div>

            <div className="mb-14 lg:mb-24 w-full relative flex flex-col items-center">
              <div className="relative">
                  <h2 className="text-[clamp(1.2rem,4vw,2.5rem)] font-black uppercase tracking-tight text-white flex gap-3 items-center">
                  O JOGO <span className="text-[#FF0000]">COMEÇOU</span>
                  </h2>
                  <div className="absolute -bottom-4 left-1/2 w-[80%] h-[4px] lg:h-[6px] flex items-center justify-center animate-[breathing-pulse_3s_infinite_ease-in-out]">
                      <div className="absolute inset-0 bg-[#FF0000] blur-[10px] opacity-50" />
                      <div className="w-full h-full bg-[#FF0000]" style={{ clipPath: 'polygon(0 50%, 50% 0, 100% 50%, 50% 100%)' }} />
                      <div className="absolute w-[60%] h-[1px] bg-white blur-[0.5px] opacity-80" />
                  </div>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 lg:gap-5">
              <a href={LINKS.VIP} target="_blank" rel="noopener noreferrer" className="btn-beam-container group col-span-1 flex flex-col items-center justify-center rounded-lg transition-all active:scale-[0.96] h-[140px] lg:h-[160px]">
                <div className="btn-beam-light" />
                <div className="btn-beam-overlay" />
                <div className="btn-beam-content flex flex-col items-center gap-3 px-2 text-center">
                  <Fingerprint className="w-9 h-9 text-[#FF0000] drop-shadow-[0_0_12px_rgba(255,0,0,0.6)]" />
                  <span className="font-archivo text-sm lg:text-base font-black text-white group-hover:text-[#FF0000] transition-colors duration-500 tracking-tighter uppercase">ACESSO VIP</span>
                </div>
              </a>

              <a href={LINKS.FREE} target="_blank" rel="noopener noreferrer" className="col-span-1 flex flex-col items-center justify-center gap-3 bg-black heist-border-glow text-white font-black py-7 px-4 rounded-lg transition-all active:scale-[0.96] uppercase tracking-tighter text-sm lg:text-base border border-red-900/50 h-[140px] lg:h-[160px] group text-center">
                <Users className="w-9 h-9 text-[#FF0000] drop-shadow-[0_0_8px_rgba(255,0,0,0.3)] group-hover:scale-110 transition-transform" />
                <span className="group-hover:text-[#FF0000] transition-colors duration-500 uppercase">GRUPO FREE</span>
              </a>

              <a href={LINKS.INSTA} target="_blank" rel="noopener noreferrer" className="col-span-1 flex items-center justify-center gap-3 bg-black border border-white/10 hover:border-white/20 text-white font-bold py-5 px-3 rounded-lg transition-all active:scale-[0.96] text-[10px] lg:text-[11px] uppercase tracking-widest">
                <div className="p-1 rounded bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]"><Instagram className="w-4 h-4 text-white" /></div>
                <span>Instagram</span>
              </a>

              <a href={LINKS.WPP} target="_blank" rel="noopener noreferrer" className="col-span-1 flex items-center justify-center gap-3 bg-black border border-white/10 hover:border-white/20 text-white font-bold py-5 px-3 rounded-lg transition-all active:scale-[0.96] text-[10px] lg:text-[11px] uppercase tracking-widest">
                <div className="p-1 rounded bg-[#25D366]"><WhatsAppIcon className="w-4 h-4 text-white" /></div>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LacasasLandingPage;
