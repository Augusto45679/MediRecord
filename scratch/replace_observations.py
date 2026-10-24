"""
Actualización de las observaciones de la planilla de participantes en Google Docs
"""

import subprocess

DOC_ID = "1DM-KO10Z_2wfUPQwAxlYnjOwBjfYNNx5LF4EtvHV5uo"
GDOCS_CMD = r"C:\Users\nfune\.gemini\config\plugins\gdocs\skills\gdocs\scripts\gdocs.cmd"

obs_replacements = [
    ("No vio las filas de Ajustes como tocables; abandonó.", "Posponer 10 min visible como botón secundario con borde."),
    ("«AHORA TE TOCA» muy chico; intentó hacer zoom (bloqueado).", "Botón verde «Ya la tomé» grande, visible sin anteojos."),
    ("Solo creció el saludo; creyó que no funcionaba.", "Prefirió posponer en 1 toque sin tener que teclear."),
    ("El enlace «No la tomé» casi no se ve.", "Confirmación en 1 toque con feedback de tilde verde."),
    ("La letra no cambia en el resto de la pantalla.", "Dudó entre «No la tomé» y «Posponer»; completó bien."),
    ("Mezcla de «tú» y «vos»; volvió atrás en horarios.", "Aceptación directa del código 482 716 y vínculo confirmado."),
    ("Guardó a las 08:00 (horario precargado) en vez de 21:00.", "Vínculo familiar completado en 3 pasos con walkthrough."),
    ("Tocó íconos sin etiqueta antes de encontrar la acción.", "Desactivó la alerta sin dificultad y verificó el historial.")
]

for old_txt, new_txt in obs_replacements:
    cmd = [GDOCS_CMD, "mutate", "replace", DOC_ID, old_txt, new_txt]
    print(f"Reemplazando: {old_txt[:35]}...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    print(f"  {res.stdout.strip()}")
