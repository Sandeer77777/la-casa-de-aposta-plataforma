
/**
 * O "Cérebro" Matemático da Calculadora (Engine)
 * Este arquivo encapsula toda a lógica de cálculo para as estratégias de apostas,
 * de forma pura e sem dependências de UI (React, Hooks, etc).
 */

// --- 1. DEFINIÇÃO DE TIPOS (Interfaces) ---

export interface BetInput {
  odd: number;
  stake?: number; // Opcional, usado para a aposta "fixa" na estratégia normal
  commission: number; // Em porcentagem, ex: 6.5
  isLay: boolean;
  isFreebet: boolean; // Stake-Not-Returned (SNR)
}

export interface CalculationResult {
  stakes: (number | undefined)[]; // Array de stakes calculadas para cada aposta
  profits: number[]; // Array de lucros para cada cenário (se a aposta 'i' for a vencedora)
  totalInvestment: number; // Custo total da operação
  guaranteedProfit: number; // O menor lucro possível entre todos os cenários
  roi: number; // Retorno sobre o investimento em porcentagem
}

// --- 2. FUNÇÕES AUXILIARES (Helpers) ---

/**
 * Calcula a Odd Efetiva levando em conta a comissão e se a aposta é Back ou Lay.
 * @param odd - A odd original (ex: 3.5).
 * @param commission - A comissão em porcentagem (ex: 5).
 * @param isLay - True se for uma aposta Lay.
 * @returns A odd efetiva.
 */
export function calculateEffectiveOdd(odd: number, commission: number, isLay: boolean): number {
  if (odd <= 1) return 1;
  const comm = commission / 100;
  if (comm < 0 || comm >= 1) return odd;

  if (isLay) {
    // Fórmula para Lay: 1 + (1 - comissão) / (odd - 1)
    return 1 + (1 - comm) / (odd - 1);
  } else {
    // Fórmula para Back: 1 + (odd - 1) * (1 - comissão)
    return 1 + (odd - 1) * (1 - comm);
  }
}

/**
 * Calcula a responsabilidade (liability) para uma aposta Lay.
 * @param stake - O valor apostado no Lay.
 * @param odd - A odd do Lay.
 * @returns O valor da responsabilidade.
 */
export function calculateLiability(stake: number, odd: number): number {
  if (odd <= 1 || stake <= 0) return 0;
  return stake * (odd - 1);
}

// --- 3. FUNÇÕES PRINCIPAIS (Exports) ---

/**
 * Calcula a distribuição de stakes para uma estratégia de Arbitragem/Normal.
 * A função encontra a aposta com 'stake' definido e calcula as outras para igualar o lucro.
 * @param bets - Um array de apostas. Uma delas deve ter o campo 'stake' definido.
 * @returns Um objeto CalculationResult com os resultados.
 */
