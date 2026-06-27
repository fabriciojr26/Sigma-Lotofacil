import { DEFAULT_DRAWS, DEFAULT_DATASET_META } from '../../_data/lotofacil3719.js';
import { json, options, readJson } from '../../_core/http.js';
import { parseDatasetText } from '../../_core/parser.js';
import { validateDataset, datasetSummary } from '../../_core/validation.js';

export async function onRequestPost({ request }) {
  try {
    const body = await readJson(request);
    const dataset = body.datasetText ? validateDataset(parseDatasetText(body.datasetText)) : DEFAULT_DRAWS;
    return json({
      ok: true,
      source: body.datasetText ? 'uploaded-dataset' : 'internal-dataset-3719',
      summary: datasetSummary(dataset),
      defaultDataset: DEFAULT_DATASET_META,
      message: 'Dataset validado com sucesso.'
    });
  } catch (error) {
    return json({ ok: false, error: error.message || 'Dataset inválido.' }, 400);
  }
}
export async function onRequestOptions() { return options(); }
export async function onRequest() { return json({ ok: false, error: 'Use POST.' }, 405); }
