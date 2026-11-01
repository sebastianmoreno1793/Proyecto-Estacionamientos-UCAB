# Unidad 15 · Reutilización Arquitectónica II

> Texto extraído de las láminas Genially de la profesora (Módulo 7). Fuente: https://view.genially.com/67daeba91ebe3b1910e38c82 · extraído el 27/oct/26. Solo texto: los diagramas e imágenes de las láminas no están aquí

## Lámina 1 · PORTADA

ReutilizaciÓN  
ArQUitectÓNICA II  
Prof. Maria Angelica Perez de Ovallesmperezpu@ucab.edu.ve  

## Lámina 2 · SECCIÓN

seguimosreutilizando  

## Lámina 3 · SECCIÓN

SERVICIOS  

## Lámina 4 · TEXTO/IMAGEN I

EsTILO ARQUITECTÓNICO BASADO EN SERVICIOS  
Aunque la arquitectura basada en servicios es una arquitectura distribuida, no tiene el mismo nivel de complejidad y costo que otras arquitecturas distribuidas.  
Se accede a los servicios de forma remota desde una interfaz de usuario mediante un protocolo de acceso remoto.  
info  

## Lámina 5 · TEXTO/IMAGEN I Copia

EsTILO ARQUITECTÓNICO BASADO EN SERVICIOS  
Los servicios son típicamente "partes de una aplicación" (generalmente llamadas servicios de dominio) que son independientes .  
En la mayoría de los casos, existe una única instancia de cada servicio de dominio  
info  

## Lámina 6 · SECCIÓN

Pregunto (1)  
menti.com  

## Lámina 7 · VERSUS

ESTILO ARQUITECTÓNICO BASADO EN EVENTOS  
El estilo de arquitectura orientado por eventos es un estilo de arquitectura asincrónica distribuida para aplicaciones altamente escalables y de alto rendimiento. Se puede utilizar tanto para aplicaciones pequeñas como grandes y complejas.  
info  

## Lámina 8 · VERSUS Copia Copia

ESTILO ARQUITECTÓNICO BASADO EN EVENTOS  
Este estilo ofrece una característica única en el sentido de que se basa únicamente en la comunicación asincrónica tanto para el procesamiento de disparar y olvidar (no se requiere respuesta) como para el procesamiento del evento/ respuesta (respuesta requerida del consumidor del evento)  
info  

## Lámina 9 · SECCIÓN Copia

Pregunto(2)  
menti.com  

## Lámina 10 · SECCIÓN Copia Copia

MICROSERVICIOS  

## Lámina 11 · LISTA I

Los microservicios es un estilo de arquitectura muy popular que ha ganado un impulso significativo en los últimos años  
Así, cada microservicio incluye todo lo necesario para operar dentro de la aplicación, incluyendo clases, otros subcomponentes y esquemas de base de datos.  
Su diseño esimpulsado por dominios (DDD), un proceso de diseño lógico para proyectos de software.  
En el contexto limitado: cada servicio modela un dominio (subdominio) o flujo de trabajo. Por eso es que es microservicio  

## Lámina 12 · LISTA I Copia Copia

Debido a su propósito único, el tamaño del servicio en los microservicios es mucho más pequeño que en otras arquitecturas distribuidas  
Para su diseño hay que tomar en cuenta: - Granularidad  
- Capa API
- Comunicación entre Microservicios
- Coreografía

## Lámina 13 · SECCIÓN Copia Copia

Pregunto(3)  
menti.com  

## Lámina 14 · TEXTO/IMAGEN I

Según Cloud Native Computing Foundation NUBE(NCF) las aplicaciones cloud-native  son de código abierto en contenedores, orquestadas dinámicamente y orientadas a microservicios  
aplicaciones Cloud-Native  
La implementacion de una aplicación de software en la nube no la convierte en cloud-native  
se trata de cómo se diseña e  implementa, no sólo de donde se ejecuta.  
info  

## Lámina 15 · TEXTO/IMAGEN I Copia Copia

aplicaciones Cloud-Native  
Las  aplicaciones de software  cloud-native, por ser complejas tienen alta posibilidad de fallar.  
Por lo que deben ser diseñadas para ser tolerantes a errores y por ende detectar la falla y recuperarse rápidamente a fin de disminuir el tiempo de inactividad.  
info  