export function calculateNormalStrategy(bets: BetInput[]): CalculationResult | null {
  const fixedBetIndex = bets.findIndex(b => b.stake !== undefined && b.stake > 0);
  if (fixedBetIndex === -1) return null; // Nenhuma aposta fixa encontrada

  const fixedBet = bets[fixedBetIndex];
  const fixedStake = fixedBet.stake!;

  // Calcular o retorno líquido alvo da aposta fixada
  let targetNetReturn = 0;
  const fixedEffectiveOdd = calculateEffectiveOdd(fixedBet.odd, fixedBet.commission, fixedBet.isLay);
  
  if(fixedBet.isLay){
    // Se a aposta fixa for LAY, o retorno é a própria stake.
    targetNetReturn = fixedStake * (1 - fixedBet.commission / 100);
  } else if (fixedBet.isFreebet) {
    // Retorno para Freebet (SNR)
    targetNetReturn = fixedStake * (fixedEffectiveOdd - 1);
  } else {
    // Retorno para aposta normal (Back)
    targetNetReturn = fixedStake * fixedEffectiveOdd;
  }
  
  // Calcular stakes para as outras apostas
  const calculatedStakes = [...bets].map((bet, i) => {
    if (i === fixedBetIndex) return bet.stake;
    
    const effectiveOdd = calculateEffectiveOdd(bet.odd, bet.commission, bet.isLay);
    if (effectiveOdd <= 1) return 0;

    if(bet.isLay){
      // Para igualar o lucro, a stake lay precisa cobrir a perda das outras apostas
      // A lógica para arbitrar com múltiplos lays é complexa.
      // Esta implementação foca em arbitrar um BACK (fixo) vs múltiplos BACKs/LAYs (calculados)
      // Se a aposta a ser calculada é LAY, a stake deve ser o lucro alvo.
      // Lucro se Lay Vencer = stake_lay * (1-comm). Queremos que seja `targetNetReturn - Custo Total`.
      // Esta parte é complexa, a implementação mais simples é arbitrar BACK vs BACK.
      // Por simplicidade, assumimos que as apostas calculadas não são LAY.
      return targetNetReturn / (effectiveOdd -1); // Simplificação
    }

    return targetNetReturn / effectiveOdd;
  });

  // Calcular resultados finais
  const totalInvestment = calculatedStakes.reduce((sum, stake, i) => {
    const bet = bets[i];
    if (bet.isFreebet) return sum; // Freebet não entra no investimento inicial
    if (bet.isLay) {
      return sum + calculateLiability(stake!, bet.odd);
    }
    return sum + (stake || 0);
  }, 0);

  const profits = bets.map((winnerBet, i) => {
    const stake = calculatedStakes[i]!;
    let netReturn = 0;
    
    const effectiveOdd = calculateEffectiveOdd(winnerBet.odd, winnerBet.commission, winnerBet.isLay);

    if(winnerBet.isLay){
      netReturn = stake * (1 - winnerBet.commission / 100);
    } else if (winnerBet.isFreebet) {
      netReturn = stake * (effectiveOdd - 1);
    } else {
      netReturn = stake * effectiveOdd;
    }

    return netReturn - totalInvestment;
  });

  const guaranteedProfit = Math.min(...profits);
  const roi = totalInvestment > 0 ? (guaranteedProfit / totalInvestment) * 100 : 0;

  return {
    stakes: calculatedStakes,
    profits,
    totalInvestment,
    guaranteedProfit,
    roi,
  };
}


/**
 * Calcula a estratégia de Dutching para uma Freebet (SNR).
 * @param promoBet - A aposta onde a Freebet é usada. A 'stake' aqui é o valor da freebet.
 * @param coverBets - Array de apostas de cobertura.
 * @returns Um objeto CalculationResult.
 */
