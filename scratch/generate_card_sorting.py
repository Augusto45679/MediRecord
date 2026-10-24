"""
Generación de Matriz de Similitud y Dendrograma para Sección I (Card Sorting)
Proyecto: MediRecord - Cátedra Diseño UX/UI (UTN FRM)
Paleta: #0d5c46 (Pino institucional), #ffffff, #cce3de
Resolución: 300 DPI
"""

import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from scipy.cluster.hierarchy import dendrogram, linkage
from scipy.spatial.distance import squareform
import os

# 20 Tarjetas actualizadas según el prototipo funcional
cards = [
    "1. Ver mis tomas de hoy",
    "2. Confirmar que tomé la pastilla",
    "3. Posponer el recordatorio 10 min",
    "4. Avisar que no la tomé",
    "5. Confirmar con la voz",
    "6. Ver cuál es la próxima toma",
    "7. Ver la lista de mis medicinas",
    "8. Añadir una medicina nueva",
    "9. Cambiar el horario o dosis",
    "10. Pausar una medicina",
    "11. Ver dosis e indicaciones",
    "12. Ver tomas de días anteriores",
    "13. Ver tomas omitidas/sin confirmar",
    "14. Ver cómo me fue en la semana",
    "15. Vincular cuenta (Persona apoyo)",
    "16. Umbral de aviso (Tiempo espera)",
    "17. Cambiar tamaño de la letra",
    "18. Sonido y vibración avisos",
    "19. Mi cuenta y cerrar sesión",
    "20. Pedir ayuda / cómo se usa"
]

# Agrupaciones de los 10 participantes (P1 a P5 Adultos Mayores; P6 a P10 Familiares/Cuidadores)
# Cada participante define grupos de índices (0-based)
participants = [
    # P1 (Roberto - 72 años)
    [[0, 1, 2, 3, 5], [6, 7, 8, 9, 10], [11, 12, 13], [14, 15, 16, 17, 18], [4, 19]],
    # P2 (Carmen - 68 años)
    [[0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13], [16, 17, 18], [14, 15, 19]],
    # P3 (Horacio - 75 años)
    [[0, 1, 2, 3, 5], [6, 8, 9, 10], [7], [11, 12, 13], [16, 17, 18], [14, 15, 4, 19]],
    # P4 (Marta - 70 años)
    [[0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13], [14, 15, 16, 17, 18, 19]],
    # P5 (Elsa - 74 años)
    [[0, 1, 2, 3, 5], [6, 7, 8, 9, 10], [11, 12, 13], [16, 17, 18], [4, 19], [14, 15]],
    # P6 (Silvana - 44 años, Hija/Cuidadora)
    [[0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13], [14, 15, 16, 17, 18, 19]],
    # P7 (Esteban - 48 años, Cuidador)
    [[0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13], [14, 15, 16, 17, 18, 19]],
    # P8 (Laura - 39 años, Hija)
    [[0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13], [14, 15, 16, 17, 18], [19]],
    # P9 (Javier - 52 años, Cuidador formal)
    [[0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13], [14, 15, 16, 17, 18, 19]],
    # P10 (Florencia - 35 años, Nieta)
    [[0, 1, 2, 3, 4, 5], [6, 7, 8, 9, 10], [11, 12, 13], [14, 15, 16, 17, 18, 19]]
]

n = len(cards)
co_occurrence = np.zeros((n, n), dtype=int)

for p in participants:
    for group in p:
        for i in group:
            for j in group:
                co_occurrence[i, j] += 1

# Matriz de similitud porcentual (0 a 100%)
similarity_matrix = (co_occurrence / len(participants)) * 100

os.makedirs("docs_assets", exist_ok=True)

# -------------------------------------------------------------
# 1. GENERACIÓN DE LA MATRIZ DE SIMILITUD (HEATMAP 300 DPI)
# -------------------------------------------------------------
plt.figure(figsize=(16, 14), dpi=300)

# Paleta personalizada: Blanco a Pino MediRecord #0d5c46
from matplotlib.colors import LinearSegmentedColormap
cmap_medirecord = LinearSegmentedColormap.from_list(
    "MediRecordSim", ["#ffffff", "#e6f1ec", "#82b29a", "#1a7458", "#0d5c46"]
)

