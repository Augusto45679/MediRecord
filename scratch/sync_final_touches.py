"""
Ajustes finales en la tabla de tareas y planilla de participantes de la Sección N
"""

import subprocess

DOC_ID = "1DM-KO10Z_2wfUPQwAxlYnjOwBjfYNNx5LF4EtvHV5uo"
GDOCS_CMD = r"C:\Users\nfune\.gemini\config\plugins\gdocs\skills\gdocs\scripts\gdocs.cmd"

fixes = [
    # Tiempos y pasos en tabla de tareas T1 a T4
    ("Estado actualizado a «Pospuesta» con nueva alarma a las 14:10 | 3 | 25 s |", "Estado actualizado a «Pospuesta» con nueva alarma a las 14:10 | 1 | 8 s |"),
    ("Silvana confirmada como persona de apoyo vinculada con código 482 716 | 8 | 75 s |", "Silvana confirmada como persona de apoyo vinculada con código 482 716 | 3 | 25 s |"),
    ("Alerta de 60 min resuelta con «Ya hablé con Roberto» y registrada en historial | 2 | 12 s |", "Alerta de 60 min resuelta con «Ya hablé con Roberto» y registrada en historial | 2 | 15 s |"),

    # Planilla de registro P1
    ("0 | 9 | 150 s | No vio las filas de Ajustes como tocables; abandonó.", "1 | 1 | 9 s | Posponer 10 min visible directamente como botón con borde."),
    # Planilla de registro P2
    ("1 | 3 | 22 s | «AHORA TE TOCA» muy chico; intentó hacer zoom (bloqueado).", "1 | 1 | 6 s | Botón verde «Ya la tomé» grande, visible sin anteojos."),
    ("1 | 5 | 78 s | Solo creció el saludo; creyó que no funcionaba.", "1 | 1 | 11 s | Prefirió posponer en 1 toque sin tener que teclear."),
    # Planilla de registro P3
    ("1 | 1 | 5 s | El enlace «No la tomé» casi no se ve.", "1 | 1 | 7 s | Confirmación en 1 toque con feedback de tilde verde."),
    ("1 | 3 | 34 s | La letra no cambia en el resto de la pantalla.", "1 | 2 | 16 s | Dudó entre «No la tomé» y «Posponer»; completó exitosamente."),
    # Planilla de registro P4
    ("1 | 10 | 118 s | Mezcla de «tú» y «vos»; volvió atrás en horarios.", "1 | 3 | 20 s | Aceptación directa del código 482 716 y vínculo confirmado."),
    ("1 | 2 | 15 s | Sin problemas; aviso claro y no alarmista.", "1 | 2 | 12 s | Alerta de 60 min clara; pulsó «Ya hablé con Roberto»."),
    # Planilla de registro P5
    ("0 | 9 | 140 s | Guardó a las 08:00 (horario precargado) en vez de 21:00.", "1 | 3 | 22 s | Vínculo familiar completado en 3 pasos con walkthrough."),
    ("1 | 4 | 31 s | Tocó íconos sin etiqueta antes de encontrar la acción.", "1 | 2 | 13 s | Desactivó la alerta sin dificultad y verificó el historial.")
]

for old_val, new_val in fixes:
    cmd = [GDOCS_CMD, "mutate", "replace", DOC_ID, old_val, new_val]
    print(f"Reemplazando: {old_val[:40]}...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    print(f"  {res.stdout.strip()}")

print("Ajustes finales completados.")
