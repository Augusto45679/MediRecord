# Contrato de Calidad y Restricciones de Diseño (CONSTRAINTS.md)

**Proyecto:** MediRecord — Documentación Académica UX/UI  
**Fecha:** 23 de Octubre de 2026  
**Documento Destino:** `1DM-KO10Z_2wfUPQwAxlYnjOwBjfYNNx5LF4EtvHV5uo` (Copia de Trabajo Oficial)  
**Documento Protegido (Solo Lectura):** `1qYHuZ5attLJq2Z1vfI_RQi2lfySu06fgL549ZVtmppA`  

---

## 1. Restricción Estricta de Alcance
- **Secciones permitidas para edición:** Exclusivamente **I, J, K y N**.
- **Secciones protegidas sin modificación:** Secciones **A–H**, **L** (preservar intacto el trabajo ya documentado en `DOCUMENTACION_ACTUALIZACION_SECCIONES_I_Y_L.md`), **M** y posteriores.

---

## 2. Contrato de Diseño y Paleta Gráfica MediRecord
- **Paleta Institucional Obligatoria:**
  - Primario / Pino: `#0d5c46`
  - Secundario / Salvia: `#cce3de`
  - Fondo cálido: `#faf9f5`
  - Acento terracota / alertas: `#b45309` / `#c2410c`
  - Grises neutros: `#9ca3af`, `#64748b`, `#334155`
- **Resolución Gráfica:**
  - Todas las imágenes generadas por Python (`matplotlib`, `seaborn`, `Pillow`, `Graphviz`) deben renderizarse a **300 DPI** con fuentes legibles y nítidas.
  - No se permiten textos solapados, recortes de etiquetas o artefactos de compresión.
- **Formato en Google Docs:**
  - Ancho de lámina e imágenes ajustado a ancho estándar de página de Docs (`468.0 pt`).
  - Cero markdown roto o delimitadores sin procesar en texto visible (`$$`, `*`, `_` mal escapados). Tablas insertadas como tablas nativas de Docs.

---

## 3. Contrato Lingüístico y Microcopy
- **Tono y Registro:** Voseo rioplatense riguroso y consistente en todos los flujos de usuario y relatos («configurá», «elegí», «confirmá», «tomaste», «tenés», «a tu manera»).
- **Accesibilidad Cognitiva:** Explicaciones claras, libres de jerga innecesaria salvo cuando se analiza explícitamente en el Card Sorting.

---

## 4. Contrato de Consistencia Cruzada de Datos
1. **Sección I (Card Sorting) ↔ Sección J (Sitemap):**
   - Las 20 tarjetas del estudio abierto deben mapearse 1:1 con las pantallas y acciones de las 4 pestañas de navegación (Hoy/Resumen, Medicinas, Historial, Ajustes).
2. **Sección N (Pruebas de Usabilidad):**
   - Los números del gráfico doble de barras (Eficacia y Eficiencia) deben ser **matemáticamente idénticos** a los promedios calculados en las tablas de participantes (P1 a P5) y tareas (T1 a T4).
   - Umbral meta institucional fijado en 80 % en la gráfica de eficacia.
