# Checklist de Tareas — MediRecord Flow Unification

---

## BLOQUE 1: Menús y Ajustes

### Task 1.1: Igualar H03 (RobertoAjustesTab menú principal) a H11 (SilvanaAjustesTab)
**Descripción:** El menú principal de Ajustes de Roberto (H03) tiene un estilo y estructura diferente al de Silvana (H11). Se debe igualar la interfaz para que ambos sean visualmente equivalentes (cards con ícono circular, chevron, subtítulo descriptivo debajo del título principal).

**Acceptance criteria:**
- [ ] El menú principal de `RobertoAjustesTab` tiene exactamente el mismo layout visual que `SilvanaAjustesTab` (H10/H11).
- [ ] Cada opción muestra: ícono en círculo, título, subtítulo descriptivo, chevron derecho.
- [ ] Las 3 opciones existentes (Mi persona de apoyo, A tu manera, Avisos y sonido) son funcionales.

**Verification:**
- [ ] Build: `npm run build` sin errores.
- [ ] Manual: Navegar a Roberto > Ajustes y comparar visualmente con Silvana > Ajustes.

**Dependencies:** Ninguna.
**Files:** `src/components/roberto/RobertoAjustesTab.tsx`
**Scope:** S (1 archivo)

---

### Task 1.2: Agregar opción "Cargar medicamentos" en RobertoAjustesTab (H03)
**Descripción:** Silvana tiene acceso a cargar medicamentos desde su tab Medicinas (H08). Roberto también debe poder acceder al wizard de carga de medicamentos directamente desde su menú de Ajustes, como una opción adicional. La funcionalidad detrás es la misma que la de `SilvanaMedicinasTab` (el wizard I-02→I-09).

**Acceptance criteria:**
- [ ] Existe una nueva opción "Cargar medicamentos" en el menú principal de `RobertoAjustesTab`.
- [ ] Al tocarla, se abre el mismo wizard de 4 pasos que usa Silvana en `SilvanaMedicinasTab`.
- [ ] El wizard funciona correctamente desde el contexto de Roberto (llama `addMedicine`).
- [ ] Al guardar, el toast confirma la acción y la medicina aparece en la lista.

**Verification:**
- [ ] Build: `npm run build` sin errores.
- [ ] Manual: Roberto > Ajustes > Cargar medicamentos → completar wizard → verificar que la medicina aparece en Roberto > Medicinas.

**Dependencies:** Task 1.1
**Files:** `src/components/roberto/RobertoAjustesTab.tsx`, (posiblemente extraer wizard a componente compartido)
**Scope:** M (1-2 archivos)

---

### Task 1.3: Configurar H08 (SilvanaMedicinasTab) para que use flujo I-02→I-09 completo
**Descripción:** El wizard de agregar medicinas en `SilvanaMedicinasTab` tiene actualmente 4 pasos (I-02 a I-05). El diseño I-02→I-09 incluye pasos adicionales: pantalla de resumen de "búsqueda/confirmación de nombre" (I-06), pantalla de edición (I-07), y las confirmaciones de pausa (I-08) y eliminación (I-09). Verificar cuáles de I-06 a I-09 faltan o están incompletos e implementarlos.

**Acceptance criteria:**
- [ ] El wizard tiene los pasos correctos según el diseño I-02→I-09.
- [ ] I-08 (Confirmar pausa) existe y es funcional (ya implementado, verificar).
- [ ] I-09 (Confirmar eliminación) existe y es funcional (ya implementado, verificar).
- [ ] I-06 (si corresponde: confirmar nombre o búsqueda) existe o se documenta como no aplicable.
- [ ] I-07 (Editar medicina) es funcional con edición real (no solo toast).

**Verification:**
- [ ] Build: `npm run build` sin errores.
- [ ] Manual: Silvana > Medicinas → Añadir → recorrer los 4 pasos → guardar → editar → pausar → eliminar.

**Dependencies:** Ninguna.
**Files:** `src/components/silvana/SilvanaMedicinasTab.tsx`
**Scope:** M (1 archivo)

---

### Checkpoint Bloque 1
- [x] Build limpio.
- [x] H03 Roberto Ajustes visualmente igual a H11 Silvana Ajustes.
- [x] Opción "Cargar medicamentos" funcional en Roberto.
- [x] Wizard Silvana Medicinas corre los pasos I-02→I-09.

---

