# back/tacticas · una clase por táctica (van dibujadas en el diagrama de clases)

| Componente | Requisito | Atributo · táctica | Responsabilidad |
|---|---|---|---|
| `AutenticadorDeSensores` | HU 3.1, 3.2 | Seguridad · autenticar actores | Solo quien tiene la clave (`x-clave-sensor`) manda avisos y placas (401) |
| `ControlDeAcceso` | HU 1.1 (y todas las que piden sesión) | Seguridad · autorizar actores | **Precondición**: sesión iniciada (401) y rol de administrador (403) |
| `FiltroDeAvisos` | HU 4.1 · RNF Fiabilidad | Disponibilidad · ignorar comportamiento defectuoso + límite | Ignora los avisos imposibles sin detener el sistema, los registra y con 3 seguidos marca el sensor «con falla» |
| `MonitorDeSensores` | HU 3.1 · RNF Disponibilidad | Disponibilidad · timeout | Marca «sin avisar» el sensor que pasa 30 min (`TIEMPO_LIMITE_SENSOR_MIN`) sin mandar nada |

Lo que dicen las dos de disponibilidad se ve en Administrar › Garita (sección «Sensores») y en
`GET /api/avisos` → `sensores`. Cuando un sensor queda con falla se emite `SENSOR_CON_FALLA` por el canal en vivo.
