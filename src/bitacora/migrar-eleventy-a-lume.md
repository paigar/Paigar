---
title: "Migrar de Eleventy a Lume: lo que nadie te cuenta"
description: "Tres problemas reales que encontré al migrar este sitio de Eleventy a Lume, y cómo los resolví. Includes rotos, tags que desaparecen y un sistema de bundling que no existe."
date: 2026-03-21
tags:
  - lume
  - eleventy
  - técnicas
destacado: true
---

Migrar un sitio estático de un generador a otro parece sencillo sobre el papel. Ambos procesan plantillas, ambos generan HTML, la estructura es parecida. Y en gran parte es así: el contenido Markdown no cambia, el CSS sigue siendo CSS, y el JavaScript vanilla funciona igual.

Pero hay trampas. No errores evidentes que te bloquean con un mensaje rojo — sino comportamientos sutiles que hacen que las páginas se generen vacías, que los posts pierdan sus categorías, o que el CSS deje de llegar donde tiene que llegar. Todo compila, todo parece funcionar, pero el resultado no es el que esperas.

Estos son los tres problemas reales que encontré migrando paigar.es de Eleventy a Lume.

## 1. Los includes dentro de bucles no reciben variables

En Eleventy con Nunjucks, esto funciona perfectamente:

```html
{% for post in collections.bitacora %}
  {% include "partials/postcard.njk" %}
{% endfor %}
```

El partial `postcard.njk` accede a la variable `post` del bucle padre sin problemas. Es el comportamiento esperado de Nunjucks: los includes heredan el scope del template que los llama.

En Lume, el mismo patrón genera HTML vacío. Sin errores, sin warnings — simplemente no renderiza nada dentro del bucle. La página se construye, el div contenedor aparece, pero los postcards no están.

Lo desconcertante es que `search.pages()` sí devuelve resultados. Puedes verificarlo con un debug inline:

```html
{% for post in search.pages("bitacora", "date=desc") %}
  <p>{{ post.title }}</p>  {# Esto SÍ funciona #}
  {% include "partials/postcard.njk" %}  {# Esto NO #}
{% endfor %}
```

El título se muestra, pero el include produce una cadena vacía. El partial no puede ver `post`.

### La solución en Nunjucks: macros

La alternativa que funciona en Lume con Nunjucks son los macros. En lugar de un partial que depende del scope del padre, defines una función que recibe los datos como argumentos:

```html
{# partials/postcard.njk #}
{% macro renderPostcard(post, postHeading) %}
<article class="postcard">
  <h3>{{ post.title }}</h3>
  ...
</article>
{% endmacro %}
```

Y en el template que lo usa:

```html
{% from "partials/postcard.njk" import renderPostcard %}

{% for post in search.pages("bitacora", "date=desc") %}
  {{ renderPostcard(post, "h2") }}
{% endfor %}
```

### La solución definitiva: Vento

Al migrar de Nunjucks a Vento (el motor nativo de Lume), el problema desaparece porque Vento permite pasar datos explícitamente al include:

```html
{{ for post of search.pages("bitacora", "date=desc") }}
  {{ include "partials/postcard.vto" { post, postHeading: "h2" } }}
{{ /for }}
```

Esa sintaxis `{ post, postHeading: "h2" }` es un objeto de datos que el include recibe. No hay ambigüedad sobre qué variables están disponibles. Es más explícito y más fiable que depender de la herencia de scope.

## 2. La cascada de datos no fusiona arrays

En Eleventy, puedes definir valores por defecto para todos los archivos de un directorio con un fichero `posts.11tydata.js`:

```javascript
// bitacora/posts/posts.11tydata.js
module.exports = {
  tags: ["bitacora"],
  layout: "layouts/post.njk",
};
```

Si un post tiene sus propios tags en el frontmatter (`tags: [css, técnicas]`), Eleventy los **fusiona** con los del directorio. El post acaba con `["bitacora", "css", "técnicas"]`. Esto es fundamental para que `collections.bitacora` incluya todos los posts de la sección.

En Lume, el equivalente es un archivo `_data.yml`:

```yaml
# bitacora/_data.yml
tags:
  - bitacora
layout: layouts/post.vto
```

Pero Lume **reemplaza** los arrays en lugar de fusionarlos. Un post con `tags: [css, técnicas]` pierde el tag `bitacora` del directorio. El resultado: `search.pages("bitacora")` devuelve cero resultados.

### El primer intento: mergedKeys

Lume tiene una opción `mergedKeys` que permite fusionar arrays:

```yaml
mergedKeys:
  tags: array
tags:
  - bitacora
layout: layouts/post.vto
```

Funciona — pero con un efecto secundario. El `_data.yml` aplica a **todos** los archivos del directorio, incluyendo `index.vto`. El índice de la sección acaba con el tag `bitacora`, apareciendo en los resultados de búsqueda como si fuera un post más. El feed RSS incluye la página de índice. Las postcards muestran la sección como si fuera un artículo.

