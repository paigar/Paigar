---
title: "Rendimiento en webs estáticas: lo que ya haces bien y lo que puedes mejorar"
description: "Una web estática no es automáticamente rápida. Técnicas concretas para que tu sitio generado con Eleventy cargue en milisegundos."
date: 2025-10-25
tags:
  - rendimiento
  - eleventy
  - técnicas
destacado: false
---

Hay una idea extendida de que las webs estáticas son rápidas por definición. Es verdad a medias. Una web estática elimina el cuello de botella del servidor (no hay base de datos, no hay rendering server-side), pero el HTML que generas puede ser igual de pesado que el de un CMS si no prestas atención.

## Lo que ya ganas

Con Eleventy o cualquier generador estático, partes con ventaja:

- **Sin servidor dinámico** — el HTML está pregenerado, el servidor solo lo sirve
- **CDN friendly** — los ficheros estáticos se cachean y distribuyen globalmente
- **Sin base de datos** — cero latencia de queries
- **Sin framework JS** (si lo evitas) — menos código para parsear y ejecutar

Pero estas ventajas se pueden desperdiciar fácilmente.

## CSS: inline vs archivo externo

El plugin `eleventy-plugin-bundle` permite incluir el CSS inline en el HTML:

{% raw %}
```html
<style>
  {% getBundle "css" %}
</style>
```
{% endraw %}

Para sitios pequeños, esto es una ventaja: eliminas una petición HTTP. El navegador tiene todo lo que necesita en el primer HTML para renderizar la página. No hay FOUC (flash of unstyled content) porque el CSS está disponible antes del primer paint.

El punto de inflexión está alrededor de los 14KB. Ese es el tamaño del primer round-trip TCP (el primer fragmento que el servidor puede enviar). Si tu CSS cabe ahí junto con el HTML, inline es la opción correcta. Si no, un archivo externo con `rel="preload"` es mejor porque el navegador lo cachea.

El CSS completo de este sitio, incluyendo todos los componentes y ambos temas, está por debajo de ese límite.

## Fuentes: la trampa silenciosa

Las fuentes web son probablemente el mayor problema de rendimiento en sitios que por lo demás son ligeros. Cada fichero de fuente es una petición HTTP, y el navegador no renderiza el texto hasta que la fuente carga (por defecto).

Opciones, de más rápida a más lenta:

1. **System font stack** — cero peticiones, renderizado instantáneo
2. **Fuente local con `font-display: swap`** — el texto aparece inmediatamente con la fuente del sistema y cambia cuando carga la fuente web
3. **Fuente de Google Fonts** — añade latencia de DNS + petición al CDN de Google
4. **Múltiples pesos de fuente** — cada peso es un archivo adicional

```css
@font-face {
  font-family: "MiFuente";
  src: url("/fonts/mifuente.woff2") format("woff2");
  font-display: swap;
  font-weight: 400;
}
```

El formato `woff2` es obligatorio — es el más comprimido y tiene soporte universal. Si tu fuente solo viene en TTF u OTF, conviértela.

Y un consejo: limita los pesos. ¿Realmente necesitas thin, light, regular, medium, semibold, bold, extrabold y black? Probablemente con regular y bold cubras el 95% de los casos.

## Imágenes: el elefante en la habitación

En una web de contenido textual como esta, las imágenes no son un problema porque apenas las hay. Pero en proyectos con imágenes, son el factor dominante del rendimiento.

Lo mínimo que deberías hacer:

- **Formatos modernos**: WebP o AVIF en vez de JPEG/PNG
- **Dimensiones correctas**: no servir una imagen de 3000px para un espacio de 800px
- **`loading="lazy"`**: carga diferida para imágenes fuera del viewport
- **`srcset` y `sizes`**: para que el navegador elija la resolución adecuada

```html
<picture>
  <source srcset="imagen.avif" type="image/avif">
  <source srcset="imagen.webp" type="image/webp">
  <img src="imagen.jpg" alt="Descripción" loading="lazy"
       width="800" height="450">
</picture>
```

## JavaScript: menos es más

El JavaScript propio de este sitio — toggle de tema, menú hamburguesa, animaciones de entrada y gestión de enlaces externos — va inline en el HTML y pesa menos de lo que pesa una sola imagen de avatar en la mayoría de webs. El cookie consent, que es la dependencia más pesada, se carga de forma diferida: su CSS y JavaScript no bloquean el primer renderizado ni forman parte del bundle principal.

El truco no es minificar mejor ni usar tree-shaking más agresivo. El truco es no cargar lo que no necesitas en el momento crítico. Cada `npm install` que evitas es rendimiento ganado, y lo que no puedes evitar, lo difiere.

## Medir, no adivinar

Las herramientas están ahí:

- **Lighthouse** en las DevTools de Chrome — puntuación general
- **WebPageTest** — waterfall detallado y métricas reales
- **El panel Network de las DevTools** — para ver exactamente qué se carga y cuánto pesa

La métrica más importante para una web de contenido es **Largest Contentful Paint (LCP)**: cuánto tarda en aparecer el contenido principal. Para este sitio, debería estar por debajo de 1 segundo en una conexión decente, porque lo primero que el navegador recibe es un HTML completo con CSS inline y texto. No hay JavaScript que bloquee el renderizado, no hay fuentes que retrasen el paint, no hay imágenes above-the-fold.

Eso no es magia. Es solo tomar decisiones conscientes sobre qué incluir y qué dejar fuera.