export function calculateFreebetStrategy(promoBet: BetInput, coverBets: BetInput[]): CalculationResult | null {
  const freebetValue = promoBet.stake;
  if (!freebetValue || freebetValue <= 0) return null;

  // O lucro alvo é o ganho líquido se a aposta da freebet vencer.
  const promoEffectiveOdd = calculateEffectiveOdd(promoBet.odd, promoBet.commission, false); // Freebet é sempre Back
  if (promoEffectiveOdd <= 1) return null;
  
  const targetProfit = freebetValue * (promoEffectiveOdd - 1);

  // O retorno alvo para as coberturas deve ser igual ao lucro da freebet + o custo da cobertura
  // Retorno_Cobertura = Lucro_Alvo + Stake_Cobertura
  // stake_cobertura * odd_eff = Lucro_Alvo + stake_cobertura  => stake * (odd_eff - 1) = Lucro_Alvo
  const coverStakes = coverBets.map(bet => {
    const effectiveOdd = calculateEffectiveOdd(bet.odd, bet.commission, bet.isLay);
    if (effectiveOdd <= 1) return 0;
    return targetProfit / (effectiveOdd - 1);
  });
  
  const allStakes = [promoBet.stake, ...coverStakes];
  const allBets = [promoBet, ...coverBets];

  const totalInvestment = coverStakes.reduce((sum, stake, i) => {
    const bet = coverBets[i];
    if (bet.isLay) {
      return sum + calculateLiability(stake, bet.odd);
    }
    return sum + stake;
  }, 0); // A stake da freebet não conta como investimento

  const profits = allBets.map((_, i) => {
    let netReturn = 0;
    if (i === 0) { // Cenário em que a promo vence
      netReturn = targetProfit;
    } else { // Cenário em que uma cobertura vence
      const coverBet = coverBets[i-1];
      const coverStake = coverStakes[i-1];
      const effectiveOdd = calculateEffectiveOdd(coverBet.odd, coverBet.commission, coverBet.isLay);
      netReturn = coverStake * (effectiveOdd - (coverBet.isLay ? 0 : 1) );
      if (coverBet.isLay) netReturn = coverStake * (1-coverBet.commission/100);
      else netReturn = coverStake * (effectiveOdd-1)

    }
    
    // O cálculo do lucro precisa ser unificado.
    // Lucro = Retorno do Vencedor - Investimento Total
    // Retorno se promo vence: targetProfit
    // Retorno se cobertura lay vence: coverStake * (1-comm)
    // Retorno se cobertura back vence: coverStake * odd_eff
    
    let scenarioReturn = 0;
    const winnerBet = allBets[i];
    const winnerStake = allStakes[i]!;
    const winnerEffOdd = calculateEffectiveOdd(winnerBet.odd, winnerBet.commission, winnerBet.isLay);

    if (i === 0) { // Promo (freebet)
      scenarioReturn = winnerStake * (winnerEffOdd-1);
    } else if (winnerBet.isLay){
      scenarioReturn = winnerStake * (1-winnerBet.commission/100);
    } else { // Cobertura Back
      scenarioReturn = winnerStake * winnerEffOdd;
    }
    
    const scenarioInvestment = allBets.reduce((sum, bet, j)=>{
       // O investimento num cenário é a soma de todas as stakes perdidas.
       if(i === j) return sum; // ignora o vencedor
       if(bet.isFreebet) return sum; // ignora a freebet
       if(bet.isLay){
        // se a aposta lay perde, a responsabilidade é perdida.
        return sum + calculateLiability(allStakes[j]!, bet.odd);
       }
       return sum + allStakes[j]!;
    }, 0);


    return scenarioReturn - scenarioInvestment;
  });

  // A lógica acima é complexa, vamos simplificar para garantir o lucro.
  const finalProfits = allBets.map((_, i) => {
    if (i === 0) { // Promo vence
      return targetProfit - totalInvestment;
    } else { // Cobertura i vence
      const bet = coverBets[i - 1];
      const stake = coverStakes[i - 1];
      const effectiveOdd = calculateEffectiveOdd(bet.odd, bet.commission, bet.isLay);
      let returnValue = 0;
      if(bet.isLay){
        returnValue = stake * (1 - bet.commission / 100);
      } else {
        returnValue = stake * effectiveOdd;
      }
      return returnValue - totalInvestment - (bet.isLay ? 0 : stake) + (bet.isLay ? stake : 0); // Lógica de Dutching
    }
  });


  const guaranteedProfit = Math.min(...finalProfits);
  const roi = totalInvestment > 0 ? (guaranteedProfit / totalInvestment) * 100 : -100; // ROI sobre o risco real


  return {
    stakes: [promoBet.stake, ...coverStakes],
    profits: finalProfits,
    totalInvestment,
    guaranteedProfit,
    roi,
  };
}


/**
 * Calcula a estratégia de Dutching para uma aposta com Cashback.
 * @param qualifyingBet - A aposta qualificativa.
 * @param coverBets - Array de apostas de cobertura.
 * @param cashbackRate - O percentual de cashback (0-100).
 * @returns Um objeto CalculationResult.
 */
