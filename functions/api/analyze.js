import { json, options, readJson } from '../_core/http.js';
import { normalizeDraw } from '../_core/validation.js';
import { profile } from '../_core/statistics.js';
import { combination } from '../_core/math.js';

export async function onRequestPost({ request }) {
  try {
    const body = await readJson(request);
    const numbers = normalizeDraw(body.numbers || body.lastDraw, 'evento');
    return json({
      ok: true,
      numbers,
      profile: profile(numbers),
      totalCombinations: combination(25, 15),
      message: 'Evento analisado estruturalmente.'
    });
  } catch (error) { return json({ ok: false, error: error.message || 'Falha na análise.' }, 400); }
}
export async function onRequestOptions() { return options(); }
export async function onRequest() { return json({ ok: false, error: 'Use POST.' }, 405); }
