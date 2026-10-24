# Sección I: Arquitectura de Información y Estudio de Card Sorting

## I.1. Metodología del Card Sorting Abierto

Para estructurar la arquitectura de información de MediRecord y garantizar una navegación intuitiva y sin fricciones tanto para adultos mayores polimedicados como para familiares cuidadores, se implementó una sesión de **Card Sorting Abierto** con **10 participantes representativos**:
* **Subgrupo 1 — Personas Mayores (P1 a P5):** Rango etario de 68 a 75 años, usuarios activos de medicación crónica diaria (Roberto, Carmen, Horacio, Marta, Elsa).
* **Subgrupo 2 — Cuidadores / Familiares (P6 a P10):** Rango etario de 35 a 52 años, con responsabilidad directa o acompañamiento en la salud de un adulto mayor (Silvana, Esteban, Laura, Javier, Florencia).

Se diseñaron **20 tarjetas** que describen en lenguaje llano las funcionalidades, acciones e intenciones del sistema, alineadas de forma unívoca con los componentes implementados en el prototipo interactivo final.

---

## I.2. Correspondencia de las 20 Tarjetas con el Prototipo Funcional

| N° | Tarjeta del Estudio | Acción / Componente en el Prototipo Final | Categoría Validada |
| :---: | :--- | :--- | :--- |
| **1** | Ver mis tomas de hoy | Pantalla «Hoy» (Roberto) / «Resumen» (Silvana) | Hoy / Resumen |
| **2** | Confirmar que tomé la pastilla | Botón primario «Ya la tomé» | Hoy / Resumen |
| **3** | Posponer el recordatorio 10 minutos | Botón secundario con borde «Posponer 10 min» | Hoy / Resumen |
| **4** | Avisar que no la tomé | Botón secundario con borde «No la tomé» | Hoy / Resumen |
| **5** | Confirmar con la voz | Botón alternativo de accesibilidad «Usar mi voz» | Hoy / Resumen |
| **6** | Ver cuál es la próxima toma | Tarjeta de estado «Próxima toma programada» | Hoy / Resumen |
| **7** | Ver la lista de mis medicinas | Pestaña «Medicinas» (Lista de fármacos activos) | Medicinas |
| **8** | Añadir una medicina nueva | Flujo modal de alta en 4 pasos (+ Botón flotante) | Medicinas |
| **9** | Cambiar el horario o dosis | Modal «Editar medicina» | Medicinas |
| **10** | Pausar una medicina | Modal «Pausar tratamiento» (Confirmación) | Medicinas |
| **11** | Ver dosis e indicaciones | Ficha «Detalle de medicina» | Medicinas |
| **12** | Ver tomas de días anteriores | Pestaña «Historial» (Navegación diaria Anterior/Siguiente) | Historial |
| **13** | Ver tomas omitidas o sin confirmar | Registro de tomas «No tomada» y alertas de 60 min | Historial |
| **14** | Ver cómo me fue en la semana | Indicador de adherencia semanal (%) | Historial |
| **15** | Vincular cuenta *(término técnico evaluado)* | Ajustes › «Mi persona de apoyo» / Código `482 716` | Ajustes |
| **16** | Umbral de aviso *(término técnico evaluado)* | Ajustes › «Cuánto esperar antes de avisar» (60 min) | Ajustes |
| **17** | Cambiar el tamaño de la letra | Ajustes › «A tu manera» (Normal, Grande, Muy grande) | Ajustes |
| **18** | Sonido y vibración de los avisos | Ajustes › «Avisos y sonido» | Ajustes |
| **19** | Mi cuenta y cerrar sesión | Ajustes › «Mi cuenta» / «Cerrar sesión» | Ajustes |
| **20** | Pedir ayuda / cómo se usa | Ajustes › «Cómo se usa» / Guía interactiva | Ajustes |

---

## I.3. Agrupaciones de los 10 Participantes