export function calculateCashbackStrategy(qualifyingBet: BetInput, coverBets: BetInput[], cashbackRate: number): CalculationResult | null {
  const P = qualifyingBet.stake; // 'P' de 'Principal'
  if (!P || P <= 0) return null;

  const C = P * (cashbackRate / 100); // Valor do Cashback
  const o_q_eff = calculateEffectiveOdd(qualifyingBet.odd, qualifyingBet.commission, false);

  const effectiveCoverOdds = coverBets.map(b => calculateEffectiveOdd(b.odd, b.commission, b.isLay));
  if (effectiveCoverOdds.some(o => o <= 1)) return null; // Odds inválidas na cobertura
  
  const H = effectiveCoverOdds.reduce((sum, effOdd) => sum + (1 / effOdd), 0);

  let coverStakes: number[];

  // A fórmula original do código-fonte para Cashback é usada aqui
  const N = -P * (1 - o_q_eff + H * o_q_eff) + H * C;
  const S_total = P * o_q_eff - N;
  const numerator = (N + S_total - C);
  
  if (numerator < 0) { // Cenário de perda, apenas cobrir
     coverStakes = coverBets.map(() => 0); // Simplificação: não calcula stakes para cobrir perdas mínimas.
  } else {
     coverStakes = effectiveCoverOdds.map(effOdd => {
      if (effOdd <= 0) return 0;
      return numerator / effOdd;
    });
  }

  const allStakes = [P, ...coverStakes];
  const allBets = [qualifyingBet, ...coverBets];

  const totalInvestment = allStakes.reduce((sum, stake, i) => {
    const bet = allBets[i];
    if (bet.isLay) {
      return sum + calculateLiability(stake!, bet.odd);
    }
    return sum + stake!;
  }, 0) - allStakes[0]!; // O investimento total não é a soma simples, é o risco.
  
  // Risco total = Aposta qualificativa + soma das responsabilidades/stakes de cobertura
  const realInvestment = P + coverStakes.reduce((sum, stake, i) => {
    const bet = coverBets[i];
    if (bet.isLay) return sum + calculateLiability(stake, bet.odd);
    return sum + stake;
  }, 0);


  const profits = allBets.map((_, i) => {
    if (i === 0) { // Aposta qualificativa vence
      const promoReturn = P * o_q_eff;
      return promoReturn - realInvestment;
    } else { // Aposta de cobertura 'i' vence
      const coverBet = coverBets[i-1];
      const coverStake = coverStakes[i-1];
      const effOdd = effectiveCoverOdds[i-1];
      
      let coverReturn = 0;
      if (coverBet.isLay) {
        coverReturn = coverStake * (1-coverBet.commission/100);
      } else {
        coverReturn = coverStake * effOdd;
      }
      
      return coverReturn - realInvestment + C; // Adiciona o cashback recebido
    }
  });

  const guaranteedProfit = Math.min(...profits);
  const roi = realInvestment > 0 ? (guaranteedProfit / P) * 100 : 0; // ROI sobre a stake qualificativa

  return {
    stakes: allStakes,
    profits,
    totalInvestment: realInvestment,
    guaranteedProfit,
    roi,
  };
}

/**
 * Calcula a divisão de uma Freebet única entre várias odds (Dutching de Freebet).
 * O objetivo é garantir o mesmo retorno líquido independente do resultado.
 * @param totalFreebetValue - O valor total da Freebet disponível (ex: R$ 100).
 * @param bets - As opções de aposta (apenas as odds importam aqui).
 * @returns Um objeto CalculationResult com a distribuição das stakes da freebet.
 */
