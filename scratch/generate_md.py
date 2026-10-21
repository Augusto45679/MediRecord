import json
import os

with open("scratch/ocr_results/all_ocr_results.json", "r", encoding="utf-8") as f:
    data = json.load(f)

md_out = []
md_out.append("# MediRecord Design Analysis\n")

for file, items in data.items():
    md_out.append(f"\n## FILE: {file} ({len(items)} items)\n")
    
    # Sort items by Y then X
    sorted_items = sorted(items, key=lambda it: (round(it['box'][0][1] / 30) * 30, it['box'][0][0]))
    
    lines = [it['text'] for it in sorted_items]
    for line in lines:
        md_out.append(f"- {line}")

with open("scratch/design_analysis.md", "w", encoding="utf-8") as f:
    f.write("\n".join(md_out))

print("Successfully generated scratch/design_analysis.md")
