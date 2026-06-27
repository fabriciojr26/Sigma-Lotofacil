# SIGMA NEXUS CORE â€” Premium V2 Oficial

Pacote oficial do projeto SIGMA, reconstruÃ­do para evitar qualquer confusÃ£o com outros projetos.

## Identidade

SIGMA NEXUS CORE Ã© um sistema estatÃ­stico experimental 25â†’15 com motor no back-end, dataset interno da LotofÃ¡cil atÃ© o concurso 3719, upload opcional de dataset, geraÃ§Ã£o experimental de 20 cenÃ¡rios, conferÃªncia 11/12/13/14/15 e backtest Nâ†’N+1.

## O que este pacote contÃ©m

- Nova interface do SIGMA NEXUS CORE;
- animaÃ§Ã£o elÃ©trica/magnÃ©tica de laboratÃ³rio;
- mÃ³dulo de dataset;
- mÃ³dulo de geraÃ§Ã£o;
- mÃ³dulo de conferÃªncia;
- mÃ³dulo de backtest;
- motor modular em Cloudflare Pages Functions;
- documentaÃ§Ã£o tÃ©cnica.

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
4. Confirme que `functions/` estÃ¡ na raiz.
5. Publique.

## Endpoints

- `/api/ping`
- `/api/dataset/validate`
- `/api/generate`
- `/api/check`
- `/api/backtest`
- `/api/analyze`

## Nota

Este pacote Ã© exclusivamente do projeto SIGMA.
