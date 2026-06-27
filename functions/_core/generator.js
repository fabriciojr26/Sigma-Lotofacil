import { RANGE25, sampleWeighted, mulberry32, hashSeed, clamp, intersection } from './math.js';
import { frequency, delay, pairMatrix, transitionProfile, profile, walletMetrics } from './statistics.js';

function normalizeMap(map) {
  const vals = RANGE25.map(n => map[n] || 0);
  const min = Math.min(...vals), max = Math.max(...vals);
  return Object.fromEntries(RANGE25.map(n => [n, max === min ? 0.5 : ((map[n] || 0) - min) / (max - min)]));
}

function pairScoreFor(n, lastDraw, matrix) {
  if (!lastDraw.length) return 0;
  return lastDraw.reduce((a, x) => a + matrix[n][x], 0) / lastDraw.length;
}

function buildScores(draws, lastDraw) {
  const fAll = normalizeMap(frequency(draws));
  const fRecent = normalizeMap(frequency(draws, Math.min(200, draws.length)));
  const d = normalizeMap(delay(draws));
  const pairs = pairMatrix(draws, Math.min(600, draws.length));
  const pairRaw = Object.fromEntries(RANGE25.map(n => [n, pairScoreFor(n, lastDraw, pairs)]));
  const p = normalizeMap(pairRaw);
  const scores = {};
  for (const n of RANGE25) scores[n] = 0.28 * fRecent[n] + 0.18 * fAll[n] + 0.22 * d[n] + 0.20 * p[n] + 0.12;
  return { scores, fAll, fRecent, delayNorm: d, pairNorm: p, transition: transitionProfile(draws) };
}

function scoreCandidate(nums, ctx, method, wallet) {
  const { scores, transition } = ctx;
  const p = profile(nums, ctx.lastDraw);
  let score = nums.reduce((a, n) => a + scores[n], 0) / 15;
  score -= Math.abs(p.even - 7.2) * 0.025;
  score -= Math.abs(p.low - 8.0) * 0.022;
  score -= Math.abs(p.sum - 195) * 0.0025;
  if (p.repeatFromLast !== null) score -= Math.abs(p.repeatFromLast - transition.targetRepeat) * 0.030;
  if (method === 'DIVERSITY-SHIELD' && wallet.length) {
    const maxOverlap = Math.max(...wallet.map(g => intersection(nums, g.numbers).length));
    score -= Math.max(0, maxOverlap - 10) * 0.06;
  }
  if (method === 'TAIL-SPARK') {
    score += nums.reduce((a, n) => a + ctx.delayNorm[n], 0) / 15 * 0.14;
  }
  return score;
}

function makeCandidate(ctx, method, rng) {
  const weights = RANGE25.map(n => {
    let w = ctx.scores[n];
    if (method === 'CORE-TRANSITION' && ctx.lastDraw.includes(n)) w *= 1.28;
    if (method === 'DIVERSITY-SHIELD') w = 0.55 * w + 0.45;
    if (method === 'TAIL-SPARK') w = 0.45 * w + 0.55 * ctx.delayNorm[n] + 0.15;
    return Math.max(0.01, w);
  });

  if (ctx.lastDraw.length) {
    const target = clamp(ctx.transition.targetRepeat + Math.round((rng() - 0.5) * 2), 7, 11);
    const inLast = [...ctx.lastDraw];
    const outLast = RANGE25.filter(n => !ctx.lastDraw.includes(n));
    const inWeights = inLast.map(n => weights[n - 1]);
    const outWeights = outLast.map(n => weights[n - 1]);
    const a = sampleWeighted(inLast, inWeights, Math.min(target, 15), rng);
    const b = sampleWeighted(outLast, outWeights, 15 - a.length, rng);
    return [...a, ...b].sort((x, y) => x - y);
  }
  return sampleWeighted(RANGE25, weights, 15, rng);
}

function pickBest(ctx, method, wallet, rng) {
  let best = null, bestScore = -Infinity;
  for (let i = 0; i < 120; i++) {
    const cand = makeCandidate(ctx, method, rng);
    const key = cand.join(',');
    if (wallet.some(g => g.key === key)) continue;
    const s = scoreCandidate(cand, ctx, method, wallet);
    if (s > bestScore) { bestScore = s; best = cand; }
  }
  return best || makeCandidate(ctx, method, rng);
}

export function generateNexusWallet(draws, lastDraw, options = {}) {
  const seed = hashSeed(`${options.seed || ''}|${draws.length}|${lastDraw.join('-')}|${options.contest || ''}`);
  const rng = mulberry32(seed);
  const ctx = { ...buildScores(draws, lastDraw), lastDraw };
  const methods = [
    ...Array(6).fill('CORE-TRANSITION'),
    ...Array(6).fill('NEXUS-HYBRID'),
    ...Array(5).fill('DIVERSITY-SHIELD'),
    ...Array(3).fill('TAIL-SPARK')
  ];
  const wallet = [];
  for (let i = 0; i < 20; i++) {
    const method = methods[i];
    const numbers = pickBest(ctx, method, wallet, rng);
    wallet.push({
      id: i + 1,
      method,
      numbers,
      key: numbers.join(','),
      profile: profile(numbers, lastDraw),
      score: Number(scoreCandidate(numbers, ctx, method, wallet).toFixed(5))
    });
  }
  for (const g of wallet) delete g.key;
  return {
    wallet,
    meta: {
      seed,
      methods: [...new Set(methods)],
      targetRepeat: ctx.transition.targetRepeat,
      datasetSize: draws.length,
      mode: 'research-experimental'
    },
    metrics: walletMetrics(wallet, lastDraw)
  };
}
