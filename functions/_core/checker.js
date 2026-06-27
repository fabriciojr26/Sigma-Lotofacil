import { intersection } from './math.js';

export function checkWallet(wallet, result) {
  const games = wallet.map(g => {
    const numbers = g.numbers || g;
    const hits = intersection(numbers, result);
    return {
      id: g.id || wallet.indexOf(g) + 1,
      method: g.method || '',
      numbers,
      hits: hits.length,
      hitNumbers: hits,
      band: hits.length >= 15 ? '15' : hits.length >= 14 ? '14' : hits.length >= 13 ? '13' : hits.length >= 12 ? '12' : hits.length >= 11 ? '11' : '<11'
    };
  });
  const summary = {
    bestHit: Math.max(...games.map(g => g.hits)),
    hits11: games.filter(g => g.hits === 11).length,
    hits12: games.filter(g => g.hits === 12).length,
    hits13: games.filter(g => g.hits === 13).length,
    hits14: games.filter(g => g.hits === 14).length,
    hits15: games.filter(g => g.hits === 15).length,
    ge11: games.filter(g => g.hits >= 11).length,
    ge12: games.filter(g => g.hits >= 12).length,
    ge13: games.filter(g => g.hits >= 13).length,
    ge14: games.filter(g => g.hits >= 14).length
  };
  return { summary, games };
}
