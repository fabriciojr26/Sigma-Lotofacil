# SIGMA NEXUS CORE — Premium V2 Oficial

Pacote oficial do projeto SIGMA, reconstruído para evitar qualquer confusão com outros projetos.

## Identidade

SIGMA NEXUS CORE é um sistema estatístico experimental 25→15 com motor no back-end, dataset interno da Lotofácil até o concurso 3719, upload opcional de dataset, geração experimental de 20 cenários, conferência 11/12/13/14/15 e backtest N→N+1.

## O que este pacote contém

- Nova interface do SIGMA NEXUS CORE;
- animação elétrica/magnética de laboratório;
- módulo de dataset;
- módulo de geração;
- módulo de conferência;
- módulo de backtest;
- motor modular em Cloudflare Pages Functions;
- documentação técnica.

## Estrutura

```text
index.html
assets/
  app.js
  styles.css
functions/
  _core/
  _data/
  api/
docs/
README.md
MANIFESTO_SIGMA.txt
wrangler.toml
package.json
```

## Como publicar

1. Suba esta pasta no Cloudflare Pages.
2. Build command: vazio.
3. Output directory: raiz.
4. Confirme que `functions/` está na raiz.
5. Publique.

## Endpoints

- `/api/ping`
- `/api/dataset/validate`
- `/api/generate`
- `/api/check`
- `/api/backtest`
- `/api/analyze`

## Nota

Este pacote é exclusivamente do projeto SIGMA.
