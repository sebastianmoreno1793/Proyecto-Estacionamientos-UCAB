# Unidad 5 · Gestión de Requisitos III

> Texto extraído de las láminas Genially de la profesora (Módulo 7). Fuente: https://view.genially.com/67ae2d7135050462fa2692f0 · extraído el 27/oct/26. Solo texto: los diagramas e imágenes de las láminas no están aquí

## Lámina 1 · Portada

GESTION DE REQUISITOS III  
Prof. Maria Angélica Perez de Ovalles  
mperezpu@ucab.edu.v  

## Lámina 2 · PORTADA

Pregunto (1,2,3)  

## Lámina 3 · Versus

Los dos mundos  
Ágil: Historias de Usuario  
Clasico: Casos de Uso refinados  

## Lámina 4 · Versus Copia

Los dos mundos  
La actividad de especificar los Casos de Uso, se hace en paralelo a medida que se van refinando los casos de uso.  
Intuitivamente sabemos cuales son los pasos de por ejemplo Modificar los datos de un Producto.  
Ya sabemos que para modificarlo debemos previamente buscar esos datos, a lo mejor previamente seleccionado de una lista. Eso hay que hablarlo con el usuario y el equipo de desarrollo  
Clasico: Casos de Uso refinados  
+info  

## Lámina 5 · Texto

ESPECIFICACIÓN DE CASOS DE USO REFINADOS  
Especificar un caso de Uso, es decir de manera precisa cual es el “diálogo” entre el Actor y el Sistema, que el usuario quiere.  
Recuerden que un caso de uso , es un conjunto de pasos que llevan a un valor observable para el usuario.  
Entonces especificar es precisar cuáles son estos pasos y llevarlos a un diálogo.  
Se comienza, conversando con el usuario/cliente y el equipo de desarrollo, precisando colaborativamente este dialogo.  
El diálogo debe decir QUE quiere el usuario que pase, no dice cómo el sistema lo logra.  
Esto seria diseño y nosotros en este momento no estamos diseñando.  
+info  

## Lámina 6 · Texto Copia

ESPECIFICACIÓN DE CASOS DE USO REFINADOS  
UML exige que los Casos de Uso se especifiquen.  
Mas no dice cómo.  
Sólo señala que debe ser un conjunto de pasos escritos. Por ello yo les propongo una plantilla, para escribir este diálogo, el Básico y los Alternos  
Lo importante es especificar éste diálogo.  
+info  

## Lámina 7 · PORTADA Copia

Pregunto (4,5,6,7,8)  

## Lámina 8 · SECCIÓN

Cuando ES UN MENU  
Cuando tiene extendidos  
Tipos de Especificación Textual  
Cuando ES UN extendido  
Cuando tiene INCLUIDOS  
Cuando ES UN INCLUIDO  

## Lámina 9 · FRASE DESTACADA

'Vamos a ver si entendimos'  

## Lámina 10 · SECCIÓN

02.  
Especifiquemos  
textualmente un caso de uso  
01.  
Vamos a conformar nuestros equipo  
Secciones como esta te ayudarán a poner orden  

## Lámina 11 · FRASE DESTACADA

- Cita siempre al autor/a

## Lámina 12 · PORTADA Copia Copia

Pregunto (9)  

## Lámina 13 · Comp 05

Diagrama de Actividades  
Los Diagramas de Actividades son un tipo de diagramas de Interacción en UML y destacan el flujo de control entre actividades  
Se centran en el conjunto de actividades que tienen lugar entre los objetos.  
Su semántica se basa en Redes Petri.  
Un diagrama de actividades puede estar enlazado a cualquier elemento para modelar su comportamiento.  
+info  

## Lámina 14 · Comp 05 Copia

Diagrama de Actividades  
Las actividades son redes de nodos con arcos  
Hay tres tipos de nodos:  
Nodos Acción: representan una unidad de trabajo atómica dentro de la actividad.  
Nodos Control: controlan flujo a través de la actividad  
Nodos Objeto: representan objetos usados en la actividad.  
Hay dos tipos de arcos:  
Arcos de Control: representan flujo de control a través de una actividad.  
Arcos de Objeto: representan flujo de objetos a través de una actividad  

