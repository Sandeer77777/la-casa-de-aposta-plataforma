import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Utils, formatCurrency, formatPercentage } from '../utils/calculations';
import LZString from 'lz-string';

export interface CoverageBet {
  market: string;
  link: string;
  odd: string;
  commission: string;
  lay: boolean;
}

export interface DutchingResult {
    stakes: number[];
    profits: number[];
    totalInvestment: number;
    minProfit: number;
    roi: number;
}

function calculateFreebetDutching(promo: any, coverageBets: CoverageBet[], numEntradas: number, roundStep: number): DutchingResult {
    const s1 = Utils.parseFlex(promo.qualifyingStake);
    const F = Utils.parseFlex(promo.freebetValue);
    const rPerc = Utils.parseFlex(promo.extractionRate);
    const o1 = Utils.parseFlex(promo.promoOdd);
    const c1 = Utils.parseFlex(promo.promoCommission) / 100;
    const coverBetsParsed = coverageBets.slice(0, numEntradas - 1);

    if (s1 <= 0 || F <= 0 || o1 <= 1 || coverBetsParsed.some(b => Utils.parseFlex(b.odd) <= 1)) {
        return { stakes: [], profits: [], totalInvestment: 0, minProfit: 0, roi: 0 };
    }

    const o1_eff = 1 + (o1 - 1) * (1 - c1);
    const rF = (rPerc / 100) * F;
    const A = s1 * o1_eff - rF;

    const effectiveCoverOdds = coverBetsParsed.map(bet => {
        const o = Utils.parseFlex(bet.odd);
        const c = Utils.parseFlex(bet.commission) / 100;
        if (bet.lay) {
            if (o <= 1) return 0;
            return 1 + (1 - c) / (o - 1);
        }
        return 1 + (o - 1) * (1 - c);
    });

    const stakes = effectiveCoverOdds.map(effOdd => {
        if (effOdd <= 0) return 0;
        const stake = A / effOdd;
        return Math.round(stake / roundStep) * roundStep;
    });

    const totalCoverageInvestment = stakes.reduce((sum, stake, i) => {
        const bet = coverBetsParsed[i];
        const odd = Utils.parseFlex(bet.odd);
        return sum + (bet.lay ? stake * (odd - 1) : stake);
    }, 0);

    const totalInvestment = s1 + totalCoverageInvestment;
    const promoWinProfit = (s1 * o1_eff) - totalInvestment;
    const coverageWinProfits = stakes.map((stake, i) => {
        const effectiveOdd = effectiveCoverOdds[i];
        return (stake * effectiveOdd) - totalInvestment + rF;
    });

    const profits = [promoWinProfit, ...coverageWinProfits];
    const minProfit = Math.min(...profits);
    const roi = totalInvestment > 0 ? (minProfit / totalInvestment) * 100 : 0;

    return { stakes, profits, totalInvestment, minProfit, roi };
}

function calculateCashbackDutching(promo: any, coverageBets: CoverageBet[], numEntradas: number, roundStep: number): DutchingResult {
    const s_q = Utils.parseFlex(promo.qualifyingStake);
    const o_q = Utils.parseFlex(promo.promoOdd);
    const c_q = Utils.parseFlex(promo.promoCommission) / 100;
    const cashbackRate = Utils.parseFlex(promo.cashbackRate) / 100;
    const coverBetsParsed = coverageBets.slice(0, numEntradas - 1);

    if (s_q <= 0 || o_q <= 1 || coverBetsParsed.some(b => Utils.parseFlex(b.odd) <= 1)) {
        return { stakes: [], profits: [], totalInvestment: 0, minProfit: 0, roi: 0 };
    }

    const o_q_eff = 1 + (o_q - 1) * (1 - c_q);
    const cashbackAmount = s_q * cashbackRate;

    const effectiveCoverOdds = coverBetsParsed.map(bet => {
        const o = Utils.parseFlex(bet.odd);
        const c = Utils.parseFlex(bet.commission) / 100;
        return bet.lay ? (o <= 1 ? 0 : 1 + (1 - c) / (o - 1)) : (1 + (o - 1) * (1 - c));
    });

    const H = effectiveCoverOdds.reduce((sum, effOdd) => sum + (effOdd > 0 ? 1 / effOdd : 0), 0);
    let stakes: number[] = [];

    if (H >= 1) {
        stakes = effectiveCoverOdds.map(effOdd => effOdd <= 1 ? 0 : s_q / (effOdd - 1));
    } else {
        const numer = (s_q * o_q_eff - cashbackAmount) / (1 - H);
        stakes = effectiveCoverOdds.map(effOdd => effOdd <= 0 ? 0 : (numer / effOdd));
    }

    const totalCoverageInvestment = stakes.reduce((sum, stake, i) => {
        const bet = coverBetsParsed[i];
        const odd = Utils.parseFlex(bet.odd);
        return sum + (bet.lay ? stake * (odd - 1) : stake);
    }, 0);

    const totalInvestment = s_q + totalCoverageInvestment;
    const promoWinProfit = (s_q * o_q_eff) - totalInvestment;
    const coverageWinProfits = stakes.map((stake, i) => {
        const effOdd = effectiveCoverOdds[i];
        return (stake * effOdd) - totalInvestment + cashbackAmount;
    });

    const profits = [promoWinProfit, ...coverageWinProfits];
    const minProfit = Math.min(...profits);
    const roi = totalInvestment > 0 ? (minProfit / totalInvestment) * 100 : 0;

    return { stakes, profits, totalInvestment, minProfit, roi };
}

