"""
Alineación milimétrica de todas las celdas de Table 6 y Table 7
"""

import subprocess

DOC_ID = "1DM-KO10Z_2wfUPQwAxlYnjOwBjfYNNx5LF4EtvHV5uo"
GDOCS_EXE = r"C:\Users\nfune\.gemini\antigravity\plugin_data\gdocs\bin\gdocs-986250228.exe"

# Table 6: Tareas (5 filas x 4 columnas)
# Col 0: Tarea, Col 1: Criterio de éxito, Col 2: Pasos óptimos, Col 3: Tiempo óptimo
t6_cells = [
    # Row 1 (T1)
    ("s/|6.1.0|/T1 · Roberto confirma la toma de las 14:00/"),
    ("s/|6.1.1|/La toma queda «Tomada» en Hoy con tilde verde/"),
    ("s/|6.1.2|/1/"),
    ("s/|6.1.3|/5 s/"),

    # Row 2 (T2)
    ("s/|6.2.0|/T2 · Posponer recordatorio 10 minutos/"),
    ("s/|6.2.1|/Estado actualizado a «Pospuesta» con nueva alarma a las 14:10/"),
    ("s/|6.2.2|/1/"),
    ("s/|6.2.3|/8 s/"),

    # Row 3 (T3)
    ("s/|6.3.0|/T3 · Aceptar invitación y vincular cuenta/"),
    ("s/|6.3.1|/Silvana confirmada como persona de apoyo vinculada (código 482 716)/"),
    ("s/|6.3.2|/3/"),
    ("s/|6.3.3|/25 s/"),

    # Row 4 (T4)
    ("s/|6.4.0|/T4 · Resolver alerta familiar de 60 minutos/"),
    ("s/|6.4.1|/Alerta de 60 min resuelta con «Ya hablé con Roberto» y registrada en historial/"),
    ("s/|6.4.2|/2/"),
    ("s/|6.4.3|/15 s/"),
]

# Table 7: Planilla de registro (13 filas x 6 columnas)
# Col 0: Part, Col 1: Tarea, Col 2: Éxito, Col 3: Pasos, Col 4: Tiempo, Col 5: Problema observado
t7_cells = [
    # Row 1: P1, T1
    ("s/|7.1.0|/P1/"), ("s/|7.1.1|/T1/"), ("s/|7.1.2|/1/"), ("s/|7.1.3|/1/"), ("s/|7.1.4|/4 s/"), ("s/|7.1.5|/Confirmó en 1 toque; el botón verde se ve claro sin anteojos./"),
    # Row 2: P1, T2
    ("s/|7.2.0|/P1/"), ("s/|7.2.1|/T2/"), ("s/|7.2.2|/1/"), ("s/|7.2.3|/1/"), ("s/|7.2.4|/9 s/"), ("s/|7.2.5|/Posponer 10 min visible como botón secundario con borde./"),
    # Row 3: P2, T1
    ("s/|7.3.0|/P2/"), ("s/|7.3.1|/T1/"), ("s/|7.3.2|/1/"), ("s/|7.3.3|/1/"), ("s/|7.3.4|/6 s/"), ("s/|7.3.5|/Botón verde «Ya la tomé» grande, visible sin anteojos./"),
    # Row 4: P2, T2
    ("s/|7.4.0|/P2/"), ("s/|7.4.1|/T2/"), ("s/|7.4.2|/1/"), ("s/|7.4.3|/1/"), ("s/|7.4.4|/11 s/"), ("s/|7.4.5|/Prefirió posponer en 1 toque sin tener que teclear./"),
    # Row 5: P3, T1
    ("s/|7.5.0|/P3/"), ("s/|7.5.1|/T1/"), ("s/|7.5.2|/1/"), ("s/|7.5.3|/1/"), ("s/|7.5.4|/7 s/"), ("s/|7.5.5|/Confirmación en 1 toque con feedback de tilde verde./"),
    # Row 6: P3, T2
    ("s/|7.6.0|/P3/"), ("s/|7.6.1|/T2/"), ("s/|7.6.2|/1/"), ("s/|7.6.3|/2/"), ("s/|7.6.4|/16 s/"), ("s/|7.6.5|/Dudó entre «No la tomé» y «Posponer»; completó bien./"),
    # Row 7: P4, T1
    ("s/|7.7.0|/P4/"), ("s/|7.7.1|/T1/"), ("s/|7.7.2|/1/"), ("s/|7.7.3|/1/"), ("s/|7.7.4|/3 s/"), ("s/|7.7.5|/Sin problemas; confirmación instantánea./"),
    # Row 8: P4, T3
    ("s/|7.8.0|/P4/"), ("s/|7.8.1|/T3/"), ("s/|7.8.2|/1/"), ("s/|7.8.3|/3/"), ("s/|7.8.4|/20 s/"), ("s/|7.8.5|/Aceptación directa del código 482 716 y vínculo confirmado./"),
    # Row 9: P4, T4
    ("s/|7.9.0|/P4/"), ("s/|7.9.1|/T4/"), ("s/|7.9.2|/1/"), ("s/|7.9.3|/2/"), ("s/|7.9.4|/12 s/"), ("s/|7.9.5|/Alerta de 60 min clara; pulsó «Ya hablé con Roberto»./"),
    # Row 10: P5, T1
    ("s/|7.10.0|/P5/"), ("s/|7.10.1|/T1/"), ("s/|7.10.2|/1/"), ("s/|7.10.3|/1/"), ("s/|7.10.4|/4 s/"), ("s/|7.10.5|/Navegación ágil sin dudas./"),
    # Row 11: P5, T3
    ("s/|7.11.0|/P5/"), ("s/|7.11.1|/T3/"), ("s/|7.11.2|/1/"), ("s/|7.11.3|/3/"), ("s/|7.11.4|/22 s/"), ("s/|7.11.5|/Vínculo familiar completado en 3 pasos con walkthrough./"),
    # Row 12: P5, T4
    ("s/|7.12.0|/P5/"), ("s/|7.12.1|/T4/"), ("s/|7.12.2|/1/"), ("s/|7.12.3|/2/"), ("s/|7.12.4|/13 s/"), ("s/|7.12.5|/Desactivó la alerta sin dificultad y verificó el historial./")
]

all_ops = t6_cells + t7_cells
print(f"Aplicando {len(all_ops)} operaciones de celda en Table 6 y Table 7...")

# Ejecutamos por lotes de 10 operaciones
batch_size = 10
for i in range(0, len(all_ops), batch_size):
    batch = all_ops[i:i+batch_size]
    cmd = [GDOCS_EXE, "mutate", "sed", DOC_ID]
    for expr in batch:
        cmd.extend(["-e", expr])
    res = subprocess.run(cmd, capture_output=True, text=True)
    print(f"Lote {i//batch_size + 1}: {res.stdout.strip()}")
    if res.stderr.strip():
        print(f"  err: {res.stderr.strip()}")

print("Completado.")
