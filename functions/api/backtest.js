import { DEFAULT_DRAWS } from '../_data/lotofacil3719.js';
import { json, options, readJson } from '../_core/http.js';
import { generateNexusWallet } from '../_core/generator.js';
import { checkWallet } from '../_core/checker.js';

export async function onRequestPost({ request }) {
  try {
    const body = await readJson(request);
    const minHistory = Math.max(50, Math.min(1000, Number(body.minHistory || 200)));
    const limit = Math.max(20, Math.min(600, Number(body.limit || 200)));
    const end = Math.min(DEFAULT_DRAWS.length - 2, Number(body.endIndex || DEFAULT_DRAWS.length - 2));
    const start = Math.max(minHistory, end - limit + 1);
    const rows = [];
    for (let i = start; i <= end; i++) {
      const history = DEFAULT_DRAWS.slice(0, i + 1);
      const lastDraw = DEFAULT_DRAWS[i].numbers;
      const target = DEFAULT_DRAWS[i + 1].numbers;
      const generated = generateNexusWallet(history, lastDraw, { seed: `bt-${i}`, contest: DEFAULT_DRAWS[i].contest });
      const checked = checkWallet(generated.wallet, target);
      rows.push({
        contestN: DEFAULT_DRAWS[i].contest,
        contestTarget: DEFAULT_DRAWS[i + 1].contest,
        bestHit: checked.summary.bestHit,
        ge11: checked.summary.ge11,
        ge12: checked.summary.ge12,
        ge13: checked.summary.ge13,
        ge14: checked.summary.ge14,
        hits15: checked.summary.hits15
      });
    }
    const summary = {
      tests: rows.length,
      bestHitMax: Math.max(...rows.map(r => r.bestHit)),
      walletsGe11: rows.filter(r => r.bestHit >= 11).length,
      walletsGe12: rows.filter(r => r.bestHit >= 12).length,
      walletsGe13: rows.filter(r => r.bestHit >= 13).length,
      walletsGe14: rows.filter(r => r.bestHit >= 14).length,
      wallets15: rows.filter(r => r.bestHit >= 15).length,
      avgBestHit: Number((rows.reduce((a, r) => a + r.bestHit, 0) / rows.length).toFixed(3))
    };
    return json({ ok: true, summary, rows, disclaimer: 'Backtest parcial/capado para execução serverless. Use para auditoria técnica, não como garantia.' });
  } catch (error) { return json({ ok: false, error: error.message || 'Falha no backtest.' }, 400); }
}
export async function onRequestOptions() { return options(); }
export async function onRequest() { return json({ ok: false, error: 'Use POST.' }, 405); }
