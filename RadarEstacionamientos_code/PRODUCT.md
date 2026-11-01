# Producto: Radar de Estacionamientos UCAB

**Estado:** 🟢 Vigente — contexto de producto para diseñar (lo lee la skill `impeccable`). El
detalle está en el Brief y en `../negocio/problema_y_usuarios.md`.

## Qué es

Una **PWA** (D-008) que le dice a la comunidad UCAB **dónde hay puestos libres** en el Campus
Montalbán, en vivo, sobre una maqueta del campus vista desde arriba, con un semáforo de dos
estados: verde si hay puesto, rojo si no hay (D-009). Además, permite reportar problemas en un
estacionamiento y le da a Planta Física el control de la capacidad.

## Quién la usa y dónde

| Persona | Momento | Lo que necesita |
|---|---|---|
| Estudiante o profesor que maneja | Llegando al campus o en la cola de la garita, con el celular en una mano | Saber en 2 segundos adónde ir |
| Conductor que ve un problema | Ya estacionado | Reportarlo en 3 toques |
| Vigilancia | En la caseta | Ver y atender las incidencias |
| Planta Física (administración) | En la oficina, desde el computador | Cambiar la capacidad y cerrar estacionamientos |

## Tono

Directo, en el lenguaje del campus («la Playa», «Sambilito»), sin tecnicismos. Las acciones se
nombran con verbos («Enviar reporte», «Actualizar»).

## Lo que no es

No es una app de reservas ni de pagos. No muestra cada puesto individual, sino cada
estacionamiento completo (restricción del Brief). No es una app nativa.

## Personalidad visual

Institucional UCAB y de iOS, sobria, con una maqueta «cuchi» del campus como protagonista. El
color fuerte es solo el semáforo (verde o rojo). Ver `DESIGN.md`.
