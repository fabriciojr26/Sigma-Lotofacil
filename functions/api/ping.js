import { json, options } from '../_core/http.js';

export async function onRequest() {
  return json({
    ok: true,
    service: 'SIGMA NEXUS CORE API',
    mode: 'pages-functions-v2.3',
    time: new Date().toISOString()
  });
}

export async function onRequestOptions() { return options(); }
