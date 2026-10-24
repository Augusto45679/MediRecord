"""
Generación del Diagrama de Sitemap y Navegación (Sección J)
Proyecto: MediRecord - Cátedra Diseño UX/UI (UTN FRM)
Paleta: #07564f (Cabecera), #0d5c46 (Pino), #e6f1ec (Fondo suave), #faf9f5 (Canvas), #b45309 (Alertas)
Resolución: 300 DPI
"""

import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

# Configuración del Canvas (4000 x 2600 px a 300 DPI -> 13.33 x 8.66 pulgadas)
fig, ax = plt.subplots(figsize=(16, 11), dpi=300)
fig.patch.set_facecolor('#faf9f5')
ax.set_facecolor('#faf9f5')
ax.set_xlim(0, 100)
ax.set_ylim(0, 100)
ax.axis('off')

# Función auxiliar para dibujar tarjetas estilizadas
def draw_card(ax, x, y, w, h, title, subtitle="", bg_color="#ffffff", border_color="#cbd5e1", title_color="#0f172a", sub_color="#475569", title_size=9, sub_size=7.5, align='center', lw=1.2, is_dashed=False):
    style = 'round,pad=0.6,rounding_size=1.2'
    linestyle = '--' if is_dashed else '-'
    box = patches.FancyBboxPatch(
        (x, y), w, h,
        boxstyle=style,
        facecolor=bg_color,
        edgecolor=border_color,
        linewidth=lw,
        linestyle=linestyle,
        zorder=3
    )
    ax.add_patch(box)
    
    # Texto
    if align == 'center':
        tx = x + w / 2
        ty = y + h / 2 if not subtitle else y + h * 0.62
        ax.text(tx, ty, title, ha='center', va='center', fontsize=title_size, fontweight='bold', color=title_color, zorder=4)
        if subtitle:
            ax.text(tx, y + h * 0.32, subtitle, ha='center', va='center', fontsize=sub_size, color=sub_color, zorder=4)
    else:
        tx = x + 1.2
        ty = y + h / 2 if not subtitle else y + h * 0.65
        ax.text(tx, ty, title, ha='left', va='center', fontsize=title_size, fontweight='bold', color=title_color, zorder=4)
        if subtitle:
            ax.text(tx, y + h * 0.30, subtitle, ha='left', va='center', fontsize=sub_size, color=sub_color, zorder=4)

def draw_arrow(ax, x1, y1, x2, y2, color="#94a3b8", lw=1.5, is_dashed=False):
    linestyle = '--' if is_dashed else '-'
    ax.annotate(
        "", xy=(x2, y2), xytext=(x1, y1),
        arrowprops=dict(
            arrowstyle="->,head_width=0.25,head_length=0.35",
            color=color,
            lw=lw,
            linestyle=linestyle
        ),
        zorder=2
    )

def draw_line(ax, x1, y1, x2, y2, color="#94a3b8", lw=1.5, is_dashed=False):
    linestyle = '--' if is_dashed else '-'
    ax.plot([x1, x2], [y1, y2], color=color, lw=lw, linestyle=linestyle, zorder=2)

# ==============================================================================
# 1. CABECERA INSTITUCIONAL Y TÍTULO
# ==============================================================================
ax.text(50, 97.5, "SITEMAP Y ARQUITECTURA DE NAVEGACIÓN — MEDIRECORD", ha='center', va='center', fontsize=16, fontweight='bold', color="#07564f")
ax.text(50, 95.2, "Estructura por Roles (Adulto Mayor vs. Cuidador Familiar) y Mapeo en 4 Cuadrantes Fijos", ha='center', va='center', fontsize=10, color="#475569")

# ==============================================================================
# 2. ACCESO COMÚN (NIVEL 0)
# ==============================================================================
draw_card(ax, 38, 88.5, 24, 4.5, "ACCESO COMÚN: Inicio y Confirmación", "A-01 Login Google  ›  A-02 Confirmar Cuenta", bg_color="#07564f", border_color="#07564f", title_color="#ffffff", sub_color="#cce3de", title_size=9.5, sub_size=8)
draw_card(ax, 39, 81.5, 22, 4.2, "A-03 Selección de Rol", "«Tomo medicinas» vs. «Acompaño o cuido»", bg_color="#e6f1ec", border_color="#0d5c46", title_color="#0d5c46", sub_color="#1a7458", title_size=9, sub_size=7.5, lw=1.5)

