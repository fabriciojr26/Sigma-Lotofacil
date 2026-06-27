import { RANGE25, avg, sum, intersection } from './math.js';

export function frequency(draws, windowSize = draws.length) {
  const slice = draws.slice(Math.max(0, draws.length - windowSize));
  const freq = Object.fromEntries(RANGE25.map(n => [n, 0]));
  for (const draw of slice) for (const n of draw.numbers) freq[n]++;
  return freq;
}

export function delay(draws) {
  const out = Object.fromEntries(RANGE25.map(n => [n, draws.length]));
  for (let i = draws.length - 1; i >= 0; i--) {
    for (const n of draws[i].numbers) if (out[n] === draws.length) out[n] = draws.length - 1 - i;
  }
  return out;
}

export function pairMatrix(draws, windowSize = 500) {
  const slice = draws.slice(Math.max(0, draws.length - windowSize));
  const matrix = Array.from({ length: 26 }, () => Array(26).fill(0));
  for (const draw of slice) {
    const nums = draw.numbers;
    for (let i = 0; i < nums.length; i++) for (let j = i + 1; j < nums.length; j++) {
      matrix[nums[i]][nums[j]]++;
      matrix[nums[j]][nums[i]]++;
    }
  }
  return matrix;
}

export function transitionProfile(draws, windowSize = 500) {
  const start = Math.max(0, draws.length - windowSize - 1);
  const counts = {};
  for (let i = start; i < draws.length - 1; i++) {
    const hits = intersection(draws[i].numbers, draws[i + 1].numbers).length;
    counts[hits] = (counts[hits] || 0) + 1;
  }
  const entries = Object.entries(counts).map(([k, v]) => [Number(k), v]).sort((a, b) => b[1] - a[1]);
  return { distribution: counts, targetRepeat: entries[0]?.[0] || 9 };
}

export function profile(numbers, lastDraw = []) {
  const even = numbers.filter(n => n % 2 === 0).length;
  const odd = numbers.length - even;
  const low = numbers.filter(n => n <= 13).length;
  const high = numbers.length - low;
  const s = sum(numbers);
  const repeat = lastDraw.length ? intersection(numbers, lastDraw).length : null;
  return {
    even, odd, low, high,
    sum: s,
    range: Math.max(...numbers) - Math.min(...numbers),
    repeatFromLast: repeat
  };
}

export function walletMetrics(wallet, lastDraw = []) {
  const profiles = wallet.map(g => profile(g.numbers, lastDraw));
  const used = new Set(wallet.flatMap(g => g.numbers));
  let overlapSum = 0, pairs = 0;
  for (let i = 0; i < wallet.length; i++) for (let j = i + 1; j < wallet.length; j++) {
    overlapSum += intersection(wallet[i].numbers, wallet[j].numbers).length;
    pairs++;
  }
  const byProfile = {};
  for (const g of wallet) byProfile[g.method] = (byProfile[g.method] || 0) + 1;
  return {
    count: wallet.length,
    avgSum: avg(profiles.map(p => p.sum)),
    avgEven: avg(profiles.map(p => p.even)),
    avgLow: avg(profiles.map(p => p.low)),
    avgRepeatFromLast: lastDraw.length ? avg(profiles.map(p => p.repeatFromLast)) : null,
    avgOverlap: pairs ? Number((overlapSum / pairs).toFixed(3)) : 0,
    coverage: used.size,
    missing: RANGE25.filter(n => !used.has(n)),
    byProfile
  };
}
