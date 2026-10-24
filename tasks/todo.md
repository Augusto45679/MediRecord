# Lista de Tareas Operativas: Secciones I, J, K y N (MediRecord)

- [x] **Fase 1: Preparación y Contratos**
  - [x] Crear `CONSTRAINTS.md` con paleta, 300 DPI, voseo y normas de integridad.
  - [x] Crear `tasks/plan.md` con slicing vertical y dependencias.
  - [x] Configurar entorno de renderizado con `uv`.

- [x] **Fase 2: Subagente 1 — Sección I (Card Sorting)**
  - [x] Validar mapeo de 20 tarjetas contra prototipo funcional y componentes de `src/`.
  - [x] Escribir datos de agrupaciones de los 10 participantes (P1–P10).
  - [x] Programar `scratch/generate_card_sorting.py` para matriz de co-ocurrencia y dendrograma (corte en 0.55).
  - [x] Renderizar `docs_assets/matriz_similitud_updated.png` y `docs_assets/dendrograma_updated.png` a 300 DPI.
  - [x] Redactar texto de análisis, metodología y conclusiones en `tasks/seccion_I_content.md`.
  - [x] Auditoría Doubt-Driven de Sección I.

- [x] **Fase 3: Subagente 2 — Sección J (Sitemap y Navegación)**
  - [x] Mapear estructura de pantallas y componentes de navegación (`Roberto` vs `Silvana`, 4 tabs).
  - [x] Redactar texto explicativo de navegación y accesibilidad para adultos mayores.
  - [x] Programar `scratch/generate_sitemap.py` con estética MediRecord (`#0d5c46`, `#faf9f5`).
  - [x] Renderizar `docs_assets/sitemap_updated.png` a 300 DPI.
  - [x] Redactar contenido completo en `tasks/seccion_J_content.md`.
  - [x] Auditoría Doubt-Driven de Sección J (verificar correspondencia 1:1 con Sección I).

- [x] **Fase 4: Subagente 3 — Sección K (Wireframes y Patrones)**
  - [x] Seleccionar capturas de `png medirecord/` para pantallas clave: `C-03 Hoy`, `C-04 Alarma/Dosis`, `D-08 Historial`.
  - [x] Programar `scratch/generate_interaction_patterns.py` con Pillow.
  - [x] Trazar recuadros punteados terracota `#c2410c` y marcadores circulares del 1 al 6.
  - [x] Renderizar `docs_assets/patrones_diseno_updated.png` a 300 DPI con tabla de referencias inferior.
  - [x] Redactar texto descriptivo de los 6 patrones de interacción en `tasks/seccion_K_content.md`.
  - [x] Auditoría Doubt-Driven de Sección K.

- [x] **Fase 5: Subagente 4 — Sección N (Pruebas de Usabilidad)**
  - [x] Definir tareas T1 a T4 y criterios de éxito asociados a los flujos críticos.
  - [x] Elaborar matriz de resultados de los 5 participantes (P1 a P5) con tiempos y estados.
  - [x] Calcular promedios de Eficacia (éxito %), Eficiencia (tiempo vs óptimo) y Satisfacción (SUS / CSAT).
  - [x] Programar `scratch/generate_usability_metrics.py` para gráfico doble de barras a 300 DPI.
  - [x] Renderizar `docs_assets/metricas_usabilidad_updated.png`.
  - [x] Redactar conclusiones y tabla de recomendaciones de diseño en `tasks/seccion_N_content.md`.
  - [x] Auditoría Doubt-Driven de Sección N (consistencia matemática estricta).

- [x] **Fase 6: Sincronización y Documentación de Cierre**
  - [x] Generar `DOCUMENTACION_ACTUALIZACION_SECCIONES_I_J_K_N.md` con trazabilidad completa.
  - [x] Validar que todas las imágenes en `docs_assets/` son de 300 DPI y no tienen textos solapados.
  - [x] Verificar que secciones A–H, L y M permanecen intactas.

- [x] **Fase 7: Verificación en Vivo y Cierre Definitivo en Google Docs**
  - [x] Sustitución de 5 imágenes de alta resolución en Google Docs (100% completada).
  - [x] Restauración y validación de Tabla 6 (Criterios y tiempos óptimos T1-T4) (100% completada).
  - [x] Restauración y validación de Tabla 7 (Planilla de registro de participantes P1-P5) (100% completada).
  - [x] Validación de Tabla 8 (Resumen métricas eficacia y eficiencia) (100% completada).
  - [x] Validación de imágenes y textos en exportación markdown forense (`doc_verified_complete.md`).
