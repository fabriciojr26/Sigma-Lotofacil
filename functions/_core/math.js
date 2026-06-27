export function mulberry32(a) {
  return function () {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = Math.imul(a ^ a >>> 15, 1 | a);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function hashSeed(value) {
  const str = String(value || Date.now());
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export const RANGE25 = Array.from({ length: 25 }, (_, i) => i + 1);

export function sum(arr) { return arr.reduce((a, b) => a + b, 0); }
export function avg(arr) { return arr.length ? Number((sum(arr) / arr.length).toFixed(3)) : 0; }
export function clamp(x, lo, hi) { return Math.max(lo, Math.min(hi, x)); }

export function sampleWeighted(items, weights, k, rng) {
  const pool = items.map((item, i) => ({ item, weight: Math.max(0.0001, weights[i] || 0.0001) }));
  const out = [];
  while (out.length < k && pool.length) {
    const total = pool.reduce((a, x) => a + x.weight, 0);
    let r = rng() * total;
    let idx = 0;
    for (; idx < pool.length; idx++) { r -= pool[idx].weight; if (r <= 0) break; }
    out.push(pool[idx].item);
    pool.splice(idx, 1);
  }
  return out.sort((a, b) => a - b);
}

export function intersection(a, b) {
  const s = new Set(b);
  return a.filter(x => s.has(x));
}

export function combination(n, k) {
  if (k < 0 || k > n) return 0;
  k = Math.min(k, n - k);
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return Math.round(r);
}
