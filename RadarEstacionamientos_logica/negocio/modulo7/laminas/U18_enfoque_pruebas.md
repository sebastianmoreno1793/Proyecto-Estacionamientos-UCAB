# Unidad 18 · Enfoque de Pruebas

> Texto extraído de las láminas Genially de la profesora (Módulo 7). Fuente: https://view.genially.com/656785b099f19e0014627651 · extraído el 27/oct/26. Solo texto: los diagramas e imágenes de las láminas no están aquí

## Lámina 1 · PORTADA

ENFOQUE DE PRUEBAS  
Prof. Maria Angélica Pérez de Ovalles  
mperezpu@ucab.edu.ve  
¡VAMOS!  

## Lámina 2 · FRASE II

OBJETIVO  
PROPONER UN ENFOQUE DE PRUEBA  

## Lámina 3 · ÍNDICE

ÍNDICE  
ENFOQUE  
DIMENSIONES  

## Lámina 4 · TEXTO III

ENFOQUE DE PRUEBAS  
Reflexión  
Ya teniendo claros los conceptos tratados en la sesion anterior.  
Y que necesitamos un Plan de Prueba.  
Junto a ello se debe proponer un Enfoque de Prueba.  
Para entender mejor que es un Enfoque debemos precisar mas aun otro conjunto de conceptos que estan muy confusos en la literatura  
+ INFO  

## Lámina 5 · TEXTO III Copia

ENFOQUE DE PRUEBAS  
Qué es?  
Provee una visión  de la estrategia recomendada para el análisis, diseño, implementación y ejecución de las pruebas.  Describe cómo las pruebas deben ser realizadas: tipos de pruebas, niveles de pruebas, técnicas de pruebas, posibles herramientas, etc.  
+ INFO  

## Lámina 6 · FRASE

- Nivel de la Prueba
- Tipo de Prueba
- Caracteristica de Calidad que mide (inspirados en el ISO25010)
- Verifica o Valida
- Manual o Automática
- Estática o Dinámica
- Alfa o Beta
Dimensión  
+ INFO  

## Lámina 7 · IMAGEN IV

DIMENSIONES  

## Lámina 8 · IMAGEN II

DIMENSIONES  
Calidad del Producto  
- Cada prueba al aplicarse debe estar identificando defectos relacionados con alguna de las características de calidad.
- Si estoy haciendo una prueba de carga, puedo estar midiendo sus eficiencia

## Lámina 9 · IMAGEN II Copia

DIMENSIONES  
Niveles de Prueba  

## Lámina 10 · IMAGEN II Copia Copia Copia

DIMENSIONES  
Niveles de Prueba en DevOps  

## Lámina 11 · FRASE Copia

Dimensión  
A su vez existen  
múltiples “tipos” de pruebas  

## Lámina 12 · TEXTO II

Dimensión  
Tipos de Pruebas  
Prueba patrón (Benchmark test): determina el funcionamiento de un blanco-de-prueba contra un estándar del software o medidas existentes.  
Prueba de la configuración: determina cómo el blanco-de-prueba funciona en diversas configuraciones (hardware o software) durante la prueba.  
Prueba funcional: determina cómo las funciones del blanco-de-prueba ejecutan el caso de uso requerido según lo previsto (funcionalidad).  

## Lámina 13 · TEXTO II Copia

Dimensión  
Tipos de Pruebas  
Prueba de la instalación: determina cómo el blanco-de-prueba se instala en diversas configuraciones o bajo diversas condiciones, tales como espacio de disco restringido, velocidad del procesador, espacio de memoria, Sistema Operativo, etc.  
Prueba de la integridad: determina la confiabilidad, la robustez, y la resistencia de los blancos-de-pruebas a través de las fallas durante la ejecución  

## Lámina 14 · TEXTO II Copia Copia

