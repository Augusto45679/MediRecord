# Documentación de Actualización: Secciones I y L (MediRecord)

**Proyecto:** MediRecord — Proyecto Final Cátedra Diseño UX/UI (UTN FRM)  
**Equipo:** Sabios del Sprint  
**Fecha de Actualización:** 23 de Octubre de 2026  
**Estado:** ✅ Implementado y sincronizado en Google Docs  

---

## 📌 1. Control de Versiones y Sandboxing

Para proteger la integridad del trabajo académico y cumplir con las directivas de seguridad:
* **Documento Original (Intacto / Solo Lectura):**  
  ID: `1qYHuZ5attLJq2Z1vfI_RQi2lfySu06fgL549ZVtmppA`  
  [Ver documento original en Google Docs](https://docs.google.com/document/d/1qYHuZ5attLJq2Z1vfI_RQi2lfySu06fgL549ZVtmppA/edit?usp=sharing)
* **Documento Duplicado Oficial (Actualizado con estas tareas):**  
  ID: `1DM-KO10Z_2wfUPQwAxlYnjOwBjfYNNx5LF4EtvHV5uo`  
  [Abrir Documento Actualizado en Google Docs](https://docs.google.com/document/d/1DM-KO10Z_2wfUPQwAxlYnjOwBjfYNNx5LF4EtvHV5uo/edit)

> **Nota:** Todos los cambios, sustitución segura de imágenes y actualización de textos se aplicaron **únicamente** sobre el documento duplicado. Las secciones K, M, N y O se preservaron sin alteraciones.

---

## 🔬 2. TAREA 1: Sección I (Card Sorting, Matriz de Similitud y Dendrograma)

### 2.1. Objetivo y Justificación
Alinear el estudio de arquitectura de información (Card Sorting abierto con 10 participantes) con las pantallas, microcopy y funciones del prototipo funcional de alta fidelidad (`https://medicare-ashy-alpha.vercel.app/`).

### 2.2. Correspondencia de las 20 Tarjetas con el Prototipo

| N° | Tarjeta del Estudio | Acción / Componente en el Prototipo Final | Categoría Final |
| :-: | :--- | :--- | :--- |
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

### 2.3. Generación Matemática y Gráfica
A partir de las agrupaciones reales de los 10 participantes (P1 a P5 adultos mayores; P6 a P10 familiares/cuidadores), se calculó la matriz de co-ocurrencia y el agrupamiento jerárquico usando Python (`scipy.cluster.hierarchy` y `seaborn`):

1. **Matriz de Similitud (`matriz_similitud_updated.png`):**
   * **Dimensiones:** 4500 × 3900 px (300 DPI).
   * **Estilo:** Mapa de calor con porcentaje exacto de co-ocurrencia en cada celda (0 a 100%), paleta institucional verde azulado `#0d5c46` a `#ffffff`, cuadrícula `#cbd5e1` y etiquetas diagonales a 45°.
2. **Dendrograma de Co-ocurrencia (`dendrograma_updated.png`):**
   * **Dimensiones:** 4500 × 2700 px (300 DPI).
   * **Método:** *Average linkage* sobre distancia de disimilitud ($1 - \text{similitud}$).
   * **Línea de corte:** Línea punteada roja en distancia **0.55**, demostrando la convergencia matemática en los **4 grupos de navegación** de la app:
     * **Grupo 1: Hoy / Resumen** (Tarjetas 1 a 6) · Estabilidad 80–100%
     * **Grupo 2: Medicinas** (Tarjetas 7 a 11) · Estabilidad 90–100%
     * **Grupo 3: Historial** (Tarjetas 12 a 14) · Estabilidad 80–100%
     * **Grupo 4: Ajustes** (Tarjetas 15 a 20) · Estabilidad 60–100%

### 2.4. Sincronización en Google Docs
* Ambas imágenes fueron insertadas de forma segura reemplazando los IDs anteriores (`kix.9pe06t9eubmf` y `kix.75znxp4nucva`), manteniendo el ancho de impresión nativo de `468.0 pt`.

---

## 🗺️ 3. TAREA 2: Sección L (Wireflow del Flujo Crítico con PNGs Locales)

### 3.1. Objetivo y Regla de Verdad
Reemplazar la Sección L mediante una lámina de alta resolución construida **únicamente a partir de las capturas `.png` existentes en la carpeta local `png medirecord/`**, reflejando la secuencia exacta de su nomenclatura numérica y su relato descriptivo.

### 3.2. Mapeo de Capturas Locales en el Wireflow

| Fase | Código | Archivo PNG Local | Nombre de Pantalla / Interacción |
| :--- | :---: | :--- | :--- |
| **Fase 1: Acceso y Vínculo** | **A-01** | `01_login_paso1_correo_google.png` | Inicio de sesión (Toca «Continuar con Google») |
| | **A-02** | `02_login_paso2_google_roberto.png` | Confirmación de cuenta (`roberto.gomez@gmail.com`) |
| | **A-03** | `04_bienvenida_seleccion_rol.png` | Selección de rol (Elige «Tomo medicinas») |
| | **L-01** | `40_modal_invitacion_recibida.png` | Invitación de Silvana con código `482 716` (Toca «Aceptar») |
| | **B-02** | `44_modal_walkthrough_vinculo_paso4.png` | Confirmación de vínculo exitoso con Silvana |
| **Fase 2: Onboarding y Happy Path** | **L-02** | `05_onboarding_roberto_paso1_bienvenida.png` | Bienvenida a Roberto (Toca «Continuar») |
| | **L-03** | `06_onboarding_roberto_paso2_tamano_letra.png` | Selección de tamaño de letra (A tu manera) |
| | **L-04** | `07_onboarding_roberto_paso3_confirmacion.png` | Confirmación de avisos y sonido («Empezar a usar») |
| | **C-03** | `11_roberto_hoy_dosis_pendiente.png` | Pantalla Hoy a las 14:00 (Alarma / Metformina 500 mg) |
| | **D-06** | `13_roberto_hoy_dosis_tomada.png` | Toma registrada «Ya la tomé» con tilde verde |
| **Fase 3: Rama Alternativa 1 (Omisión)** | **J-02** | `39_modal_omision_motivos.png` | Modal de motivos tras presionar «No la tomé» |
| | **J-05** | `14_roberto_hoy_dosis_omitida.png` | Hoy con tarjeta registrada como «No tomada» |
| **Fase 3: Rama Alternativa 2 (Aviso Familiar)** | **K-01** | `15_roberto_hoy_dosis_sin_confirmar_60m.png` | Hoy Roberto: Advertencia ámbar tras 60 minutos |
| | **K-02** | `30_silvana_resumen_alerta_sin_confirmar_60m.png` | Resumen Silvana: Alerta y botón «Ya hablé con Roberto» |

### 3.3. Estructura de la Nueva Lámina (`wireflow_updated.png`)
* **Resolución:** 2500 × 3740 px.
* **Layout:**
  * Cabecera institucional verde (`#07564f` a `#0d5c46`) con metadatos del proyecto.
  * **Fila 1 (Fase 1):** 5 mockups conectados por flechas sólidas con etiquetas explícitas sobre las acciones realizadas.
  * **Fila 2 (Fase 2):** 5 mockups del recorrido feliz hasta la confirmación de la dosis de las 14:00.
  * **Fila 3 (Fase 3):** Dos contenedores en paralelo con línea discontinua:
    * *Recuadro Ámbar:* Omisión voluntaria por parte de Roberto con selección de motivos.
    * *Recuadro Rojo:* Protocolo de alerta familiar cuando transcurren 60 minutos sin confirmación.

### 3.4. Texto Actualizado en el Google Doc (Sección L)
Se actualizaron los dos párrafos de la Sección L para sincronizarlos con los archivos locales:

> *El wireflow muestra el happy path de Roberto y sus ramas alternativas estructurado a partir de las capturas de alta fidelidad generadas directamente en el repositorio local. Sobre cada flecha se especifica la interacción que conduce a la pantalla siguiente. En la Fase 1 (Acceso y Vínculo), Roberto abre la app en A-01 (01_login_paso1_correo_google.png), toca «Continuar con Google», selecciona su cuenta en A-02 (02_login_paso2_google_roberto.png) y elige el rol «Tomo medicinas» en A-03 (04_bienvenida_seleccion_rol.png). Luego recibe la invitación familiar con el código 482 716 en L-01 (40_modal_invitacion_recibida.png) y toca «Aceptar y vincular», confirmando el vínculo con Silvana en B-02 (44_modal_walkthrough_vinculo_paso4.png). En la Fase 2 (Onboarding y Happy Path), Roberto transita su bienvenida personalizada en L-02 (05_onboarding_roberto_paso1_bienvenida.png), configura el tamaño de letra en L-03 (06_onboarding_roberto_paso2_tamano_letra.png) y habilita avisos en L-04 (07_onboarding_roberto_paso3_confirmacion.png). Ya en Hoy (C-03, 11_roberto_hoy_dosis_pendiente.png), a las 14:00 se presenta la toma de Metformina 500 mg. Al tocar «Ya la tomé», la toma queda registrada con estado «Tomada» en D-06 (13_roberto_hoy_dosis_tomada.png), concluyendo con éxito el recorrido principal.*
>
> *Desde la pantalla Hoy (C-03) parten dos ramas alternativas dibujadas con línea punteada. En la primera (Omisión voluntaria), Roberto toca el botón secundario con borde «No la tomé», selecciona un motivo («Me cayó mal», «No tengo el remedio», etc.) en el modal J-02 (39_modal_omision_motivos.png) y la dosis queda registrada como «No tomada» en Hoy (J-05, 14_roberto_hoy_dosis_omitida.png) sin reiterar alertas invasivas. En la segunda (Protocolo familiar tras 60 minutos), si Roberto no confirma ni pospone la toma, la tarjeta pasa al estado de advertencia en K-01 (15_roberto_hoy_dosis_sin_confirmar_60m.png) y el sistema envía una notificación push al celular de Silvana visible en su pantalla de Resumen en K-02 (30_silvana_resumen_alerta_sin_confirmar_60m.png), permitiéndole llamarlo o pulsar «Ya hablé con Roberto» para resolver el aviso sin dar la dosis por perdida.*

---

## 🛠️ 4. Ubicación de Archivos en tu Computadora

Todos los recursos generados quedaron guardados localmente en este repositorio:

| Archivo / Directorio | Descripción |
| :--- | :--- |
| `png medirecord/` | Carpeta con las 51 capturas móviles de alta fidelidad (`01_...` a `51_...`). |
| `docs_assets/` | Carpeta permanente con los 3 gráficos finales generados (`matriz_similitud_updated.png`, `dendrograma_updated.png`, `wireflow_updated.png`). |
| `scratch/build_wireflow.py` | Script en Python que compuso y generó la lámina del Wireflow. |
| `DOCUMENTACION_ACTUALIZACION_SECCIONES_I_Y_L.md` | Este mismo documento de respaldo. |

---

## ✅ 5. Resumen de Calidad

* **Trazabilidad 100%:** Cada captura citada existe físicamente en el repositorio.
* **Consistencia Terminológica:** Se respetó el voseo rioplatense («Copiá», «Tomaste», «Elegí») y los tokens de diseño de MediRecord (`#07564F`, `#0D5C46`, `#E6F1EC`).
* **Seguridad:** El documento original de la cátedra permanece inalterado.
