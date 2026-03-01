---
title: "Imágenes Open Graph automáticas con Eleventy"
description: "Cómo generar automáticamente imágenes de vista previa para redes sociales en cada post, usando SVG y el plugin de imagen de Eleventy."
date: 2026-03-01
tags:
  - eleventy
  - técnicas
destacado: false
---

Cuando compartes un enlace en redes sociales, lo primero que ves es una imagen. Si no la tienes, tu enlace aparece como un rectángulo gris con texto plano. No es el fin del mundo, pero es una oportunidad perdida.

Crear esas imágenes a mano para cada post es tedioso. Y conectar un servicio externo para algo tan simple es sobredimensionar el problema. La solución está en el propio Eleventy: generar las imágenes durante el build, sin dependencias externas más allá de un plugin.

La idea original la encontré en el artículo de [Bernard Nijenhuis](https://bnijenhuis.nl/notes/automatically-generate-open-graph-images-in-eleventy/), y la he adaptado a las necesidades de este sitio.

## La estrategia

El truco es usar SVG como plantilla intermedia. SVG es código, así que puedes generarlo con Nunjucks igual que generas HTML. Después, el plugin `@11ty/eleventy-img` convierte ese SVG a PNG durante el build.

El flujo completo:

1. Una plantilla Nunjucks con paginación genera un archivo SVG por cada post
2. El SVG contiene el título del post, la sección y el branding del sitio
3. Después del build, un evento de Eleventy convierte todos los SVG a PNG
4. Las meta tags `og:image` apuntan a las imágenes generadas

Todo ocurre en el build. No hay servicios externos, no hay APIs, no hay imágenes que mantener a mano.

## El filtro splitlines

SVG no sabe partir texto en líneas. Si el título de tu post tiene 80 caracteres, se sale del canvas. Necesitas un filtro que divida el texto en líneas de longitud controlada:

```javascript
eleventyConfig.addFilter("splitlines", function (input) {
  const parts = input.split(" ");
  const lines = parts.reduce(function (prev, current) {
    if (!prev.length) {
      return [current];
    }
    const lastLine = prev[prev.length - 1];
    if (lastLine.length + 1 + current.length > 36) {
      return [...prev, current];
    }
    prev[prev.length - 1] = lastLine + " " + current;
    return prev;
  }, []);
  return lines;
});
```

El número 36 es el máximo de caracteres por línea. Depende del tamaño de fuente y del ancho del canvas. En mi caso, con `font-size="48"` y un canvas de 1200px, 36 caracteres encajan bien.

## La plantilla SVG

La plantilla usa la paginación de Eleventy para iterar sobre todos los posts y generar un SVG por cada uno:

{% raw %}
```html
---
pagination:
  data: collections.posts
  size: 1
  alias: post
permalink: "/og-images/{{ post.fileSlug }}.svg"
eleventyExcludeFromCollections: true
---
```
{% endraw %}

El SVG en sí es sencillo: fondo oscuro, una barra de color lateral, el título partido en líneas con `splitlines`, la sección del post y el nombre del sitio abajo. Nada que no puedas hacer con `<rect>`, `<text>` y `<line>`.

La posición vertical del título se ajusta según el número de líneas para que quede centrado visualmente:

{% raw %}
```html
{%- set titleLines = post.data.title | splitlines -%}
{%- if titleLines.length == 1 -%}
  {%- set titleY = 310 -%}
{%- elseif titleLines.length == 2 -%}
  {%- set titleY = 280 -%}
{%- elseif titleLines.length == 3 -%}
  {%- set titleY = 240 -%}
{%- else -%}
  {%- set titleY = 200 -%}
{%- endif -%}
```
{% endraw %}

Cada línea del título se renderiza con un `<tspan>` dentro de un `<text>`, incrementando la coordenada Y en cada iteración.

## Por qué PNG y no JPEG o WebP

La elección del formato no es casual. Estas imágenes son texto sobre fondos planos, sin fotografías ni degradados complejos. PNG comprime ese tipo de contenido muy bien y mantiene los bordes del texto nítidos. JPEG introduciría artefactos de compresión visibles en las letras y líneas rectas — necesitarías calidad alta para disimularlos, y el archivo acabaría pesando lo mismo o más.

WebP sería ideal por tamaño, pero los crawlers de redes sociales (Facebook, LinkedIn, WhatsApp) históricamente han tenido problemas con WebP en `og:image`. Facebook recomienda oficialmente PNG o JPEG.

En la práctica, las imágenes generadas pesan entre 22 y 38 KB. No merece la pena buscar más optimización.

## La conversión

Los SVG no sirven directamente como imágenes Open Graph. Los crawlers de redes sociales esperan formatos rasterizados. El plugin `@11ty/eleventy-img` hace la conversión usando Sharp internamente:

```javascript
eleventyConfig.on("eleventy.after", async () => {
  const ogDir = "_site/og-images/";
  if (!fs.existsSync(ogDir)) return;

  const svgFiles = fs.readdirSync(ogDir)
    .filter((f) => f.endsWith(".svg"));

  for (const filename of svgFiles) {
    const inputPath = path.join(ogDir, filename);
    const outputName = filename.replace(".svg", "");

    await Image(inputPath, {
      formats: ["png"],
      widths: [1200],
      outputDir: ogDir,
      filenameFormat: () => `${outputName}.png`,
    });
  }

  // Eliminar SVG originales
  for (const filename of svgFiles) {
    fs.unlinkSync(path.join(ogDir, filename));
  }
});
```

El evento `eleventy.after` se ejecuta cuando el build ha terminado de generar los archivos. En ese momento los SVG ya están en `_site/og-images/`, listos para convertir. Después de la conversión, se eliminan los SVG porque ya no hacen falta.

## Las meta tags

Solo queda apuntar las meta tags a las imágenes generadas. En el layout base:

{% raw %}
```html
{% if tags and ("bitacora" in tags or "reflexiones" in tags) %}
<meta property="og:image"
      content="{{ metadata.url }}/og-images/{{ page.fileSlug }}.png">
{% else %}
<meta property="og:image"
      content="{{ metadata.url }}/og-images/default.png">
{% endif %}
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
```
{% endraw %}

Los posts obtienen su imagen específica. El resto de páginas usan una imagen genérica con el nombre y la descripción del sitio. El valor `summary_large_image` en `twitter:card` hace que la imagen se muestre en grande al compartir en X.

## Sobre las fuentes

Un detalle importante: SVG renderiza el texto con las fuentes del sistema donde se ejecuta la conversión. Si usas una tipografía personalizada que no está instalada en el servidor de build, el resultado será diferente. En mi caso uso Arial como fuente para las imágenes OG, que está disponible en prácticamente cualquier sistema.

## El resultado

Con esta solución, cada vez que hago build se generan automáticamente las imágenes de vista previa para todos los posts. Sin intervención manual, sin servicios externos, sin imágenes que versionar en el repositorio. Solo código que genera código que genera imágenes.

La técnica original es de [Bernard Nijenhuis](https://bnijenhuis.nl/notes/automatically-generate-open-graph-images-in-eleventy/). Mi adaptación ajusta los colores al diseño de este sitio, usa PNG en lugar de JPEG para mejor calidad del texto, y genera también una imagen por defecto para las páginas que no son posts.
