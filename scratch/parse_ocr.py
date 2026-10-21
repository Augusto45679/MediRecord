import json
import os

with open("scratch/ocr_results/all_ocr_results.json", "r", encoding="utf-8") as f:
    data = json.load(f)

for file, items in data.items():
    print(f"\n=======================================================")
    print(f"FILE: {file} ({len(items)} items)")
    print(f"=======================================================")
    
    # Sort items by Y then X
    # Box is [[x1,y1],[x2,y2],[x3,y3],[x4,y4]]
    sorted_items = sorted(items, key=lambda it: (round(it['box'][0][1] / 30) * 30, it['box'][0][0]))
    
    # Print out lines
    lines = [it['text'] for it in sorted_items]
    print("\n".join(lines[:60]))
    if len(lines) > 60:
        print(f"... and {len(lines) - 60} more lines")