const createInitialCoverage = (num: number): CoverageBet[] => 
    Array.from({ length: num - 1 }).map(() => ({ market: '', link: '', odd: '', commission: '', lay: false }));

export function useFreebetCalculator() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeMode, setActiveMode] = useState<'freebet' | 'cashback'>('freebet');
  const [numEntradas, setNumEntradas] = useState<number>(3);
  const [roundStep, setRoundStep] = useState<number>(1.00);
  const [promo, setPromo] = useState({ promoMarket: '', promoLink: '', qualifyingStake: '50', freebetValue: '50', extractionRate: '70', promoOdd: '3.0', promoCommission: '0', cashbackRate: '100' });
  const [coverageBets, setCoverageBets] = useState<CoverageBet[]>(createInitialCoverage(3));
  
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
            if (s.m) setActiveMode(s.m);
            if (s.n) setNumEntradas(s.n);
            if (s.r) setRoundStep(s.r);
            if (s.p) setPromo({ promoMarket: s.p.pm || '', promoLink: s.p.pl || '', qualifyingStake: s.p.qs || '50', freebetValue: s.p.fv || '50', extractionRate: s.p.er || '70', promoOdd: s.p.po || '3.0', promoCommission: s.p.pc || '0', cashbackRate: s.p.cr || '100' });
            if (s.c) setCoverageBets(s.c.map((b: any) => ({ market: b.m || '', link: b.lk || '', odd: b.o || '', commission: b.c || '', lay: !!b.l })));
            hasLoaded.current = true;
        }
      } catch (e) {}
    }
  }, [searchParams]);

  useEffect(() => {
    setCoverageBets(prev => {
        const target = numEntradas - 1;
        if (prev.length === target) return prev;
        return prev.length < target ? [...prev, ...createInitialCoverage(target - prev.length + 1)] : prev.slice(0, target);
    });
  }, [numEntradas]);

  const handlePromoChange = useCallback((field: string, value: string) => setPromo(p => ({ ...p, [field]: value })), []);
  const handleCoverageChange = useCallback((idx: number, field: string, value: any) => setCoverageBets(bs => bs.map((b, i) => i === idx ? { ...b, [field]: value } : b)), []);
  const clearData = useCallback(() => { setPromo({ promoMarket: '', promoLink: '', qualifyingStake: '50', freebetValue: '50', extractionRate: '70', promoOdd: '3.0', promoCommission: '0', cashbackRate: '100' }); setCoverageBets(createInitialCoverage(numEntradas)); }, [numEntradas]);

  const shareState = useCallback(() => {
    const state = {
        m: activeMode, n: numEntradas, r: roundStep,
        p: { pm: promo.promoMarket, pl: promo.promoLink, qs: promo.qualifyingStake, fv: promo.freebetValue, er: promo.extractionRate, po: promo.promoOdd, pc: promo.promoCommission, cr: promo.cashbackRate },
        c: coverageBets.map(b => ({ m: b.market, lk: b.link, o: b.odd, c: b.commission, l: b.lay ? 1 : 0 }))
    };
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(state));
    navigator.clipboard.writeText(`${window.location.origin}${window.location.pathname}?data=${compressed}`).then(() => alert('Link tático copiado!'));
  }, [activeMode, numEntradas, roundStep, promo, coverageBets]);

  const results = useMemo(() => activeMode === 'freebet' ? calculateFreebetDutching(promo, coverageBets, numEntradas, roundStep) : calculateCashbackDutching(promo, coverageBets, numEntradas, roundStep), [promo, coverageBets, numEntradas, roundStep, activeMode]);

  return { activeMode, setActiveMode, numEntradas, setNumEntradas, roundStep, setRoundStep, promo, handlePromoChange, coverageBets, handleCoverageChange, results, clearData, shareState };
}