short_labels = [f"T{i+1}: {c.split('. ')[1]}" for i, c in enumerate(cards)]

ax = sns.heatmap(
    similarity_matrix,
    annot=True,
    fmt=".0f",
    cmap=cmap_medirecord,
    cbar_kws={'label': 'Porcentaje de Similitud / Co-ocurrencia (%)'},
    xticklabels=short_labels,
    yticklabels=short_labels,
    linewidths=0.5,
    linecolor="#cbd5e1"
)

plt.title("Matriz de Similitud — Card Sorting Abierto (10 Participantes)", fontsize=18, fontweight='bold', pad=20, color="#07564f")
plt.xticks(rotation=45, ha='right', fontsize=9, fontweight='medium')
plt.yticks(rotation=0, fontsize=9, fontweight='medium')
plt.tight_layout()

sim_path = "docs_assets/matriz_similitud_updated.png"
plt.savefig(sim_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"[OK] Matriz de similitud generada en: {sim_path}")

# -------------------------------------------------------------
# 2. GENERACIÓN DEL DENDROGRAMA (CORTE EN 0.55 - 4 GRUPOS)
# -------------------------------------------------------------
# Matriz de disimilitud normalizada entre 0 y 1
dissimilarity = 1.0 - (similarity_matrix / 100.0)
np.fill_diagonal(dissimilarity, 0)
condensed_dist = squareform(dissimilarity, checks=False)

# Enlace promedio (Average linkage)
Z = linkage(condensed_dist, method='average')

plt.figure(figsize=(15, 9), dpi=300)
ax_dendro = plt.subplot(1, 1, 1)

# Colores de ramas
from scipy.cluster.hierarchy import set_link_color_palette
set_link_color_palette(['#0d5c46', '#0284c7', '#d97706', '#7c3aed'])

dendro_res = dendrogram(
    Z,
    labels=short_labels,
    orientation='top',
    leaf_font_size=10,
    color_threshold=0.55,
    above_threshold_color='#64748b'
)

# Línea de corte en 0.55
plt.axhline(y=0.55, color='#dc2626', linestyle='--', linewidth=2, label='Línea de corte = 0,55 (4 grupos funcionales)')

plt.title("Dendrograma de Co-ocurrencia — Agrupamiento Jerárquico (Corte en 0,55)", fontsize=16, fontweight='bold', pad=15, color="#07564f")
plt.xlabel("Tarjetas evaluadas del estudio de arquitectura de información", fontsize=11, labelpad=10, color="#1e293b")
plt.ylabel("Distancia de disimilitud (1 - Similitud)", fontsize=11, labelpad=10, color="#1e293b")
plt.xticks(rotation=45, ha='right', fontsize=9.5)
plt.legend(loc='upper right', frameon=True, facecolor='#faf9f5', edgecolor='#cbd5e1')
plt.grid(axis='y', linestyle=':', alpha=0.6)

# Anotaciones de los 4 grupos identificados
plt.text(25, 0.48, "Grupo 1:\nHoy / Resumen", color="#0d5c46", fontweight='bold', fontsize=10, ha='center', bbox=dict(boxstyle="round,pad=0.3", fc="#e6f1ec", ec="#0d5c46", lw=1))
plt.text(80, 0.48, "Grupo 2:\nMedicinas", color="#0284c7", fontweight='bold', fontsize=10, ha='center', bbox=dict(boxstyle="round,pad=0.3", fc="#e0f2fe", ec="#0284c7", lw=1))
plt.text(125, 0.48, "Grupo 3:\nHistorial", color="#d97706", fontweight='bold', fontsize=10, ha='center', bbox=dict(boxstyle="round,pad=0.3", fc="#fef3c7", ec="#d97706", lw=1))
plt.text(170, 0.48, "Grupo 4:\nAjustes", color="#7c3aed", fontweight='bold', fontsize=10, ha='center', bbox=dict(boxstyle="round,pad=0.3", fc="#f3e8ff", ec="#7c3aed", lw=1))

plt.tight_layout()

dendro_path = "docs_assets/dendrograma_updated.png"
plt.savefig(dendro_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"[OK] Dendrograma generado en: {dendro_path}")
