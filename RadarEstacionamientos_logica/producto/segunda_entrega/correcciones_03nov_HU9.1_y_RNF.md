# Correcciones del 03/nov · HU 9.1 y RNF (lo que me marcaron en la revisión del equipo)

**Estado:** 🟢 Subido a Trello el 03/nov/26 (tabla como portada de la HU 9.1, enlace del diagrama, ítem de la checklist y descripción de los RNF en el orden del equipo). Comprobado en el JSON público del tablero.

Lo que pidió la revisión del equipo para Sebastian:

1. Falta la tabla y el enlace del diagrama.
2. Corregir en la checklist el ítem «no enlace a la herramienta de diagramación».
3. Pasar la tarjeta de RNF a la forma de lista (1. Característica → a. Subcaracterística: El sistema
   debe…), sin perder el contenido nuevo ni los «Cómo se prueba».

Archivos nuevos en esta carpeta:

- `HU9.1_especificacion_tabla.png` (y su `.html`): la tabla de 3 columnas con el Autor arriba, con el
  mismo formato que las HU 1.1 y 4.1.
- `diagrama_actividades_HU9.1.drawio`: el mismo diagrama del PNG v2, en draw.io. Se abre en
  diagrams.net si hay que cambiar algo.
- `enlace_diagrama_HU9.1.txt`: el enlace de viewer.diagrams.net. El diagrama va dentro del enlace,
  así que abre sin cuenta ni ningún otro paso (comprobado el 03/nov). Es el mismo tipo de enlace que
  tienen las HU 1.1 y 4.1.

> **Ojo con la consigna.** Nuestra copia del enunciado de Módulo 7
> (`negocio/modulo7/documentos_y_anuncios.md`) dice: «El diagrama debe ser un enlace de fácil revisión
> para la profesora» y, entre comillas, «Nada de enlaces con las herramientas de diagramación». La
> revisión del equipo cita otra frase («que la herramienta me dé acceso sin ningún paso previo»). Con
> la imagen adjunta **y** el enlace de solo lectura se cumplen las dos lecturas, que es lo que hicieron
> la 1.1 y la 4.1.

---

## 1. HU 9.1 · Tarjeta https://trello.com/c/1gn9kPQ3

### 1.1 Adjuntos

Subir `HU9.1_especificacion_tabla.png` a la tarjeta con el nombre **HU 9.1 · Especificación.png** y
ponerla de portada.

### 1.2 Descripción

Pegar este bloque **al principio** de la descripción (antes de «**Responsable:**»). Cambiar
`URL_DE_LA_TABLA` por el enlace del adjunto de la tabla: en el adjunto, «…» › «Copiar enlace».

