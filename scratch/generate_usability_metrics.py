"""
Generación de Gráficos de Usabilidad para Sección N (Pruebas de Usabilidad)
Proyecto: MediRecord - Cátedra Diseño UX/UI (UTN FRM)
Paleta: #0d5c46 (Verde MediRecord), #9ca3af (Gris neutro), #dc2626 (Línea meta 80%)
Resolución: 300 DPI
"""

import matplotlib.pyplot as plt
import numpy as np
import os

# Configuración de datos estricta (1:1 con las tablas de Sección N)
tasks = [
    "T1: Confirmar toma\n(Pantalla Hoy)",
    "T2: Posponer recordatorio\n(10 minutos)",
    "T3: Aceptar invitación\n(Vínculo código 482 716)",
    "T4: Resolver alerta familiar\n(Protocolo 60 minutos)"
]

# Eficacia: Tasa de éxito (%)
efficacy = [100.0, 80.0, 80.0, 100.0]

# Eficiencia: Tiempos en segundos
time_optimal = [5.0, 8.0, 25.0, 15.0]
time_average = [4.8, 9.8, 29.2, 16.0]

os.makedirs("docs_assets", exist_ok=True)

# Crear figura con 2 subplots horizontales
fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(16, 7), dpi=300)
fig.patch.set_facecolor('#faf9f5')

# ------------------------------------------------------------------------------
# SUBPLOT 1: EFICACIA (Tasa de Éxito por Tarea)
# ------------------------------------------------------------------------------
ax1.set_facecolor('#faf9f5')
x_pos = np.arange(len(tasks))

bars1 = ax1.bar(
    x_pos, efficacy,
    color='#0d5c46',
    width=0.48,
    edgecolor='#07564f',
    linewidth=1.2,
    zorder=3
)

# Línea punteada de umbral meta institucional al 80%
ax1.axhline(
    y=80, color='#dc2626', linestyle='--', linewidth=2,
    label='Meta institucional = 80 %', zorder=4
)

ax1.set_title("Eficacia: Tasa de Éxito por Tarea", fontsize=15, fontweight='bold', pad=15, color='#07564f')
ax1.set_ylabel("Tasa de Éxito sin Asistencia (%)", fontsize=11, labelpad=10, color='#1e293b')
ax1.set_ylim(0, 115)
ax1.set_xticks(x_pos)
ax1.set_xticklabels(tasks, fontsize=9.5, fontweight='medium', color='#334155')
ax1.grid(axis='y', linestyle=':', alpha=0.6, zorder=0)
ax1.legend(loc='lower right', frameon=True, facecolor='#ffffff', edgecolor='#cbd5e1', fontsize=10)

# Etiquetas sobre las barras
for bar, val in zip(bars1, efficacy):
    h = bar.get_height()
    ax1.text(
        bar.get_x() + bar.get_width() / 2, h + 2.5,
        f"{val:.0f} %", ha='center', va='bottom',
        fontsize=11, fontweight='bold', color='#0d5c46'
    )

# ------------------------------------------------------------------------------
# SUBPLOT 2: EFICIENCIA (Tiempo Promedio vs. Tiempo Óptimo)
# ------------------------------------------------------------------------------
ax2.set_facecolor('#faf9f5')
bar_width = 0.32

bars_opt = ax2.bar(
    x_pos - bar_width / 2, time_optimal,
    width=bar_width,
    label='Tiempo óptimo experto (seg)',
    color='#9ca3af',
    edgecolor='#64748b',
    linewidth=1.2,
    zorder=3
)

bars_avg = ax2.bar(
    x_pos + bar_width / 2, time_average,
    width=bar_width,
    label='Tiempo promedio observado (seg)',
    color='#0d5c46',
    edgecolor='#07564f',
    linewidth=1.2,
    zorder=3
)

ax2.set_title("Eficiencia: Tiempo Promedio vs. Tiempo Óptimo", fontsize=15, fontweight='bold', pad=15, color='#07564f')
ax2.set_ylabel("Tiempo de Ejecución (segundos)", fontsize=11, labelpad=10, color='#1e293b')
ax2.set_ylim(0, 36)
ax2.set_xticks(x_pos)
ax2.set_xticklabels(tasks, fontsize=9.5, fontweight='medium', color='#334155')
ax2.grid(axis='y', linestyle=':', alpha=0.6, zorder=0)
ax2.legend(loc='upper left', frameon=True, facecolor='#ffffff', edgecolor='#cbd5e1', fontsize=10)

# Etiquetas sobre las barras de eficiencia
for b_opt, b_avg, v_opt, v_avg in zip(bars_opt, bars_avg, time_optimal, time_average):
    ax2.text(
        b_opt.get_x() + b_opt.get_width() / 2, v_opt + 0.8,
        f"{v_opt:.1f}s", ha='center', va='bottom',
        fontsize=9.5, fontweight='bold', color='#475569'
    )
    ax2.text(
        b_avg.get_x() + b_avg.get_width() / 2, v_avg + 0.8,
        f"{v_avg:.1f}s", ha='center', va='bottom',
        fontsize=9.5, fontweight='bold', color='#0d5c46'
    )

plt.tight_layout()

out_path = "docs_assets/metricas_usabilidad_updated.png"
plt.savefig(out_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"[OK] Gráfico de métricas de usabilidad generado en: {out_path}")
