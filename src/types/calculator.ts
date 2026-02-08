export interface House {
  id: string;
  name: string; 
  market?: string; 
  link?: string; // NOVO: Link direto para a aposta
  odd: string; 
  stake: string; 
  commission: number | null;
  freebet: boolean;
  increase: number | null; 
  lay: boolean;
  finalOdd: number; 
  fixedStake: boolean;
  responsibility: string; 
}

export interface ArbitrageResult {
  profits: number[];
  totalStake: number;
  roi: number;
}

export interface RoundingConfig {
  precision: number; // 0.01, 0.10, 0.50, 1.00
}

export interface FreebetCalculation {
  freebetValue: number;
  extractionRate: number;
  backStake: number;
  layStake: number;
  layLiability: number;
  scenarios: { backWins: number; layWins: number };
  netProfit: number;
  roi: number;
}

export interface CashbackCalculation {
  qualifyingStake: number;
  cashbackRate: number;
  cashbackValue: number;
  coverageStake: number; // lay stake
  layLiability: number;
  scenarios: { qualifyingWins: number; qualifyingLoses: number };
  netProfit: number;
  roi: number;
}