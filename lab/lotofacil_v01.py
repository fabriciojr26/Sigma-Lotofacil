#!/usr/bin/env python3
"""Loto Fácil — protótipo científico sem vantagem preditiva presumida.

Comandos:
  python lab/lotofacil_v01.py latest
  python lab/lotofacil_v01.py audit --data caminho/lotofacil.csv
  python lab/lotofacil_v01.py predict --data caminho/lotofacil.csv --out saida
  python lab/lotofacil_v01.py backtest --data caminho/lotofacil.csv --rounds 500 --out saida
  python lab/lotofacil_v01.py simulate --n 30000 --out saida

Fonte: concurso,data,d1..d15. Requer sequência íntegra antes de testes.
"""
import argparse
import csv
import hashlib
import json
import math
import random
import sys
import urllib.request
from collections import defaultdict
from datetime import datetime, timezone
from itertools import combinations
from pathlib import Path

VERSION = "0.1.0-research"
TOTAL = math.comb(25, 15)
CAIXA_URL = "https://servicebus2.caixa.gov.br/portaldeloterias/api/lotofacil"
FIELDS = ["concurso", "data"] + [f"d{i}" for i in range(1, 16)]

def validate_ticket(values):
    vals = tuple(sorted(int(x) for x in values))
    if len(vals) != 15 or len(set(vals)) != 15 or vals[0] < 1 or vals[-1] > 25:
        raise ValueError("exatamente 15 dezenas unicas em [1,25] sao obrigatorias")
    return vals

def read_history(filepath):
    records = []
    with open(filepath, "r", encoding="utf-8-sig", newline="") as stream:
        rd = csv.DictReader(stream)
        if not set(FIELDS).issubset(rd.fieldnames or []):
            raise ValueError("cabecalho invalido: concurso,data,d1..d15")
        for row in rd:
            n = int(row["concurso"])
            day = datetime.strptime(row["data"], "%d/%m/%Y").date().isoformat()
            nums = validate_ticket(row[f"d{i}"] for i in range(1,16))
            records.append((n, day, nums))
    if not records:
        raise ValueError("base vazia")
    expected = list(range(records[0][0], records[-1][0]+1))
    actual = [r[0] for r in records]
    if actual != expected:
        missing = sorted(set(expected)-set(actual))
        raise ValueError(f"concursos fora de ordem, faltantes ou duplicados; lacunas={missing[:30]}")
    if records[0][0] != 1:
        raise ValueError("historico nao comeca em 1")
    if any(records[i][1] < records[i-1][1] for i in range(1,len(records))):
        raise ValueError("datas nao sao monotonicamente crescentes")
    return records

def inspect_last():
    # Endpoint interno de portal CAIXA, sem contrato de API/suporte formal.
    req = urllib.request.Request(CAIXA_URL, headers={"Accept":"application/json", "User-Agent":"LotoFacilLab/0.1"})
    with urllib.request.urlopen(req, timeout=20) as resp:
        data = json.load(resp)
    return {
        "concurso": int(data["numero"]),
        "data": datetime.strptime(data["dataApuracao"], "%d/%m/%Y").date().isoformat(),
        "dezenas": validate_ticket(data["listaDezenas"]),
        "origem": CAIXA_URL,
    }

def choose20(seed, candidates=250):
    """Diversificação geométrica independente do resultado futuro.

    A chance de 15 num sorteio justo permanece 20/C(25,15).
    """
    rng = random.Random(seed)
    picks = []
    used = [0]*25
    for _ in range(20):
        best = None
        best_score = None
        for _ in range(candidates):
            trial = validate_ticket(rng.sample(range(1,26),15))
            if trial in picks:
                continue
            overlaps = [len(set(trial)&set(old)) for old in picks]
            exposure = used.copy()
            for i in trial:
                exposure[i-1] += 1
            score = (
                sum(max(0, x-9)**2 for x in overlaps)*2.0
                + 0.2*sum((count-0.6*(len(picks)+1))**2 for count in exposure)
            )
            if best_score is None or score < best_score:
                best, best_score = trial, score
        if best is None:
            raise RuntimeError("nao foi possivel selecionar candidato distinto")
        picks.append(best)
        for i in best:
            used[i-1] += 1
    return picks

def exact_pmf(k):
    if not 5 <= k <= 15:
        return 0
    return math.comb(15,k)*math.comb(10,15-k)/TOTAL

def audit(records, filepath):
    repeats = [len(set(records[t-1][2]) & set(records[t][2])) for t in range(1,len(records))]
    freq = {str(i): sum(i in r[2] for r in records) for i in range(1,26)}
    return {
        "registros": len(records), "primeiro":records[0][0],
        "ultimo":records[-1][0],"data_ultimo":records[-1][1],
        "sha256":hashlib.sha256(Path(filepath).read_bytes()).hexdigest(),
        "media_repetidos":sum(repeats)/len(repeats) if repeats else None,
        "media_nulo_iid":9,
        "freq_dezenas":freq
    }

def hot(hist, width):
    subset = hist[-width:]
    counts = [sum(i in r[2] for r in subset) for i in range(1,26)]
    rank = sorted(range(1,26),key=lambda k:(-counts[k-1],k))
    return validate_ticket(rank[:15])

