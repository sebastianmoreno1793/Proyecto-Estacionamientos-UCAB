# Estado del proyecto

**Estado:** 🟢 Vigente — es la única fuente de las cifras del proyecto. Actualizado: 27/oct/26.

## Equipo 3 (NRC 15787)

| Integrante | Épicas |
|---|---|
| Samuel Goncalves | 1 Autenticación y perfiles · 2 Vehículos, favoritos y NRC |
| Aaron Zarraga | 3 Detección de entradas y salidas · 4 Puestos libres en tiempo real |
| German Alfonzo | 5 Mapa del campus con semáforo · 6 Edificios y distancia a pie |
| Manuel Rosales | 7 Sugerencia de estacionamiento · 8 Avisos en el celular |
| Sebastian Moreno | 9 Incidencias y vigilancia · 10 Administración y reportes |

Profesora: María Pérez de Ovalles — Ingeniería de Software.

## Dónde estamos

- **Brief aprobado:** «OK con el brief» (profesora en Trello, 19/oct/26), nota 2,1/3. La versión
  aprobada es el Google Doc de Samuel del 16–17/oct
  (https://docs.google.com/document/d/11RHWEd0lgparq8xaIide1dya6_3Fqi7DAFOERzXE6lw). El 27/oct se
  copió como `entregables/BRIEF EQUIPO 3 15787.docx`.
- **Iteración 1** (05/oct → 16/oct): 12 historias, con la 2.1 en lugar de la 1.2 (ver D-004).
  Fusionadas en `main`: 5.1, 5.4 y 9.1. PR abiertos: #44 (6.1) y #45 (8.1). La maqueta 3D (3.2) está
  en la rama `hu-3.2-mapa-3d-campus`. Detalle: `producto/revision_27oct_equipo_vs_profesora.md`.
- **Arquitectura:** dos sistemas, la app y la maqueta 3D (D-006,
  `arquitectura/arquitectura_dual_app_y_maqueta.md`).
- **Próximo:** Segunda Entrega el **mar 03/nov** (12 pts): cada uno especifica una HU en Trello con
  su diagrama de actividades, más los 4 RNF. Checklist en `negocio/modulo7/README.md`.
- **Material de la profesora:** `negocio/modulo7/` (instrucciones, plantillas, anuncios, comentarios y
  láminas de todas las unidades).

## Herramientas y enlaces

- Repositorio (privado, cuenta universitaria sebastianmoreno1793): https://github.com/sebastianmoreno1793/Proyecto-Estacionamientos-UCAB — contiene las dos carpetas: `RadarEstacionamientos_logica/` y `RadarEstacionamientos_code/` (la raíz del repo es la carpeta *Ingeneria de Software*).
- Tareas: Issues #1–#12 (milestone **Iteración 1**) y #13–#32 (milestone **Iteración 2**), con etiquetas por épica y por persona. Flujo de trabajo en `CONTRIBUTING.md` del repo.

- Brief vigente: `entregables/BRIEF EQUIPO 3 15787.docx`
- Mapa de historias (Figma): https://www.figma.com/board/sDRyvMoT5BDiuwwb2pPG2P/Mapa-de-historias-de-usuario---Equipo-3?node-id=0-1&p=f
- Tablero Trello (Sprint 1, administrado por Sebastian; se sincroniza desde GitHub): https://trello.com/b/WQSBIFTj/radar-de-estacionamientos-ucab-sprint-1

## Pendientes inmediatos

### Para la Segunda Entrega (03/nov)

- [ ] Cada integrante especifica una HU en su tarjeta de Trello (Card, Conversación y Criterios) con su diagrama de actividades como imagen o PDF.
- [ ] Tarjeta «Requisitos No Funcionales» con los 4 RNF (ISO 25010, testeables), acordados en equipo.
- [ ] Llenar las tarjetas de reuniones (la profesora preguntó dos veces si nos reunimos) y agendar una antes del 03/nov.
- [ ] Renombrar el tablero «EQUIPO 87 3» y enviar el enlace a mperezpu@ucab.edu.ve.
- [ ] Renombrar los Issues de GitHub con los nombres del Brief aprobado (lista en `producto/revision_27oct_equipo_vs_profesora.md` §3).
- [ ] Revisar y fusionar los PR #44 y #45; abrir y fusionar el PR de la maqueta 3D.
- [ ] Preguntar a la profesora por la «Actividad 4 A» de la Unidad 9.
- [ ] Ajustar `.github/workflows/trello.yml`: mueve tarjetas a listas que ya no existen (Por hacer, En proceso, Hecho).

### De antes

- [ ] Crear el tablero (GitHub Project, vista Board) y añadirle los Issues — el token fine-grained no puede crearlo.
- [ ] Activar GitHub Pro con el Student Developer Pack para proteger `main` (hoy GitHub no lo permite en repo privado gratis).
- [ ] Asignar los Issues a cada compañero cuando acepte la invitación. Invitados (05/oct/26): Samuel `sagoncalves17-hash`, Aaron `AaronZarraga` (confirmado por Sebastian, reinvitado 05/oct/26), Manuel `marosaless`, y `Duende717` (es Samuel, confirmado 04/oct/26: Samuel tiene dos invitaciones, falta saber con cuál cuenta trabaja). German `gmalfonzo25-ucab` invitado 05/oct/26 (cuenta confirmada por commits con su correo UCAB). Manuel y Aaron ya aceptaron.

- [ ] Invitar a Samuel, Aaron, German y Manuel como colaboradores del repo (faltan sus usuarios de GitHub).

- [ ] Montar en Trello las 4 etapas según `producto/tablero_trello_por_etapas.md` y renombrar las HU con los nombres del Brief.
- [ ] Generar el token de Trello y guardarlo como secreto `TRELLO_TOKEN` en GitHub (la clave `TRELLO_KEY` ya está).
- [x] Tablero de Trello nuevo público e integrantes agregados como miembros (05/oct/26).
- [ ] Decidir si el tablero va por etapas (ejemplo de la profesora, `producto/tablero_trello_por_etapas.md`) o por estado, y luego actualizar enlace y Figura 3 del Brief.
- [ ] Cambiar la Figura 3 del Brief por una captura nueva del tablero por etapas.
- [ ] Actualizar el mapa de Figma para que coincida con el del Brief (11 épicas, R1 y R2).
- [ ] Responder las preguntas de `preguntas_abiertas.md` que bloquean la Iteración 1.
