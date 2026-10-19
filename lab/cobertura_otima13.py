#!/usr/bin/env python3
"""Cobertura EXATA para >=13, >=14 e 15 no IID 15-de-25.

Teorema: se 2 bilhetes distintos A e B têm no máximo 10 dezenas comuns,
não existe sorteio S com |S∩A|>=13 e |S∩B|>=13.
Prova: 13+13 <= |S| + |A∩B| =15+|A∩B| => |A∩B|>=11.
Logo os eventos >=13 de cada bilhete são disjuntos.
Cada bilhete cobre 4.725+150+1=4.876 resultados para >=13;
20 bilhetes assim atingem o limite de união de Boole, máximo exato.
"""
import argparse
import csv
import json
import math
import random
from pathlib import Path

TOTAL = math.comb(25,15)
NUM_TICKETS = 20

def intersection(a, b):
    return len(set(a).intersection(b))

def construct(seed=20261019, max_overlap=10, n=20, max_trials=300000):
    if max_overlap < 10 and n == 20:
        raise ValueError("Para >=13 o requisito necessario e intersecao <=10; limites menores exigem estudo de viabilidade.")
    for restart in range(30):
        rng=random.Random(seed+restart*131071)
        tickets=[]
        attempts=0
        while len(tickets) < n and attempts < max_trials:
            attempts+=1
            t=tuple(sorted(rng.sample(range(1,26),15)))
            if all(intersection(t, prev)<=max_overlap for prev in tickets):
                tickets.append(t)
        if len(tickets)==n:
            return tickets, {"seed":seed,"restart":restart,
                             "tentativas":attempts, "max_overlap":max_overlap}
    raise RuntimeError("Falha ao construir carteira; nenhuma garantia de viabilidade foi presumida.")

def validate(tickets):
    if len(tickets)!=NUM_TICKETS or len(set(tickets))!=NUM_TICKETS:
        raise ValueError("Carteira deve conter 20 bilhetes unicos")
    if not all(len(t)==15 and len(set(t))==15 and min(t)>=1 and max(t)<=25 for t in tickets):
        raise ValueError("Bilhetes invalidos")
    if any(intersection(a,b)>10 for i,a in enumerate(tickets) for b in tickets[i+1:]):
        raise ValueError("Intersecao >10: eventos de 13+ podem se sobrepor")
    return True

def prove():
    number_ge13=sum(math.comb(15,k)*math.comb(10,15-k) for k in (13,14,15))
    number_ge14=sum(math.comb(15,k)*math.comb(10,15-k) for k in (14,15))
    assert number_ge13==4876 and number_ge14==151
    return {
        "espaco_amostral":TOTAL,
        "numeros_por_bilhete":15,
        "apostas":NUM_TICKETS,
        "sorteios_cobertos_por_aposta_ge13":number_ge13,
        "limite_exato_prob_ge13":NUM_TICKETS*number_ge13/TOTAL,
        "limite_exato_prob_ge14":NUM_TICKETS*number_ge14/TOTAL,
        "limite_exato_prob_15":NUM_TICKETS/TOTAL,
        "prova":"Se um sorteio permitisse >=13 em duas apostas, a intersecao delas seria >=11; com sobreposicao <=10, isso e impossivel. Portanto os eventos sao disjuntos, saturando a desigualdade da uniao.",
        "nao_e_previsao":True
    }

def main():
    p=argparse.ArgumentParser()
    p.add_argument("--seed",type=int,default=20261019)
    p.add_argument("--out",default="out/otimo13")
    args=p.parse_args()
    tickets, metadata=construct(seed=args.seed)
    validate(tickets)
    out=Path(args.out);out.mkdir(parents=True,exist_ok=True)
    with open(out/"jogos20.csv","w",newline="",encoding="utf-8") as f:
        w=csv.writer(f);w.writerow(["jogo"]+[f"d{i}" for i in range(1,16)])
        for i,t in enumerate(tickets,1):w.writerow([i,*t])
    evidence={"algoritmo":"packing_codificacao_constante_peso_distancia_minima_10",
              "parametros":metadata, "resultados_exatos_sob_iid":prove(),
              "bilhetes":tickets}
    (out/"prova.json").write_text(json.dumps(evidence,indent=2,ensure_ascii=False)+"\n",encoding="utf-8")
    print(json.dumps(evidence,indent=2,ensure_ascii=False))
if __name__=="__main__":
    main()
