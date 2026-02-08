
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { calculateFreebetDutchingStrategy, BetInput, calculateEffectiveOdd, calculateHybridStrategy } from '../utils/calculadoraEngine';
import LZString from 'lz-string';

export interface DutchingHouse {
  id: string;
  name: string;
  market: string;
  link: string;
  odd: string;
  stake: string; 
  commission: string; 
  profit: number; 
  betType?: 'freebet' | 'cash';
  efficiency?: number;
}

export function useDutchingFreebetCalculator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalFreebet, setTotalFreebet] = useState<string>('100');
  const [numberOfHouses, setNumberOfHouses] = useState<number>(2);
  const [houses, setHouses] = useState<DutchingHouse[]>([]);
  const [roundingValue, setRoundingValue] = useState<number>(0.01);
  const [optimizationMode, setOptimizationMode] = useState<boolean>(false); 
  
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    const data = searchParams.get('data');
    if (data) {
      try {
        let decoded = LZString.decompressFromEncodedURIComponent(data);
        if (!decoded) try { decoded = atob(data); } catch(e) {}
        if (decoded) {
            const s = JSON.parse(decoded);
            if (s.tf) setTotalFreebet(s.tf);
            if (s.n) setNumberOfHouses(s.n);
            if (s.r) setRoundingValue(s.r);
            if (s.om !== undefined) setOptimizationMode(!!s.om);
            if (s.h) setHouses(s.h.map((h: any) => ({ id: crypto.randomUUID(), name: h.nm || '', market: h.m || '', link: h.lk || '', odd: h.o || '', stake: '', commission: h.c || '', profit: 0, betType: 'freebet', efficiency: 0 })));
            hasLoaded.current = true;
        }
      } catch (e) {}
    }
  }, [searchParams]);

  useEffect(() => {
    setHouses(prev => {
      if (prev.length === numberOfHouses) return prev;
      return Array.from({ length: numberOfHouses }).map((_, i) => prev[i] || { id: crypto.randomUUID(), name: '', market: '', link: '', odd: '', stake: '', commission: '', profit: 0, betType: 'freebet', efficiency: 0 });
    });
  }, [numberOfHouses]);

  const updateHouse = useCallback((idx: number, field: string, value: string) => setHouses(ps => ps.map((h, i) => i === idx ? { ...h, [field]: value } : h)), []);
  const clearAllData = useCallback(() => { setTotalFreebet('100'); setHouses(hs => hs.map(h => ({ ...h, odd: '', stake: '', commission: '', profit: 0, name: '', market: '', link: '' }))); }, []);

  const shareState = useCallback(() => {
    const state = { tf: totalFreebet, n: numberOfHouses, r: roundingValue, om: optimizationMode ? 1 : 0, h: houses.map(h => ({ nm: h.name, m: h.market, lk: h.link, o: h.odd, c: h.commission })) };
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(state));
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?data=${compressed}`).then(() => alert('Link de plano copiado!'));
  }, [totalFreebet, numberOfHouses, roundingValue, optimizationMode, houses]);

  const results = useMemo(() => {
    const freebetValue = parseFloat(totalFreebet.replace(',', '.')) || 0;
    const betInputs: BetInput[] = houses.map(h => ({ odd: parseFloat(h.odd.replace(',', '.')) || 0, stake: 0, commission: parseFloat(h.commission.replace(',', '.')) || 0, isLay: false, isFreebet: true }));
    let calc = optimizationMode ? calculateHybridStrategy(freebetValue, betInputs) : calculateFreebetDutchingStrategy(freebetValue, betInputs);
    if (!calc) return { houses: houses.map(h => ({ ...h, stake: '0.00', profit: 0 })), totalInvestment: 0, guaranteedProfit: 0, roi: 0 };
    if (!optimizationMode) { calc.betTypes = houses.map(() => 'freebet'); calc.efficiencies = houses.map((_, i) => betInputs[i].odd > 1 ? ((betInputs[i].odd - 1) / betInputs[i].odd) * 100 : 0); }
    
    let roundedStakes = (calc.stakes as number[]).map(s => Math.round(s / (roundingValue || 0.01)) * (roundingValue || 0.01));
    const types = calc.betTypes as ('freebet' | 'cash')[];
    const fbIdxs = types.map((t, i) => t === 'freebet' ? i : -1).filter(i => i !== -1);
    if (fbIdxs.length > 0) {
        const sum = fbIdxs.reduce((s, idx) => s + roundedStakes[idx], 0);
        const diff = freebetValue - sum;
        if (Math.abs(diff) > 0.001) {
            let maxI = fbIdxs[0]; let maxV = -1;
            fbIdxs.forEach(idx => { if (calc.stakes[idx] > maxV) { maxV = calc.stakes[idx]; maxI = idx; } });
            roundedStakes[maxI] += diff;
        }
    }

    const newProfits = roundedStakes.map((stake, i) => {
        const h = houses[i]; const odd = parseFloat(h.odd.replace(',', '.')) || 0; const comm = parseFloat(h.commission.replace(',', '.')) || 0;
        const eff = calculateEffectiveOdd(odd, comm, false);
        const totalCash = roundedStakes.reduce((s, st, idx) => types[idx] === 'cash' ? s + st : s, 0);
        return (types[i] === 'freebet' ? stake * (eff - 1) : stake * eff) - totalCash;
    });

    const guaranteedProfit = Math.min(...newProfits);
    const totalCash = roundedStakes.reduce((s, st, idx) => types[idx] === 'cash' ? s + st : s, 0);
    const roi = optimizationMode ? (totalCash > 0 ? (guaranteedProfit / totalCash) * 100 : 0) : (guaranteedProfit / freebetValue) * 100;

    return { houses: houses.map((h, i) => ({ ...h, stake: roundedStakes[i].toFixed(2), profit: newProfits[i], betType: types[i], efficiency: calc.efficiencies ? calc.efficiencies[i] : 0 })), totalInvestment: optimizationMode ? totalCash : freebetValue, guaranteedProfit, roi };
  }, [totalFreebet, houses, roundingValue, optimizationMode]);

  return { totalFreebet, setTotalFreebet, numberOfHouses, setNumberOfHouses, houses: results.houses, results: { totalInvestment: results.totalInvestment, guaranteedProfit: results.guaranteedProfit, roi: results.roi }, updateHouse, clearAllData, shareState, roundingValue, setRoundingValue, optimizationMode, setOptimizationMode };
}