```
![HU 9.1 · Especificación](URL_DE_LA_TABLA)

**Diagrama de actividades:** [Ver diagrama de actividades de la HU 9.1](https://viewer.diagrams.net/?lightbox=1&highlight=0000ff&nav=1&title=HU_9.1_Crear_incidencia.drawio#R7V1Zk5u4Gv01rrrzktLC%2BtjtdM%2Bk6k7V1HTNzLMaZJsajHxZknR%2B%2FZXYDHxyuu3Ihg7kJSCEGs7Rt0t4Rdf7r5so5iv6sKLrMGLblO1XBCVsL9s%2Brgj57S956n%2FA8rDqtP%2F6a8oOu99FyGN5Kfxa9cMEIdVHtrxULX7TsE2jsGrqNDxF3%2Bq%2FgJvWIgp5VrdVTbkQcR4d%2Bo2BSBIe5L02lqbiS7%2FbRsRhr%2BHAthw0PAUshq3%2FRGG%2Bq1vt5qnVhd94tN01f9qjqEUlFSJv8FnzWCHTf%2BnHE1fbv5ryJH%2FLDQGp7vjM4qJ%2B8qohy1%2BaV0lFkYRc3YBW9P7LLsr504EF6uoXSZ5sk6THaxGLtLyBbsp%2Fsj3LU%2FEv71xB5b%2F2SoOMfO37%2Bjl4mvOvJ1%2BmN3G42PM8fZFd6hsabOsp49anXzr4W17duOti79K6ldWsb9uxj9jJgxq%2BE1DSK0AZMu5tgvcDpW0ZANJ6HUh5h5RkDgEbwKK7YgAe6vXxwZYNALI08Fgm5pkN4Hni6noSBRGTB0qTOvKFsXrZNcuEUqOqx1%2FqcABktmMHdZiIXKGZVYoUWyem5y7fx%2FXs3Ygkr%2FUupvW5Dm6oHEigndGh8%2BzYjhmCrIaQliDNDLZ1E9gEQw5gCP8iz%2B%2BeU0VDrEgShyBarenqnibybLUmq7v7P%2FlBpDlL1dn9%2FXeUB5YgsTSo0SdnkuWcRdY4mtzuy1erjzr0UaShzzVBnwvoI4q%2Bv3kabaKANRRmPDtS2Apc5cgUWcHSSMyZQ4zomCR6b7DGO7F%2FLrJpOzW4VV01jJRCGHWm2DOBog9F4UOpy34vuHxdVtqdnKcb9q0jA5U6e0hkh0WZERcQCJ0FrbdgRA6agKhHYanPPjUOQ0%2BRqYhItRUdPgORplyUXGd5lBdBJBIWLwbqyKnl3lK3YQwdjO%2B4yGdAbzfn9Th4%2BlRQj%2FSosF0CqXAgE03bjzFBFiY6Fn9UKs6Ov0cJHTFy%2BqrD0YQmWnOAjagOGFzTvj0v%2FdeNSPdFXLmwtUWIRdYxCbI3K83APpIvri4h9hxJYMrDF9A%2FT7m6kEeHskMZjx5S8RzzPZu3lzxItTi%2BxpKQa%2Fl3GCYTKuftsTMBOrFN6QMEUcgT5Tq85tqh8%2BiyrkgX%2FmAbIow69iA3pkktEBsS5hghDOYWyGwNDhnYG9e7pb1x34W9IQNz49kac%2BNdzdzAMNxS5uYhjra8MTYDW7LEFUe2fHTTuAKG%2BzZgS5nwxYKfpgwjfEvOCPpJEl10oKgwxjdMdBEYUjtVpmstvdoU1FV6DnIWKQc5bdL3MxYGag851OS6yNVkgZxTOWxKXzwJn3KWX1ZMvE5QQAYwEk2MeLX6IoGB9GOUsDj6tlQXa80woIciOMuxo%2BPHhONJYAjvKEX1RxFnrC0mPiSfI6WLarXElzw8MNQ6qbqioYahtluWFaVkheykL9zK2svigL2x0HhrYp2ftdSIqXVLFwwG1G7lgn1Kwqru%2Fr9C1anufJWhZHHOugnJmG%2BjdKkz9ti7ZaGReEtmquXCs8hwgdgNU1MExvGekqM%2FpYjUWf6Y9VO5dZa%2FFafy%2BoYHO%2Fn%2Fuum%2FE%2BW9L11jFQpQ%2BD9Ij1pZr8XngOn947LJm%2BT3KcwOfOqQPu%2FMPbb8W6buKUwx%2BP3SW1zL4SZK9ywYrsnomDqdo7ju%2B4froTCfEt5FOI8TwkE3FU7N4gGkZsR%2FOf%2FObFgiuA5f9g0dfUp%2FjvQSWL3ukhuml6i1pJfOXLzuNrXG11avG8kvNTnc7qxOwju1KarEOuF9LM%2BfvTwEm6dexSblMcujz%2F37dO9Z3%2FqHiOSIx%2BAI6Xe0NCNkokgDXt%2FU3TD1yjjYQ4ORcpZueQ5GKmFv3%2BeNTMDMwnEHXZnnu3dVhSLlZaavSIBTv3ogKyntvpQ59LHakMcaiboLJJ5RyMJyZU63512RKy7vlHMiJDO1d%2FHEn1mWRwzaIDnX8%2F6kkPK8TeRxzDfqipIHGcLHd3XzPgrDmPcFkaAz4jzze5yaUnVvj5POllATe5woTHasRRIWgUKeoP9I76wIJdS5YkpUmb4Nz0T6yxngByoIS98Iv3z%2Fm8I%2FXJeAAfyOFn1iAn2Yq3iSkbEukfpO0fXQmPDC%2FMPKvn8qq6Tdxeb2x6vB7VwXXhA6UAvmdzDVAEyM7JBEOoDX4ocAPkNVXx1e7PfzZ7r02RXhxVp4WRJIJyR9x9OW2HRQnycaXPHVcCU6XOtK5XudqxYepHoJsgCm%2FtUgpTpIH6viiPQIlbPHcvGuVe3Q5aY6ZeBcDWFLh%2FBHVq10D8T%2BEHN1%2FNPoWmxRjSvsXQ1fGG52AOunpM%2FLGYcs27WJMRjCjhaLWiDtaF8WjIJEwXCgE7GoBIK9dLodVIesfWDZr%2BpxceDa5CFMckr6JD7HIvi3anqM1JOULI%2FHKcgLXMopOrFrenRO3blxag%2B%2FQmBfyCncCm9PRVC9uZGK8SD73fpmZ7M6HInSqYiqPz9Wh5vsL03w%2Bt4rA41FaqOM5kOqN0gRWsiQTbXMcPr6A1vovOfq9zcwZ%2FDc%2FTDbQmbmTLuXfXQ9QGZvsi1symQ71lS0O50fqwMJc5B3Katoqqxas5dVxzYmq%2F5UWL15xmpqJNOBtw0%2BoPpmksHXFKYSQ9nO7EXXvTSGGiY4Pfs6%2FjZ4Yg%2Bj8x4Mm3a4Z5cko2ChwYVWHAxkT0UTeHMPojzHUBDlo6lw6s%2BdU981xOnxexdjk%2Bqg2VedkGeKVTwZVmeXw4JfQrk0hmrrTCdHGo3V%2BWWxhsX6i0vEYCQylXyHQ%2Be2lgNycakGBiNRNJEisWPN3q5i35RdnY6s2nNfz4GJa2pBBxxqNFqXvBWmxupDx0zn6Ly6s1%2FTgalnaFEHHGk0Wr25r%2BrAFr5QC8OR7InU6B1%2FUcIWMaaEralIq4uWyt%2BAG5uYKv3BoUajGS%2FiazvGxNeZStbfnV%2FSCX7i5tIFcSB6mswqG5fOPj%2FhuIaWxh6%2FBTM6q9bs94W5Fy9eBV%2BQGUdW5enxt6yr7sef%2B24amx8KP3aqf0T8%2Fw%3D%3D)

![HU 9.1 · Diagrama de actividades](https://trello.com/1/cards/6ac2fab067a4aa12eecbdc57/attachments/6ae8d8159aa4f3ae2df55582/download/diagrama_actividades_HU9.1_v2.png)

---
```