### La solución: un preprocessor

La solución limpia es un preprocessor en `_config.ts` que solo inyecta el tag de sección en archivos Markdown, ignorando las plantillas `.vto`:

```typescript
site.preprocess([".md"], (pages) => {
  for (const page of pages) {
    const path = page.src.path;
    if (path.startsWith("/bitacora/")) {
      page.data.tags = [...(page.data.tags || []), "bitacora"];
    } else if (path.startsWith("/reflexiones/")) {
      page.data.tags = [...(page.data.tags || []), "reflexiones"];
    }
  }
});
```

El filtro `[".md"]` es la clave. Solo procesa archivos Markdown, así que los `index.vto` de cada sección no reciben el tag. Es más explícito que la cascada de datos y no tiene efectos colaterales.

## 3. El bundling de CSS y JS no existe

Eleventy tiene un plugin de bundling que permite incluir CSS y JavaScript inline directamente desde las plantillas:

```html
{# base.njk — recoge CSS de todos los templates #}
{% css %}{% include "public/css/reset.css" %}{% endcss %}
{% css %}{% include "public/css/tokens.css" %}{% endcss %}
{% css %}{% include "public/css/components.css" %}{% endcss %}

<style>
  {% getBundle "css" %}
</style>
```

El mecanismo es potente: cada plantilla puede añadir su propio CSS con `{% css %}...{% endcss %}`, y todo se concatena en un solo `<style>` en el `<head>`. Los posts añaden estilos de navegación, la home añade estilos del hero, la 404 añade estilos del terminal — y el usuario solo descarga el CSS que la página necesita.

Lume no tiene nada parecido. No hay `{% css %}`, no hay `{% getBundle %}`, no hay concatenación de CSS desde plantillas.

### La solución: postcss + inline + pageCss

La migración requiere tres pasos:

**Primero**, extraer todos los bloques `{% css %}...{% endcss %}` de las plantillas a archivos CSS individuales: `page-hero.css`, `page-post.css`, `page-404.css`, `page-sobre.css`, etc. Cada archivo contiene exactamente el CSS que antes vivía dentro de su plantilla.

**Segundo**, crear un `main.css` que importe solo el CSS base — el que todas las páginas necesitan:

```css
/* main.css */
@import "./public/css/reset.css";
@import "./public/css/tokens.css";
@import "./public/css/theme.css";
@import "./public/fonts/fonts.css";
@import "./public/css/layout.css";
@import "./public/css/components.css";
@import "./public/css/code.css";
```

El plugin `postcss` resuelve los `@import` y concatena todo. El plugin `inline` sustituye el `<link>` por un `<style>` con el contenido incrustado:

```html
<link rel="stylesheet" href="/css_main.css" inline>
```

**Tercero**, cada plantilla declara en su frontmatter qué CSS extra necesita con un array `pageCss`:

```yaml
---
layout: layouts/base.vto
title: "Paigar — Juanjo Marcos"
pageCss:
  - /css/page-hero.css
---
```

El layout base recorre ese array y añade cada archivo como un `<link inline>`:

```html
{{ for css of pageCss }}
<link rel="stylesheet" href="{{ css }}" inline>
{{ /for }}
```

El resultado es que la homepage solo carga el CSS del hero, un post solo carga el CSS de posts, y la 404 solo carga el suyo. Exactamente el mismo comportamiento que el `getBundle` de Eleventy — cada página recibe solo el CSS que necesita, todo inline, cero peticiones HTTP.

Para JavaScript, la misma idea. El atributo `inline` funciona también con `<script>`:

```html
<script src="/js/theme-toggle.js" inline></script>
<script src="/js/externallinks.js" inline></script>
<script src="/js/reveal.js" inline></script>
<script src="/js/nav-mobile.js" inline></script>
```

Lume lee cada archivo y lo incrusta directamente en el HTML. Cero peticiones externas para JS.

## ¿Mereció la pena?

Sí. Los tres problemas se resolvieron en el mismo día, y el resultado es un proyecto más limpio:

- **Deno en lugar de Node** — sin `node_modules` de 200 MB, sin `package.json`, sin `package-lock.json`
- **Vento en lugar de Nunjucks** — sintaxis más clara, datos explícitos en includes, expresiones JavaScript reales
- **TypeScript nativo** — la configuración, los generadores y el script de publicación son `.ts`, con tipado sin transpilación
- **Build en ~1 segundo** — 260 archivos generados, incluyendo conversión SVG→PNG de las imágenes Open Graph

El código fuente pasó de depender de 10 paquetes npm a cero dependencias de Node.js. Todo corre sobre Deno y las importaciones son URLs directas o paquetes de JSR. Para un sitio que predica la simplicidad, es coherente.
