# Sección J: Mapa del Sitio (Sitemap) y Arquitectura de Navegación

## J.1. Modelo Conceptual y Arquitectura Dual por Roles

La arquitectura de navegación de MediRecord se estructura a partir de un **modelo dual simétrico**, diseñado para resolver la asimetría de necesidades entre la **Persona Mayor Polimedicada** (foco en simplicidad, legibilidad extrema y toma autónoma) y el **Familiar o Cuidador** (foco en supervisión en tiempo real, trazabilidad y resolución colaborativa):

1. **Acceso Común Inicial (Nivel 0):**
   * Ambas personas ingresan a través del flujo simplificado de Google (`A-01` Login Google › `A-02` Confirmar Cuenta).
   * En `A-03` (Selección de Rol), el usuario bifurca su experiencia eligiendo entre:
     * **«Tomo medicinas»:** Activa la interfaz de Roberto, optimizada para baja agudeza visual y motricidad fina reducida.
     * **«Acompaño o cuido a alguien»:** Activa la interfaz de Silvana, optimizada para control de adherencia y alertas familiares.

2. **Onboarding Contextual:**
   * **Roberto:** Recorrido en 3 pasos enfocado en accesibilidad personalizada (`L-02` Bienvenida › `L-03` «A tu manera» para regular tamaño de letra › `L-04` Verificación de avisos y sonido fuerte).
   * **Silvana:** Recorrido centrado en la configuración de supervisión (`Bienvenida` › `Tiempo de espera para alertas` con umbral predeterminado de 60 minutos › `Confirmación`).

---

## J.2. Las 4 Pestañas de Navegación Fija (Bottom Navigation Bar)

En estricta concordancia con la convergencia matemática del Card Sorting (Sección I), la navegación principal se sostiene sobre una barra inferior fija de **4 pestañas persistentes**, garantizando que el usuario nunca quede atrapado en subniveles profundos:

```
┌───────────────┬───────────────┬───────────────┬───────────────┐
│  1. HOY /     │ 2. MEDICINAS  │ 3. HISTORIAL  │  4. AJUSTES   │
│    RESUMEN    │               │               │               │
└───────────────┴───────────────┴───────────────┴───────────────┘
```

### 1. Pestaña «Hoy» (Roberto) / «Resumen» (Silvana)
* **Rama Roberto (`Hoy`):**
  * **Tarjeta de Toma Activa (`C-03`):** Muestra el fármaco inmediato (ej. *Metformina 500 mg a las 14:00*), botón primario destacado «Ya la tomé» (`D-06`), botones secundarios «Posponer 10 min» y «No la tomé» (despliega modal de motivos `J-02`), y botón multimodal «Usar mi voz».
  * **Estado de Advertencia Ámbar (`K-01`):** Se activa al transcurrir 60 minutos sin confirmación, manteniendo los controles abiertos sin bloquear la app.
  * **Próxima toma programada:** Previsualización horaria de los siguientes medicamentos del día.
  * **Banner de Invitación:** Notificación flotante no invasiva cuando Silvana envía un código de vínculo.
* **Rama Silvana (`Resumen`):**
  * **Monitoreo en Vivo:** Visualización del estado actual de Roberto (dosis tomada, pendiente o retrasada).
  * **Protocolo de Alerta Familiar (`K-02`):** Si una dosis supera los 60 minutos sin respuesta, Silvana recibe un banner de alerta con dos llamadas a la acción directas: botón «Llamar a Roberto» y botón «Ya hablé con Roberto» (resuelve la alerta sin forzar una toma ficticia).

### 2. Pestaña «Medicinas»
* **Listado de Fármacos Activos:** Fichas de fármacos con nombre comercial, genérico, dosis, frecuencia y horarios programados.
* **Ficha de Detalle:** Indicaciones clínicas ampliadas (con o sin alimentos, precauciones).
* **Flujo Modal de Alta en 4 Pasos:**
  1. *Paso 1:* Nombre del fármaco (búsqueda predictiva).
  2. *Paso 2:* Dosis y forma farmacéutica (comprimido, gotas, cápsula).
  3. *Paso 3:* Horarios y frecuencia diaria.
  4. *Paso 4:* Resumen de confirmación.
* **Gestión del Tratamiento:** Modales para editar dosis, pausar tratamiento de forma temporal o eliminar prescripción.

### 3. Pestaña «Historial»
* **Navegación Cronológica Diaria:** Selector de fechas con flechas anterior/siguiente («Hoy», «Ayer», etc.).
* **Registro de Estados:** Trazabilidad de cada evento con hora real de confirmación, tomas pospuestas y motivos de omisión («Me cayó mal», «No tengo el remedio»).
* **Métrica de Adherencia:** Indicador porcentual de cumplimiento semanal para evaluación en consulta médica.

### 4. Pestaña «Ajustes»
* **Mi Persona de Apoyo (Vínculo Familiar):** Gestión del enlace mediante código unívoco de 6 dígitos (`482 716`). Permite visualizar el estado del familiar conectado o desvincular.
* **Accesibilidad «A tu manera»:** Ajuste dinámico de tamaño de tipografía (Normal, Grande, Muy Grande), modo alto contraste y calibración de volumen.
* **Protocolo de Espera:** Silvana regula aquí el tiempo de espera antes de activar la alerta push (30, 45 o 60 minutos).
* **Soporte y Cuenta:** Ficha de usuario, cierre de sesión y acceso a la guía interactiva «Cómo se usa».

---

## J.3. Diagrama del Sitemap Actualizado

*(Se inserta la lámina `sitemap_updated.png` generada a 300 DPI, reflejando el árbol jerárquico completo, los contenedores por rol y la conexión transversal del código de invitación).*
