---
title: "Construyendo paigar.es con Lume"
description: "Cómo y por qué he reconstruido mi web personal desde cero con Lume, CSS puro y muy pocas dependencias."
date: 2026-02-28
tags:
  - lume
  - css
  - proyectos
destacado: true
---

Llevaba tiempo queriendo rehacer esta web. La versión anterior cumplía su función, pero se había convertido en algo demasiado parecido a un escaparate comercial. Y no es eso lo que quiero que sea paigar.es. Para lo comercial ya está [Idenautas](https://www.idenautas.com).

## La idea

Si [Bilbonauta](https://www.bilbonauta.com) es mi cuaderno de viajes, paigar.es debería ser mi cuaderno de desarrollo. Un sitio donde documentar lo que construyo, reflexionar sobre el oficio y compartir las herramientas que uso. Un espacio donde el contenido manda y la tecnología está al servicio del texto.

La estructura la tenía clara: una bitácora técnica para documentar soluciones, una sección de reflexiones para las opiniones más largas, una trayectoria profesional y una caja de herramientas. Sin portfolio de clientes, sin formulario de contacto, sin sección de "servicios". Solo lo que un desarrollador necesita contar.

## Decisiones técnicas

### Lume sobre Deno

Después de años usando Eleventy con Node.js, quería probar algo diferente. [Lume](https://lume.land/) corre sobre Deno y comparte la misma filosofía: cero opiniones sobre el frontend. Tú decides qué HTML generar, qué CSS escribir y si necesitas JavaScript o no.

La configuración vive en un solo archivo TypeScript, limpio y directo:

```typescript
import lume from "lume/mod.ts";

const site = lume({ src: "./src" });

site.copy("public", ".");

export default site;
```

Lo que me convenció de Lume fue la combinación de Deno (sin `node_modules`, con TypeScript nativo) y un sistema de plugins sencillo. Feed, sitemap, minificación — todo se añade con una línea. Y Vento, su motor de plantillas, es más limpio que Nunjucks.

### CSS puro con custom properties

Nada de Sass, nada de Tailwind, nada de PostCSS. Variables CSS para los tokens de diseño, grid nativo para el layout, `clamp()` para la tipografía fluida y nada más.

```css
:root {
  --color-texto: #1a1b2e;
  --color-fondo: #fafaf8;
  --color-acento: #e05a1b;
  --fs-base: clamp(1rem, 1.5vw, 1.15rem);
  --fs1: calc(var(--fs-base) * 1.2);
  --fs2: calc(var(--fs-base) * 1.45);
}
```

Cuando llevas más de veinte años escribiendo CSS, no necesitas abstracciones sobre abstracciones. Sabes lo que hace cada propiedad y las custom properties te dan todo lo que antes necesitabas de un preprocesador: variables, temas, tokens reutilizables.

### El sistema de layout "límites"

Uno de los componentes de los que más orgulloso estoy es el sistema de grid con columnas nombradas. Un único contenedor `.limites` que define columnas con nombres (`total`, `ancho`, `normal`, `estrecho`), y cada hijo decide su ancho con una clase:

```css
.limites > * { grid-column: normal; }
.limites > .ancho { grid-column: ancho; }
.limites > .total { grid-column: total; }
```

Esto elimina la necesidad de wrappers anidados. El texto va a `normal` (55ch), las secciones amplias a `ancho` (65rem), y si algún elemento necesita ir a sangre, `total`. Todo responsive sin media queries.

### Tema claro y oscuro

Siendo una web de desarrollo, el tema oscuro no es un capricho sino una expectativa. La implementación es más simple de lo que parece: un atributo `data-theme` en el `<html>`, un juego de custom properties para cada tema, y un script inline en el `<head>` que lee la preferencia guardada antes de que el navegador pinte nada.

```html
<script>
  (function() {
    var theme = localStorage.getItem('theme');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

El script va inline y antes del CSS deliberadamente. Si lo pones al final o lo cargas como módulo, obtienes un flash de tema incorrecto (FOUC) que es molesto e innecesario.

### Vento + Markdown

Los artículos se escriben en Markdown — cómodo, portable, sin lock-in. Las páginas de sección usan Vento, el motor de plantillas nativo de Lume. Su sintaxis es más limpia que Nunjucks: usa `{{ }}` para todo — variables, condicionales, bucles — con expresiones JavaScript reales en lugar de un lenguaje de plantillas propio.

```html
{{ for post of search.pages("bitacora", "date=desc") }}
  <article>
    <h2>{{ post.title }}</h2>
    <time>{{ post.date |> readableDate }}</time>
  </article>
{{ /for }}
```

La gestión de contenido es por ficheros: cada artículo es un `.md` con frontmatter YAML. Sin base de datos, sin CMS, sin panel de administración. `git push` y a producción.

## Lo que tiene y lo que no

**Tiene**: RSS, sitemap, sistema de temas, tipografía fluida, syntax highlighting para código, navegación responsive con panel deslizante, imágenes Open Graph generadas automáticamente, favicon, robots.txt, páginas legales y consentimiento de cookies.

**No tiene**: analytics, comentarios, newsletter, buscador, imágenes decorativas ni un solo kilobyte de JavaScript que no sea estrictamente necesario.

La web completa — HTML con CSS externo, JavaScript vanilla y cero fuentes web (uso las del sistema) — pesa menos que una imagen hero típica. Y eso no es un accidente — es una decisión de diseño.

## Lo que queda

Esto es solo el principio. Hay mucho que escribir, muchas herramientas que documentar y muchas reflexiones pendientes. Pero la base está puesta, el código es limpio, y puedo centrarme en lo que importa: el contenido.
