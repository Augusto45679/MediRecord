import json

with open('scratch/tables.json', 'r', encoding='utf-16') as f:
    data = json.load(f)

# Table 6 (index 5)
print("=== TABLE 6 ===")
t6 = data[5]['rows']
for r_idx, row in enumerate(t6, 1):
    for c_idx, cell in enumerate(row, 1):
        print(f"|6.{r_idx}.{c_idx}|: {ascii(cell)}")

# Table 7 (index 6)
print("\n=== TABLE 7 ===")
t7 = data[6]['rows']
for r_idx, row in enumerate(t7, 1):
    for c_idx, cell in enumerate(row, 1):
        print(f"|7.{r_idx}.{c_idx}|: {ascii(cell)}")