## Lámina 15 · Imagen

NODO DE CONTROL: INICIO. Es uno solo  
NODO DE CONTROL: DECISION, propone varios caminos alternativos, atentos con la notacion  
NODO DE CONTROL: UNION, sincroniza  
NODO DE CONTROL: FIN, pueden ser varios  
ARCO DE CONTROL  
ARCO OBJETO, enlaza el nodo accion con el nodo objeto  
NODO ACCION: ejecucion atómica. Se utiliza un verbo  
NODO OBJETO, como su nombre lo indicar, representa un objeto que se usa en el nodo accion  
Diagrama de Actividades  
Se pueden usar Notas, para aclarar  

## Lámina 16 · PORTADA Copia Copia

Pregunto (10)  

## Lámina 17 · Gracias

CIERRE  
UML exige que además de refinar el Diagrama de Casos de Uso, para propiciar reutilización y modularidad, se especifique cada Caso de Uso.  
Esta especificación es textual, UML no dice como hacerlo.  
Aquí estudiamos una plantilla producto de muchos años de experiencia y además nos apoyamos en el Diagrama de Actividades , versión 2.0 de UML  
Se destacó la importancia de cada una de las secciones de la Plantilla propuesta para este especificación  

## Ventana emergente 18 · Copia Copia Copia Copia

POSTCONDICIONES:  
Se garantizan como verdaderas cuando el Caso de Uso termina.  
Opcional: Utilizar solamente si es necesario para clarificación.  

## Ventana emergente 19 · 

1. Inserto la Tarjeta
2. Ingreso mi clave
3. Muestra el menu
4. Selecciono retirar
5. Muestra los posibles montos
6. Selecciono un monto
7. Muestra las posibles cuentas a debitar
8. Selecciono la cuenta
9. Entrega el dinero
10. Entrega el recibo
11. Informa que la transaccion ha sido exitosa
12. Retiro la tarjeta
Este “camino” o dialogo se le conoce como Flujo Básico o tambien como camino feliz  

## Ventana emergente 20 · Copia Copia Copia

Flujo básico: Selecciona “Inscribir materias”.  
1. Busca  las materias que puede inscribir y las muestra
2. Selecciona materias.
3. Presiona OK
4. Busca  posibilidades de horario y las muestra
5. Selecciona horarios.
6. Presiona OK
7. Muestra resumen de  inscripción y solicita confirmación
8. Confirma
9. Registra Inscripcion
10. Muestra mensaje de exito
Flujos alternos:  
A1.1. Información no disponible  
A5.1. No puede inscribirse  
A7.1. Salir.  

## Ventana emergente 21 · Copia

Por lo que, en el proceso de refinación ya proponemos un Caso de Uso de Modificación de datos de Producto que tiene incluido un caso de uso Busqueda de datos de Producto  

## Ventana emergente 22 · Copia Copia Copia

PRECONDICIONES:  
Es una restricción del estado del sistema que se debe cumplir antes de la ejecución del Caso de Uso.  
Restringen sobre cuándo puede iniciarse el Caso de Uso, no el evento que inicia el Caso de Uso.  
Opcional: Utilizar solamente si es necesario para clarificación.  

## Ventana emergente 23 · Copia

Puede suceder:  
Que marque mal la clave (mas de una vez).  
Que no tenga dinero (el cajero).  
Que no tenga dinero (yo).  
Que no haya papel  
Estos son otros caminos, “flujos” y se les conoce como Alternos  

## Ventana emergente 24 · 

Cuando hacemos Gestión de Requerimientos  
Para entender algún flujo de un caso de uso/ de una historia  
Cuando hacemos Diseño  
Para detallar una operación  
Para representar los procesos en un nodo de procesamiento  
Cuando queremos entender el Negocio  
Para modelar un proceso de Negocio  

## Ventana emergente 25 · Copia Copia

Es decir, la especificación es precisar el Flujo Básico y los posibles Flujos Alternos  
