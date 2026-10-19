# Loto Fácil — Relatório verificável de pesquisa v0.1 (19/10/2026)

## Código e ambiente
Repositório LEGADO (branch de pesquisa): \`fabriciojr26/Sigma-Lotofacil\`
Branch: \`research/lotofacil-lab-v01-20261019\`.
CI aprovado em \`https://github.com/fabriciojr26/Sigma-Lotofacil/actions/runs/39318789436\`.
Sem deploy, sem apostas, sem operação GitHub diária ativada. A automação diária do ChatGPT é um recurso provisório separado.

## Resultado matemático principal
Conjunto de 20 bilhetes com 15 números cada, pairwise overlap <=10, construção determinística seed 20261019. A execução do construtor teve \`restart=0\`, \`tentativas=85\`. A prova de disjunção de eventos >=13 está no arquivo \`docs/TEOREMA_COBERTURA_OTIMA_13PLUS.md\`; certificador e CSV em \`lab/cobertura_otima13.py\`.

Chances **exatas** de ao menos um bilhete atingir cada faixa, sob sorteio 15-de-25 IID justo:
- >=13: \`97520/3268760 = 0.029833943146636645\` (2,9833943%).
- >=14: \`3020/3268760 = 0.0009238977471579437\` (0,09238977%).
- =15: \`20/3268760 = 0.000006118528126873799\` (0,000611853%).

São limites máximos entre 20 bilhetes fixos distintos, não vantagem histórica ou previsão. O limite do 15 não depende da construção: qualquer carteira de 20 bilhetes distintos o atinge.

## Estudo exploratório de carteira K=20, ainda sem otimização 13+
- 6.000 sorteios sintéticos IID gerados após a escolha das carteiras.
- 12 carteiras diversificadas e 12 aleatórias, sempre **K=20**, mesmas 6.000 realizações.
- Semente 20261019.
- \`P(melhor >=11)\` média: diversificado 0,95735, aleatório 0,89081, Δ+0,06654.
- \`P(melhor >=12)\` média: diversificado 0,33429, aleatório 0,30525, Δ+0,02904.
- \`P(melhor >=13)\` média: diversificado 0,02911, aleatório 0,03022, Δ−0,00111.
- \`P(melhor >=14)\` média: diversificado 0,000819, aleatório 0,000944, Δ−0,000125.
- Essas diferenças são **estatísticas simuladas de portfólios selecionados**, sem testes pareados robustos nem validade preditiva.
- Conclusão: o algoritmo inicial maximizava principalmente 11 e 12; foi desenvolvido outro algoritmo com prova exata para 13+/14+/15.

## Artefatos de CI disponibilizados
Run \`39318789436\`: 
- \`LotoFacil-20-jogos-otimos-13plus-demo\`: arquivo CSV e certificado \`prova.json\`.
- \`LotoFacil-plugin-fonte-v0-1\`: arquivo ZIP do plugin privado **apenas empacotado**, ainda NÃO instalado/criado no ChatGPT.
Os artefatos do GitHub Actions expiram após 30 dias; os arquivos de origem versionados permanecem na branch.

## Pendências reais
1. Repositório próprio privado \`fabriciojr26/LotoFacil\` não criado pelas ações disponíveis neste chat. O usuário precisa criar um GitHub repo (https://github.com/new?name=LotoFacil&owner=fabriciojr26&visibility=private), ou conectar ferramenta autorizada com permissão de criação. Preservar branch legada, sem alterar main.
2. Plugin privado: fonte e arquivo ZIP preparados; ação de instalação ainda não executada.
3. Histórico canônico: até concurso 3807 havia relatório preliminar com reconciliação de lacunas; revalidar todo o CSV com a CAIXA antes de permitir backtest ou update versionado.
4. Ferramentas reais de atualização automática e persistência GitHub ainda não habilitadas no repo novo.
5. Backtest walk-forward com carteira otimizada 13+ e baselines por concurso ainda **não executado**; será necessário quando os dados estiverem homologados.

## Critério de honestidade
O experimento de cobertura tem prova combinatória e CI, mas não prevê resultados. Qualquer declaração de ganho preditivo exige signal temporal validado fora da amostra, comparação IID justa, taxas e IC95, seeds e reprodutibilidade.
