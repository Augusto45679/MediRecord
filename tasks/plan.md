# Plan de Trabajo: Actualización Quirúrgica de Secciones I, J, K y N (MediRecord)

## Resumen Ejecutivo
Este plan estructura la ejecución de actualización sobre el documento de trabajo de Google Docs (`1DM-KO10Z_2wfUPQwAxlYnjOwBjfYNNx5LF4EtvHV5uo`) para las secciones **I, J, K y N**, preservando intacto el documento original (`1qYHuZ5attLJq2Z1vfI_RQi2lfySu06fgL549ZVtmppA`) y las secciones A–H, L y M.

Se aplica una metodología en vertical slices delegada en 4 subagentes especializados, seguida por una auditoría integral bajo *Doubt-Driven Development*.

---

## Arquitectura de Módulos y Dependencias

```
┌────────────────────────────────────────────────────────┐
│  SUBAGENTE 1: Arquitectura de Información (Sección I)   │
│  - 20 tarjetas alineadas con prototipo funcional       │
│  - Matriz de Similitud y Dendrograma (300 DPI)         │
│  - Informe de conclusiones y tablas de participantes   │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  SUBAGENTE 2: Navegación y Sitemap (Sección J)         │
│  - Texto de arquitectura y ramas por rol (2 roles)     │
│  - Diagrama de Sitemap en alta resolución (Graphviz/Py)│
│  - Coherencia 1:1 con las 20 tarjetas de Sección I     │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  SUBAGENTE 3: UI & Patrones de Interacción (Sección K) │
│  - Capturas reales C-03, C-04, D-08 de png medirecord/ │
│  - Lámina compuesta "Patrones de diseño" con 6 marcas  │
│  - Nomenclatura terracota y descripciones en voseo     │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  SUBAGENTE 4: Usabilidad y Métricas (Sección N)        │
│  - Criterios T1 a T4 y registro de 5 participantes     │
│  - Eficacia, Eficiencia y Satisfacción calculadas      │
│  - Gráfico doble de barras a 300 DPI (meta 80%)        │
│  - Tabla de recomendaciones derivadas                  │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│  SINCRONIZACIÓN Y AUDITORÍA FINAL (DOUBT-DRIVEN)       │
│  - Inyección en Google Docs (tablas + imágenes)        │
│  - Verificación matemática y de integridad visual      │
└────────────────────────────────────────────────────────┘
```

---

## Tareas Detalladas

### Tarea 1: Subagente 1 — Sección I (Card Sorting)
- **Archivos generados:** `scratch/generate_card_sorting.py`, `docs_assets/matriz_similitud_updated.png`, `docs_assets/dendrograma_updated.png`, `tasks/seccion_I_content.md`.
- **Criterios de Aceptación:**
  - 20 tarjetas correspondientes a las pantallas y acciones del prototipo.
  - Tabla de agrupaciones de 10 participantes (P1–P5 adultos mayores, P6–P10 cuidadores).
  - Matriz con porcentajes legibles sin solapamientos, paleta `#0d5c46`.
  - Dendrograma con corte explícito en distancia 0.55 que delimita los 4 grupos estables (Hoy/Resumen, Medicinas, Historial, Ajustes).

### Tarea 2: Subagente 2 — Sección J (Sitemap y Navegación)
- **Archivos generados:** `scratch/generate_sitemap.py`, `docs_assets/sitemap_updated.png`, `tasks/seccion_J_content.md`.
- **Criterios de Aceptación:**
  - Diagrama claro con doble rama por rol (Roberto: toma medicinas / Silvana: cuida y acompaña).
  - 4 pestañas de navegación inferior: Hoy/Resumen, Medicinas, Historial, Ajustes.
  - Colores corporativos `#0d5c46` en nodos clave y `#faf9f5` de fondo.

### Tarea 3: Subagente 3 — Sección K (Wireframes y Patrones de Interacción)
- **Archivos generados:** `scratch/generate_interaction_patterns.py`, `docs_assets/patrones_diseno_updated.png`, `tasks/seccion_K_content.md`.
- **Criterios de Aceptación:**
  - Selección de capturas de alta calidad de `png medirecord/`: `11_roberto_hoy_dosis_pendiente.png` (C-03), alarma/confirmación (C-04), `19_roberto_historial.png` (D-08), etc.
  - Lámina a 300 DPI con recuadros punteados en terracota `#c2410c`, marcadores circulares del 1 al 6 numerados claramente.
  - Referencias inferiores explicativas de cada uno de los 6 patrones de diseño.

### Tarea 4: Subagente 4 — Sección N (Pruebas de Usabilidad)
- **Archivos generados:** `scratch/generate_usability_metrics.py`, `docs_assets/metricas_usabilidad_updated.png`, `tasks/seccion_N_content.md`.
- **Criterios de Aceptación:**
  - Planilla con 5 participantes y 4 tareas críticas de los flujos de Roberto y Silvana.
  - Gráfico doble de barras con barras verdes `#0d5c46`, grises `#9ca3af`, línea meta en 80 % y tiempos en segundos/minutos.
  - Consistencia numérica 100% entre las tablas y el gráfico.

### Tarea 5: Sincronización y Validación Final
- **Archivos generados:** Script de actualización de Google Docs `scratch/sync_doc_sections.py`, reporte de auditoría `tasks/audit_report.md`.
- **Criterios de Aceptación:**
  - Secciones I, J, K y N actualizadas en el documento de trabajo `1DM-KO10Z_2wfUPQwAxlYnjOwBjfYNNx5LF4EtvHV5uo`.
  - Sin rotura de formato, preservando L intacta y original intacto.
