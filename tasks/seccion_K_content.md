# Sección K: Wireframes y Patrones de Interacción

## K.1. Criterios de Diseño UI y Accesibilidad para Personas Mayores

El diseño de interfaz de MediRecord implementa un sistema visual riguroso orientado a neutralizar las barreras cognitivas, visuales y motrices que frecuentemente afectan a los adultos mayores polimedicados. Sobre la base de las directrices WCAG 2.2 (Nivel AA y AAA) y los estándares de diseño para envejecimiento saludable, se aplicaron cinco principios rectores:

1. **Áreas de Toque Sobredimensionadas:** Todo botón principal posee un alto mínimo de `56 px` y un ancho expandido al ancho completo del contenedor (mínimo `48 × 48 px` en elementos secundarios), previniendo toques involuntarios derivados del temblor senil o artrosis.
2. **Jerarquía Visual Inequívoca:** Una única acción principal por pantalla («Ya la tomé» en verde institucional `#0d5c46`), mientras que las opciones secundarias o de desvío se subordinan mediante botones con contorno (*outlined*).
3. **Contraste Cromático Elevado:** Razón de contraste superior a `7:1` en textos primarios sobre fondo claro (`#faf9f5`), y texto blanco sobre fondos oscuros corporativos (`#07564f`).
4. **Visibilidad del Estado del Sistema:** Toda acción produce retroalimentación visual inmediata con estados cromáticos canónicos: Verde (Tomada), Ámbar (Pospuesta o retraso 60 min), Rojo (Omitida) y Azul/Gris (Programada).
5. **Microcopy en Voseo Cercano:** Lenguaje cotidiano, cálido y directo («Copiá», «Elegí», «¿Tomaste tu medicina?»), eliminando términos informáticos confusos.

---

## K.2. Los 6 Patrones de Diseño Aplicados en la Interfaz

A partir del análisis de las pantallas clave del flujo principal (`C-03 Hoy`, `C-04 Alarma / 60 minutos sin confirmar` y `D-08 Historial`), se identificaron y documentaron los **6 patrones de interacción fundamentales** que componen la lámina de diseño:

### 1. Navegación Inferior Fija (Bottom Navigation Bar)
* **Pantallas de aplicación:** `C-03`, `D-08`, y todas las pantallas raíz.
* **Justificación de diseño:** Barra persistente con 4 pestañas accesibles directamente con el pulgar («Hoy», «Medicinas», «Historial», «Ajustes»). Cuenta con iconos vectoriales de `28 px` acompañados de rótulo textual explícito y un indicador de pestaña activa en verde institucional. Evita menús laterales ocultos (*hamburger menus*) que demandan memoria de trabajo y exploración espacial compleja.

### 2. Tarjeta con CTA Principal (Hero Card & Primary Button)
* **Pantallas de aplicación:** `C-03 Hoy`.
* **Justificación de diseño:** La dosis activa de las 14:00 se presenta en una tarjeta destacada con fondo blanco y sombra suave. El botón «Ya la tomé» ocupa el ancho completo, con tipografía negrita de `20 px` y radio de curvatura ergonómico de `16 px`. Resuelve la tarea crítica en un único toque sin navegación intermedia.

### 3. Botones Secundarios con Borde (Secondary Outlined Buttons)
* **Pantallas de aplicación:** `C-03 Hoy`.
* **Justificación de diseño:** Las opciones alternativas («Posponer 10 min», «No la tomé» y «Usar mi voz») se presentan bajo el botón principal con fondo transparente y borde sólido de `1.5 px`. Esta diferenciación formal previene la omisión accidental al tiempo que otorga una salida clara y respetuosa si el paciente no puede tomar la dosis en ese instante.

### 4. Alerta y Protocolo de Estado Escalado (Full Alert / Escalation Warning)
* **Pantallas de aplicación:** `C-04 Alarma / 60m`, `Silvana Resumen K-02`.
* **Justificación de diseño:** Al transcurrir 60 minutos sin registro, la interfaz abandona los tonos neutros e incorpora una cabecera de advertencia ámbar/terracota con ícono de aviso. La interfaz no bloquea al usuario ni emite alarmas estridentes punitivas; en su lugar, ofrece confirmación diferida y activa de forma transparente la red de contención familiar avisando al celular de Silvana.

### 5. Lista de Tarjetas con Estados (Stateful Card List)
* **Pantallas de aplicación:** `D-08 Historial`, `Medicinas`.
* **Justificación de diseño:** Registro secuencial de tomas estructurado en fichas independientes. Cada evento cuenta con un badge de estado cromático y textual unívoco («Tomada a las 08:00» con tilde verde, «Pospuesta», «No tomada»). Permite a Roberto y a su médico auditar la rutina diaria de un vistazo.

### 6. Navegación por Fechas (Daily Date Stepper)
* **Pantallas de aplicación:** `D-08 Historial`.
* **Justificación de diseño:** Barra horizontal con selector cronológico simplificado («Ayer», «Hoy», «Mañana») y flechas direccionales amplias. Sustituye la complejidad de los selectores tipo calendario mensual (con celdas minúsculas y números difíciles de pulsar) por un avance secuencial paso a paso.

---

## K.3. Lámina Compuesta de Patrones de Diseño

*(Se inserta la lámina de alta resolución `patrones_diseno_updated.png`, renderizada a 300 DPI, exhibiendo las 3 pantallas clave con los 6 marcadores circulares terracota y la matriz de especificaciones técnicas al pie).*
