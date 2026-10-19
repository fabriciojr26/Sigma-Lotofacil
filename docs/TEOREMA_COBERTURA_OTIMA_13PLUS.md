# Loto Fácil — Teorema de cobertura máxima para 13+ com 20 bilhetes

**Classificação:** resultado matemático exato (sob sorteio IID uniforme), não evidência de predição.

## 1. Universo
O conjunto de resultados possíveis de uma Lotofácil simples é \(\Omega=\binom{[25]}{15}\), com \(|\Omega|=\binom{25}{15}=3.268.760\). Cada bilhete \(A\) contém 15 números.

O número de sorteios que permitem **exatamente k acertos** em A é:
\[
N_k=\binom{15}{k}\binom{10}{15-k}.
\]

Logo, para uma aposta:
- \(\#\{\ge13\}=N_{13}+N_{14}+N_{15}=4.725+150+1=4.876\).
- \(\#\{\ge14\}=150+1=151\).
- \(\#\{15\}=1\).

## 2. Condição suficiente para não haver sobreposição da cauda >=13
Se \(A,B\) são duas apostas e \(S\) é um sorteio que dá >=13 em ambas:
\[
|S\cap A|+|S\cap B|
=|S\cap(A\cup B)|+|S\cap(A\cap B)|
\le 15+|A\cap B|.
\]
Como o lado esquerdo é pelo menos 26, \(|A\cap B|\ge 11\).

Portanto, **se todas as apostas A != B satisfazem \(|A\cap B|\le10\)**, nenhum resultado futuro gera 13+ em duas delas simultaneamente. Os conjuntos de 4.876 resultados cobertos por cada bilhete são disjuntos.

## 3. Limite máximo universal sob IID
Para 20 bilhetes:
\[
P(\exists A: |S\cap A|\ge13)\le \frac{20\cdot4.876}{3.268.760}.
\]
A desigualdade da união torna-se **igualdade** para uma carteira com interseções pareadas <=10.

O mesmo conjunto de 20 bilhetes atinge simultaneamente os limites superiores:
\[
P(\exists A:\ \mathrm{hits}(A)\ge14)=\frac{20\cdot151}{3.268.760},
\quad
P(\exists A:\ \mathrm{hits}(A)=15)=\frac{20}{3.268.760}.
\]

Note que:
- Um bilhete isolado mantém E[acertos]=9 e P(15)=1/3.268.760.
- A otimização altera a distribuição do **máximo da carteira**, não a probabilidade individual ou a física do sorteio.
- A construção não é necessariamente ótima para >=11 ou >=12, cuja geometria combinatória é diferente.
- Este resultado é um caso de **códigos binários de peso constante**: comprimento 25, peso 15, distância de Hamming >=10. Não reivindicar novidade científica; a contribuição aqui é aplicar um teorema demonstrável ao motor.

## 4. Certificação computacional
O arquivo \`lab/cobertura_otima13.py\` fornece:
1. Gerador determinístico de 20 apostas de 15 números com semente registrada;
2. Verificação exaustiva dos \(\binom{20}{2}=190\) pares;
3. Certificado JSON com hipótese, contagem, probabilidades exatas, algoritmo e semente;
4. CSV com os 20 jogos;
5. Testes automáticos de correção e reprodutibilidade em \`lab/test_cobertura_otima13.py\`.

O GitHub Actions da branch de pesquisa testa a construção sem acesso a dados pessoais ou apostas reais.

## 5. Próximo nível
A engenharia de cobertura está matematicamente resolvida para 13+/14+/15 sob IID, mas **não** transforma histórico em previsão. Para haver vantagem genuína acima desse valor neutro, seria necessário identificar e validar uma distribuição não uniforme dos resultados futuros fora da amostra (sem múltiplas comparações não corrigidas). Se ela não existir, o limite acima é o melhor possível com 20 bilhetes distintos.