## BLOQUE 2: Accesos y Journeys

### Task 2.1: Implementar Journey Acceso Roberto (pantallas A-xx)
**Descripción:** El archivo `Journey section Acceso Roberto.svg` define el flujo de primer acceso de Roberto: bienvenida, configuración de accesibilidad (tamaño de letra, voz), y llegada a la pantalla principal. Se implementa como un componente `RobertoAccessFlow.tsx` que se muestra en la pantalla de selección de rol cuando se elige Roberto por primera vez.

**Acceptance criteria:**
- [x] Existe `RobertoAccessFlow.tsx` con al menos 3 pasos: Bienvenida, Configuración de accesibilidad (tamaño de letra), Confirmación/inicio.
- [x] El selector de tamaño de letra en el onboarding llama `setFontSize` del contexto.
- [x] Al finalizar el flujo, el usuario llega a la tab "Hoy" de Roberto.
- [x] El flujo se puede acceder desde `DemoControlBar` o `RoleSelectionView`.

**Verification:**
- [x] Build: `npm run build` sin errores.
- [x] Manual: Seleccionar "Tomo medicinas" → recorrer pantallas de acceso → llegar a Hoy.

**Dependencies:** Ninguna.
**Files:** `src/components/common/RobertoAccessFlow.tsx`, `src/components/common/RoleSelectionView.tsx` o `src/App.tsx`
**Scope:** M (2-3 archivos)

---

### Task 2.2: Implementar Journey Acceso Silvana (pantallas S-xx)
**Descripción:** El archivo `Journey section Acceso Silvana.svg` define el flujo de primer acceso de Silvana: bienvenida como cuidadora, configuración inicial (preferencias de aviso), y llegada a su pantalla principal. Se implementa como `SilvanaAccessFlow.tsx`.

**Acceptance criteria:**
- [x] Existe `SilvanaAccessFlow.tsx` con al menos 3 pasos: Bienvenida cuidadora, Preferencia de tiempo de aviso (30/60/90 min), Confirmación/inicio.
- [x] El selector de tiempo llama `setSilvanaAlertWait` del contexto.
- [x] Al finalizar, el usuario llega a la tab "Hoy" de Silvana.
- [x] El flujo se puede acceder desde `DemoControlBar` o `RoleSelectionView`.

**Verification:**
- [x] Build: `npm run build` sin errores.
- [x] Manual: Seleccionar "Soy familiar o cuidador" → recorrer pantallas de acceso → llegar a Resumen de Silvana.

**Dependencies:** Task 2.1 (patrón idéntico).
**Files:** `src/components/common/SilvanaAccessFlow.tsx`, `src/components/common/RoleSelectionView.tsx` o `src/App.tsx`
**Scope:** M (2-3 archivos)

---

### Task 2.3: Implementar "Mi persona de apoyo" en Journey E (subpantalla apoyo de Roberto)
**Descripción:** La subpantalla "Mi persona de apoyo" en `RobertoAjustesTab` (activeSubscreen === 'apoyo') ya existe pero el diseño Journey E requiere revisión. Verificar que muestre: estado vinculado/no vinculado, datos de Silvana si vinculada, opción de desvincular, y opción de ingresar código de invitación si no vinculado.

**Acceptance criteria:**
- [x] Estado vinculado: muestra nombre de Silvana, descripción de permisos, botón "Desvincular".
- [x] Estado no vinculado: muestra mensaje claro, campo/botón para "Ingresar código de invitación".
- [x] "Ingresar código de invitación" abre un input donde Roberto puede escribir el código.
- [x] Al ingresar el código correcto ("482 716"), el estado `familyLinked` pasa a `true`.

**Verification:**
- [x] Build: `npm run build` sin errores.
- [x] Manual: Roberto vinculado → Ajustes → Mi persona de apoyo → ver Silvana. Roberto no vinculado → ingresar código → verificar vinculación.

**Dependencies:** Task 1.1
**Files:** `src/components/roberto/RobertoAjustesTab.tsx`
**Scope:** S (1 archivo)

---

### Task 2.4: Arreglar bug de accesibilidad — incremento/decremento de tamaño de letras no funciona
**Descripción:** En la subpantalla "A tu manera" de Roberto (activeSubscreen === 'manera'), los botones de selección de tamaño de letra llaman `setFontSize` pero hay un bug que hace que el cambio no se refleje visualmente. El problema probable: la clase CSS `font-${fontSize}` se aplica en `PhoneMockup.tsx` al contenedor padre, pero el componente hijo usa tamaños hardcoded. Hay que verificar cuál es el bug real e implementar una solución mínima.

