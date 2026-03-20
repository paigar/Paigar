---
title: "La web sostenible: cada kilobyte tiene un coste"
description: "Reflexión sobre el consumo de recursos de la web y la responsabilidad medioambiental de los desarrolladores. La mayoría de webs no necesitan lo que tienen."
date: 2026-02-02
tags:
  - sostenibilidad
  - opinión
  - rendimiento
destacado: true
---

Internet consume aproximadamente el 4% de la electricidad mundial. Para ponerlo en contexto: si la web fuera un país, sería el cuarto mayor consumidor de energía del planeta, por detrás de China, Estados Unidos y la India. Y esa cifra crece cada año.

No solemos pensar en el coste medioambiental de una página web. Pero cada petición HTTP, cada imagen sin optimizar, cada framework JavaScript de 200KB, cada base de datos que responde a una consulta para servir una página que podría haber sido estática — todo eso consume electricidad en servidores, en la red de transmisión y en el dispositivo del usuario.

## El problema no es internet. Es lo que hacemos con él

Una página de Wikipedia consume una fracción de lo que consume la home de un periódico digital medio. La diferencia no está en el contenido — ambos muestran texto e imágenes. La diferencia está en las decisiones técnicas:

- El periódico carga 40-60 scripts de tracking, publicidad y analytics
- Cada visita dispara docenas de peticiones a terceros
- Las imágenes se sirven sin optimizar y sin lazy loading
- El CSS viene de un framework que incluye miles de clases que no se usan
- La página pesa 5-10MB cuando el contenido real son 50KB de texto

Y luego está WordPress. La mayoría de sitios WordPress son blogs o webs corporativas que muestran texto, algunas imágenes y un formulario de contacto. ¿Qué necesitan técnicamente? Un servidor que sirva HTML. ¿Qué tienen? Un servidor con PHP, una base de datos MySQL, 30 plugins cargados en cada petición, un tema con 15 archivos CSS y 20 de JavaScript, un CDN, un plugin de caché para mitigar el rendimiento deficiente de todo lo anterior, y actualizaciones constantes que consumen recursos de CI/CD.

Todo eso para mostrar texto.

## Cuánto pesa realmente tu web

La web media en 2025 pesa más de 2.5MB. La mediana de transferencia de una sola visita supera lo que pesaba la web entera en los primeros años de internet. Hemos normalizado la obesidad digital.

Para muchos sitios, la pregunta honesta no es "¿cómo optimizo mi web?" sino "¿por qué pesa tanto para empezar?". Si eliminas lo que no necesitas antes de optimizar lo que queda, el resultado suele ser una web que ni siquiera necesita optimización.

Este sitio completo — HTML, CSS, JavaScript, fuentes — pesa menos que una sola imagen hero de la mayoría de webs. No porque haya aplicado técnicas de optimización complicadas, sino porque no he añadido lo que no necesito.

## Lo que podemos hacer

No hace falta ser un activista medioambiental para tomar decisiones responsables. Son las mismas decisiones que hacen que una web sea rápida, accesible y mantenible:

**Elige HTML estático cuando puedas**. Si tu contenido no cambia con cada visita, no necesitas un servidor dinámico. Un generador estático produce HTML que un CDN sirve sin consumir CPU en cada petición.

**No cargues lo que no uses**. Cada plugin de WordPress, cada componente de framework, cada fuente tipográfica extra es un recurso que el servidor tiene que procesar, la red tiene que transmitir y el navegador tiene que parsear. Si no aporta valor al usuario, elimínalo.

**Optimiza las imágenes**. Es el cambio con mayor impacto. WebP y AVIF comprimen mejor que JPEG. Las dimensiones correctas evitan descargar píxeles que el navegador va a descartar. El lazy loading evita cargar lo que el usuario quizás nunca vea.

**Cuestiona cada dependencia**. ¿Necesitas un framework CSS de 300KB para dar estilo a tu blog? ¿Necesitas React para mostrar una lista de artículos? ¿Necesitas un servicio de analytics que inyecta 100KB de JavaScript en cada página?

**Piensa en los dispositivos de tus usuarios**. No todos navegan con un MacBook Pro y fibra óptica. Un porcentaje significativo de tu audiencia está en un móvil de gama media con datos limitados. Cada megabyte que les envías tiene un coste real para ellos — en datos, en batería, en tiempo de espera.

## No es solo técnica, es ética

Ser un buen desarrollador web en 2026 incluye ser consciente del impacto de tu trabajo. No necesitas obsesionarte con cada byte, pero sí preguntarte si lo que estás construyendo realmente necesita lo que le estás poniendo dentro.

La web más sostenible no es la que compensa su huella de carbono comprando créditos. Es la que no genera esa huella en primer lugar.
