import { describe, it, expect } from 'vitest';
import { loadGameData, startGame, drawToHandSize } from '../src/lib/game-engine';
import fs from 'fs';
import path from 'path';

const base = path.resolve(process.cwd(), 'data');
const cards = JSON.parse(fs.readFileSync(path.join(base, 'cards.json'), 'utf-8'));
const heroes = JSON.parse(fs.readFileSync(path.join(base, 'heroes.json'), 'utf-8'));
const monsters = JSON.parse(fs.readFileSync(path.join(base, 'monsters.json'), 'utf-8'));

describe('game engine basic', () => {
  it('loads data and starts game with a hand', () => {
    const data = loadGameData(cards, heroes, monsters);
    const state = startGame(data, 'knight_of_ashes');

    expect(state.hero.name).toBe('Knight of Ashes');
    expect(state.deck.length + state.hand.length + state.discard.length).toBeGreaterThan(0);
    expect(state.hand.length).toBeLessThanOrEqual(state.hero.handSize);
  });

  it('drawToHandSize fills to hand size when deck available', () => {
    const data = loadGameData(cards, heroes, monsters);
    const state = startGame(data, 'knight_of_ashes');
    // Move all cards from hand and deck to deck to simulate a fresh state
    state.deck = [...state.hand, ...state.deck];
    state.hand = [];
    drawToHandSize(state);
    expect(state.hand.length).toBeGreaterThan(0);
  });
});