**Acceptance criteria:**
- [x] Seleccionar "Normal" en A tu manera → el texto del prototipo se ve en tamaño base.
- [x] Seleccionar "Grande" → texto aumenta visiblemente.
- [x] Seleccionar "Muy grande" → texto aumenta al máximo.
- [x] El cambio persiste al navegar entre tabs.

**Verification:**
- [x] Build: `npm run build` sin errores.
- [x] Manual: Roberto → Ajustes → A tu manera → cambiar tamaño → navegar a Hoy → verificar cambio aplicado.

**Dependencies:** Ninguna.
**Files:** `src/index.css` (revisar variables CSS de font size), `src/components/roberto/RobertoAjustesTab.tsx`
**Scope:** S (1-2 archivos)

---

### Task 2.5: Auditar Journey G e implementar partes faltantes
**Descripción:** Leer `Journey section G.svg` e identificar qué pantallas del flujo G están implementadas y cuáles no. Journey G es el flujo de "Gestión de medicamentos de Silvana" (cargar, editar, pausar, eliminar). Completar las pantallas faltantes.

**Acceptance criteria:**
- [x] Se genera un listado de pantallas G identificadas vs implementadas.
- [x] Las pantallas faltantes están implementadas.
- [x] El flujo completo de G se puede recorrer sin pantallas rotas o faltantes.

**Verification:**
- [x] Build: `npm run build` sin errores.
- [x] Manual: Recorrer el flujo completo del Journey G identificado.

**Dependencies:** Task 1.3 (flujo I-02→I-09 ya correcto).
**Files:** Por determinar según auditoría; probablemente `SilvanaMedicinasTab.tsx`
**Scope:** M (2-3 archivos)

---

### Checkpoint Bloque 2
- [x] Build limpio.
- [x] Flujos de acceso Roberto y Silvana recorribles.
- [x] "Mi persona de apoyo" funciona en ambos estados (vinculado/no vinculado).
- [x] Cambio de tamaño de letra funciona y persiste.
- [x] Journey G auditado y completo.

---

## BLOQUE 3: Vínculos e Invitaciones

### Task 3.1: Implementar pantalla de gestión de invitaciones recibidas para Roberto (Journey Invitación Roberto)
**Descripción:** Roberto recibe una invitación de Silvana. Se necesita una pantalla donde Roberto puede ver la invitación pendiente, leer los detalles (quién invita, qué permisos otorga), y decidir "Aceptar" o "Rechazar". Esta pantalla se activa cuando `state.pendingInvitation` existe.

**Acceptance criteria:**
- [x] Existe una pantalla/modal de invitación recibida accesible desde Roberto.
- [x] Muestra: nombre de quien invita (Silvana Gómez), descripción de permisos, código de invitación.
- [x] Botón "Aceptar": llama `toggleFamilyLink(true)`, muestra confirmación, cierra la pantalla.
- [x] Botón "Rechazar": llama `toggleFamilyLink(false)`, muestra toast de rechazo, cierra la pantalla.
- [x] El flujo es accesible desde `DemoControlBar` para demostración.

**Verification:**
- [x] Build: `npm run build` sin errores.
- [x] Manual: Roberto → activar invitación desde DemoControlBar → ver pantalla → aceptar → verificar vínculo activo.

**Dependencies:** Ninguna.
**Files:** `src/components/roberto/InvitationReceivedScreen.tsx` (nuevo), `src/components/DemoControlBar.tsx`
**Scope:** M (2 archivos)

---

### Task 3.2: Implementar pantalla que muestra el link/código de invitación (para que Roberto lo ingrese) — L-01
**Descripción:** Silvana genera un código de invitación (actualmente "482 716", hardcodeado). Se necesita una pantalla en el flujo de Silvana que muestre claramente ese código con instrucciones para que Roberto lo ingrese en su app. Esta pantalla es L-01 del archivo `L Vínculo y casos borde.svg`.

**Acceptance criteria:**
- [x] Existe una subpantalla en `SilvanaAjustesTab` (o en un modal del DemoControlBar) que muestra el código de invitación generado.
- [x] La pantalla muestra: código grande y legible ("482 716"), instrucción "Compartí este código con Roberto", botón para copiar/compartir (simulado).
- [x] El código mostrado coincide con `state.familyCode`.