Dimensión  
Tipos de Pruebas  
Prueba de la carga (Load Test): determina la aceptabilidad del funcionamiento de blanco-de prueba bajo varias condiciones operacionales, tales como número de usuarios, número de transacciones, y así  sucesivamente, mientras que la configuración sigue siendo constante.  
Prueba de Desempeño (Performance): determina la aceptabilidad del funcionamiento de los blanco-de-pruebas usando varias configuraciones mientras que las condiciones operacionales siguen siendo constantes  (mide eficiencia).  

## Lámina 15 · TEXTO II Copia Copia Copia

Dimensión  
Tipos de Pruebas  
Prueba de tensión (Stress): determina el funcionamiento de las blanco-de-pruebas utilizando condiciones anormales o extremas; por ejemplo: recursos disminuidos o un número extremadamente alto de usuarios.  
Prueba de la Regresión: es una estrategia donde pruebas previamente ejecutadas son nuevamente puestas en marcha  a través de una nueva versión como blanco de prueba para asegurarse de que no ha sido perjudicada la calidad cuando se han agregado nuevas capacidades  

## Lámina 16 · TEXTO II Copia Copia Copia Copia

Dimensión  
Tipos de Pruebas  
- Prueba API: determina el funcionamiento de las blanco-de-pruebas (las API) enviandole peticiones para asegurarse de que funcionan de la forma en que se espera. Las pruebas de API se concentran en la funcionalidad de una aplicación. Se les aplica en algunos casos la Técnica del Fuzzing (implican enviar información incorrecta a una API para comprobar si las aplicaciones fallan o hay algún otro problema. El fuzzing encuentra problemas y errores ocultos

## Lámina 17 · TEXTO II Copia Copia Copia Copia

Dimensión  
Tipos de Pruebas  
- Prueba End-to-End (E2E): determina el funcionamiento del blanco-de-pruebas en todo el flujo, desde el inicio hasta el final, simulando el comportamiento del usuarioen un escanadio real. Tiene na perspectiva global.
- Prueba de Penetración (Pentesting): determina el funcionamiento del blanco-de-pruebas simulando un ataque a un sistema para identificar vulnerabilidades. Pueden detectar brechas de seguridad en aplicaciones web, accesos no autorizados a bases de datos, y exposición de información sensible.

## Lámina 18 · TEXTO II Copia Copia Copia Copia Copia

Dimensión  
Tipos de Pruebas  
- Prueba de Inyección SQL: determina el funcionamiento del blanco-de-pruebas simulando un ataque que se basa en colocar sentencias SQL maliciosas a través de la entrada web. Tales como: eludir la autenticación, robar la identidad de un usuario, incluido un ejecutivo de nivel C, recuperar, añadir, modificar o destruir completamente los registros de la base de datos, convertirse en administrador, etc.

## Lámina 19 · FRASE II

DIMENSION  
TODOS ESTO SE PUEDE USAR PARA VALIDAR O VERIFICAR ESTO NOS LLEVA A UN MULTICUBO  

## Lámina 20 · TEXTO

DIMENSIONES D E LA PRUEBA  
Nivel  
Tipo  
Calidad  
+ INFO  

## Lámina 21 · FRASE II Copia

DIMENSIÓN  
Y para complicarlo un poco mas!  
Si  para hacer la prueba necesito ejecutar el código es Dinámica,  
si en cambio la hago sobre un diagrama es Estática  
Si  la hace el Probador/Desarrollador es Manual,  
si la hace un software es Automática  
Si el código no es estable es Alfa,  
si es estable es Beta  

## Lámina 22 · FRASE II Copia Copia

DIMENSIÓN  

## Lámina 23 · SECCIÓN

A LA VELOCIDAD DE LA LUZ  
Indique las dimensiones de Este Enfoque  

## Lámina 24 · TEXTO

Cierre  
El Plan de Prueba que describe la estrategia de Prueba tiene que incluir el Enfoque de Prueba.  
El Enfoque de Prueba precisa cómo vamos a probar, para ello debe identificar cuáles pruebas se harán precisando todas sus dimensiones.  
