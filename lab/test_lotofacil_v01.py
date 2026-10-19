"""Teste interno para invariantes matemáticas e separação treino/teste."""
import sys
import tempfile
import unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
import lotofacil_v01 as lab

class LotoFacilTests(unittest.TestCase):
    def test_universo(self):
        self.assertEqual(lab.TOTAL,3268760)
        self.assertAlmostEqual(sum(lab.exact_pmf(k) for k in range(5,16)),1.0,places=12)
        self.assertAlmostEqual(sum(k*lab.exact_pmf(k) for k in range(5,16)),9.0,places=12)
        self.assertAlmostEqual(sum((k-9)**2*lab.exact_pmf(k) for k in range(5,16)),1.5,places=12)
    def test_tickets(self):
        a=lab.choose20(seed=42,candidates=50)
        b=lab.choose20(seed=42,candidates=50)
        self.assertEqual(a,b)
        self.assertEqual(len(a),20)
        self.assertEqual(len(set(a)),20)
        for ticket in a:
            self.assertEqual(lab.validate_ticket(ticket),ticket)
        with self.assertRaises(ValueError):
            lab.validate_ticket([1]*15)
    def test_holes_are_rejected(self):
        from datetime import datetime
        with tempfile.TemporaryDirectory() as tmp:
            p=Path(tmp)/"hist.csv"
            with open(p,"w",encoding="utf8") as f:
                f.write("concurso,data,"+",".join(f"d{i}" for i in range(1,16))+"\n")
                for n in (1,3):
                    f.write(f"{n},01/01/2020,"+",".join(str(v) for v in range(1,16))+"\n")
            with self.assertRaises(ValueError):
                lab.read_history(p)
    def test_no_future_in_hot(self):
        base=[(i+1,"2020-01-01",tuple(range(1,16)) if i%2 else tuple(range(11,26))) for i in range(130)]
        frozen=lab.hot(base[:120],60)
        changed=base.copy()
        changed[-1]=(130,"2020-01-01",tuple(range(1,16)))
        self.assertEqual(frozen,lab.hot(changed[:120],60))
    def test_exact_15_for_20_distinct(self):
        self.assertAlmostEqual(20/lab.TOTAL,0.000006118528126873796)
if __name__ == "__main__":
    unittest.main()