draw_arrow(ax, 50, 88.5, 50, 85.7, color="#0d5c46", lw=1.8)

# Ramificación hacia los 2 roles
draw_line(ax, 50, 81.5, 50, 78.5, color="#0d5c46", lw=1.8)
draw_line(ax, 24, 78.5, 76, 78.5, color="#0d5c46", lw=1.8)
draw_arrow(ax, 24, 78.5, 24, 75.8, color="#0d5c46", lw=1.8)
draw_arrow(ax, 76, 78.5, 76, 75.8, color="#0d5c46", lw=1.8)

# ==============================================================================
# 3. ONBOARDING ESPECÍFICO POR ROL
# ==============================================================================
# Roberto
draw_card(ax, 11, 71.5, 26, 4.2, "Onboarding Roberto (L-02 a L-04)", "Bienvenida › A tu manera (letra) › Avisos y sonido", bg_color="#ffffff", border_color="#0d5c46", title_color="#0d5c46", sub_color="#475569", title_size=8.5, sub_size=7.5)
# Silvana
draw_card(ax, 63, 71.5, 26, 4.2, "Onboarding Silvana", "Bienvenida › Tiempo de espera › Confirmación", bg_color="#ffffff", border_color="#0284c7", title_color="#0284c7", sub_color="#475569", title_size=8.5, sub_size=7.5)

draw_line(ax, 24, 71.5, 24, 68.0, color="#0d5c46", lw=1.5)
draw_line(ax, 76, 71.5, 76, 68.0, color="#0284c7", lw=1.5)

# Contenedores de Roles
# Role Roberto Background
roberto_bg = patches.FancyBboxPatch((3, 4.5), 45, 62.5, boxstyle="round,pad=0.8,rounding_size=1.5", facecolor="#ffffff", edgecolor="#0d5c46", linewidth=1.5, zorder=1)
ax.add_patch(roberto_bg)
ax.text(25.5, 65.5, "ROL: PERSONA MAYOR (ROBERTO)", ha='center', va='center', fontsize=11, fontweight='bold', color="#0d5c46", zorder=2)
ax.text(25.5, 63.8, "Interfaz accesible con tipografía grande y acciones prioritarias de 1 toque", ha='center', va='center', fontsize=7.5, color="#64748b", zorder=2)

# Role Silvana Background
silvana_bg = patches.FancyBboxPatch((52, 4.5), 45, 62.5, boxstyle="round,pad=0.8,rounding_size=1.5", facecolor="#ffffff", edgecolor="#0284c7", linewidth=1.5, zorder=1)
ax.add_patch(silvana_bg)
ax.text(74.5, 65.5, "ROL: FAMILIAR / CUIDADOR (SILVANA)", ha='center', va='center', fontsize=11, fontweight='bold', color="#0284c7", zorder=2)
ax.text(74.5, 63.8, "Monitoreo de adherencia, alertas escaladas y gestión de tratamiento", ha='center', va='center', fontsize=7.5, color="#64748b", zorder=2)

# ==============================================================================
# 4. CUATRO PESTAÑAS FIJAS — ROL ROBERTO
# ==============================================================================
# Pestaña 1: Hoy
draw_card(ax, 4.5, 56.5, 9.8, 4.8, "1. HOY", "C-03 Alarma / Toma", bg_color="#e6f1ec", border_color="#0d5c46", title_color="#0d5c46", sub_color="#1a7458", title_size=8.5, sub_size=7)
# Pestaña 2: Medicinas
draw_card(ax, 15.3, 56.5, 9.8, 4.8, "2. MEDICINAS", "Lista de fármacos", bg_color="#e6f1ec", border_color="#0d5c46", title_color="#0d5c46", sub_color="#1a7458", title_size=8.5, sub_size=7)
# Pestaña 3: Historial
draw_card(ax, 26.1, 56.5, 9.8, 4.8, "3. HISTORIAL", "Registro y tomas", bg_color="#e6f1ec", border_color="#0d5c46", title_color="#0d5c46", sub_color="#1a7458", title_size=8.5, sub_size=7)
# Pestaña 4: Ajustes
draw_card(ax, 36.9, 56.5, 9.8, 4.8, "4. AJUSTES", "Vínculo y accesib.", bg_color="#e6f1ec", border_color="#0d5c46", title_color="#0d5c46", sub_color="#1a7458", title_size=8.5, sub_size=7)

