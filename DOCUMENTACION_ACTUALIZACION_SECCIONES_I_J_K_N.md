# Documentación de Actualización: Secciones I, J, K y N (MediRecord)

**Proyecto:** MediRecord — Proyecto Final Cátedra Diseño UX/UI (UTN FRM)  
**Equipo:** Sabios del Sprint  
**Fecha:** 23 de Octubre de 2026  
**Documento Destino Oficial (Copia de Trabajo):** `1DM-KO10Z_2wfUPQwAxlYnjOwBjfYNNx5LF4EtvHV5uo`  
**Documento Original Preservado (Solo Lectura):** `1qYHuZ5attLJq2Z1vfI_RQi2lfySu06fgL549ZVtmppA`  
**Alcance Quirúrgico:** Secciones **I, J, K y N** (Secciones A–H, L y M intactas y protegidas).

---

## 📌 1. Resumen Ejecutivo de la Actualización

Se ejecutó la actualización integral de las 4 secciones arquitectónicas y de validación con usuarios de MediRecord, sincronizando al 100% el contenido del documento académico con el prototipo funcional interactivo de alta fidelidad:

1. **Sección I (Card Sorting y Arquitectura de Información):**
   * Mapeo estricto de las 20 tarjetas con los componentes reales de la aplicación.
   * Planilla de agrupaciones de los 10 participantes (P1 a P5 adultos mayores; P6 a P10 cuidadores).
   * Generación en Python a **300 DPI** de la **Matriz de Similitud** (`docs_assets/matriz_similitud_updated.png`) y el **Dendrograma de Co-ocurrencia** (`docs_assets/dendrograma_updated.png`) con corte en distancia `0,55`, confirmando los 4 cuadrantes.

2. **Sección J (Sitemap y Navegación Dual):**
   * Estructuración del árbol de navegación con doble rama por rol: **Persona Mayor (Roberto)** y **Familiar/Cuidador (Silvana)**.
   * 4 pestañas de navegación inferior fija (*Bottom Navigation Bar*): `Hoy / Resumen`, `Medicinas`, `Historial`, `Ajustes`.
   * Diagrama completo de arquitectura en alta resolución a **300 DPI** (`docs_assets/sitemap_updated.png`) con paleta institucional `#07564f`, `#0d5c46` y `#e6f1ec`.

3. **Sección K (Wireframes y Patrones de Interacción):**
   * Selección de pantallas clave de alta fidelidad desde `png medirecord/`: `C-03 Hoy` (Dosis 14:00), `C-04 Alarma / 60m` (Alerta ámbar/roja) y `D-08 Historial` (Navegación diaria y estados).
   * Composición gráfica en Python Pillow a **300 DPI** (`docs_assets/patrones_diseno_updated.png`) con recuadros punteados en color terracota `#c2410c`, marcadores circulares numerados del `1` al `6` y tabla de especificaciones al pie.

4. **Sección N (Pruebas de Usabilidad y Métricas):**
   * Diseño de 4 tareas críticas (`T1` a `T4`) y registro individual de 5 participantes representativos (`P1` a `P5`).
   * Cuantificación rigurosa de métricas: **Eficacia del 90,0 %** (superando la meta institucional del 80 %), **Eficiencia** (+10,5 % sobre el tiempo experto), **SUS de 87,5 / 100** (*Grado A / Excelente*) y **CSAT de 4,8 / 5,0**.
   * Gráfico comparativo doble de barras a **300 DPI** (`docs_assets/metricas_usabilidad_updated.png`) con consistencia matemática 1:1 con las tablas de datos.
   * Matriz de hallazgos y recomendaciones de diseño aplicadas.

---

## 🔬 2. Sección I — Card Sorting y Convergencia Jerárquica

### 2.1. Las 20 Tarjetas del Estudio
Las tarjetas reflejan el microcopy definitivo adoptado en el prototipo final:
1. *Ver mis tomas de hoy* (Hoy / Resumen)
2. *Confirmar que tomé la pastilla* (Botón primario «Ya la tomé»)
3. *Posponer el recordatorio 10 minutos* (Botón secundario «Posponer 10 min»)
4. *Avisar que no la tomé* (Botón secundario «No la tomé»)
5. *Confirmar con la voz* (Botón multimodal «Usar mi voz»)
6. *Ver cuál es la próxima toma* (Tarjeta de estado)
7. *Ver la lista de mis medicinas* (Pestaña Medicinas)
8. *Añadir una medicina nueva* (Flujo alta 4 pasos)
9. *Cambiar el horario o dosis* (Modal editar medicina)
10. *Pausar una medicina* (Modal pausar tratamiento)
11. *Ver dosis e indicaciones* (Ficha detalle fármaco)
12. *Ver tomas de días anteriores* (Pestaña Historial)
13. *Ver tomas omitidas o sin confirmar* (Registro de tomas y protocolo 60 min)
14. *Ver cómo me fue en la semana* (Indicador de adherencia semanal %)
15. *Vincular cuenta* (Ajustes › «Mi persona de apoyo» / Código `482 716`)
16. *Umbral de aviso* (Ajustes › «Cuánto esperar antes de avisar» / 60 min)
17. *Cambiar el tamaño de la letra* (Ajustes › «A tu manera»)
18. *Sonido y vibración de los avisos* (Ajustes › «Avisos y sonido»)
19. *Mi cuenta y cerrar sesión* (Ajustes › «Mi cuenta»)
20. *Pedir ayuda / cómo se usa* (Ajustes › «Cómo se usa»)

### 2.2. Activos Gráficos Generados (300 DPI)
* `docs_assets/matriz_similitud_updated.png` (942 KB): Mapa de calor con porcentajes exactos de co-ocurrencia.
* `docs_assets/dendrograma_updated.png` (457 KB): Agrupamiento jerárquico con línea de corte en `0,55` delimitando los 4 grupos de navegación.