Y dos cambios más abajo, en la misma descripción:

- `**Especificada por:** Sebastian Moreno` → `**Autor:** Moreno, Sebastian`
- La última línea, `**Diagrama de actividades:** adjunto a esta tarjeta (diagrama_actividades_HU9.1_v2.png).`
  → `**Diagrama de actividades:** [Ver diagrama de actividades de la HU 9.1](https://viewer.diagrams.net/?lightbox=1&highlight=0000ff&nav=1&title=HU_9.1_Crear_incidencia.drawio#R7V1Zk5u4Gv01rrrzktLC%2BtjtdM%2Bk6k7V1HTNzLMaZJsajHxZknR%2B%2FZXYDHxyuu3Ihg7kJSCEGs7Rt0t4Rdf7r5so5iv6sKLrMGLblO1XBCVsL9s%2Brgj57S956n%2FA8rDqtP%2F6a8oOu99FyGN5Kfxa9cMEIdVHtrxULX7TsE2jsGrqNDxF3%2Bq%2FgJvWIgp5VrdVTbkQcR4d%2Bo2BSBIe5L02lqbiS7%2FbRsRhr%2BHAthw0PAUshq3%2FRGG%2Bq1vt5qnVhd94tN01f9qjqEUlFSJv8FnzWCHTf%2BnHE1fbv5ryJH%2FLDQGp7vjM4qJ%2B8qohy1%2BaV0lFkYRc3YBW9P7LLsr504EF6uoXSZ5sk6THaxGLtLyBbsp%2Fsj3LU%2FEv71xB5b%2F2SoOMfO37%2Bjl4mvOvJ1%2BmN3G42PM8fZFd6hsabOsp49anXzr4W17duOti79K6ldWsb9uxj9jJgxq%2BE1DSK0AZMu5tgvcDpW0ZANJ6HUh5h5RkDgEbwKK7YgAe6vXxwZYNALI08Fgm5pkN4Hni6noSBRGTB0qTOvKFsXrZNcuEUqOqx1%2FqcABktmMHdZiIXKGZVYoUWyem5y7fx%2FXs3Ygkr%2FUupvW5Dm6oHEigndGh8%2BzYjhmCrIaQliDNDLZ1E9gEQw5gCP8iz%2B%2BeU0VDrEgShyBarenqnibybLUmq7v7P%2FlBpDlL1dn9%2FXeUB5YgsTSo0SdnkuWcRdY4mtzuy1erjzr0UaShzzVBnwvoI4q%2Bv3kabaKANRRmPDtS2Apc5cgUWcHSSMyZQ4zomCR6b7DGO7F%2FLrJpOzW4VV01jJRCGHWm2DOBog9F4UOpy34vuHxdVtqdnKcb9q0jA5U6e0hkh0WZERcQCJ0FrbdgRA6agKhHYanPPjUOQ0%2BRqYhItRUdPgORplyUXGd5lBdBJBIWLwbqyKnl3lK3YQwdjO%2B4yGdAbzfn9Th4%2BlRQj%2FSosF0CqXAgE03bjzFBFiY6Fn9UKs6Ov0cJHTFy%2BqrD0YQmWnOAjagOGFzTvj0v%2FdeNSPdFXLmwtUWIRdYxCbI3K83APpIvri4h9hxJYMrDF9A%2FT7m6kEeHskMZjx5S8RzzPZu3lzxItTi%2BxpKQa%2Fl3GCYTKuftsTMBOrFN6QMEUcgT5Tq85tqh8%2BiyrkgX%2FmAbIow69iA3pkktEBsS5hghDOYWyGwNDhnYG9e7pb1x34W9IQNz49kac%2BNdzdzAMNxS5uYhjra8MTYDW7LEFUe2fHTTuAKG%2BzZgS5nwxYKfpgwjfEvOCPpJEl10oKgwxjdMdBEYUjtVpmstvdoU1FV6DnIWKQc5bdL3MxYGag851OS6yNVkgZxTOWxKXzwJn3KWX1ZMvE5QQAYwEk2MeLX6IoGB9GOUsDj6tlQXa80woIciOMuxo%2BPHhONJYAjvKEX1RxFnrC0mPiSfI6WLarXElzw8MNQ6qbqioYahtluWFaVkheykL9zK2svigL2x0HhrYp2ftdSIqXVLFwwG1G7lgn1Kwqru%2Fr9C1anufJWhZHHOugnJmG%2BjdKkz9ti7ZaGReEtmquXCs8hwgdgNU1MExvGekqM%2FpYjUWf6Y9VO5dZa%2FFafy%2BoYHO%2Fn%2Fuum%2FE%2BW9L11jFQpQ%2BD9Ij1pZr8XngOn947LJm%2BT3KcwOfOqQPu%2FMPbb8W6buKUwx%2BP3SW1zL4SZK9ywYrsnomDqdo7ju%2B4froTCfEt5FOI8TwkE3FU7N4gGkZsR%2FOf%2FObFgiuA5f9g0dfUp%2FjvQSWL3ukhuml6i1pJfOXLzuNrXG11avG8kvNTnc7qxOwju1KarEOuF9LM%2BfvTwEm6dexSblMcujz%2F37dO9Z3%2FqHiOSIx%2BAI6Xe0NCNkokgDXt%2FU3TD1yjjYQ4ORcpZueQ5GKmFv3%2BeNTMDMwnEHXZnnu3dVhSLlZaavSIBTv3ogKyntvpQ59LHakMcaiboLJJ5RyMJyZU63512RKy7vlHMiJDO1d%2FHEn1mWRwzaIDnX8%2F6kkPK8TeRxzDfqipIHGcLHd3XzPgrDmPcFkaAz4jzze5yaUnVvj5POllATe5woTHasRRIWgUKeoP9I76wIJdS5YkpUmb4Nz0T6yxngByoIS98Iv3z%2Fm8I%2FXJeAAfyOFn1iAn2Yq3iSkbEukfpO0fXQmPDC%2FMPKvn8qq6Tdxeb2x6vB7VwXXhA6UAvmdzDVAEyM7JBEOoDX4ocAPkNVXx1e7PfzZ7r02RXhxVp4WRJIJyR9x9OW2HRQnycaXPHVcCU6XOtK5XudqxYepHoJsgCm%2FtUgpTpIH6viiPQIlbPHcvGuVe3Q5aY6ZeBcDWFLh%2FBHVq10D8T%2BEHN1%2FNPoWmxRjSvsXQ1fGG52AOunpM%2FLGYcs27WJMRjCjhaLWiDtaF8WjIJEwXCgE7GoBIK9dLodVIesfWDZr%2BpxceDa5CFMckr6JD7HIvi3anqM1JOULI%2FHKcgLXMopOrFrenRO3blxag%2B%2FQmBfyCncCm9PRVC9uZGK8SD73fpmZ7M6HInSqYiqPz9Wh5vsL03w%2Bt4rA41FaqOM5kOqN0gRWsiQTbXMcPr6A1vovOfq9zcwZ%2FDc%2FTDbQmbmTLuXfXQ9QGZvsi1symQ71lS0O50fqwMJc5B3Katoqqxas5dVxzYmq%2F5UWL15xmpqJNOBtw0%2BoPpmksHXFKYSQ9nO7EXXvTSGGiY4Pfs6%2FjZ4Yg%2Bj8x4Mm3a4Z5cko2ChwYVWHAxkT0UTeHMPojzHUBDlo6lw6s%2BdU981xOnxexdjk%2Bqg2VedkGeKVTwZVmeXw4JfQrk0hmrrTCdHGo3V%2BWWxhsX6i0vEYCQylXyHQ%2Be2lgNycakGBiNRNJEisWPN3q5i35RdnY6s2nNfz4GJa2pBBxxqNFqXvBWmxupDx0zn6Ly6s1%2FTgalnaFEHHGk0Wr25r%2BrAFr5QC8OR7InU6B1%2FUcIWMaaEralIq4uWyt%2BAG5uYKv3BoUajGS%2FiazvGxNeZStbfnV%2FSCX7i5tIFcSB6mswqG5fOPj%2FhuIaWxh6%2FBTM6q9bs94W5Fy9eBV%2BQGUdW5enxt6yr7sef%2B24amx8KP3aqf0T8%2Fw%3D%3D) (y la imagen adjunta, diagrama_actividades_HU9.1_v2.png).`

