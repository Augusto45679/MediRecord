import os
import subprocess
import json
from pathlib import Path
from rapidocr_onnxruntime import RapidOCR

ocr = RapidOCR()
CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
WORKSPACE = r"c:\Users\nfune\OneDrive\Documentos\Proyectos\MediRecord"
DESIGNS_DIR = os.path.join(WORKSPACE, "design-reference")
OUTPUT_DIR = os.path.join(WORKSPACE, "scratch", "ocr_results")
os.makedirs(OUTPUT_DIR, exist_ok=True)

svg_files = [f for f in os.listdir(DESIGNS_DIR) if f.endswith(".svg")]

results = {}

for svg_file in svg_files:
    print(f"\nProcessing {svg_file}...")
    svg_path = os.path.join(DESIGNS_DIR, svg_file)
    
    # We create a simple HTML to render the SVG cleanly
    html_content = f"""<!DOCTYPE html>
<html>
<head><style>body {{ margin: 0; padding: 0; background: #FCFAF5; }} img {{ display: block; }}</style></head>
<body><img src="{Path(svg_path).as_uri()}" /></body>
</html>"""
    temp_html = os.path.join(WORKSPACE, "scratch", "temp.html")
    with open(temp_html, "w", encoding="utf-8") as f:
        f.write(html_content)
        
    png_out = os.path.join(OUTPUT_DIR, f"{Path(svg_file).stem}.png")
    
    # Run Chrome headless to screenshot full document
    cmd = [
        CHROME_PATH,
        "--headless=new",
        "--disable-gpu",
        "--default-background-color=00000000",
        "--hide-scrollbars",
        f"--screenshot={png_out}",
        "--window-size=2000,4000",
        temp_html
    ]
    subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    
    if os.path.exists(png_out):
        print(f"  Screenshot saved: {png_out}")
        ocr_res, _ = ocr(png_out)
        texts = []
        if ocr_res:
            for item in ocr_res:
                box, txt, score = item
                if float(score) > 0.6:
                    texts.append({"box": box, "text": txt, "score": float(score)})
            print(f"  OCR detected {len(texts)} text snippets.")
        results[svg_file] = texts

with open(os.path.join(OUTPUT_DIR, "all_ocr_results.json"), "w", encoding="utf-8") as f:
    json.dump(results, f, ensure_ascii=False, indent=2)

print("\nFinished OCR extraction!")
