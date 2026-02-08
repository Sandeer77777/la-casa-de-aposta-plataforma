

import type { BettingOdds, RoundingConfig } from '../types/calculator'

/**
 * Utilitários para inputs numéricos - TOTALMENTE LIVRE
 */
export const Utils = {
  /**
   * REMOVIDO: Agora permite qualquer caractere durante digitação
   */
  keepNumeric: (value: string): string => {
    // TOTALMENTE LIVRE - aceita qualquer coisa
    return value
  },

  /**
   * Parse flexível que converte vírgula para ponto apenas no final
   */
  parseFlex: (value: string | number): number => {
    if (value === '' || value === null || value === undefined) return 0
    if (typeof value === 'number') return value
    
    // Converte vírgula para ponto apenas para parsing
    const cleaned = value.toString().replace(',', '.')
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? 0 : parsed
  },

  /**
   * Formata número para input (permite vazio)
   */
  formatInput: (value: number): string => {
    return value === 0 ? '' : value.toString()
  }
}

/**
 * Arredondamento inteligente para stakes
 */
export function smartRoundStake(value: number, config: RoundingConfig): number {
  if (value <= 0) return 0
  const factor = 1 / config.precision
  
  switch (config.method) {
    case 'up':
      return Math.ceil(value * factor) / factor
    case 'down':
      return Math.floor(value * factor) / factor
    case 'nearest':
    default:
      return Math.round(value * factor) / factor
  }
}

/**
 * Calcula Odd Final com aumento percentual
 * Fórmula: Odd_Base + (Odd_Base - 1) * (Aumento_% / 100)
 */
export function calculateFinalOdd(baseOdd: number, increasePercent: number = 0): number {
  if (increasePercent <= 0) return baseOdd
  return baseOdd + (baseOdd - 1) * (increasePercent / 100)
}

/**
 * Calcula Odd Efetiva com comissão
 * Fórmula: 1 + (Odd - 1) * (1 - Comissao_% / 100)
 */
export function calculateEffectiveOdd(odd: number, commissionPercent: number = 0): number {
  if (commissionPercent <= 0) return odd
  return 1 + (odd - 1) * (1 - commissionPercent / 100)
}

/**
 * Calcula Odd Efetiva LAY com comissão
 * Fórmula: 1 + ((Odd - 1) / (1 - Comissao_% / 100))
 */
export function calculateEffectiveLayOdd(odd: number, commissionPercent: number = 0): number {
  if (commissionPercent <= 0) return odd;
  const commission = commissionPercent / 100;
  if ((odd - 1) <= 0) return odd; // Evitar divisão por zero
  return 1 + (1 - commission) / (odd - 1);
}

/**
 * Calcula ganhos para Freebet
 * Fórmula: (Odd - 1) * Stake
 */
export function calculateFreebetWinnings(finalOdd: number, freebetStake: number): number {
  return Math.max(finalOdd - 1, 0) * freebetStake
}

/**
 * Calcula responsabilidade LAY
 */
export function calculateLayLiability(stake: number, layOdd: number): number {
  if (layOdd <= 1) return 0
  return stake * (layOdd - 1)
}

/**
 * Calcula probabilidade implícita das odds
 */
export function calculateImpliedProbability(odds: number[]): number {
  return odds.reduce((sum, odd) => sum + (1 / odd), 0)
}

/**
 * Calcula margem das casas de apostas
 */
export function calculateBookmakerMargin(odds: number[]): number {
  const impliedProb = calculateImpliedProbability(odds)
  return ((impliedProb - 1) * 100)
}

/**
 * Verifica se existe oportunidade de arbitragem
 */
export function hasArbitrageOpportunity(odds: number[]): boolean {
  return calculateImpliedProbability(odds) < 1
}

/**
 * Distribui stakes para arbitragem perfeita
 * Fórmula: stake_i = (stake_fixo * odd_fixo) / odd_i
 */
export function distributeArbitrageStakes(
  bets: BettingOdds[],
  roundingConfig: RoundingConfig
): BettingOdds[] {
  const activeBets = [...bets]
  const fixedBet = activeBets.find(bet => bet.isFixed)
  
  if (!fixedBet || fixedBet.stake <= 0) {
    return activeBets
  }

  // Calcular odds efetivas
  const effectiveOdds = activeBets.map(bet => {
    let finalOdd = bet.backOdd

    // Aplicar aumento de odd
    if (bet.hasOddIncrease && bet.oddIncrease) {
      finalOdd = calculateFinalOdd(finalOdd, bet.oddIncrease)
    }

    // Aplicar comissão se não for freebet
    if (bet.hasCommission && bet.commission && !bet.hasFreebet) {
      finalOdd = calculateEffectiveOdd(finalOdd, bet.commission)
    }

    return finalOdd
  })

  // Encontrar casa fixada
  const fixedIndex = activeBets.findIndex(bet => bet.isFixed)
  const fixedStake = fixedBet.stake
  const fixedOdd = effectiveOdds[fixedIndex]

  // Calcular retorno alvo para arbitragem perfeita
  const targetReturn = fixedStake * fixedOdd

  // Distribuir stakes para igualar retornos
  return activeBets.map((bet, index) => {
    if (bet.isFixed) return bet

    // Fórmula: stake = targetReturn / odd
    let calculatedStake = targetReturn / effectiveOdds[index]
    
    // Aplicar arredondamento
    calculatedStake = smartRoundStake(calculatedStake, roundingConfig)

    return {
      ...bet,
      stake: calculatedStake
    }
  })
}

