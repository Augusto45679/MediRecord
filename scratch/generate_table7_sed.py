# Generador de table7.sed

t7_rows = [
    # Row 1 (Header)
    ["Participante", "Tarea", "Éxito", "Pasos", "Tiempo", "Observaciones"],
    # Row 2 (P1 - T1)
    ["P1", "T1", "1", "1", "4 s", "Confirmó en 1 toque; el botón verde se ve claro sin anteojos."],
    # Row 3 (P1 - T2)
    ["P1", "T2", "1", "1", "9 s", "Posponer 10 min visible como botón secundario con borde."],
    # Row 4 (P2 - T1)
    ["P2", "T1", "1", "1", "6 s", "Botón verde «Ya la tomé» grande, visible sin anteojos."],
    # Row 5 (P2 - T2)
    ["P2", "T2", "1", "1", "11 s", "Prefirió posponer en 1 toque sin tener que teclear."],
    # Row 6 (P3 - T1)
    ["P3", "T1", "1", "1", "7 s", "Confirmación en 1 toque con feedback de tilde verde."],
    # Row 7 (P3 - T2)
    ["P3", "T2", "1", "2", "16 s", "Dudó entre «No la tomé» y «Posponer»; completó bien."],
    # Row 8 (P4 - T1)
    ["P4", "T1", "1", "1", "3 s", "Sin problemas; confirmación instantánea."],
    # Row 9 (P4 - T3)
    ["P4", "T3", "1", "3", "20 s", "Aceptación directa del código 482 716 y vínculo confirmado."],
    # Row 10 (P4 - T4)
    ["P4", "T4", "1", "2", "12 s", "Alerta de 60 min clara; pulsó «Ya hablé con Roberto»."],
    # Row 11 (P5 - T1)
    ["P5", "T1", "1", "1", "4 s", "Navegación ágil sin dudas."],
    # Row 12 (P5 - T3)
    ["P5", "T3", "1", "3", "22 s", "Vínculo familiar completado en 3 pasos con walkthrough."],
    # Row 13 (P5 - T4)
    ["P5", "T4", "1", "2", "13 s", "Desactivó la alerta sin dificultad y verificó el historial."]
]

with open("scratch/table7.sed", "w", encoding="utf-8") as f:
    for r_idx, row in enumerate(t7_rows, 1):
        for c_idx, val in enumerate(row, 1):
            f.write(f"s/|7.{r_idx}.{c_idx}|/{val}/\n")

print(f"Generado table7.sed con {len(t7_rows) * 6} expresiones.")
