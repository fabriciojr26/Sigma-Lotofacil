import { json, options, readJson } from '../_core/http.js';
import { normalizeDraw } from '../_core/validation.js';
import { checkWallet } from '../_core/checker.js';

export async function onRequestPost({ request }) {
  try {
    const body = await readJson(request);
    const result = normalizeDraw(body.result, 'resultado de conferência');
    if (!Array.isArray(body.wallet) || body.wallet.length === 0) throw new Error('Envie a carteira/cenários para conferência.');
    return json({ ok: true, result, ...checkWallet(body.wallet, result) });
  } catch (error) {
    return json({ ok: false, error: error.message || 'Falha na conferência.' }, 400);
  }
}
export async function onRequestOptions() { return options(); }
export async function onRequest() { return json({ ok: false, error: 'Use POST.' }, 405); }
