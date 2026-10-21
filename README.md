# MediRecord · Demo Interactiva Mobile-First

Prototipo interactivo de alta fidelidad de **MediRecord**, aplicación móvil de recordatorios y seguimiento de medicamentos, diseñada para personas mayores y sus familiares cuidadores.

Construida con **React**, **Vite** y **TypeScript**, fiel a los diseños de referencia de Figma (`design-reference/`). Lista para desplegarse en **Vercel** y presentar en entornos académicos y universitarios.

---

## 📱 Características Principales

1. **Mobile-First con Vista de Presentación en Escritorio**:
   - En móviles, ocupa el 100% de la pantalla respetando safe areas.
   - En pantallas de escritorio/proyector, presenta un marco de smartphone centrado (~420px) con barra de estado nativa (`14:00`, Wi-Fi, batería).

2. **Doble Recorrido de Usuario**:
   - 👴 **Roberto Gómez (Paciente mayor)**:
     - Vista **Hoy** con tomas del día y progreso («1 de 3 tomas registradas» hasta «Listo por hoy»).
     - Botón principal de un toque: **«Ya la tomé»** (Metformina 14:00).
     - Confirmación por voz simulada: **«Decí: Ya la tomé»** con animación de micrófono.
     - Botón **«Recordármelo en 10 minutos»** (posponer).
     - Flujo de omisión: **«No la tomé»** con selección de motivo (*Me sentí mal*, *Me olvidé*, *Otro motivo*) y confirmación visual.
     - Consulta de medicinas en solo lectura con opción de aviso a Silvana.
     - Historial con distinción entre tomas *Confirmadas*, *Sin confirmar* y *No tomadas*.
     - Ajustes de accesibilidad: Tamaño de letra (*Grande*, *Más grande*, *Muy grande*), alto contraste y sonido claro.
   - 👩 **Silvana Gómez (Familiar cuidadora)**:
     - Vista **Resumen** con aviso de demora tras 60 minutos (*«Roberto no confirmó»*).
     - Acciones de acompañamiento: **«Llamar a Roberto»** y **«Ya hablé con Roberto»** (atiende el aviso sin falsear la toma).
     - Gestión completa de medicinas: Listado, **«+ Añadir medicina»** con asistente de 4 pasos, edición de horarios, pausar y eliminar con modales de confirmación.
     - Preferencias de aviso: selección de margen de espera (30, 60 o 90 minutos) y vibración/sonido.

3. **Recorrido de Invitación y Vínculo Familiar**:
   - Recorrido guiado que muestra la generación del código de 6 dígitos (`482 716`), la solicitud de consentimiento a Roberto y la confirmación del vínculo.

4. **Barra de Control de Demostración**:
   - Barra flotante para exposiciones que permite alternar instantáneamente entre Roberto y Silvana, forzar estados de la toma de las 14:00 (Pendiente, Confirmada, Omitida, Sin confirmar a los 60 min) y restablecer la demo con un solo clic.

5. **Persistencia Local (`localStorage`) y Parámetros URL**:
   - Todos los cambios se guardan localmente para mantener la coherencia entre pantallas.
   - Parámetros directos para presentaciones:
     - `/?role=roberto`
     - `/?role=silvana`
     - `/?role=silvana&status=unconfirmed`
     - `/?tab=medicinas`
     - `/?tab=historial`

---

## 🚀 Cómo Ejecutar Localmente

```bash
# 1. Instalar dependencias
npm install

# 2. Iniciar servidor de desarrollo
npm run dev

# 3. Compilar para producción
npm run build

# 4. Probar build de producción localmente
npm run preview
```

---

## ☁️ Despliegue en Vercel

El proyecto está 100% configurado para Vercel:
1. Subí el repositorio a GitHub o GitLab.
2. Importalo en [vercel.com](https://vercel.com).
3. Vercel detectará Vite automáticamente (`npm run build` y directorio `dist`).
4. Incluye `vercel.json` con reescrituras para navegación SPA fluida.