## Lámina 16 · SECCIÓN

PATRÓN ARQUITECTÓNICO  

## Lámina 17 · TEXTO/IMAGEN I

PATRÓN ARQUITECTÓNICO  
Buschmann et al. (1996) define patrón como una regla que consta de tres partes, la cual expresa una relación entre un contexto, un problema y una solución  
Estas son: Contexto. Es una situación de diseño en la que aparece un problema de diseño.  
Problema. Es un conjunto de fuerzas que aparecen repetidamente en el contexto.  
Solución. Es una configuración que equilibra estas fuerzas.  

## Lámina 18 · SECCIÓN Copia

Pregunto (4)  
menti.com  

## Lámina 19 · VÍDEO I

PATRONES ARQUITECTONICOS  
PROPUESTOS POR BUSCHMANN  

## Lámina 20 · SECCIÓN Copia Copia

PERO HAY OTROS NIVELES DE REUTILIZACIÓN  

## Lámina 21 · SECCIÓN Copia

FRAMEWORK  

## Lámina 22 · VERSUS

FRAMEWORK  
Un framework es más que una jerarquía de clases. Es una jerarquía de clases más un modelo de interacción entre los objetos instanciados a partir del framework.  
Un framework es un diseño reutilizable de todo o partes del sistema que esta representado por un conjunto de clases abstractas  y la forma como sus instancias interactúan.  
info  

## Lámina 23 · SECCIÓN Copia Copia

PATRÓN DE DISEÑO  

## Lámina 24 · VERSUS Copia

PATRÓN DE DISEÑO  
Estos pattern fueron descubiertos al examinar varios framework y  fueron seleccionados como representativos de software reusable.  
Un pattern describe un problema a ser resuelto, una solución y el contexto en el cual la solución trabaja.  
info  

## Lámina 25 · DATOS III

Y aun hay unas mas pequeñas!!!  
Las Tácticas Arquitectónicas  
Ustedes investigarán sobre ellas  

## Lámina 26 · SECCIÓN II

en resumen  

## Lámina 27 · SECCIÓN II

Se describieron las características de los Estilos Arquitectónicos basados en: - Servicios  
- Eventos
- Microservicios
- Aplicaciones Cloud-Native

## Lámina 28 · SECCIÓN II Copia

Se describieron las características de los de otras formas de reutilización- Patrones de Arquitectónicos  
- Framework
- Patrones de Diseño

## Ventana emergente 29 · Copia Copia Copia

Tambien se espera que sean portables con una amplia variedad de dispositivos, no sólo los clásicos (PC, laptos, tablets y móviles) sino tambien de IoT.  
Con una alta facilidad de poder cambiar de dispositivos  

## Ventana emergente 30 · 

¿Tienes una idea?  
¡Que fluya la comunicación!  
Con las plantillas de Genially podrás incluir recursos visuales para dejar a tu audiencia con la boca abierta. También destacar alguna frase o dato concreto que se quede grabado a fuego en la memoria de tu público e incluso embeber contenido externo que sorprenda: vídeos, fotos, audios... ¡Lo que tú quieras!  
¿Necesitas más motivos para crear contenidos dinámicos? Bien: el 90% de la información que asimilamos nos llega a través de la vista y, además, retenemos un 42% más de información cuando el contenido se mueve.  
- Genera experiencias con tu contenido.
- Tiene efecto WOW. Muy WOW.
- Logra que tu público recuerde el mensaje.
- Activa y sorprende a tu audiencia.

## Ventana emergente 31 · Copia Copia

Tambien se espera que tengan ciclos cortos de lanzamiento (despliegue).Deben desplegar (publicar) sus actualizaciones en rápidamente.  
Esto se le conoce como: Entrega continua (Continous Delibery(CD)). Esto es una característica de su proceso de desarrollo.  
Lo cual es factible si y solo si esta estructurada en microservicios  

## Ventana emergente 32 · 

Los servicios son típicamente "partes de una aplicación" (generalmente llamadas servicios de dominio) que son independientes .  

## Ventana emergente 33 · Copia

Otro enfoque de diseño es dividir el dominio de cada servicio de dominio utilizando subdominios como es el monolítico  