# Desglose Vertical Hoy Roberto
draw_card(ax, 4.5, 48.0, 9.8, 6.2, "Tarjeta de Toma Activa", "• D-06 «Ya la tomé»\n• «Posponer 10 min»\n• J-02 «No la tomé»\n• Voz: «Usar mi voz»", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_card(ax, 4.5, 38.5, 9.8, 7.5, "Ramas de Toma", "• K-01: Estado 60m sin confirmar (Ámbar)\n• J-05: Modal motivos de omisión (Roja)\n• Banner invitación recibida (Silvana)", bg_color="#fffbeb", border_color="#d97706", title_color="#b45309", sub_color="#78350f", title_size=7.5, sub_size=6.5, align='left')
draw_card(ax, 4.5, 29.5, 9.8, 6.5, "Próximas Tomas", "• Lista horaria día\n• Fármacos pendientes\n• Dosis programadas", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_arrow(ax, 9.4, 56.5, 9.4, 54.4, color="#0d5c46", lw=1.2)
draw_arrow(ax, 9.4, 48.0, 9.4, 46.2, color="#0d5c46", lw=1.2)
draw_arrow(ax, 9.4, 38.5, 9.4, 36.2, color="#0d5c46", lw=1.2)

# Desglose Vertical Medicinas Roberto
draw_card(ax, 15.3, 47.5, 9.8, 7.0, "Detalle Fármaco", "• Nombre y miligramos\n• Horario programado\n• Instrucciones toma\n• Con o sin comida", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_card(ax, 15.3, 37.5, 9.8, 7.5, "Alta de Medicina", "• Paso 1: Nombre\n• Paso 2: Dosis/forma\n• Paso 3: Horarios\n• Paso 4: Resumen alta", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_card(ax, 15.3, 27.5, 9.8, 7.5, "Acciones Tratamiento", "• Modal editar datos\n• Pausar tratamiento\n• Reanudar fármaco\n• Eliminar medicina", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_arrow(ax, 20.2, 56.5, 20.2, 54.7, color="#0d5c46", lw=1.2)
draw_arrow(ax, 20.2, 47.5, 20.2, 45.2, color="#0d5c46", lw=1.2)
draw_arrow(ax, 20.2, 37.5, 20.2, 35.2, color="#0d5c46", lw=1.2)

# Desglose Vertical Historial Roberto
draw_card(ax, 26.1, 47.5, 9.8, 7.0, "Navegación Diaria", "• Selector fecha (Hoy / Ayer / etc.)\n• Botones anterior / sgte\n• Indicador calendario", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_card(ax, 26.1, 37.5, 9.8, 7.5, "Tarjetas de Registro", "• Horario real tomado\n• Tomas pospuestas\n• Tomas omitidas (motivo)\n• Sin confirmar (alerta)", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_card(ax, 26.1, 27.5, 9.8, 7.5, "Adherencia Semanal", "• Porcentaje cumplim.\n• Días con 100% toma\n• Resumen visual simple", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_arrow(ax, 31.0, 56.5, 31.0, 54.7, color="#0d5c46", lw=1.2)
draw_arrow(ax, 31.0, 47.5, 31.0, 45.2, color="#0d5c46", lw=1.2)
draw_arrow(ax, 31.0, 37.5, 31.0, 35.2, color="#0d5c46", lw=1.2)

# Desglose Vertical Ajustes Roberto
draw_card(ax, 36.9, 47.5, 9.8, 7.0, "Mi Persona de Apoyo", "• L-01: Aceptar vínculo\n• B-02: Código 482 716\n• Estado conectado\n• Desvincular familiar", bg_color="#eef2ff", border_color="#6366f1", title_color="#4338ca", sub_color="#312e81", title_size=7.5, sub_size=6.5, align='left')
draw_card(ax, 36.9, 37.5, 9.8, 7.5, "Accesibilidad «A tu manera»", "• Tamaño de letra\n  (Normal / Grande / Max)\n• Alto contraste\n• Avisos y sonido fuerte", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_card(ax, 36.9, 27.5, 9.8, 7.5, "Cuenta y Soporte", "• Ver datos personales\n• Cerrar sesión segura\n• «Cómo se usa» (Guía)\n• Botón pedir ayuda", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_arrow(ax, 41.8, 56.5, 41.8, 54.7, color="#0d5c46", lw=1.2)
draw_arrow(ax, 41.8, 47.5, 41.8, 45.2, color="#0d5c46", lw=1.2)
draw_arrow(ax, 41.8, 37.5, 41.8, 35.2, color="#0d5c46", lw=1.2)

# ==============================================================================
# 5. CUATRO PESTAÑAS FIJAS — ROL SILVANA
# ==============================================================================
# Pestaña 1: Resumen
draw_card(ax, 53.5, 56.5, 9.8, 4.8, "1. RESUMEN", "Monitoreo en vivo", bg_color="#e0f2fe", border_color="#0284c7", title_color="#0284c7", sub_color="#0369a1", title_size=8.5, sub_size=7)
# Pestaña 2: Medicinas
draw_card(ax, 64.3, 56.5, 9.8, 4.8, "2. MEDICINAS", "Supervisión dosis", bg_color="#e0f2fe", border_color="#0284c7", title_color="#0284c7", sub_color="#0369a1", title_size=8.5, sub_size=7)
# Pestaña 3: Historial
draw_card(ax, 75.1, 56.5, 9.8, 4.8, "3. HISTORIAL", "Control adherencia", bg_color="#e0f2fe", border_color="#0284c7", title_color="#0284c7", sub_color="#0369a1", title_size=8.5, sub_size=7)
# Pestaña 4: Ajustes
draw_card(ax, 85.9, 56.5, 9.8, 4.8, "4. AJUSTES", "Protocolo y avisos", bg_color="#e0f2fe", border_color="#0284c7", title_color="#0284c7", sub_color="#0369a1", title_size=8.5, sub_size=7)

# Desglose Vertical Resumen Silvana
draw_card(ax, 53.5, 47.5, 9.8, 7.0, "Estado de Roberto", "• Toma tomada / a horario\n• Toma pendiente\n• Próximo fármaco día\n• Indicador sincroniz.", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_card(ax, 53.5, 37.5, 9.8, 7.5, "Alertas Escaladas", "• K-02 Alerta 60m sin toma\n• Botón «Llamar a Roberto»\n• Botón «Ya hablé con él»\n• Banner omisión voluntaria", bg_color="#fef2f2", border_color="#ef4444", title_color="#b91c1c", sub_color="#7f1d1d", title_size=7.5, sub_size=6.5, align='left')
draw_card(ax, 53.5, 27.5, 9.8, 7.5, "Resumen Adherencia", "• % cumplimiento hoy\n• Tendencia semanal\n• Fármacos críticos", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_arrow(ax, 58.4, 56.5, 58.4, 54.7, color="#0284c7", lw=1.2)
draw_arrow(ax, 58.4, 47.5, 58.4, 45.2, color="#0284c7", lw=1.2)
draw_arrow(ax, 58.4, 37.5, 58.4, 35.2, color="#0284c7", lw=1.2)

# Desglose Vertical Medicinas Silvana
draw_card(ax, 64.3, 47.5, 9.8, 7.0, "Gestión Remota", "• Lista completa recetas\n• Detalle de indicaciones\n• Consultar stock pastillas", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_card(ax, 64.3, 37.5, 9.8, 7.5, "Edición y Nuevos", "• Flujo alta 4 pasos\n• Ajustar dosis / horarios\n• Añadir notas para Roberto", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_card(ax, 64.3, 27.5, 9.8, 7.5, "Control de Estados", "• Pausar por indicación\n• Confirmación médica\n• Registro de cambios", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_arrow(ax, 69.2, 56.5, 69.2, 54.7, color="#0284c7", lw=1.2)
draw_arrow(ax, 69.2, 47.5, 69.2, 45.2, color="#0284c7", lw=1.2)
draw_arrow(ax, 69.2, 37.5, 69.2, 35.2, color="#0284c7", lw=1.2)

# Desglose Vertical Historial Silvana
draw_card(ax, 75.1, 47.5, 9.8, 7.0, "Auditoría de Tomas", "• Registro día por día\n• Horas de confirmación\n• Motivos de omisión", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_card(ax, 75.1, 37.5, 9.8, 7.5, "Métricas y Gráficos", "• Tasa de éxito semanal\n• Días con retraso\n• Dosis pospuestas", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_card(ax, 75.1, 27.5, 9.8, 7.5, "Exportación Médico", "• Reporte de adherencia\n• Compartir en consulta\n• Histórico mensual", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_arrow(ax, 80.0, 56.5, 80.0, 54.7, color="#0284c7", lw=1.2)
draw_arrow(ax, 80.0, 47.5, 80.0, 45.2, color="#0284c7", lw=1.2)
draw_arrow(ax, 80.0, 37.5, 80.0, 35.2, color="#0284c7", lw=1.2)

# Desglose Vertical Ajustes Silvana
draw_card(ax, 85.9, 47.5, 9.8, 7.0, "Persona Acompañada", "• Vínculo con Roberto\n• Compartir código vínculo\n• Administrar acompañados", bg_color="#eef2ff", border_color="#6366f1", title_color="#4338ca", sub_color="#312e81", title_size=7.5, sub_size=6.5, align='left')
draw_card(ax, 85.9, 37.5, 9.8, 7.5, "Protocolo de Espera", "• Umbral de aviso familiar\n  (Definido en 60 minutos)\n• Modos de notificación push\n• Llamada directa", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_card(ax, 85.9, 27.5, 9.8, 7.5, "Cuenta y Perfil", "• Datos de Silvana\n• Notificaciones celular\n• Cerrar sesión", bg_color="#f8fafc", border_color="#cbd5e1", title_size=7.5, sub_size=6.5, align='left')
draw_arrow(ax, 90.8, 56.5, 90.8, 54.7, color="#0284c7", lw=1.2)
draw_arrow(ax, 90.8, 47.5, 90.8, 45.2, color="#0284c7", lw=1.2)
draw_arrow(ax, 90.8, 37.5, 90.8, 35.2, color="#0284c7", lw=1.2)

# ==============================================================================
# 6. CONEXIÓN TRANSVERSAL: VÍNCULO FAMILIAR (CÓDIGO 482 716)
# ==============================================================================
draw_line(ax, 46.7, 51.0, 85.9, 51.0, color="#6366f1", lw=1.8, is_dashed=True)
ax.text(66.3, 52.2, "Vínculo Sincronizado: Código de 6 dígitos «482 716»", ha='center', va='center', fontsize=8, fontweight='bold', color="#4338ca", bbox=dict(boxstyle="round,pad=0.25", fc="#eef2ff", ec="#6366f1", lw=1), zorder=5)

# Barra de referencia de pestañas fijas en la base
draw_card(ax, 15, 6.0, 70, 3.2, "BARRA DE NAVEGACIÓN INFERIOR PERSISTENTE (BOTTOM NAV BAR)", "Pestañas fijas: 1. Hoy / Resumen   |   2. Medicinas   |   3. Historial   |   4. Ajustes", bg_color="#07564f", border_color="#07564f", title_color="#ffffff", sub_color="#cce3de", title_size=9, sub_size=8)

sitemap_path = "docs_assets/sitemap_updated.png"
plt.savefig(sitemap_path, dpi=300, bbox_inches='tight')
plt.close()
print(f"[OK] Diagrama de Sitemap generado en: {sitemap_path}")
