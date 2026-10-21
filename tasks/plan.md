# Implementation Plan: Unificación y Completud del Flujo MediRecord

## Overview

El prototipo tiene implementadas las pantallas core del ciclo de toma diaria (Hoy, Medicinas, Historial, Ajustes básicos). El objetivo es completar y unificar el flujo completo en 3 bloques:

1. **Menús y Ajustes**: Igualar H03 a H11, agregar "Cargar medicamentos" en AjustesRoberto, y configurar H08 para flujo I-02→I-09.
2. **Accesos y Journeys**: Implementar pantallas de acceso (Roberto y Silvana), "Mi persona de apoyo" en Journey E, bug de accesibilidad, y auditoría/completud de Journey G.
3. **Vínculos e Invitaciones**: Pantallas de invitación recibida (Roberto), pantalla de código de invitación, L-01/L-05/L-06/L-07.

## Architecture Decisions

- **No se crea router nuevo**: Se extiende el sistema de `activeSubscreen` ya existente en los componentes de Ajustes, usando strings de estado local. El router de la app sigue siendo un único árbol renderizado por `PhoneMockup.tsx`.
- **No se introducen librerías nuevas**: Solo React + Lucide (ya instalados).
- **Nuevo archivo por pantalla grande**: Las pantallas de Acceso (onboarding) y las de Invitación se implementan como componentes independientes en `src/components/common/` o `src/components/roberto/` / `src/components/silvana/`.
- **Estado global**: El contexto `MediRecordContext` se extiende únicamente con campos que tienen que persistir (ej. `pendingInvitation`). Estados de UI de subpantallas quedan en estado local.

## Archivos Relevantes a Mantener en Memoria

### Modificados
- `src/components/roberto/RobertoAjustesTab.tsx` — H03, "Mi persona de apoyo" (E), accesibilidad
- `src/components/silvana/SilvanaAjustesTab.tsx` — H10/H11 de referencia
- `src/components/silvana/SilvanaMedicinasTab.tsx` — Flujo I-02→I-09 (H08 de Silvana)
- `src/context/MediRecordContext.tsx` — agregar `pendingInvitation` state
- `src/types.ts` — agregar tipos necesarios
- `src/App.tsx` — orquestar pantallas de acceso (onboarding)
- `src/components/PhoneMockup.tsx` — renderizar pantallas de acceso si aplica

### Creados
- `src/components/common/RobertoAccessFlow.tsx` — Journey Acceso Roberto (A-01→A-N)
- `src/components/common/SilvanaAccessFlow.tsx` — Journey Acceso Silvana (S-01→S-N)
- `src/components/roberto/InvitationReceivedScreen.tsx` — Gestión invitaciones recibidas
- `src/components/common/InvitationCodeScreen.tsx` — Pantalla que muestra código de invitación

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| SVGs no textuales → interpretación de pantallas por nombre/código | Med | Inferir contenido de nombres de pantalla + código existente + patrones del diseño |
| Bug accesibilidad fontSize no persiste | Med | El `setFontSize` ya existe en contexto; el bug probable es que los botones +/- llaman setFontSize con el valor incorrecto |
| Journey G sin auditar puede tener mucho implementado | Med | Leer código G antes de implementar para no duplicar |

## Open Questions

- ¿Las pantallas de "Acceso Roberto" y "Acceso Silvana" son onboarding inicial (primera vez) o acceso/login en cada sesión? → Asumir: flujo de primera vez, triggered desde el `RoleSelectionView`.
- ¿L-01/L-05/L-06/L-07 corresponden a estados del vínculo (sin vincular, pendiente, vinculado, rechazado)? → Sí, basado en el nombre del archivo.
