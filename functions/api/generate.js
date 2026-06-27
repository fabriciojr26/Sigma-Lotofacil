import { DEFAULT_DRAWS, DEFAULT_DATASET_META } from '../_data/lotofacil3719.js';
import { json, options, readJson } from '../_core/http.js';
import { parseDatasetText } from '../_core/parser.js';
import { normalizeDraw, validateDataset, datasetSummary } from '../_core/validation.js';
import { generateNexusWallet } from '../_core/generator.js';

function resolveHistory(dataset, contest, lastDraw) {
  const c = Number(contest || 0);
  let base = dataset;
  if (c && dataset.some(d => d.contest === c)) base = dataset.filter(d => d.contest <= c);
  if (lastDraw.length) {
    const last = base[base.length - 1];
    if (!last || last.numbers.join(',') !== lastDraw.join(',')) {
      base = [...base, { contest: c || (last?.contest || 0) + 1, date: '', numbers: lastDraw }];
    }
  }
  return base;
}

export async function onRequestPost({ request }) {
  try {
    const body = await readJson(request);
    const uploaded = body.datasetText ? validateDataset(parseDatasetText(body.datasetText)) : null;
    const dataset = uploaded || DEFAULT_DRAWS;
    const lastDraw = body.lastDraw || body.numbers ? normalizeDraw(body.lastDraw || body.numbers, 'último sorteio') : dataset[dataset.length - 1].numbers;
    const history = resolveHistory(dataset, body.contest, lastDraw);
    const out = generateNexusWallet(history, lastDraw, { seed: body.seed, contest: body.contest });
    return json({
      ok: true,
      source: uploaded ? 'uploaded-dataset' : 'internal-dataset-3719',
      defaultDataset: DEFAULT_DATASET_META,
      dataset: datasetSummary(history),
      lastDraw,
      ...out,
      disclaimer: 'Cenários experimentais para validação estatística e conferência. Não é promessa de acerto nem recomendação de aposta.'
    });
  } catch (error) {
    return json({ ok: false, error: error.message || 'Falha ao gerar cenários.' }, 400);
  }
}
export async function onRequestOptions() { return options(); }
export async function onRequest() { return json({ ok: false, error: 'Use POST.' }, 405); }