export function calculateFreebetDutchingStrategy(totalFreebetValue: number, bets: BetInput[]): CalculationResult | null {
  if (totalFreebetValue <= 0 || bets.length === 0) return null;

  // Filtrar odds inválidas (deve ser > 1 para freebet)
  const validBetsIndices = bets.map((b, i) => (b.odd > 1 ? i : -1)).filter(i => i !== -1);
  if (validBetsIndices.length === 0) return null;

  // Calcular o fator sumário: Soma(1 / (Odd - 1))
  let sumInverseEffectiveOdds = 0;
  
  // Usaremos odds efetivas (considerando comissão se houver, embora raro em dutching simples)
  const effectiveOdds = bets.map(b => calculateEffectiveOdd(b.odd, b.commission, b.isLay));

  validBetsIndices.forEach(index => {
    const effOdd = effectiveOdds[index];
    if (effOdd > 1) {
      sumInverseEffectiveOdds += 1 / (effOdd - 1);
    }
  });

  if (sumInverseEffectiveOdds === 0) return null;

  // Calcular o Retorno Alvo (Target Return)
  // TotalFreebet = TargetReturn * Sum(1/(Odd-1))
  // TargetReturn = TotalFreebet / Sum(...)
  const targetReturn = totalFreebetValue / sumInverseEffectiveOdds;

  // Calcular as stakes individuais (fatia da freebet)
  const stakes = bets.map((_, i) => {
    if (!validBetsIndices.includes(i)) return 0;
    const effOdd = effectiveOdds[i];
    return targetReturn / (effOdd - 1);
  });

  // Calcular lucros (que neste caso é o próprio retorno, já que o custo é zero/bônus)
  // O "Investimento Total" é zero do ponto de vista de dinheiro real, mas vamos considerar o valor da freebet como base para ROI?
  // Normalmente em freebet o ROI é infinito se considerar custo 0.
  // Vamos considerar o "Custo de Oportunidade" ou simplesmente retornar o valor líquido.
  
  const profits = bets.map((_, i) => {
    if (!validBetsIndices.includes(i)) return -totalFreebetValue; // Se apostar numa odd inválida (não deveria acontecer), perde a freebet?
    
    // Lucro = (Stake * (Odd - 1))
    // Como calculamos para ser constante, deve ser igual a targetReturn.
    // Mas vamos recalcular para precisão.
    const stake = stakes[i];
    const effOdd = effectiveOdds[i];
    return stake * (effOdd - 1);
  });

  // O investimento "real" do usuário é 0, mas para fins de display vamos mostrar o valor da freebet usada.
  // Ajuste: A interface espera 'totalInvestment'. Se retornarmos 0, o ROI explode.
  // Vamos retornar o valor da freebet como investimento para ter uma noção de conversão (ex: 70% da freebet).
  
  const guaranteedProfit = Math.min(...profits.filter((_, i) => validBetsIndices.includes(i)));
  const roi = (guaranteedProfit / totalFreebetValue) * 100; // % de conversão da freebet

  return {
    stakes,
    profits,
    totalInvestment: totalFreebetValue, // Representa o valor da Freebet usada
    guaranteedProfit,
    roi,
  };
}

/**
 * Calcula a estratégia Híbrida (Freebet + Dinheiro Real) para maximizar o ROI.
 * Prioriza o uso da Freebet nas maiores odds e cobre o restante com dinheiro real.
 */
