import subprocess
import os
import time

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
WORKSPACE = r"c:\Users\nfune\OneDrive\Documentos\Proyectos\MediRecord"
SHOTS_DIR = os.path.join(WORKSPACE, "scratch", "qa_shots")
os.makedirs(SHOTS_DIR, exist_ok=True)

test_cases = [
    ("roberto_hoy_pendiente", "http://localhost:4173/?role=roberto&tab=hoy&status=pending"),
    ("roberto_hoy_tomada", "http://localhost:4173/?role=roberto&tab=hoy&status=taken"),
    ("roberto_hoy_omitida", "http://localhost:4173/?role=roberto&tab=hoy&status=omitted"),
    ("roberto_medicinas", "http://localhost:4173/?role=roberto&tab=medicinas"),
    ("roberto_historial", "http://localhost:4173/?role=roberto&tab=historial"),
    ("roberto_ajustes", "http://localhost:4173/?role=roberto&tab=ajustes"),
    ("silvana_resumen_aviso", "http://localhost:4173/?role=silvana&tab=hoy&status=unconfirmed"),
    ("silvana_medicinas", "http://localhost:4173/?role=silvana&tab=medicinas"),
    ("silvana_historial", "http://localhost:4173/?role=silvana&tab=historial"),
    ("silvana_ajustes", "http://localhost:4173/?role=silvana&tab=ajustes")
]

for name, url in test_cases:
    print(f"Capturing {name}...")
    out_file = os.path.join(SHOTS_DIR, f"{name}.png")
    cmd = [
        CHROME,
        "--headless=new",
        "--disable-gpu",
        f"--screenshot={out_file}",
        "--window-size=500,980",
        url
    ]
    subprocess.run(cmd, check=True)
    time.sleep(0.3)

print("\nDirect screenshots captured successfully!")
