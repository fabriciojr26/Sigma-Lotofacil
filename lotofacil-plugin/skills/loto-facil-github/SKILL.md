---
name: loto-facil-github
description: "Versionar motor, histórico, relatórios e integração contínua do Loto Fácil no GitHub, preservando legado SIGMA e exigindo CI."
---
# GitHub e continuidade
- Confirmar proprietário autenticado e estado de repositórios, branches, HEADs e permissões.
- Repositório-alvo do novo projeto: \`fabriciojr26/LotoFacil\` com visibilidade privada, sem clonar o SIGMA inteiro. Não presumir que já exista. Se ferramenta conectada não puder criar repositório, apresentar interface GitHub de criação, nunca simular sucesso.
- Origem a migrar: \`fabriciojr26/Sigma-Lotofacil\` branch \`research/lotofacil-lab-v01-20261019\`, arquivos \`docs/LOTOFACIL_RECONSTRUCAO_2026-10-19.md\`, \`lab/lotofacil_v01.py\`, \`lab/test_lotofacil_v01.py\`, \`.github/workflows/lab-ci.yml\`, \`lotofacil-plugin/\`.
- Para alterações, criar branch, fazer CI, registrar commit/PR e só aprovar merge quando necessário. Não misturar ambiente de pesquisa com produção e não reescrever o legado.
- Guardar seeds, checksums, fontes e snapshots de resultados. Artefatos com histórico só são canônicos depois de conferidos com a CAIXA. Executar CI em GitHub Actions, não confundir lint/testes unitários com prova de previsão.
- Acompanhar continuamente a literatura e métodos mas classificar variações sem benefício em holdout como tentativas rejeitadas.
