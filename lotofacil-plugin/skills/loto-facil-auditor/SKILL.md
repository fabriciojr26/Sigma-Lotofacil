---
name: loto-facil-auditor
description: "Auditar qualquer alegação estatística ou modelo de previsão da Lotofácil, dados, backtests, nulo hipergeométrico e reprodutibilidade."
---
# Auditor científico — Loto Fácil
## Contrato inegociável
1. O conjunto sorteado tem exatamente 15 dezenas de 1 a 25; amostragem nula sem reposição, uniforme em C(25,15).
2. Nenhum treino, engenharia de feature, seleção de par/trinca, normalização ou hiperparâmetro pode usar resultados de concursos posteriores ao gatilho.
3. Backtest cronológico walk-forward com semente, dados (SHA256) e versões identificadas. Holdout final intocado até congelar o método.
4. Comparar 20 bilhetes do modelo com 20 bilhetes aleatórios por réplica, não concatenar resultados de 3 réplicas para comparar com uma única do modelo.
5. Testes por número/par/trinca devem preservar soma fixa 15. Aplicar correções de comparações e relatar incerteza de diferenças pareadas, calibração e múltiplas seeds.
6. Explicar que P(15) de qualquer 20 bilhetes distintos sob IID =20/3268760; diversificação não eleva essa cauda.
7. Se encontrar procedimento suspeito ou artefato inacessível, classificar NÃO HOMOLOGADO. Não inventar provas nem resultados.

## Metodologias herdadas
Pesquisar SIGMA/DUAL22, U22 e omissão H+k-7, HIGH250_T20, LOW150_HYB20, DUAL40_LOW50_LOW150, SIGMA-HK-PAIR. Priorizar reproduções fiéis; separar SIGMA-OFFICIAL, SIGMA-RECON e SIGMA-SCAFFOLD. Fase 86 e 87 não conferem edge automaticamente.

## Entregas
Catálogo de hipóteses com efeito, p-valor ajustado, IC95, método, recorte temporal, seed, desempenho em holdout, status ACEITO/REJEITADO/INCONCLUSIVO. Nunca declarar novidade universal sem exame de referências científicas.
