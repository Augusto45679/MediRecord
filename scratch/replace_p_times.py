"""
Reemplazo de tiempos de participantes en Table 2
"""

import subprocess

DOC_ID = "1DM-KO10Z_2wfUPQwAxlYnjOwBjfYNNx5LF4EtvHV5uo"
GDOCS_CMD = r"C:\Users\nfune\.gemini\config\plugins\gdocs\skills\gdocs\scripts\gdocs.cmd"

time_replacements = [
    ("150 s", "9 s"),
    ("78 s", "11 s"),
    ("34 s", "16 s"),
    ("118 s", "20 s"),
    ("140 s", "22 s"),
    ("31 s", "13 s"),
]

for old_val, new_val in time_replacements:
    cmd = [GDOCS_CMD, "mutate", "replace", DOC_ID, old_val, new_val]
    print(f"Reemplazando: {old_val} -> {new_val}")
    res = subprocess.run(cmd, capture_output=True, text=True)
    print(f"  {res.stdout.strip()}")
