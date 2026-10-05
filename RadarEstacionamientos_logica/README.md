# Radar de Estacionamientos Libres UCAB — carpeta de lógica

**Estado:** 🟢 Vigente — mapa de la carpeta.

Proyecto en equipo de Ingeniería de Software (período 202715, UCAB Montalbán, Equipo 3).
Esta carpeta es la de **lógica** (decidir y escribir). El código vive en
`../RadarEstacionamientos_code/`.

## Cómo trabajamos: método de dos sesiones

**Una sesión decide y escribe. Otra programa.** Nunca la misma, nunca a la vez. Así cada
una revisa lo que la otra no puede ver: quien programa no se convence a sí mismo de su
propia lectura de las reglas.

| Sesión | Rol | Trabaja en | No hace |
|---|---|---|---|
| **Lógica (arquitecto)** | Entiende el problema, decide, escribe el Brief, las decisiones y el plan | `RadarEstacionamientos_logica/` (y `docs/` del código solo con `sincronizar.sh`) | No escribe código de producción |
| **Código (ejecutor)** | Programa las historias siguiendo `CONTEXTO.md` y `docs/` | `RadarEstacionamientos_code/` menos `docs/` | No cambia decisiones; si algo está mal, lo reporta |

### El flujo

1. **Decidir:** se discute en la sesión de lógica y la decisión queda en una ficha en
   `decisiones/` (una decisión, una ficha).
2. **Escribir:** se actualizan los documentos vigentes (Brief, backlog, estado) y se anota
   en `02_bitacora.md` qué cambió y por qué.
3. **Sincronizar:** `para_el_codigo/sincronizar.sh` copia a `RadarEstacionamientos_code/docs/`
   solo lo que necesita quien programa. Siempre de lógica a código, nunca al revés.
4. **Programar:** la sesión de código toma una historia de la iteración, la construye y al
   cerrar dice qué quedó hecho y qué documento le parece equivocado (sin editarlo).
5. **Revisar:** la sesión de lógica revisa lo construido y, si hace falta, corrige el
   documento o abre una nueva decisión.

### Reglas de la carpeta

- **Una decisión, una ficha.** No se entierran decisiones en documentos largos.
- **Lo abierto se marca como abierto** (va a `preguntas_abiertas.md`); lo no confirmado, como hipótesis.
- **Los documentos se actualizan, no se acumulan.** Cada documento lleva bajo el título su
  estado: 🟢 vigente, 🟡 vigente con reservas o ⚪ histórico.
- **Un solo Brief:** `entregables/BRIEF EQUIPO 3 15787.docx`. Cada cambio lo sobrescribe y
  queda registrado en su Histórico de Revisiones y en la bitácora. Nunca se guardan copias
  con versión en el nombre.

### Cómo arrancar una sesión nueva

- **Lógica:** leer `00_rol_y_metodo.md` → `01_estado_del_proyecto.md` → `decisiones/README.md`.
- **Código:** leer `RadarEstacionamientos_code/CONTEXTO.md` y `docs/ULTIMA_SINCRONIZACION.md`.

## Qué hay aquí y cuándo abrirlo

| Documento | Qué contiene | Cuándo abrirlo |
|---|---|---|
| `00_rol_y_metodo.md` | Reglas de trabajo y reparto lógica / código | Siempre, al empezar |
| `01_estado_del_proyecto.md` | Foto de hoy: equipo, iteración, pendientes | Al empezar, para saber dónde estamos |
| `02_bitacora.md` | Qué se hizo y por qué, por fecha | Para entender por qué algo es como es |
| `preguntas_abiertas.md` | Lo que falta confirmar (equipo, profesora, UCAB) | Antes de decidir algo nuevo |
| `decisiones/README.md` | Tablero de decisiones (cerradas y abiertas) | Antes de cambiar el alcance |
| `entregables/BRIEF EQUIPO 3 15787.docx` | **El Brief vigente** (único, se sobrescribe) | Para entregar o editar el Brief |
| `negocio/problema_y_usuarios.md` | El problema, las personas y las reglas del negocio | Para diseñar o redactar |
| `negocio/guia_profesora_como_se_elabora_el_brief.pdf` | Normas de la profesora para el Brief | Antes de tocar el Brief |
| `negocio/normas_del_brief.md` | Resumen de esas normas como checklist | Para revisar el Brief rápido |
| `producto/backlog_y_iteraciones.md` | Épicas, historias, R1/R2 y plan de la Iteración 1 | Para planificar o programar |
| `arquitectura/stack_y_arquitectura.md` | Stack y decisiones técnicas (con lo que falta) | Antes de programar |
| `para_el_codigo/` | Lo que se copia a la carpeta de código | Solo vía `sincronizar.sh` |
