# Unidad 14 · Reutilización Arquitectónica I

> Texto extraído de las láminas Genially de la profesora (Módulo 7). Fuente: https://view.genially.com/67d310f1b958bf8e929c6f62 · extraído el 27/oct/26. Solo texto: los diagramas e imágenes de las láminas no están aquí

## Lámina 1 · PORTADA

Maria Angélica Perez de Ovalles  
Reutilización Arquitectónica I  
mperezpu@ucab.edu.ve  

## Lámina 2 · RESUMEN

PREGUNTO (1,2,3)  
MENTI.COM  

## Lámina 3 · DATOS RELEVANTES Copia

No se puede tener todo en una propuesta de arquitectura  
Hay que decidir cuáles caracteristicas arquitectónicas son las más importantes  
Todo implica hacer un balance(TRADE OFF).  
TRADE OFF  

## Lámina 4 · DATOS RELEVANTES

No se puede tener todo en una propuesta de arquitectura  
Esto es más importante que esto.  
Asi que decidimos.....  
+ info  
DECISIÓN ARQUITECTÓNICA  

## Lámina 5 · AUDIO

COMPONENTES LÓGICOS  
Son los bloques funcionales mas pequeños de nuestra arquitectura  
Se organizan en un Directorio  
El nombre del Componente debe ser descriptivo y único...  
Para su creación: lo nominamos, le asignamos el requisito, analizamos su responsabilidad.  

## Lámina 6 · TEXTO+IMAGEN

A la organización de los componente debemos agregarle la solución a las Características Arquitectónicas con base a las Decisiones Arquitectónicas que se vayan tomando  
Como se hace esto????  
Reutilizando!  

## Lámina 7 · SECCIÓN

Estilo Arquitectónico  

## Lámina 8 · TEXTO+IMAGEN 2

En estas últimas cinco décadas, se ven familias de software, que se pueden agrupar en un estilo…  
Por ejemplo, las aplicaciones cliente servidor, se caracterizan por que tiene dos capas…  
Hay muchas aplicaciones desarrolladas en base a capas…  

## Lámina 9 · TEXTO+IMAGEN 2 Copia Copia

Cada estilo tiene sus pro y sus contras  
Estilo Arquitectónico  
- Define una familia de sistemas de software en términos de su organización estructural.
- Determina un vocabulario de los componentes y conectores que se usan para instanciar esa estructura junto con sus restricciones de cómo ellos puedes combinarse
Vamos a revisar los más conocidos  

## Lámina 10 · TEXTO+IMAGEN 2

Tuberias y Filtros  
Las tuberías son el canal de comunicación entre los filtros  
Uno de los estilos fundamentales en la arquitectura de software que aparece una y otra vez es la arquitectura de tuberías (también conocida como arquitectura de tuberías y filtros).  
Tan pronto como los desarrolladores y arquitectos decidieron dividir la funcionalidad en partes discretas, se siguió este estilo.  
Se conoce como el principio subyacente detrás de los lenguajes de Shell, tales como  Unix  
Los filtros son autónomos  

## Lámina 11 · RESUMEN Copia Copia Copia

PREGUNTO (4,5)  
MENTI.COM  

## Lámina 12 · TEXTO+IMAGEN 2 Copia

Capas  
Las capas son AISLADAS,  
INDEPENDIENTES  
Es uno de los más conocidos y usados.  
Entre otras cosas por su simplicidad y por su similitud con el mundo de los negocios  
Es un estilo sencillo, ampliamente conocido  
Para presupuestos limitados  

## Lámina 13 · RESUMEN Copia Copia Copia Copia

PREGUNTO (6,7)  
MENTI.COM  

## Lámina 14 · TEXTO+IMAGEN

Microkernel  
Sl estilo de arquitectura de microkernel (también conocido como arquitectura de PLUG-IN)  
Este estilo de es un ajuste natural para las aplicaciones basadas en productos (empaquetados y disponibles para su descarga e instalación como una implementación monolítica única, generalmente instalada en el sitio del cliente como un producto de terceros)  
Los plug-in son componentes independientes que contienen procesamiento especifico, funciones adicionales y código propio destinado a mejorar o ampliar el core.  
+ info  

## Lámina 15 · RESUMEN Copia Copia Copia Copia Copia

PREGUNTO (8)  
MENTI.COM  

## Lámina 16 · TEXTO + ICONOS II

Cierre  
Deciciones Arquitectónicas  
Componente Lógico  
Todo en arquitectura de software es un TRADE OFF.  
Asi que se decide y se registra esa decisión  
Son pequeños bloques funcionales  
Estilo Arquitectónico  
Tuberías y Filtros  
Es el nivel más alto de REUTILIZACIÓN.  
Conducen a familias de sofwtare  
Dos componentes: tuberías y Filtros.  
Unidireccionales  

## Lámina 17 · TEXTO + ICONOS II Copia

Cierre  
Capas  
MicroKernel  
Sus componentes son capas aisladas  
Dos componentes: CORE y Plug-ins  