### 1.3 Checklist «Especificación ERS · Segunda Entrega»

Cambiar el texto del último ítem (dejarlo marcado):

- Antes: `Diagrama de actividades adjunto como imagen o PDF (no enlace a la herramienta de diagramación)`
- Ahora: `Diagrama de actividades adjunto como imagen y con enlace de draw.io que abre sin pasos previos`

Es el mismo texto que ya tiene Aaron en la HU 4.1.

---

## 2. Tarjeta «Especificación de Requisitos No Funcionales» https://trello.com/c/d70el54Y

Reemplazar toda la descripción por el bloque de abajo. Vuelve a la lista numerada con la
subcaracterística en letra, como estaba antes del 02/nov, y conserva todo lo nuevo: el rango del
Brief, las cifras y los «Cómo se prueba».

**Orden y nombres.** Va en el orden y con los nombres de la lista del equipo (1. Facilidad de
Iteración, 2. Eficiencia de Desempeño, 3. Compatibilidad, 4. Fiabilidad, 5. Seguridad,
6. Mantenibilidad, 7. Flexibilidad, 8. Protección), como pidió la revisión del equipo y confirmó
Sebastian el 03/nov. La plantilla ERS v2.0 de nuestra copia ordena distinto (2.1 Eficiencia …
2.3 «Capacidad de interacción»); queda anotado por si la profesora lo marca.

