export function parseNumbers(value) {
  if (Array.isArray(value)) return value.map(Number).filter(Number.isFinite);
  return String(value || '')
    .split(/[^0-9]+/)
    .filter(Boolean)
    .map(Number)
    .filter(Number.isFinite);
}

export function normalizeDraw(numbers, label = 'sorteio') {
  const arr = parseNumbers(numbers).map(Number).sort((a, b) => a - b);
  const unique = [...new Set(arr)];
  if (unique.length !== 15 || arr.length !== 15 || !unique.every(n => Number.isInteger(n) && n >= 1 && n <= 25)) {
    throw new Error(`Informe exatamente 15 dezenas diferentes entre 1 e 25 para ${label}.`);
  }
  return unique;
}

export function validateDataset(draws) {
  if (!Array.isArray(draws) || draws.length < 50) throw new Error('Dataset insuficiente. Envie pelo menos 50 concursos válidos.');
  const normalized = draws.map((draw, i) => {
    const contest = Number(draw.contest || draw.id || i + 1);
    const date = String(draw.date || draw.data || '');
    const numbers = normalizeDraw(draw.numbers || draw.dezenas || draw, `linha ${i + 1}`);
    return { contest: Number.isFinite(contest) ? contest : i + 1, date, numbers };
  }).sort((a, b) => a.contest - b.contest);

  const seen = new Set();
  for (const d of normalized) {
    if (seen.has(d.contest)) throw new Error(`Concurso duplicado detectado: ${d.contest}.`);
    seen.add(d.contest);
  }
  return normalized;
}

export function datasetSummary(draws) {
  return {
    draws: draws.length,
    firstContest: draws[0]?.contest ?? null,
    lastContest: draws[draws.length - 1]?.contest ?? null,
    firstDate: draws[0]?.date ?? '',
    lastDate: draws[draws.length - 1]?.date ?? ''
  };
}