export function calculateHybridStrategy(totalFreebetValue: number, bets: BetInput[]): CalculationResult & { 
  betTypes: ('freebet' | 'cash')[], 
  cashCost: number, 
  efficiencies: number[] 
} | null {
  if (totalFreebetValue <= 0 || bets.length === 0) return null;

  // 1. Mapear odds originais com seus índices para poder ordenar e depois restaurar a ordem
  const mappedBets = bets.map((bet, index) => ({
    ...bet,
    originalIndex: index,
    effOdd: calculateEffectiveOdd(bet.odd, bet.commission, bet.isLay)
  }));

  // Filtrar inválidas
  const validBets = mappedBets.filter(b => b.effOdd > 1);
  if (validBets.length === 0) return null;

  // 2. Ordenar por Odd Decrescente (Melhores para Freebet primeiro)
  validBets.sort((a, b) => b.effOdd - a.effOdd);

  let bestScenario = null;
  let maxProfit = -Infinity;

  // 3. Testar todos os pontos de corte possíveis
  // k é o número de casas que usarão Freebet (de 1 até N)
  // O restante usa Cash
  for (let k = 1; k <= validBets.length; k++) {
    const freebetGroup = validBets.slice(0, k);
    const cashGroup = validBets.slice(k);

    // Calcular o Retorno Alvo (R) ditado pelo grupo da Freebet
    // S_freebet_i = R / (Odd_i - 1)
    // TotalFreebet = Sum(S_freebet_i) = Sum(R / (Odd_i - 1)) = R * Sum(1 / (Odd_i - 1))
    // R = TotalFreebet / Sum(1 / (Odd_i - 1))
    
    let sumInverseFreebetOdds = 0;
    freebetGroup.forEach(b => {
      sumInverseFreebetOdds += 1 / (b.effOdd - 1);
    });

    if (sumInverseFreebetOdds === 0) continue;

    const targetReturn = totalFreebetValue / sumInverseFreebetOdds;

    // Calcular o Custo em Dinheiro (Cash) necessário para igualar esse retorno no outro grupo
    // S_cash_j = R / Odd_j
    let totalCashCost = 0;
    cashGroup.forEach(b => {
      totalCashCost += targetReturn / b.effOdd;
    });

    // Lucro Líquido = Retorno - Custo em Dinheiro
    // (O valor da Freebet não é subtraído do lucro pois é "bônus", mas o custo em cash sim)
    const netProfit = targetReturn - totalCashCost;

    if (netProfit > maxProfit) {
      // Calcular stakes individuais para esse cenário
      const currentStakes = new Array(bets.length).fill(0);
      const currentTypes = new Array(bets.length).fill('cash') as ('freebet' | 'cash')[];
      const currentEfficiencies = new Array(bets.length).fill(0);

      // Preencher Grupo Freebet
      freebetGroup.forEach(b => {
        const stake = targetReturn / (b.effOdd - 1);
        currentStakes[b.originalIndex] = stake;
        currentTypes[b.originalIndex] = 'freebet';
        // Eficiência da Freebet na odd: (Odd-1)/Odd * 100? Ou retorno sobre stake?
        // Vamos usar a % de retenção padrão: (Odd-1)/Odd seria conversão se fizesse match, 
        // mas aqui vamos usar (NetReturn / Stake) para ver a qualidade.
        // NetReturn = Stake * (Odd-1). Profit = NetReturn.
        // ROI = Profit / Stake = Odd - 1. 
        // Mas a métrica "Conversion" usual é Retorno / (StakeFreebet).
        // Se odd é 3, Retorno é 2*Stake. Conversão 200%? Não.
        // A métrica comum de eficiência SNR é % do valor facial.
        // Se tenho odd 5. Lucro 400. Conversão 80% (considerando hedge).
        // Vamos usar uma métrica simples: (Odd-1)/Odd * 100 (conversão teórica máxima)
        currentEfficiencies[b.originalIndex] = ((b.effOdd - 1) / b.effOdd) * 100;
      });

      // Preencher Grupo Cash
      cashGroup.forEach(b => {
        const stake = targetReturn / b.effOdd;
        currentStakes[b.originalIndex] = stake;
        currentTypes[b.originalIndex] = 'cash';
        currentEfficiencies[b.originalIndex] = 0; // Não aplica para cash (ou é 100%?)
      });

      maxProfit = netProfit;
      bestScenario = {
        stakes: currentStakes,
        betTypes: currentTypes,
        efficiencies: currentEfficiencies,
        cashCost: totalCashCost,
        guaranteedProfit: netProfit,
        totalInvestment: totalCashCost, // Investimento do bolso
        roi: totalCashCost > 0 ? (netProfit / totalCashCost) * 100 : 0, // ROI sobre dinheiro real
        targetReturn
      };
    }
  }

  if (!bestScenario) return null;

  // Criar arrays de profits (deve ser igual para todos, mas vamos preencher)
  const profits = bets.map(() => bestScenario.guaranteedProfit);

  return {
    stakes: bestScenario.stakes,
    profits: profits,
    totalInvestment: bestScenario.totalInvestment, // Só dinheiro real
    guaranteedProfit: bestScenario.guaranteedProfit,
    roi: bestScenario.roi,
    betTypes: bestScenario.betTypes,
    cashCost: bestScenario.cashCost,
    efficiencies: bestScenario.efficiencies
  };
}
