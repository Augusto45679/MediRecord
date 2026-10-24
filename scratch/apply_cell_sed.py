"""
Actualización exacta de celdas por dirección |T.R.C| en Google Docs
"""

import subprocess

DOC_ID = "1DM-KO10Z_2wfUPQwAxlYnjOwBjfYNNx5LF4EtvHV5uo"
GDOCS_CMD = r"C:\Users\nfune\.gemini\config\plugins\gdocs\skills\gdocs\scripts\gdocs.cmd"

expressions = [
    # Table 6: Tareas
    "s/|6.2.2|/1/",       # T2 pasos = 1
    "s/|6.3.2|/3/",       # T3 pasos = 3
    "s/|6.3.3|/25 s/",    # T3 tiempo = 25 s

    # Table 7: Planilla de registro
    "s/|7.2.2|/1/",       # P1 T2 éxito = 1
    "s/|7.2.3|/1/",       # P1 T2 pasos = 1
    "s/|7.11.2|/1/",      # P5 T3 éxito = 1
    "s/|7.11.3|/3/",      # P5 T3 pasos = 3
]

for expr in expressions:
    cmd = [GDOCS_CMD, "mutate", "sed", DOC_ID, expr]
    print(f"Ejecutando: {expr}")
    res = subprocess.run(cmd, capture_output=True, text=True)
    print(f"  {res.stdout.strip()}")
    if res.stderr.strip():
        print(f"  err: {res.stderr.strip()}")

print("Celdas actualizadas correctamente.")
