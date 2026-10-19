---
name: loto-facil-operador
description: "Operar rotina de atualização de resultados, GitHub e geração auditável de 20 jogos da Lotofácil; tratar falhas de fonte, integrações e trilhas de dados."
---
# Operações — Loto Fácil
## Fonte
Preferir https://loterias.caixa.gov.br/paginas/lotofacil.aspx . O endpoint /portaldeloterias/api/lotofacil no domínio servicebus2.caixa.gov.br é endpoint HTTP público NÃO DOCUMENTADO, não contrato de API. Não confundir HTML oficial com garantia de API estável.

## Antes de atualizar
1. Confirmar repositório vinculado e permissões pelo plugin GitHub. O destino desejado é \`fabriciojr26/LotoFacil\` privado, **ainda pendente de criação** na versão inicial. O legado \`fabriciojr26/Sigma-Lotofacil\` permanece intocado em main.
2. Confirmar concurso, data, 15 dezenas únicas e intervalo sem lacunas; rejeitar conflitos e salvar origem/SHA256/UTC.
3. Conservar proveniência e logs; separar registros provisórios de homologados; se CAIXA falhar, não preencher lacunas com números inventados.
4. Gerar somente 20 bilhetes distintos de 15 dezenas e salvar CSV + JSON com seed, checksum e versão.
5. Comparar previsões antigas contra concursos já realizados; jamais usar t para ajustar previsão que deveria ter sido feita em t-1.
6. Entregar métricas por concurso (11..15 pontos e melhor carteira), logs de erro, versão SHA e estado do agendamento.
7. Não efetuar apostas, compras de bilhetes, depósitos ou pagamentos.
## Agendamento
Uma automação diária do ChatGPT foi ativada por solicitação do usuário como operação provisória. Produção definitiva exige job versionado (GitHub Actions/Cloudflare Cron) implantado, logs verificáveis e permissões mínimas. Plugin não é, por si só, serviço que acorda automaticamente.
