# MANIFESTO DE ARQUIVAMENTO — SIGMA

Data do arquivamento: **2026-06-28**
Repositório: `fabriciojr26/Sigma-Lotofacil`
Visibilidade: pública
Finalidade: preservação e versionamento do sistema SIGMA / Lotofácil / NEXUS CORE.

## Pacote 1 — Site Cloudflare

Arquivo oficial:

```text
SIGMA_NEXUS_LAB_CLOUDFLARE_v1_2_1_DIRECT_SAFE_AUDITADO.zip
```

Uso recomendado:

```text
Cloudflare Pages Direct Upload
```

Conteúdo interno validado:

```text
21 arquivos
```

SHA-256:

```text
933e9ade60a46bdcb5a5ada28df592d19effa7e6fe1a3c2bda86bdef1925b007
```

## Pacote 2 — Métodos / Transferência

Arquivo oficial:

```text
SIGMA_LAB_TRANSFERENCIA_METODOS_v2_1.zip
```

Uso recomendado:

```text
Continuidade técnica, auditoria de métodos, evolução do laboratório e transferência para novo chat/desenvolvedor.
```

Conteúdo interno validado:

```text
61 arquivos
```

SHA-256:

```text
620f4337b28c3140598de7d57e1f4f626821b00c95e97ba513c74f2dc5ed1fcd
```

## Regra de substituição futura

Quando uma nova versão for criada:

1. Criar nova pasta em `archives/AAAA-MM-DD/`.
2. Subir os novos pacotes.
3. Criar novo `CHECKSUMS_SHA256.txt`.
4. Atualizar o `README.md` da raiz com a versão operacional atual.
5. Nunca apagar o histórico Git de versões anteriores.

## Observação crítica

A integridade de cada ZIP deve ser conferida pelo SHA-256 antes de qualquer publicação, deploy ou continuação metodológica.

## Natureza do sistema

O SIGMA é um laboratório estatístico experimental. A base correta de validação é o protocolo cego N→N+1, walk-forward e comparação com baseline aleatório/controlado. Nenhum pacote deve ser descrito como sistema garantido de acerto.