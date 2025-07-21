/*
 * NPC Decision Logic for 4-Player No-Limit Texas Hold'em
 * Small Blind = 10, Big Blind = 20
 */

enum Style {
  Aggressive = 'aggressive',
  Normal     = 'normal',
  Tight      = 'tight'
}


// Represent a card as string, e.g. 'As' for Ace of spades
type Card = string;

// Configuration for an NPC
interface NPCConfig {
  style: Style;
  stack: number;           // current stack in chips
  position: number;
  tightness: number;       // [0..1], lower = looser
  bluffFactor: number;     // [0..1], chance to bluff
}

// Decision result
interface Decision {
  action: 'fold' | 'call' | 'raise' | 'all-in';
  amount?: number;
  reason?: string;
}

// Constants
const SMALL_BLIND = 10;
const BIG_BLIND   = 20;
const SMALL_STACK_THRESHOLD = 40 * BIG_BLIND; // 40 BB

// Calculate break-even equity for a call
function calculateBreakEvenEquity(call: number, pot: number): number {
  return call / (pot + call);
}

// Style-based factors
function getStyleFactors(style: Style) {
  switch (style) {
    case Style.Aggressive:
      return { foldFactor: 0.8, raiseFactor: 1.2, raiseSizeFactor: 1.0 };
    case Style.Normal:
      return { foldFactor: 1.0, raiseFactor: 1.5, raiseSizeFactor: 0.66 };
    case Style.Tight:
      return { foldFactor: 1.2, raiseFactor: 2.0, raiseSizeFactor: 0.5 };
  }
}

// Adjust a threshold based on position
function adjustByPosition(value: number, position: number): number {
  if (position === 0) return value * 1.1;   // tighter
  if (position === 3)  return value * 0.9;   // looser
  return value;                                         // middle
}

// Core decision logic
function decideAction(
  equity: number,          // estimated win probability [0..1]
  pot: number,             // current pot size
  callAmount: number,      // chips required to call
  config: NPCConfig
): Decision {
  const E_break = calculateBreakEvenEquity(callAmount, pot);
  const { foldFactor, raiseFactor, raiseSizeFactor } = getStyleFactors(config.style);

  // thresholds
  let foldThreshold  = adjustByPosition(foldFactor  * E_break, config.position);
  let raiseThreshold = adjustByPosition(raiseFactor * E_break, config.position);

  const isShort = config.stack <= SMALL_STACK_THRESHOLD;

  // 1) Weak
  if (equity < foldThreshold) {
    if (config.style === Style.Aggressive && Math.random() < config.bluffFactor) {
      const amount = Math.max(2 * BIG_BLIND, callAmount + Math.round(0.25 * pot));
      return { action: 'raise', amount, reason: 'aggressive bluff' };
    }
    return { action: 'fold', reason: 'equity below fold threshold' };
  }

  // 2) Strong
  if (equity >= raiseThreshold) {
    if (isShort) {
      return { action: 'all-in', amount: config.stack, reason: 'short stack push' };
    }
    const base = callAmount + Math.round(raiseSizeFactor * pot);
    const noise = 1 + (Math.random() * 0.2 - 0.1);
    const amt   = Math.min(config.stack, Math.max(base, 2 * BIG_BLIND));
    return { action: 'raise', amount: Math.round(amt * noise), reason: 'equity above raise threshold' };
  }

  // 3) Medium
  if (config.style === Style.Aggressive && Math.random() < config.bluffFactor * 0.5) {
    const amount = Math.max(2 * BIG_BLIND, callAmount + Math.round(0.5 * pot));
    return { action: 'raise', amount, reason: 'semi-bluff' };
  }
  return { action: 'call', reason: 'medium equity, default call' };
}

// New wrapper: decide based on hole cards, community cards & precomputed equity
export function getNPCDecision(
  config: NPCConfig,
  holeCards: [Card, Card],
  equity: number,        // precomputed hand+board equity [0..1]
  pot: number,
  callAmount: number
): Decision {
  // Optionally: validate inputs
  if (holeCards.length !== 2) throw new Error('Require exactly 2 hole cards');
  if (equity < 0 || equity > 1) throw new Error('Equity must be between 0 and 1');

  // Could insert Monte-Carlo here to recompute equity if needed

  // Delegate to core logic
  return decideAction(equity, pot, callAmount, config);
}

// Example usage:
// const config: NPCConfig = { style: Style.Normal, stack: 1000, position: Position.Middle, tightness: 0.5, bluffFactor: 0.1 };
// const decision = getNPCDecision(config, ['As','Kd'], ['Jh','7c','2s'], 0.35, 150, 20);
// console.log(decision);
