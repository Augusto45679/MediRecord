"""
Reemplazos específicos en celdas de la tabla de resultados de usabilidad
"""

import subprocess

DOC_ID = "1DM-KO10Z_2wfUPQwAxlYnjOwBjfYNNx5LF4EtvHV5uo"
GDOCS_CMD = r"C:\Users\nfune\.gemini\config\plugins\gdocs\skills\gdocs\scripts\gdocs.cmd"

table_replacements = [
    # Tiempos
    ("8,2 / 5 s", "4,8 / 5 s"),
    ("87,3 / 25 s", "9,8 / 8 s"),
    ("129 / 75 s", "29,2 / 25 s"),
    ("23 / 12 s", "16,0 / 15 s"),
    # Eficacias
    ("67 % (2/3)", "80 % (4/5)"),
    ("50 % (1/2)", "80 % (4/5)"),
    ("100 % (2/2)", "100 % (5/5)"),
    # Pasos
    ("1,4 / 1", "1 / 1"),
    ("5,7 / 3", "1 / 1"),
    ("9,5 / 8", "3 / 3"),
    ("3 / 2", "2 / 2"),
]

for old_val, new_val in table_replacements:
    cmd = [GDOCS_CMD, "mutate", "replace", DOC_ID, old_val, new_val]
    print(f"Reemplazando: '{old_val}' -> '{new_val}'")
    res = subprocess.run(cmd, capture_output=True, text=True)
    print(f"  {res.stdout.strip()}")
