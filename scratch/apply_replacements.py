"""
Sincronización quirúrgica de textos y tablas en Google Docs
Documento: 1DM-KO10Z_2wfUPQwAxlYnjOwBjfYNNx5LF4EtvHV5uo
"""

import subprocess
import sys

DOC_ID = "1DM-KO10Z_2wfUPQwAxlYnjOwBjfYNNx5LF4EtvHV5uo"
GDOCS_CMD = r"C:\Users\nfune\.gemini\config\plugins\gdocs\skills\gdocs\scripts\gdocs.cmd"

replacements = [
    # --- SECCIÓN I: Card Sorting ---
    ("9. Cambiar el horario de una medicina", "9. Cambiar el horario o dosis"),
    ("12. Ver qué tomé los días anteriores", "12. Ver tomas de días anteriores"),
    ("13. Ver las tomas que se olvidaron", "13. Ver tomas omitidas o sin confirmar"),
    ("15. Vincular cuenta", "15. Vincular cuenta (Persona de apoyo / código 482 716)"),
    ("16. Umbral de aviso", "16. Umbral de aviso (Tiempo de espera antes de avisar)"),

    # --- SECCIÓN N: Tareas y Criterios ---
    ("Queda elegido «Grande» o «Muy grande» en A tu manera", "Estado actualizado a «Pospuesta» con nueva alarma a las 14:10"),
    ("T3 · Silvana carga Atorvastatina 20 mg a las 21:00", "T3 · Aceptar invitación y vincular cuenta"),
    ("Aparece en Medicinas con horario 21:00", "Silvana confirmada como persona de apoyo vinculada con código 482 716"),
    ("T4 · Silvana atiende un aviso de omisión", "T4 · Resolver alerta familiar de 60 minutos"),
    ("El aviso queda atendido con «Ya hablé con Roberto»", "Alerta de 60 min resuelta con «Ya hablé con Roberto» y registrada en historial"),

    # --- SECCIÓN N: Eficacia y Eficiencia ---
    ("100 % (5/5) | 8,2 / 5 s | 1,4 / 1", "100 % (5/5) | 4,8 / 5 s | 1 / 1"),
    ("67 % (2/3) | 87,3 / 25 s | 5,7 / 3", "80 % (4/5) | 9,8 / 8 s | 1 / 1"),
    ("50 % (1/2) | 129 / 75 s | 9,5 / 8", "80 % (4/5) | 29,2 / 25 s | 3 / 3"),
    ("100 % (2/2) | 23 / 12 s | 3 / 2", "100 % (5/5) | 16,0 / 15 s | 2 / 2"),
    ("83 % (10/12)", "90 % (18/20)"),

    # --- SECCIÓN N: Satisfacción ---
    ("Promedio general 3,9 (índice 74/100)", "Promedio general: Escala SUS de 87,5 / 100 puntos (Grado A / Excelente) y CSAT de 4,8 / 5,0")
]

print(f"Iniciando {len(replacements)} reemplazos quirurgicos en el documento {DOC_ID}...")

for i, (old_text, new_text) in enumerate(replacements, 1):
    cmd = [GDOCS_CMD, "mutate", "replace", DOC_ID, old_text, new_text]
    print(f"[{i}/{len(replacements)}] Reemplazando: {old_text[:35]}... -> {new_text[:35]}...")
    try:
        res = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(f"    OK: {res.stdout.strip()}")
    except subprocess.CalledProcessError as e:
        print(f"    ERROR: {e.stderr.strip()}")

print("Completado.")
