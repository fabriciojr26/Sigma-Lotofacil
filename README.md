# SIGMA LOTOFÁCIL — REPOSITÓRIO-ARQUIVO

Este repositório é o cofre público de arquivamento do projeto **SIGMA / Lotofácil / NEXUS CORE**.

A função deste repositório não é prometer resultado de jogo. A função é preservar, versionar e permitir substituição controlada dos pacotes oficiais do sistema.

## Estado atual do arquivo

Versão arquivada em: **2026-06-28**

Pacotes oficiais desta rodada:

1. **SIGMA_NEXUS_LAB_CLOUDFLARE_v1_2_1_DIRECT_SAFE_AUDITADO.zip**
   - Finalidade: pacote do site para Cloudflare Pages Direct Upload.
   - Tamanho local validado: 71.607 bytes.
   - Quantidade de arquivos internos: 21.
   - SHA-256: `933e9ade60a46bdcb5a5ada28df592d19effa7e6fe1a3c2bda86bdef1925b007`

2. **SIGMA_LAB_TRANSFERENCIA_METODOS_v2_1.zip**
   - Finalidade: pacote completo de transferência metodológica, scripts, relatórios, dados e Cloudflare embutido.
   - Tamanho local validado: 517.868 bytes.
   - Quantidade de arquivos internos: 61.
   - SHA-256: `620f4337b28c3140598de7d57e1f4f626821b00c95e97ba513c74f2dc5ed1fcd`

## Como usar

### Para publicar o site

Use o pacote:

```text
SIGMA_NEXUS_LAB_CLOUDFLARE_v1_2_1_DIRECT_SAFE_AUDITADO.zip
```

Esse pacote é a base de publicação direta no Cloudflare Pages.

### Para continuar o desenvolvimento dos métodos

Use o pacote:

```text
SIGMA_LAB_TRANSFERENCIA_METODOS_v2_1.zip
```

Esse pacote é a base de continuidade técnica do laboratório SIGMA.

## Política de versionamento

Toda nova versão deve seguir o padrão:

```text
archives/AAAA-MM-DD/NOME_DO_PACOTE.zip
archives/AAAA-MM-DD/CHECKSUMS_SHA256.txt
archives/AAAA-MM-DD/MANIFESTO_ARQUIVO_SIGMA.md
```

Quando uma versão nova for aprovada, ela deve substituir a versão operacional, mas a versão anterior deve permanecer rastreável pelo histórico Git.

## Aviso técnico

O SIGMA é um laboratório estatístico experimental. Nenhum método aqui deve ser tratado como garantia de acerto. A validação correta deve usar protocolo cego, walk-forward e comparação N→N+1.