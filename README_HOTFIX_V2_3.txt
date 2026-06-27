SIGMA NEXUS CORE - Cloudflare Hotfix v2.3 corrigido

Correcoes aplicadas sobre o pacote v2.2:
- Seed deterministica corrigida em functions/_core/generator.js.
- /api/generate agora inclui contest no calculo da seed modular.
- /api/backtest protegido contra endIndex apontando para o ultimo concurso.
- /api/ping adicionado tambem em functions/api/ping.js.
- _worker.js mantido no formato correto de Direct Upload:
  export default { async fetch(request, env, ctx) { ... } }
- Assets estaticos continuam sendo servidos por env.ASSETS.fetch(request).
- APIs continuam respondendo JSON sempre.

Teste esperado apos deploy:
1. Abra a home:
   https://SEU-PROJETO.pages.dev/

2. Teste a API:
   https://SEU-PROJETO.pages.dev/api/ping

Retorno esperado:
{
  "ok": true,
  "service": "SIGMA NEXUS CORE API",
  "mode": "direct-upload-worker-v2.3"
}

Endpoints incluidos:
- GET/POST /api/ping
- POST /api/dataset/validate
- POST /api/generate
- POST /api/check
- POST /api/backtest
- POST /api/analyze

Observacao:
Este pacote e para Cloudflare Pages Direct Upload. O arquivo index.html esta na raiz do ZIP e o worker esta em _worker.js.
