import subprocess
import os

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
WORKSPACE = r"c:\Users\nfune\OneDrive\Documentos\Proyectos\MediRecord"
SHOTS_DIR = os.path.join(WORKSPACE, "scratch", "qa_shots")
os.makedirs(SHOTS_DIR, exist_ok=True)

# 1. Desktop presentation layout
cmd_desktop = [
    CHROME,
    "--headless=new",
    "--disable-gpu",
    f"--screenshot={os.path.join(SHOTS_DIR, 'desktop_view.png')}",
    "--window-size=1400,980",
    "http://localhost:4173/"
]
subprocess.run(cmd_desktop, check=True)

# 2. Mobile viewport (iPhone 14 style: 390x844)
cmd_mobile = [
    CHROME,
    "--headless=new",
    "--disable-gpu",
    f"--screenshot={os.path.join(SHOTS_DIR, 'mobile_view.png')}",
    "--window-size=390,844",
    "http://localhost:4173/"
]
subprocess.run(cmd_mobile, check=True)

print("Screenshots captured successfully in", SHOTS_DIR)
