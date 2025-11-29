// Card helper functions for descriptions and emojis
export const cardEmojis: Record<string, string> = {
  // Attack cards
  knight_strike: '⚔️',
  quick_slash: '🗡️',
  heavy_strike: '💥',
  
  // Defense cards
  defend: '🛡️',
  shield_wall: '🏯',
  brace_for_impact: '🛡️',
  
  // Spell cards
  flame_burst: '🔥',
  frost_bolt: '❄️',
  arcane_bolt: '✨',
  
  // Poison & Status
  poison_dagger: '☠️',
  venomous_strike: '🐍',
  
  // Healing
  heal_potion: '🧪',
  greater_healing: '💊',
  inspiring_shout: '📣',
  
  // Utility
  second_wind: '💨',
  momentum: '⚡',
};

export const cardDescriptions: Record<string, string> = {
  // Basic Attacks
  knight_strike: 'Deal 6 damage to an enemy',
  quick_slash: 'Deal 4 quick damage to an enemy',
  heavy_strike: 'Deal 12 heavy damage to an enemy',
  
  // Defensive Cards
  defend: 'Gain 5 block',
  shield_wall: 'Gain 12 block and hold the line',
  brace_for_impact: 'Gain 8 block and prepare for damage',
  
  // Spell Cards
  flame_burst: 'Deal 8 damage to all enemies and inflict burn',
  frost_bolt: 'Deal 6 damage and chill an enemy, reducing their attack by 30%',
  arcane_bolt: 'Deal 5 arcane damage to an enemy',
  
  // Poison & Status
  poison_dagger: 'Deal 3 damage and apply poison (2)',
  venomous_strike: 'Deal 5 damage and heavily poison (3)',
  
  // Healing
  heal_potion: 'Restore 10 health',
  greater_healing: 'Restore 20 health',
  inspiring_shout: 'Heal 5 damage and deal 4 damage to all enemies',
  
  // Utility
  second_wind: 'Draw 1 card. Free to play!',
  momentum: 'Heal 3 health and draw 2 cards',
};

export function getCardDescription(cardId: string): string {
  return cardDescriptions[cardId] || 'Unknown card';
}

export function getCardEmoji(cardId: string): string {
  return cardEmojis[cardId] || '📿';
}

export function getStatusEmoji(statusName: string): string {
  const statusEmojis: Record<string, string> = {
    poison: '☠️',
    burn: '🔥',
    chill: '❄️',
    frozen: '🧊',
  };
  return statusEmojis[statusName] || '⚡';
}

export function getStatusDescription(statusName: string): string {
  const statusDesc: Record<string, string> = {
    poison: 'Takes damage each turn',
    burn: 'Takes double damage each turn',
    chill: '30% reduced attack',
    frozen: 'Skips next attack',
  };
  return statusDesc[statusName] || 'Unknown status';
}