**Verification:**
- [x] Build: `npm run build` sin errores.
- [x] Manual: Silvana → Ajustes → (o flujo de vinculación) → ver pantalla con código.

**Dependencies:** Task 3.1 (flujo complementario).
**Files:** `src/components/silvana/SilvanaAjustesTab.tsx` o nuevo `src/components/common/InvitationCodeScreen.tsx`
**Scope:** S (1-2 archivos)

---

### Task 3.3: Implementar L-05 — Estado "Sin vincular" (Roberto sin persona de apoyo)
**Descripción:** L-05 muestra el estado de la app de Roberto cuando no tiene ninguna persona de apoyo vinculada. Verificar/implementar que la pantalla "Mi persona de apoyo" en Ajustes de Roberto muestre correctamente este estado con call-to-action para iniciar el proceso de vinculación.

**Acceptance criteria:**
- [x] Cuando `state.familyLinked === false`, la subpantalla "Mi persona de apoyo" muestra un estado vacío con mensaje claro.
- [x] Hay un botón "Invitar a alguien" o "Ingresar código de invitación".
- [x] El estado vacío es visualmente distinto del estado vinculado.

**Verification:**
- [x] Manual: Desvincular desde DemoControlBar o Ajustes → Roberto → Ajustes → Mi persona de apoyo → ver estado sin vincular.

**Dependencies:** Task 2.3 (subpantalla apoyo ya correcta).
**Files:** `src/components/roberto/RobertoAjustesTab.tsx`
**Scope:** XS (1 archivo, verificación mayormente)

---

### Task 3.4: Implementar L-06 — Estado "Invitación pendiente" (Roberto recibió invitación pero no respondió)
**Descripción:** L-06 muestra el estado de Roberto cuando hay una invitación recibida pero no respondida. Se necesita representar este estado intermedio con un banner/card informativo en la pantalla "Mi persona de apoyo" o en la pantalla principal de "Hoy".

**Acceptance criteria:**
- [x] Existe un estado `pendingInvitation: boolean` (o similar) en el contexto.
- [x] Cuando hay invitación pendiente, se muestra un banner/card en "Mi persona de apoyo" o en "Hoy" con botón para ver la invitación.
- [x] El banner desaparece al aceptar o rechazar.

**Verification:**
- [x] Build: `npm run build` sin errores.
- [x] Manual: DemoControlBar → simular invitación pendiente → Roberto → ver banner → responder → banner desaparece.

**Dependencies:** Task 3.1 (pantalla de invitación).
**Files:** `src/types.ts`, `src/context/MediRecordContext.tsx`, `src/components/roberto/RobertoAjustesTab.tsx`
**Scope:** M (3 archivos)

---

### Task 3.5: Implementar L-07 — Estado "Invitación rechazada" (caso borde)
**Descripción:** L-07 muestra el estado cuando Roberto rechazó una invitación. Se necesita feedback claro y vuelta al estado "Sin vincular".

**Acceptance criteria:**
- [x] Al rechazar una invitación (Task 3.1), se muestra un toast con mensaje claro "Invitación rechazada".
- [x] El estado vuelve a "Sin vincular" (`familyLinked: false`, sin pending).
- [x] No hay estado residual de la invitación rechazada.

**Verification:**
- [x] Manual: Recibir invitación → rechazar → verificar toast y estado sin vincular.

**Dependencies:** Task 3.1, Task 3.3.
**Files:** `src/components/roberto/InvitationReceivedScreen.tsx`, `src/context/MediRecordContext.tsx`
**Scope:** XS (verificación + ajuste de toast)

---

### Checkpoint Bloque 3
- [x] Build limpio.
- [x] Flujo completo: Silvana genera código → Roberto recibe invitación → Roberto acepta/rechaza → estado correcto.
- [x] L-01 (código visible para Roberto), L-05 (sin vincular), L-06 (pendiente), L-07 (rechazada) implementados.
- [x] DemoControlBar permite simular todos estos estados.

---

## Checkpoint Final
- [x] `npm run build` sin errores.
- [x] Todos los flows recorribles sin pantallas rotas.
- [x] Los 3 bloques de requerimientos verificados manualmente.
- [x] Revisión aprobada por el usuario.