def hits(a,b):
    return len(set(a)&set(b))

def backtest(records, rounds=500, seed=20261019):
    if len(records) < rounds+121:
        raise ValueError("dados insuficientes para teste")
    rng = random.Random(seed)
    table=[]
    for t in range(len(records)-rounds,len(records)):
        hist = records[:t]  # CAUSAL: nunca le records[t] para gerar
        draw = records[t][2]
        bets = {
            "hot30":hot(hist,30),"hot60":hot(hist,60),
            "hot120":hot(hist,120),
            "repeat":hist[-1][2],
            "iid_random":validate_ticket(rng.sample(range(1,26),15))
        }
        for strategy, bet in bets.items():
            table.append({"concurso":records[t][0],"metodo":strategy,
                          "acertos":hits(bet,draw)})
    return table

def wilson(x, n):
    z=1.959963984540054
    p=x/n; d=1+z*z/n
    m=(p+z*z/(2*n))/d
    h=z*math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d
    return [m-h,m+h]

def simulate(n=30000, seed=123456):
    """Compara DUAS carteiras de K=20 (não 20 versus 60).

    Sorteios gerados independentemente de ambas as carteiras.
    """
    portfolio=choose20(seed)
    random_portfolio=[]
    rng = random.Random(seed+1)
    while len(random_portfolio)<20:
        t=validate_ticket(rng.sample(range(1,26),15))
        if t not in random_portfolio:
            random_portfolio.append(t)
    sums={"diversificado":defaultdict(int), "random20":defaultdict(int)}
    for _ in range(n):
        result=set(rng.sample(range(1,26),15))
        for label,bets in (("diversificado",portfolio),("random20",random_portfolio)):
            score=max(len(result&set(t)) for t in bets)
            sums[label]["best_sum"] += score
            for k in (11,12,13,14,15):
                sums[label][f"ge{k}"] += int(score>=k)
    return {
        "n_iid":n, "seed":seed,"k_por_carteira":20,
        "avaliacao":{label:{"media_melhor":q["best_sum"]/n,
          **{f"p_ge{k}":q[f"ge{k}"]/n for k in (11,12,13,14,15)},
          **{f"ic95_ge{k}":wilson(q[f"ge{k}"],n) for k in (11,12,13,14,15)}}
          for label,q in sums.items()},
        "p_15_exata_ambas":20/TOTAL,
        "nota":"A carteira nao tem ganho preditivo por construcao; difs finitas podem ser ruido MC."
    }

def emit(obj, out):
    Path(out).mkdir(parents=True, exist_ok=True)
    file=Path(out)/"relatorio.json"
    file.write_text(json.dumps(obj, indent=2, ensure_ascii=False, default=list)+"\n", encoding="utf-8")
    print(json.dumps(obj, ensure_ascii=False, indent=2, default=list))

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("cmd",choices=["latest","audit","predict","backtest","simulate"])
    parser.add_argument("--data",default="data/lotofacil.csv")
    parser.add_argument("--out",default="out")
    parser.add_argument("--seed",type=int,default=20261019)
    parser.add_argument("--rounds",type=int,default=500)
    parser.add_argument("--n",type=int,default=30000)
    args=parser.parse_args()
    if args.cmd=="latest":
        print(json.dumps(inspect_last(),indent=2,ensure_ascii=False));return
    if args.cmd=="simulate":
        emit(simulate(args.n,args.seed),args.out);return
    records=read_history(args.data)
    if args.cmd=="audit":
        emit(audit(records,args.data),args.out)
    elif args.cmd=="backtest":
        rows=backtest(records,args.rounds,args.seed)
        Path(args.out).mkdir(parents=True,exist_ok=True)
        with open(Path(args.out)/"walkforward.csv","w",encoding="utf-8",newline="") as f:
            writer=csv.DictWriter(f,fieldnames=["concurso","metodo","acertos"])
            writer.writeheader();writer.writerows(rows)
        by_model=defaultdict(list)
        for row in rows:
            by_model[row["metodo"]].append(row["acertos"])
        emit({"rounds":args.rounds,"seed":args.seed,
              "modelos":{name:{"media":sum(vals)/len(vals),
                          **{f"ge{k}":sum(x>=k for x in vals) for k in (11,12,13,14,15)}}
                          for name,vals in by_model.items()}},args.out)
    else:
        tickets=choose20(args.seed)
        report={"versao":VERSION,"modo":"neutro-diversificado-sem-edge",
                "seed":args.seed,"historico_ultimo_concurso":records[-1][0],
                "historico_sha256":hashlib.sha256(Path(args.data).read_bytes()).hexdigest(),
                "criado_em_utc":datetime.now(timezone.utc).isoformat(),
                "chance_exata_de_ao_menos_um_15_em_iid":20/TOTAL,
                "prova_de_superioridade_preditiva":False}
        Path(args.out).mkdir(parents=True,exist_ok=True)
        with open(Path(args.out)/"jogos20.csv","w",encoding="utf-8",newline="") as f:
            writer=csv.writer(f)
            writer.writerow(["jogo"]+[f"bola{i}" for i in range(1,16)])
            for j, nums in enumerate(tickets,1):
                writer.writerow([j,*nums])
        emit(report,args.out)
if __name__=="__main__":
    main()
