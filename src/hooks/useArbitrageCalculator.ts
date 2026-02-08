
import { useState, useEffect, useCallback, useRef } from 'react';
import type { House, ArbitrageResult } from '../types/calculator';
import { useSearchParams } from 'react-router-dom';
import LZString from 'lz-string';

const parseFlex = (value: any): number => {
  if (typeof value === 'number') return value;
  if (!value || typeof value !== 'string') return 0;
  const n = parseFloat(value.replace(',', '.'));
  return isNaN(n) ? 0 : n;
};

const formatDecimal = (n: number): string => n ? String(parseFloat(n.toFixed(2))) : '';

const MAX_HOUSES = 6;

const createInitialHouses = (): House[] => Array.from({ length: MAX_HOUSES }).map((_, i) => ({
  id: (i + 1).toString(), name: '', market: '', link: '', odd: '', stake: i === 0 ? '100' : '',
  commission: null, freebet: false, increase: null, lay: false, finalOdd: 0, fixedStake: i === 0, responsibility: ''
}));

export function useArbitrageCalculator() {
  const [searchParams] = useSearchParams();
  const [numberOfHouses, setNumberOfHouses] = useState(2);
  const [roundingValue, setRoundingValue] = useState(0.01);
  const [houses, setHouses] = useState<House[]>(createInitialHouses());
  const [manualOverrides, setManualOverrides] = useState<Record<number, Record<string, boolean>>>({});
  const [results, setResults] = useState<ArbitrageResult>({ profits: [], totalStake: 0, roi: 0 });
  
  const isFirstLoad = useRef(true);

  // --- 1. CARREGAMENTO DA URL ---
  useEffect(() => {
    if (!isFirstLoad.current) return;
    const data = searchParams.get('data');
    if (data) {
      try {
        let decoded = LZString.decompressFromEncodedURIComponent(data);
        if (!decoded) { try { decoded = atob(data); } catch(e) {} }

        if (decoded) {
          const s = JSON.parse(decoded);
          if (s.n) setNumberOfHouses(s.n);
          if (s.r) setRoundingValue(s.r);
          
          if (s.h && Array.isArray(s.h)) {
            const loadedHouses = createInitialHouses().map((h, i) => {
              const d = s.h[i];
              if (!d) return h;
              return {
                ...h,
                name: d.a || d.nm || '',
                market: d.b || d.m || '',
                link: d.c || d.lk || '',
                odd: d.d || d.o || '',
                stake: d.e || d.s || '',
                commission: d.f !== undefined ? d.f : (d.c !== undefined ? d.c : null),
                increase: d.g !== undefined ? d.g : (d.i !== undefined ? d.i : null),
                freebet: !!(d.h || d.f),
                lay: !!(d.i || d.l),
                fixedStake: !!(d.j || d.fs),
                responsibility: d.k || d.re || ''
              };
            });
            setHouses(loadedHouses);
            // IMPORTANTE: Não definimos manualOverrides aqui para permitir que o cálculo flua ao mudar ODDs
          }
        }
      } catch (e) { console.error("Erro URL:", e); }
    }
    isFirstLoad.current = false;
  }, [searchParams]);

  // --- 2. MOTOR DE CÁLCULO ---
  useEffect(() => {
    // 2.1 Calcular Odds Finais
    let nextHouses = houses.map(h => {
      const oddBase = parseFlex(h.odd);
      const inc = parseFlex(h.increase);
      let fOdd = oddBase;
      if (h.increase !== null && inc > 0 && oddBase > 1) fOdd = oddBase + (oddBase - 1) * (inc / 100);
      return { ...h, finalOdd: h.freebet ? Math.max(fOdd - 1, 0) : fOdd };
    });

    // 2.2 Distribuir Stakes baseado na FixedStake
    const fixedIdx = nextHouses.findIndex(h => h.fixedStake);
    if (fixedIdx !== -1) {
      const fixed = nextHouses[fixedIdx];
      const fStake = parseFlex(fixed.stake);
      if (fStake > 0 && fixed.finalOdd > 0) {
        const fComm = (fixed.commission || 0) / 100;
        const fNetReturn = fixed.freebet 
          ? (fStake * fixed.finalOdd * (1 - fComm)) 
          : (fStake * fixed.finalOdd - (fStake * (fixed.finalOdd - 1) * fComm));

        nextHouses = nextHouses.map((h, i) => {
          // Se não for a fixa E não tiver sido editada manualmente nesta sessão, recalcula
          if (i !== fixedIdx && !manualOverrides[i]?.stake && h.finalOdd > 0) {
            const comm = (h.commission || 0) / 100;
            const factor = h.finalOdd * (1 - comm) + comm;
            const calcStake = factor > 0 ? fNetReturn / factor : 0;
            const rounded = Math.round(calcStake / roundingValue) * roundingValue;
            return { ...h, stake: formatDecimal(rounded) };
          }
          return h;
        });
      }
    }

    // 2.3 Responsabilidade LAY
    nextHouses = nextHouses.map((h, i) => {
      if (h.lay && !manualOverrides[i]?.responsibility) {
        const sVal = parseFlex(h.stake);
        const oVal = parseFlex(h.odd);
        if (sVal > 0 && oVal > 1) return { ...h, responsibility: formatDecimal(sVal * (oVal - 1)) };
      }
      return h;
    });

    // 2.4 Calcular Resultados
    const active = nextHouses.slice(0, numberOfHouses);
    let totalInv = 0;
    active.forEach(h => { if (!h.freebet) totalInv += h.lay ? parseFlex(h.responsibility) : parseFlex(h.stake); });

    const profits = active.map(h => {
      const s = parseFlex(h.stake);
      const comm = (h.commission || 0) / 100;
      let net = 0;
      if (h.lay) net = s * (1 - comm);
      else if (h.freebet) net = s * h.finalOdd * (1 - comm);
      else net = (s * h.finalOdd) - ((s * (h.finalOdd - 1)) * comm);
      return net - totalInv;
    });

    const minP = profits.length ? Math.min(...profits) : 0;
    const fb = active.find(h => h.freebet);
    const den = fb ? parseFlex(fb.stake) : totalInv;
    const roi = den > 0 ? (minP / den) * 100 : 0;

    // Atualiza resultados se mudou
    if (JSON.stringify(results.profits) !== JSON.stringify(profits) || results.totalStake !== totalInv) {
        setResults({ profits, totalStake: totalInv, roi });
    }
    
    // Sincroniza estado das houses
    if (JSON.stringify(houses) !== JSON.stringify(nextHouses)) {
        setHouses(nextHouses);
    }

  }, [numberOfHouses, roundingValue, manualOverrides, houses]);

  const actions = {
    updateHouse: useCallback((i: number, p: Partial<House>) => {
      setHouses(prev => prev.map((h, idx) => i === idx ? { ...h, ...p } : h));
      // Se mudar ODD ou COMISSÃO, limpamos a trava da stake para ela recalcular
      if (p.odd || p.commission !== undefined || p.increase !== undefined) {
          setManualOverrides(prev => {
              const n = { ...prev };
              if (n[i]) delete n[i].stake;
              return n;
          });
      }
    }, []),
    setFixedStake: useCallback((i: number) => {
      setHouses(prev => prev.map((h, idx) => ({ ...h, fixedStake: i === idx })));
      setManualOverrides(prev => { const n = { ...prev }; if(n[i]) delete n[i].stake; return n; });
    }, []),
    handleStakeChange: useCallback((i: number, v: string) => {
      setHouses(prev => prev.map((h, idx) => i === idx ? { ...h, stake: v } : h));
      setManualOverrides(prev => ({ ...prev, [i]: { ...prev[i], stake: true } }));
    }, []),
    setNumberOfHouses,
    setRoundingValue,
    clearAllData: useCallback(() => {
      setNumberOfHouses(2); setRoundingValue(0.01); setHouses(createInitialHouses()); setManualOverrides({});
      window.history.pushState({}, '', window.location.pathname);
    }, []),
    shareState: useCallback(() => {
      const state = {
        n: numberOfHouses, r: roundingValue,
        h: houses.slice(0, numberOfHouses).map(h => ({
          a: h.name, b: h.market, c: h.link, d: h.odd, e: h.stake, f: h.commission, g: h.increase, h: h.freebet ? 1 : 0, i: h.lay ? 1 : 0, j: h.fixedStake ? 1 : 0, k: h.responsibility
        }))
      };
      const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(state));
      navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?data=${compressed}`).then(() => alert('✅ Link Seguro Gerado!'));
    }, [houses, numberOfHouses, roundingValue]),
    importHouses: useCallback((importedData: any[]) => {
      setNumberOfHouses(importedData.length);
      setHouses(prev => {
          const newHouses = createInitialHouses();
          importedData.forEach((data, i) => {
              if (i < MAX_HOUSES) {
                  newHouses[i] = { ...newHouses[i], name: data.name || '', market: data.market || '', link: data.link || '', odd: data.odd || '', stake: data.stake || '', fixedStake: i === 0 };
              }
          });
          return newHouses;
      });
      setManualOverrides({});
    }, [])
  };

  return { houses, numberOfHouses, results, roundingValue, actions };
}
