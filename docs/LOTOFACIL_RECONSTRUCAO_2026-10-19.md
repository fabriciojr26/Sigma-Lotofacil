# LOTO FÁCIL — RECUPERAÇÃO E RECONSTRUÇÃO | 19/10/2026

Status: **pré-implementação em branch isolada, NÃO homologado, NÃO publicado em produção**.

## Decisão canônica
Novo produto: **Loto Fácil**. SIGMA e ENIGMA passam a ser acervo técnico de pesquisa, não evidência automática de vantagem. O novo repositório desejado é **fabriciojr26/LotoFacil** (preferencialmente privado). Esta branch no repositório legado serve somente para preservar o checkpoint enquanto o novo repositório não é criado. NÃO sobrescrever o legado e NÃO mesclar este material em `main` sem revisão.

## Repositórios e documentos identificados
- Código legado auditado em leitura: `fabriciojr26/Sigma-Lotofacil`, `main`, Cloudflare Pages + Functions, package 2.4.0.
- Repositório histórico auxiliar: `fabriciojr26/enigma-api-mvp`.
- Legado de pesquisa: SIGMA/DUAL22, família U22 + omissão, `HIGH250_T20`, `LOW150_HYB20`, `DUAL40_LOW50_LOW150`, `SIGMA-HK-PAIR v0.1`.
- Fase 86: vitórias em stress de 300 gatilhos eram **comparativas e exploratórias**; teste final N→N+1 não confirmou 13+/14+/15. Fase 87: scaffold/recon, não reprodução exata do método oficial.
- Handoff de 19/10/2026: série recomposta de 3.807 concursos **não homologada** com oito reparações manuais. Teste 500 concursos de sete modelos simples sem ganho estável; média dos sorteios repetidos ~8,975 vs 9 teórico.

## Auditoria metodológica e correções obrigatórias
1. No sorteio justo, cada aposta simples de 15 tem exatamente P(15)=1/C(25,15), E[acertos]=9 e Var[acertos]=1,5. Para 20 bilhetes simples **distintos**, P(ao menos um 15)=20/C(25,15), INDEPENDENTEMENTE da distribuição dos bilhetes. Diversificação pode afetar a chance de ao menos um 11/12/13/14, mas não a chance de 15 no modelo uniforme.
2. Nulo de coocorrências e pares/trincas deve preservar **15 dezenas sem reposição** em cada concurso; Bernoulli independente entre colunas (p=0,6) não preserva o número fixo de 15 dezenas e induz testes incorretos. Sob IID, P(dois específicos saírem)=(15/25)(14/24)=0,35.
3. Uma comparação de `max_hits(modelo)` em K jogos com `max_hits(random)` em 3K (concatenação de réplicas) **não é comparável**. Cada réplica random deve ter exatamente K jogos e ser agregada após calcular seu máximo.
4. O cálculo de `top_pairs_lift` sobre todo o arquivo, usado depois em previsões retroativas, constitui **vazamento de informação**. Todas as features precisam ser recalculadas apenas até t-1.
5. Atribuir `P(j|i)` a uma matriz normalizada com soma de linha 1 não representa probabilidade marginal de j sair em 15/25 (o correto é 15 inclusões esperadas, não 1).
6. Testes MC com 200 réplicas não resolvem p-valores pequenos suficientes para FDR de milhares de motivos; escolher nível de resolução apropriado, usar teste exato ou validação hierárquica.
7. E[Jaccard] deve ser calculado usando a distribuição hipergeométrica de R, não apenas substituindo E[R] na razão.
8. Testes, relatos e hiperparâmetros anteriores são **hipóteses**, não métodos validados de previsão.

## Fonte e integridade
Fonte autoritativa é o portal público https://loterias.caixa.gov.br/paginas/lotofacil.aspx .
Endpoint HTTP de resultados do domínio CAIXA `https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil`: acessível publicamente, **não documentado como API suportada**; implementar retries/timeouts, checar campos de resposta, falhar em divergências. Arquivar `concurso`, `data`, `dezenas`, `sha256`, `origem`, `capturado_em` e estado `provisorio/homologado`. O CSV público de terceiros apresenta lacunas: concursos 3715, 3759, 3766, 3771, 3790, 3791, 3792, 3794. Corrigir cada um com validação cruzada; rejeitar dataset com buracos, datas inválidas, dezenas fora de 1–25 ou duplicadas.

## Arquitetura-alvo
```
LotoFacil/
  data/                  # CSV homologado e manifestos de fonte
  src/lotofacil/
    caixa.py             # adaptação ao endpoint público
    validation.py        # invariantes 15/25 e linha ordinal
    null.py              # distribuições hipergeométricas exatas
    features.py          # lags, streaks, hazards, pares
    models/              # neutro, hot/cold, regressão e legado auditado
    portfolio.py         # 20 jogos distintos, metas >=11..15
    backtest.py          # walk-forward, holdout, bootstraps
    report.py            # JSON/CSV explicativos
  tests/                 # invariantes, vazamento, reproduzibilidade
  .github/workflows/     # coleta diária APÓS homologação, sem apostas
  docs/                  # método, hipóteses, changelog, resultados
```

## Gates
**G0** reconstruir e reconciliar fonte oficial.
**G1** executar nulo exato e batelada de baselines com K idêntico, seed e CIs pareados.
**G2** replicar SIGMA/DUAL22 e HK-PAIR apenas com implementações recuperadas/claramente recon.
**G3** testar modelos novos em rolling CV; corrigir seleção de modelos e múltiplas hipóteses.
**G4** travar holdout; nenhuma alteração de hiperparâmetro após abertura.
**G5** gerar diariamente 20 bilhetes (modo neutro enquanto nenhuma vantagem for comprovada); consultar e auditar fonte.
**G6** plugin privado do ChatGPT com habilidades separadas: operador GitHub, pesquisador estatístico, auditor de resultados, gerador 20, continuidade. O plugin não executa agendamento sozinho; GitHub Actions ou agendamento externo assegura execução recorrente.
**G7** liberar alegações de vantagem apenas com IC/p-valores/holdout explícitos e comparação justa.

## Primeira conclusão reprodutível (teórica, não resultado empírico)
`C(25,15)=3.268.760`. Para qualquer bilhete simples, `P(15)=1/3.268.760`.
Para 20 bilhetes distintos, `P(ao menos um 15)=20/3.268.760≈0,000006118528`.
É impossível prometer melhora nessa probabilidade pela mera escolha dos 20 bilhetes **sob sorteio IID uniforme**; só informação preditiva verdadeira, comprovada prospectivamente, permitiria superar a chance individual uniforme.

## Status de automação do ChatGPT
Uma rotina flexível diária foi autorizada e criada para consultar o resultado mais recente e gerar 20 jogos, com transparência sobre limitações e sem apostas. Ela é **provisória**; não corresponde a workflow GitHub executado ou plugin já criado.

## Restrição operacional
Não executar apostas nem gastos. Não alterar o legado na main; não publicar credenciais. Ao criar repositório próprio `LotoFacil`, migrar este documento e fazer novos commits apenas em branch de pesquisa, sob auditoria.
