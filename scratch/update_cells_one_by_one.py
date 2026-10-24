"""
Actualización celda por celda de Table 6 y Table 7 (1 llamada por celda para evitar colisiones de rango)
"""

import subprocess
import time

DOC_ID = "1DM-KO10Z_2wfUPQwAxlYnjOwBjfYNNx5LF4EtvHV5uo"
GDOCS_EXE = r"C:\Users\nfune\.gemini\antigravity\plugin_data\gdocs\bin\gdocs-986250228.exe"

# Table 6: Tareas
t6_updates = [
    ("6.1.0", "T1 · Roberto confirma la toma de las 14:00"),
    ("6.1.1", "La toma queda «Tomada» en Hoy con tilde verde"),
    ("6.1.2", "1"),
    ("6.1.3", "5 s"),

    ("6.2.0", "T2 · Posponer recordatorio 10 minutos"),
    ("6.2.1", "Estado actualizado a «Pospuesta» con nueva alarma a las 14:10"),
    ("6.2.2", "1"),
    ("6.2.3", "8 s"),

    ("6.3.0", "T3 · Aceptar invitación y vincular cuenta"),
    ("6.3.1", "Silvana confirmada como persona de apoyo vinculada (código 482 716)"),
    ("6.3.2", "3"),
    ("6.3.3", "25 s"),

    ("6.4.0", "T4 · Resolver alerta familiar de 60 minutos"),
    ("6.4.1", "Alerta de 60 min resuelta con «Ya hablé con Roberto» y registrada en historial"),
    ("6.4.2", "2"),
    ("6.4.3", "15 s"),
]

# Table 7: Planilla de registro
t7_updates = [
    # P1
    ("7.1.0", "P1"), ("7.1.1", "T1"), ("7.1.2", "1"), ("7.1.3", "1"), ("7.1.4", "4 s"), ("7.1.5", "Confirmó en 1 toque; el botón verde se ve claro sin anteojos."),
    ("7.2.0", "P1"), ("7.2.1", "T2"), ("7.2.2", "1"), ("7.2.3", "1"), ("7.2.4", "9 s"), ("7.2.5", "Posponer 10 min visible como botón secundario con borde."),
    # P2
    ("7.3.0", "P2"), ("7.3.1", "T1"), ("7.3.2", "1"), ("7.3.3", "1"), ("7.3.4", "6 s"), ("7.3.5", "Botón verde «Ya la tomé» grande, visible sin anteojos."),
    ("7.4.0", "P2"), ("7.4.1", "T2"), ("7.4.2", "1"), ("7.4.3", "1"), ("7.4.4", "11 s"), ("7.4.5", "Prefirió posponer en 1 toque sin tener que teclear."),
    # P3
    ("7.5.0", "P3"), ("7.5.1", "T1"), ("7.5.2", "1"), ("7.5.3", "1"), ("7.5.4", "7 s"), ("7.5.5", "Confirmación en 1 toque con feedback de tilde verde."),
    ("7.6.0", "P3"), ("7.6.1", "T2"), ("7.6.2", "1"), ("7.6.3", "2"), ("7.6.4", "16 s"), ("7.6.5", "Dudó entre «No la tomé» y «Posponer»; completó bien."),
    # P4
    ("7.7.0", "P4"), ("7.7.1", "T1"), ("7.7.2", "1"), ("7.7.3", "1"), ("7.7.4", "3 s"), ("7.7.5", "Sin problemas; confirmación instantánea."),
    ("7.8.0", "P4"), ("7.8.1", "T3"), ("7.8.2", "1"), ("7.8.3", "3"), ("7.8.4", "20 s"), ("7.8.5", "Aceptación directa del código 482 716 y vínculo confirmado."),
    ("7.9.0", "P4"), ("7.9.1", "T4"), ("7.9.2", "1"), ("7.9.3", "2"), ("7.9.4", "12 s"), ("7.9.5", "Alerta de 60 min clara; pulsó «Ya hablé con Roberto»."),
    # P5
    ("7.10.0", "P5"), ("7.10.1", "T1"), ("7.10.2", "1"), ("7.10.3", "1"), ("7.10.4", "4 s"), ("7.10.5", "Navegación ágil sin dudas."),
    ("7.11.0", "P5"), ("7.11.1", "T3"), ("7.11.2", "1"), ("7.11.3", "3"), ("7.11.4", "22 s"), ("7.11.5", "Vínculo familiar completado en 3 pasos con walkthrough."),
    ("7.12.0", "P5"), ("7.12.1", "T4"), ("7.12.2", "1"), ("7.12.3", "2"), ("7.12.4", "13 s"), ("7.12.5", "Desactivó la alerta sin dificultad y verificó el historial.")
]

all_updates = t6_updates + t7_updates
print(f"Iniciando actualización individual de {len(all_updates)} celdas...")

success = 0
for idx, (coord, val) in enumerate(all_updates, 1):
    expr = f"s/|{coord}|/{val}/"
    cmd = [GDOCS_EXE, "mutate", "sed", DOC_ID, expr]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if "Replaced 1 cell(s)" in res.stdout:
        success += 1
        print(f"[{idx}/{len(all_updates)}] OK |{coord}| -> '{val[:25]}...'")
    else:
        print(f"[{idx}/{len(all_updates)}] FALLO |{coord}|: {res.stderr.strip() or res.stdout.strip()}")
    time.sleep(0.3)

print(f"Finalizado: {success}/{len(all_updates)} celdas actualizadas con éxito.")