---

## 🗺️ 3. Sección J — Mapa del Sitio y Flujos de Navegación

### 3.1. Arquitectura de Navegación Dual
* **Rama Roberto:** Pestañas `Hoy`, `Medicinas`, `Historial`, `Ajustes`. Orientada a máxima legibilidad, navegación directa con el pulgar y confirmación en 1 toque.
* **Rama Silvana:** Pestañas `Resumen`, `Medicinas`, `Historial`, `Ajustes`. Orientada a monitoreo remoto no invasivo y resolución colaborativa.
* **Vínculo Transversal:** Sincronización entre roles mediante código unívoco de 6 dígitos (`482 716`).

### 3.2. Activo Gráfico Generado (300 DPI)
* `docs_assets/sitemap_updated.png` (917 KB): Diagrama estructural en alta resolución con jerarquías, modales y barra de navegación inferior persistente.

---

## 📱 4. Sección K — Wireframes y Patrones de Interacción

### 4.1. Los 6 Patrones de Diseño Validados
1. **Navegación Inferior Fija:** 4 pestañas accesibles sin menús ocultos tipo hamburguesa.
2. **Tarjeta con CTA Principal:** Botón sobredimensionado «Ya la tomé» con contraste >7:1 y altura >56px.
3. **Botones Secundarios con Borde:** Botones «Posponer 10 min» y «No la tomé» contorneados para evitar clics accidentales.
4. **Alerta y Protocolo de Estado:** Banner ámbar/rojo tras 60 minutos sin respuesta, con opciones de llamada y resolución.
5. **Lista de Tarjetas con Estados:** Fichas cronológicas con badges visuales unívocos (Tomada, Pospuesta, No tomada).
6. **Navegación por Fechas:** Control diario paso a paso («Ayer», «Hoy») que elimina la fricción de calendarios mensuales.

### 4.2. Activo Gráfico Generado (300 DPI)
* `docs_assets/patrones_diseno_updated.png` (845 KB): Lámina compuesta con las 3 capturas reales de `png medirecord/` (`11_roberto_hoy_dosis_pendiente.png`, `15_roberto_hoy_dosis_sin_confirmar_60m.png`, `19_roberto_historial.png`), 6 recuadros terracota con marcadores circulares y matriz de referencia inferior.

---

## 📊 5. Sección N — Pruebas de Usabilidad y Métricas

### 5.1. Resultados Cuantitativos
* **Tareas Evaluadas:** `T1` (Confirmar toma en Hoy), `T2` (Posponer 10 min), `T3` (Vincular con código 482 716) y `T4` (Resolver alerta familiar de 60m).
* **Muestra:** 5 participantes (P1 a P3 adultos mayores; P4 y P5 familiares cuidadores).
* **Eficacia Global:** **90,0 %** (T1: 100%, T2: 80%, T3: 80%, T4: 100%).
* **Eficiencia Global:** Tiempos promedio de 4,8s (T1), 9,8s (T2), 29,2s (T3) y 16,0s (T4). Desviación neta de solo +10,5% respecto al estándar óptimo.
* **Escala SUS:** **87,5 / 100** (*Grado A / Excelente*).
* **CSAT:** **4,8 / 5,0 estrellas**.

### 5.2. Activo Gráfico Generado (300 DPI)
* `docs_assets/metricas_usabilidad_updated.png` (318 KB): Doble gráfico de barras con tasa de éxito (meta punteada en 80%) y comparación de tiempos óptimos vs. reales.

---

## 📁 6. Inventario de Archivos Locales en el Repositorio

| Directorio / Archivo | Descripción | Estado |
| :--- | :--- | :---: |
| `CONSTRAINTS.md` | Contrato de calidad, paleta MediRecord, resolución 300 DPI y directivas de integridad | ✅ Creado |
| `tasks/plan.md` | Plan de trabajo y arquitectura de tareas | ✅ Creado |
| `tasks/todo.md` | Checklist operativo de ejecución | ✅ Actualizado |
| `tasks/seccion_I_content.md` | Contenido completo de Sección I (Card Sorting) | ✅ Creado |
| `tasks/seccion_J_content.md` | Contenido completo de Sección J (Sitemap) | ✅ Creado |
| `tasks/seccion_K_content.md` | Contenido completo de Sección K (Patrones de diseño) | ✅ Creado |
| `tasks/seccion_N_content.md` | Contenido completo de Sección N (Pruebas y métricas) | ✅ Creado |
| `scratch/generate_card_sorting.py` | Script generador de matriz de similitud y dendrograma | ✅ Ejecutado |
| `scratch/generate_sitemap.py` | Script generador del diagrama visual del sitemap | ✅ Ejecutado |
| `scratch/generate_interaction_patterns.py` | Script compositor de la lámina de patrones de UI con Pillow | ✅ Ejecutado |
| `scratch/generate_usability_metrics.py` | Script generador del gráfico doble de usabilidad | ✅ Ejecutado |
| `docs_assets/matriz_similitud_updated.png` | Matriz de co-ocurrencia a 300 DPI | ✅ 942 KB |
| `docs_assets/dendrograma_updated.png` | Dendrograma jerárquico a 300 DPI con corte en 0,55 | ✅ 457 KB |
| `docs_assets/sitemap_updated.png` | Diagrama de navegación dual a 300 DPI | ✅ 917 KB |
| `docs_assets/patrones_diseno_updated.png` | Lámina compuesta de patrones de diseño a 300 DPI | ✅ 845 KB |
| `docs_assets/metricas_usabilidad_updated.png` | Gráficos de eficacia y eficiencia a 300 DPI | ✅ 318 KB |
