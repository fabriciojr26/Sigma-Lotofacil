"""Verifica a construcao de uma carteira que satura a cota de 13+ no modelo IID."""
import sys
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
import cobertura_otima13 as pack

class PackingTests(unittest.TestCase):
    def test_theory(self):
        proof=pack.prove()
        self.assertEqual(proof["sorteios_cobertos_por_aposta_ge13"],4876)
        self.assertEqual(proof["espaco_amostral"],3268760)
        self.assertAlmostEqual(proof["limite_exato_prob_ge13"],20*4876/3268760)
        self.assertAlmostEqual(proof["limite_exato_prob_ge14"],20*151/3268760)
    def test_construct20(self):
        tickets,meta=pack.construct(seed=20261019,max_trials=200000)
        self.assertEqual(len(tickets),20)
        self.assertTrue(pack.validate(tickets))
        self.assertLessEqual(max(pack.intersection(a,b) for i,a in enumerate(tickets) for b in tickets[i+1:]),10)
    def test_repeatability(self):
        x,_=pack.construct(seed=321,max_trials=100000)
        y,_=pack.construct(seed=321,max_trials=100000)
        self.assertEqual(x,y)
if __name__=="__main__":
    unittest.main()
