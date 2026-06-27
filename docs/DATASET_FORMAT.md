# Formato de dataset

Aceita CSV/TXT/JSON/XLSX no front-end.

## CSV/TXT simples

Cada linha pode conter 15 dezenas, ou concurso + 15 dezenas.

```text
3719,02,03,04,08,10,11,12,14,15,18,19,21,22,23,25
```

## JSON

```json
[
  { "contest": 3719, "date": "25/06/2026", "numbers": [2,3,4,8,10,11,12,14,15,18,19,21,22,23,25] }
]
```
