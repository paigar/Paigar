---
title: "Construir para durar: webs que sobrevivan diez años"
description: "En un oficio obsesionado con lo nuevo, una reflexión sobre el valor de construir cosas que perduren. Qué decisiones técnicas hacen que una web sobreviva al paso del tiempo."
date: 2026-01-15
tags:
  - opinión
  - oficio
  - técnicas
destacado: false
---

La web de Space Jam — la película de 1996 — sigue online. Treinta años después, su HTML funciona perfectamente en cualquier navegador moderno. Es fea por los estándares actuales, pero funciona. Cada enlace, cada imagen, cada tabla de layout hace exactamente lo que hacía en 1996.

Ahora piensa en cualquier web construida con AngularJS en 2014. ¿Cuántas de esas siguen funcionando sin modificaciones? Prácticamente ninguna. El framework se depreció, las dependencias dejaron de actualizarse, los builds dejaron de funcionar. Webs que tenían cuatro años de antigüedad ya eran inmantenibles.

Hay algo profundamente equivocado en un oficio donde la tecnología de hace una década es basura y la de hace treinta años sigue funcionando.

## La paradoja de la modernidad

En desarrollo web, "moderno" suele significar "construido con las herramientas que son populares ahora mismo". Pero lo moderno tiene una vida útil sorprendentemente corta:

- El stack que era moderno en 2015 (Angular, Grunt, Bower) es arqueología hoy
- El que era moderno en 2018 (React con Create React App, Webpack 4) ya necesita migración
- El que era moderno en 2021 (Next.js, Tailwind, Vercel) ya tiene versiones mayores incompatibles

Mientras tanto, una web estática con HTML y CSS que escribí en 2015 sigue funcionando exactamente igual. No he tenido que migrar nada, actualizar nada, ni reescribir nada. Abrí el HTML en un navegador de 2026 y funciona.

## Qué hace que una web dure

Después de años observando qué proyectos sobreviven y cuáles no, he identificado un patrón:

**Las webs que duran usan la plataforma web directamente**. HTML, CSS, JavaScript estándar. No capas de abstracción sobre capas de abstracción. La plataforma web tiene una promesa de retrocompatibilidad que ningún framework puede igualar: lo que funciona hoy funcionará mañana.

**Las webs que duran tienen pocas dependencias**. Cada dependencia es un reloj con cuenta atrás. El día que el mantenedor la abandone, que una actualización rompa la compatibilidad, o que el ecosistema migre a otra cosa, tendrás un problema. Menos dependencias = menos relojes = más tiempo de vida.

**Las webs que duran son estáticas** (o pueden serlo). Un fichero HTML en un servidor no caduca. No necesita actualizaciones de seguridad. No tiene vulnerabilidades de inyección SQL. No se rompe cuando el hosting actualiza PHP. Es la forma más duradera de publicar en internet.

**Las webs que duran separan el contenido de la presentación**. Si tu contenido está en Markdown, puedes cambiar el generador estático, el diseño, el hosting — sin perder una palabra. Si tu contenido está atrapado en una base de datos propietaria, estás a merced de esa plataforma.

## Mis decisiones con esta mentalidad

Cuando construí este sitio, cada decisión técnica pasó por el filtro de la durabilidad:

- **Eleventy** genera HTML estático. Si Eleventy desaparece mañana, el HTML que ha generado sigue funcionando. Y mis artículos están en Markdown — puedo migrar a cualquier otro generador.
- **CSS con custom properties** — no Sass, no PostCSS, no Tailwind. CSS nativo que el navegador entiende directamente sin ningún paso de compilación.
- **JavaScript vanilla** — ni React, ni Vue, ni ningún framework. Las APIs del navegador que uso hoy existirán dentro de diez años.
- **Hosting estático** — un CDN sirviendo ficheros. La infraestructura más simple y robusta que existe.

¿Podría haber usado herramientas más sofisticadas? Sí. ¿Habrían aportado algo? Para este proyecto, no.

## No todo necesita durar diez años

Hay contextos donde la durabilidad no es la prioridad. Un prototipo, una campaña temporal, una aplicación experimental — tiene sentido usar las herramientas más productivas del momento sin preocuparse por la longevidad.

Pero para proyectos que representan la presencia online permanente de una persona o un negocio, la durabilidad debería ser un requisito explícito. "¿Seguirá funcionando esta web dentro de cinco años sin que nadie la toque?" es una pregunta que deberíamos hacer en la primera reunión con el cliente.

La respuesta honesta, para la mayoría de stacks modernos, es "probablemente no". Para una web estática bien construida, la respuesta es "casi con certeza sí".

Construir para durar no es resistirse al progreso. Es elegir conscientemente qué progreso merece la pena y cuál es ruido que pasará de moda antes de que termines de aprenderlo.