/**

 * Calcula stake de cobertura para freebet (SNR - Stake Not Returned)

 */

export function calculateFreebetCoverage(

  freebetValue: number,

  backOdd: number,

  layOdd: number,

  backCommission: number = 0,

  layCommission: number = 0

): { backStake: number; layStake: number; layLiability: number; netProfit: number } {

  if (freebetValue <= 0 || backOdd <= 1 || layOdd <= 1) {

    return { backStake: 0, layStake: 0, layLiability: 0, netProfit: 0 };

  }



  const backProfit = freebetValue * (backOdd - 1) * (1 - backCommission / 100);

  const layDenominator = layOdd - (layCommission / 100);



  if (layDenominator <= 0) {

    return { backStake: 0, layStake: 0, layLiability: 0, netProfit: 0 };

  }



  const layStake = backProfit / layDenominator;

  const layLiability = calculateLayLiability(layStake, layOdd);

  const netProfit = (layStake * (1 - layCommission / 100));



  return { 

    backStake: freebetValue, 

    layStake, 

    layLiability, 

    netProfit

  };

}



/**

 * Calcula cobertura para cashback, com modo de nivelamento de lucro.

 */

export function calculateCashbackCoverage(

  qualifyingStake: number,

  cashbackRate: number,

  qualifyingOdd: number,

  layOdd: number,

  qualifyingCommission: number = 0,

  layCommission: number = 0,

  mode: 'level' | 'cover' = 'level'

): { 

  cashbackValue: number;

  layStake: number;

  layLiability: number;

  scenarios: { qualifyingWins: number; qualifyingLoses: number };

} {

  if (qualifyingStake <= 0 || qualifyingOdd <= 1 || layOdd <= 1) {

    return { cashbackValue: 0, layStake: 0, layLiability: 0, scenarios: { qualifyingWins: 0, qualifyingLoses: 0 } };

  }



  const cashbackValue = qualifyingStake * (cashbackRate / 100);

  let layStake = 0;



  if (mode === 'level') {

    const qCommissionPercent = qualifyingCommission / 100;

    const lCommissionPercent = layCommission / 100;



    const numerator = (qualifyingStake * (qualifyingOdd - 1) * (1 - qCommissionPercent)) + cashbackValue;

    const denominator = (layOdd - 1) + (1 - lCommissionPercent);

    

    if (denominator <= 0) {

        return { cashbackValue, layStake: 0, layLiability: 0, scenarios: { qualifyingWins: 0, qualifyingLoses: 0 } };

    }

    layStake = numerator / denominator;



  } else { // 'cover' mode: aposta apenas o suficiente para não perder dinheiro se a aposta qualificatória perder.

    const denominator = 1 - (layCommission / 100);

    if (denominator <= 0) {

        return { cashbackValue, layStake: 0, layLiability: 0, scenarios: { qualifyingWins: 0, qualifyingLoses: 0 } };

    }

    layStake = (qualifyingStake - cashbackValue) / denominator;

  }



  const layLiability = calculateLayLiability(layStake, layOdd);

  

  const qualifyingWins = (qualifyingStake * (qualifyingOdd - 1) * (1 - qualifyingCommission / 100)) - layLiability;

  const qualifyingLoses = (layStake * (1 - layCommission / 100)) - qualifyingStake + cashbackValue;

  

  return {

    cashbackValue,

    layStake,

    layLiability,

    scenarios: { qualifyingWins, qualifyingLoses }

  };

}

/**
 * REMOVIDO: Validação de odds (agora aceita qualquer valor)
 */
export function validateOdds(odds: number[]): boolean {
  return true // ACEITA TUDO
}

/**
 * Valida se o stake é válido
 */
export function validateStake(stake: number, min: number = 0, max: number = 100000): boolean {
  return stake >= min && stake <= max && !isNaN(stake)
}

/**
 * Formata valor monetário
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

/**
 * Formata percentual
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`
}
