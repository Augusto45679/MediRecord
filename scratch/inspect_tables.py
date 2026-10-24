import json

with open('scratch/tables.json', 'r', encoding='utf-16') as f:
    data = json.load(f)

with open('scratch/tables_summary.txt', 'w', encoding='utf-8') as out:
    for idx, tbl in enumerate(data):
        rows = tbl if isinstance(tbl, list) else tbl.get('rows', tbl.get('data', []))
        out.write(f"=== TABLE {idx+1} (rows: {len(rows)}) ===\n")
        for r_i, r in enumerate(rows):
            out.write(f"  Row {r_i}: {r}\n")
        out.write("\n")