```
**Requisitos No Funcionales · ERS §2 (Requisitos suplementarios)**

Los 4 RNF salen de los 4 rangos de calidad del Brief aprobado. Cada uno lleva su característica y subcaracterística ISO 25010, es medible y tiene su procedimiento de prueba.

1. **Facilidad de Iteración**
   a. **Auto-descriptividad:** El sistema debe permitir que al menos **9 de cada 10** usuarios de prueba que nunca han usado el Radar, sin recibir instrucciones, identifiquen en **10 segundos o menos** un estacionamiento donde hay puesto, solo con el semáforo de dos estados (verde: hay puesto; rojo: no hay puesto) y su leyenda.
   - Rango de calidad del Brief: «La información debe entenderse de un vistazo, utilizando los colores del semáforo y un lenguaje claro.»
   - Cómo se prueba:
     - Preparación: 10 estudiantes o profesores que no conocen el Radar. La maqueta muestra al menos un estacionamiento en verde y uno en rojo.
     - Prueba: se abre el mapa y se le pregunta a cada uno «¿dónde puedes estacionar ahora?». Se cronometra desde que ve el mapa hasta que señala un estacionamiento. Nadie le explica los colores.
     - Aceptación: al menos 9 de 10 señalan un estacionamiento en verde en 10 s o menos.
   - Redactado por: Manuel Rosales.

2. **Eficiencia de Desempeño**
   a. **Comportamiento Temporal:** El sistema debe mostrar el mapa del campus con todos los estacionamientos y su color en **3 segundos o menos**, medidos desde que el usuario abre el Radar hasta que se ven todos los estacionamientos con su color, con la red limitada a 9 Mbps de bajada, 1,5 Mbps de subida y 60 ms de latencia, en al menos 9 de cada 10 cargas; y debe reflejar un cambio de ocupación en **5 segundos o menos** después del aviso del sensor.
   - Rango de calidad del Brief: «El mapa debe cargarse y actualizarse en pocos segundos, para que el conductor decida antes de llegar al campus.»
   - Cómo se prueba:
     - Carga: en las herramientas del navegador, crear un perfil de red de 9 Mbps de bajada, 1,5 Mbps de subida y 60 ms de latencia, y abrir el Radar 10 veces. Se mide desde que se abre el Radar hasta que se ven todos los estacionamientos con su color. Al menos 9 de 10 cargas deben tardar 3 s o menos.
     - Actualización: enviar 10 avisos de entrada desde el simulador de sensores y cronometrar cada uno. Los 10 cambios deben verse en 5 s o menos.
   - Redactado por: German Alfonzo.

3. **Compatibilidad**
   No aplica: el Brief no fija un rango de calidad para esta característica.

4. **Fiabilidad**
   a. **Tolerancia a Fallos:** El sistema debe **ocultar solo la ocupación del estacionamiento** que no reciba avisos de su sensor durante **10 minutos** (deja de mostrar su color y lo marca «sin datos») y seguir actualizando los demás en **5 segundos o menos**, en el **100 %** de las pruebas.
   - Rango de calidad del Brief: «Si un sensor falla, el sistema debe ocultar solo ese estacionamiento y seguir funcionando con los demás.»
   - Cómo se prueba:
     - Preparación: con el simulador de sensores activo, detener solo los avisos de un estacionamiento durante 10 minutos.
     - Fallo aislado: al pasar los 10 minutos, ese estacionamiento ya no muestra su color (hay o no hay puesto) y aparece como «sin datos».
     - Los demás siguen: enviar una entrada a otro estacionamiento y comprobar que su ocupación cambia en 5 s o menos.
     - Se repite con 5 estacionamientos distintos y debe cumplirse en las 5 pruebas (100 %).
   - Redactado por: Aaron Zarraga.

5. **Seguridad**
   a. **Confidencialidad:** El sistema debe mostrar las placas y los vehículos registrados solo a su dueño y al personal con rol de vigilancia o administración: en el **100 %** de los intentos de un usuario sin ese rol de consultar los vehículos de otra persona, el sistema no muestra ninguna placa ajena y responde «acceso denegado».
   - Rango de calidad del Brief: «El sistema debe ser seguro con los datos: cada usuario solo accede a lo permitido para su rol, y las placas y los vehículos solo los ve su dueño y el personal autorizado.»
   - Cómo se prueba:
     - Preparación: crear dos cuentas de estudiante (A y B) y una con rol de vigilancia o administración. Con la cuenta B, registrar un vehículo.
     - Acceso ajeno: con la cuenta A, intentar ver los vehículos de B (desde la pantalla de vehículos y buscando directamente la placa de B). El sistema debe responder «acceso denegado» y no mostrar ninguna placa de B.
     - Acceso permitido: con la cuenta B (dueño) y con la cuenta de vigilancia o administración, consultar el mismo vehículo. Ahí sí debe mostrarse la placa.
     - Se repite con 10 placas distintas y debe cumplirse en los 10 intentos (100 %).
   - Redactado por: Samuel Goncalves.

6. **Mantenibilidad**
   No aplica: el Brief no fija un rango de calidad para esta característica.

7. **Flexibilidad**
   No aplica: el Brief no fija un rango de calidad para esta característica.

8. **Protección**
   No aplica: el Brief no fija un rango de calidad para esta característica.

Revisión final: Sebastian Moreno (03/11/2026).
```

Lo que cambia respecto de la tarjeta de hoy: solo la forma (lista 1–8 con la subcaracterística en
letra y «El sistema debe…» justo después). Los cuatro textos, las cifras y las pruebas son los mismos
que dejaron German, Manuel, Aaron (su arreglo de las 10:36 a. m. ya empieza con «El sistema debe») y
Samuel.
