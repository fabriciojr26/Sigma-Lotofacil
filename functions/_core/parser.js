import { normalizeDraw } from './validation.js';

export function parseDatasetText(text) {
  const raw = String(text || '').trim();
  if (!raw) return [];

  if (raw.startsWith('[') || raw.startsWith('{')) {
    const parsed = JSON.parse(raw);
    const rows = Array.isArray(parsed) ? parsed : (parsed.draws || parsed.results || parsed.data || []);
    return rows.map((row, i) => normalizeRow(row, i));
  }

  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const output = [];
  for (let i = 0; i < lines.length; i++) {
    const parts = lines[i].split(/[;,\t ]+/).filter(Boolean);
    const nums = parts.map(x => Number(String(x).replace(/\D/g, ''))).filter(Number.isFinite);
    if (nums.length >= 15) {
      const maybeContest = nums.length >= 16 ? nums[0] : i + 1;
      const last15 = nums.slice(-15);
      output.push({ contest: maybeContest, date: '', numbers: normalizeDraw(last15, `linha ${i + 1}`) });
    }
  }
  return output;
}

function normalizeRow(row, i) {
  if (Array.isArray(row)) return { contest: i + 1, date: '', numbers: normalizeDraw(row.slice(-15), `linha ${i + 1}`) };
  const contest = Number(row.contest || row.Concurso || row.id || row.ID || i + 1);
  const date = String(row.date || row.Data || row.data || '');
  const nums = row.numbers || row.dezenas || row.Dezenas || Object.keys(row)
    .filter(k => /bola|dezena|d\d+|^n\d+/i.test(k))
    .sort((a, b) => String(a).localeCompare(String(b), 'pt-BR', { numeric: true }))
    .map(k => row[k]);
  return { contest, date, numbers: normalizeDraw(nums, `linha ${i + 1}`) };
}
