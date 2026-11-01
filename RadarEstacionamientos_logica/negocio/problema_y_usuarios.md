# Problema y usuarios

**Estado:** 🟢 Vigente — resumen del negocio. Fuente: Brief v1.0.

## El problema

En el campus Montalbán, en las horas pico (**10:00 a.m. y 2:00 p.m.**), estudiantes y
profesores pierden tiempo dando vueltas buscando puesto: llegan tarde a clase y
congestionan las vías internas. No saben dónde se acaba de liberar un puesto.

## Personas (Mapa de Impacto)

| Meta | Personas | Impacto |
|---|---|---|
| Consultar estacionamientos | Estudiantes y profesores | Saben dónde hay puestos libres antes de entrar |
| Llegar a clase a tiempo | Estudiantes / Profesores | Llegan más rápido a su salón / a los puestos docentes |
| Seguridad | Conductores / Vigilancia | Avisan y atienden problemas más rápido |
| Administración | Planta Física | Controlan la capacidad y saben cuándo se llena el campus |

## Reglas del negocio

- Semáforo de dos estados (D-009, 27/oct/26): **verde = hay puesto** (al menos 1 libre), **rojo = no hay
  puesto** (0 libres), gris = cerrado. Siempre con el texto y la cantidad de libres. El porcentaje de
  ocupación es un dato, no decide el color.
- La ocupación se mide por estacionamiento completo, no por puesto.
- Solo campus Montalbán; catálogo de NRC solo de la Escuela de Ingeniería.
- El aula de cada NRC no es pública: el usuario elige el edificio.
