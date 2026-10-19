"""Estudo de cobertura K=20 sob H0 uniforme, multiplas sementes.

Comparação de diversidade geométrica com diversas carteiras random20.
Não utiliza o histórico, não mede poder de previsão. O Monte Carlo é independente.
"""
import json
import random
import sys
from collections import defaultdict
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
from lotofacil_v01 import choose20, TOTAL

def random20(seed):
    rng=random.Random(seed)
    portfolio=[]; seen=set()
    while len(portfolio)<20:
        s=tuple(sorted(rng.sample(range(1,26),15)))
        if s not in seen:
            portfolio.append(s);seen.add(s)
    return portfolio

def benchmark(n=6000, n_port=15, seed=20261019):
    # Criar carteiras antes de sortear os cenários de avaliação.
    rng=random.Random(seed)
    base=[set(rng.sample(range(1,26),15)) for _ in range(n)]
    result={}
    for family in ("diversificado", "aleatorio"):
        runs=[]
        for idx in range(n_port):
            ps=choose20(seed+idx+1, candidates=125) if family=="diversificado" else random20(seed+10000+idx)
            ns=[set(p) for p in ps]
            counters=defaultdict(int)
            for draw in base:
                maximum=max(len(draw & p) for p in ns)
                counters["max_soma"]+=maximum
                for k in (11,12,13,14,15):
                    counters[f"ge{k}"]+=int(maximum>=k)
            runs.append({
                "media_melhor":counters["max_soma"]/n,
                **{f"p_ge{k}":counters[f"ge{k}"]/n for k in (11,12,13,14,15)}
            })
        means={key:sum(x[key] for x in runs)/len(runs) for key in runs[0]}
        ranges={key:[min(x[key] for x in runs),max(x[key] for x in runs)] for key in runs[0]}
        result[family]={"carteiras":n_port,"medias":means,"intervalos_de_seeds":ranges}
    return {"cenarios":n,"seed":seed,"bilhetes_por_carteira":20,"resultados":result,
        "delta_entre_medias":{k:result["diversificado"]["medias"][k]-result["aleatorio"]["medias"][k] for k in result["diversificado"]["medias"]},
        "p_ge15_exato_ambos":20/TOTAL,
        "status":"ESTUDO_DE_COBERTURA_IID_NAO_PREDICAO",
        "observacao":"Intervalos de seeds nao sao IC95; para inferencia formal exigir bootstraps por sorteio e replicacao independente."}

if __name__=="__main__":
    n=int(sys.argv[1]) if len(sys.argv)>1 else 6000
    p=int(sys.argv[2]) if len(sys.argv)>2 else 15
    print(json.dumps(benchmark(n,p),indent=2,ensure_ascii=False))