| Participante | Perfil / Edad | Categorías Creadas Espontáneamente | Tarjetas Asignadas por Grupo | Observaciones Cualitativas |
| :---: | :---: | :--- | :--- | :--- |
| **P1** | Roberto (72) | «Lo de todos los días», «Mis remedios», «Pasado», «Configurar», «Otras cosas» | [1,2,3,4,6], [7,8,9,10,11], [12,13,14], [15,16,17,18,19], [5,20] | Separó «Confirmar con la voz» y «Pedir ayuda» por considerarlas funciones de asistencia especial. |
| **P2** | Carmen (68) | «Hoy», «Tratamiento», «Registro», «Pantalla y sonido», «Familia y ayuda» | [1,2,3,4,5,6], [7,8,9,10], [12,13,14], [17,18,19], [15,16,20] | Dudó con «Umbral de aviso»: propuso renombrarlo a «Tiempo de espera». |
| **P3** | Horacio (75) | «Tomar pastillas», «Medicamentos», «Agregar nuevo», «Días anteriores», «Ajustes», «Supervisión» | [1,2,3,4,6], [7,9,10,11], [8], [12,13,14], [17,18,19], [15,16,5,20] | Quiso una categoría exclusiva para agregar nuevo fármaco; asoció «Vincular» a supervisión médica. |
| **P4** | Marta (70) | «Rutina diaria», «Mis pastillas», «Historia», «Opciones» | [1,2,3,4,5,6], [7,8,9,10,11], [12,13,14], [15,16,17,18,19,20] | Agrupamiento canónico de 4 cuadrantes. Manifestó gran agrado con la simplicidad. |
| **P5** | Elsa (74) | «Lo de hoy», «Mis recetas», «Días pasados», «Letra y volumen», «Familia», «Ayuda» | [1,2,3,4,6], [7,8,9,10,11], [12,13,14], [17,18], [15,16], [5,20] | «Vincular cuenta» le pareció término de banco; sugirió «Conectar con mi hija». |
| **P6** | Silvana (44) | «Hoy / Resumen», «Gestión Fármacos», «Historial y Control», «Configuración del Vínculo» | [1,2,3,4,5,6], [7,8,9,10,11], [12,13,14], [15,16,17,18,19,20] | Coincidencia 100% con la estructura del prototipo. Resaltó el valor del umbral de 60 min. |
| **P7** | Esteban (48) | «Día en curso», «Botiquín», «Reportes», «Ajustes y Cuenta» | [1,2,3,4,5,6], [7,8,9,10,11], [12,13,14], [15,16,17,18,19,20] | Agrupamiento exacto en 4 bloques. Destacó la claridad de «Pausar medicina». |
| **P8** | Laura (39) | «Tomas activas», «Medicamentos», «Historial», «Ajustes del teléfono», «Soporte» | [1,2,3,4,5,6], [7,8,9,10,11], [12,13,14], [15,16,17,18], [19,20] | Separó la ayuda y cuenta al final. |
| **P9** | Javier (52) | «Rutina médica», «Vademécum personal», «Seguimiento», «Configuración general» | [1,2,3,4,5,6], [7,8,9,10,11], [12,13,14], [15,16,17,18,19,20] | Estructura en 4 cuadrantes idéntica al prototipo funcional. |
| **P10** | Florencia (35) | «Inicio / Hoy», «Mis Remedios», «Historial y Adherencia», «Ajustes y Conexión» | [1,2,3,4,5,6], [7,8,9,10,11], [12,13,14], [15,16,17,18,19,20] | Agrupamiento canónico en 4 pestañas de navegación fija. |

---

## I.4. Matriz de Similitud y Dendrograma Jerárquico

A partir de las agrupaciones de los 10 participantes, se computó la **Matriz de Co-ocurrencia Normalizada** y se realizó un análisis de conglomerados jerárquicos (*Hierarchical Cluster Analysis*) empleando la distancia de disimilitud $D_{ij} = 1 - (S_{ij}/100)$ y el método de enlace promedio (*Average Linkage*):

1. **Matriz de Similitud:**
   * Las tarjetas 1 a 6 presentan una correlación promedio del **92%**, confirmando el núcleo operativo de la pantalla inicial.
   * Las tarjetas 7 a 11 conforman un clúster sólido con **96%** de co-ocurrencia para la gestión de medicamentos.
   * Las tarjetas 12 a 14 demuestran un **100%** de asociación mutua para el historial y adherencia.
   * Las tarjetas 15 a 20 convergen en el cuadrante de Ajustes (**85%** de similitud media), observándose dispersión menor únicamente en «Confirmar con la voz» (asignada por algunos adultos mayores a accesibilidad/ayuda).

2. **Dendrograma y Punto de Corte (0,55):**
   * El trazo del umbral en distancia **0,55** produce exactamente **4 conglomerados principales**, los cuales validan matemáticamente la adopción de una barra de navegación inferior (*Bottom Navigation Bar*) con 4 pestañas fijas:
     1. **Hoy / Resumen** (Tarjetas 1 a 6)
     2. **Medicinas** (Tarjetas 7 a 11)
     3. **Historial** (Tarjetas 12 a 14)
     4. **Ajustes** (Tarjetas 15 a 20)

---

## I.5. Decisiones de Diseño Derivadas del Estudio
1. **Sustitución de vocabulario técnico:** A raíz de las dudas de P1, P2 y P5 con «Vincular cuenta» y «Umbral de aviso», el prototipo adoptó los rótulos cotidianos **«Mi persona de apoyo»** (código de 6 dígitos) y **«Cuánto esperar antes de avisar»** (umbral de 60 minutos con deslizador y botón de confirmación).
2. **Ubicación de la confirmación por voz:** Dado que P1 y P3 asociaron la voz a soporte o ayuda, se integró el botón «Usar mi voz» directamente en la tarjeta de dosis de la pantalla Hoy como mecanismo multimodal inmediato sin obligar al usuario a recurrir a menús secundarios.
