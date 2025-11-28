import fs from 'fs';
import path from 'path';
import readline from 'readline';
import { loadGameData, startGame, playCard, startTurn, enemyTurn } from './lib/game-engine';

function prompt(question: string) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise<string>((resolve) => rl.question(question, (ans) => { rl.close(); resolve(ans); }));
}

function showState(state: any) {
  console.log('\n=== Hero ===');
  console.log(`${state.hero.name}  HP: ${state.hero.hp}/${state.hero.baseHP}  Block: ${state.hero.block}  Energy: ${state.energy}`);
  console.log('\n=== Enemies ===');
  state.enemies.forEach((e: any, i: number) => console.log(`${i}: ${e.name}  HP: ${e.hp}`));
  console.log('\n=== Hand ===');
  state.hand.forEach((c: any, i: number) => console.log(`${i}: ${c.name} (cost ${c.cost})`));
}

async function runInteractive() {
  const base = path.resolve(process.cwd(), 'data');
  const cards = JSON.parse(fs.readFileSync(path.join(base, 'cards.json'), 'utf-8'));
  const heroes = JSON.parse(fs.readFileSync(path.join(base, 'heroes.json'), 'utf-8'));
  const monsters = JSON.parse(fs.readFileSync(path.join(base, 'monsters.json'), 'utf-8'));

  const data = loadGameData(cards, heroes, monsters);
  const state = startGame(data, 'knight_of_ashes');

  // Spawn a simple enemy for demo
  state.enemies = [{ ...monsters[0] }];

  console.log('Welcome to UnderCrypt - Interactive Demo');

  while (state.hero.hp > 0 && state.enemies.some((e: any) => e.hp > 0)) {
    startTurn(state);
    let turnOver = false;

    while (!turnOver && state.hero.hp > 0 && state.enemies.some((e: any) => e.hp > 0)) {
      showState(state);
      const ans = (await prompt('\nEnter card index to play, `end` to end turn: ')).trim();
      if (ans === 'end') {
        turnOver = true;
        break;
      }
      const idx = Number(ans);
      if (Number.isNaN(idx) || idx < 0 || idx >= state.hand.length) {
        console.log('Invalid selection');
        continue;
      }
      try {
        playCard(state, idx, 0);
        // Remove dead enemies
        state.enemies = state.enemies.filter((e: any) => e.hp > 0);
        if (!state.enemies.length) break;
      } catch (e: any) {
        console.log('Could not play card:', e.message);
      }
    }

    if (state.enemies.some((e: any) => e.hp > 0)) {
      console.log('\nEnemies act...');
      enemyTurn(state);
      console.log(`Hero HP is now ${state.hero.hp}`);
    }
  }

  if (state.hero.hp <= 0) console.log('\nYou were defeated.');
  else console.log('\nAll enemies defeated — victory!');
}

runInteractive().catch((e) => { console.error(e); process.exit(1); });

