---
title: "Migrando paigar.es de Eleventy a Lume"
description: "Por qué decidí migrar este sitio de Eleventy a Lume, qué cambió en la arquitectura y qué se ganó en el proceso."
date: 2026-03-12
tags:
  - lume
  - eleventy
  - proyectos
destacado: false
---

Hace unos días escribí sobre [lo que supone el cambio de Eleventy a Build Awesome](/reflexiones/alternativas-a-eleventy/) y sobre por qué Lume me parecía la alternativa más coherente. Al final del artículo decía que tenía la tentación de probarlo con mi propio sitio. Pues lo he hecho. Este es el resultado.

Esta versión 3.x de paigar.es [nació con Eleventy](/bitacora/construyendo-paigar-con-eleventy/) y funcionaba bien. No había una razón urgente para cambiar. Pero las razones de fondo — independencia del proyecto, afinidad con Deno, curiosidad técnica — pesaban lo suficiente como para justificar el experimento. Y siendo un sitio personal, me podía permitir romper cosas.

## Qué se gana con Lume

**Deno en lugar de Node.** Adiós a `package.json`, `package-lock.json` y la carpeta `node_modules` de 200 MB. Las dependencias se resuelven por URL o desde JSR. El proyecto entero se gestiona con `deno.json` y un solo `_config.ts`.

**TypeScript nativo.** La configuración, los generadores de páginas y el script de publicación son `.ts`. Sin transpilación, sin configuración extra, con tipado real.

**Vento en lugar de Nunjucks.** El motor de plantillas nativo de Lume es más limpio: usa `{{ }}` para todo — variables, condicionales, bucles — con expresiones JavaScript reales en lugar de un lenguaje propio. Y los includes pasan datos de forma explícita, lo que evita problemas de scope que tenía con Nunjucks.

**Plugins integrados.** Feed RSS, sitemap, minificación HTML, PostCSS, inlining de assets — todo con una línea en la configuración. En Eleventy necesitaba paquetes npm separados para cada cosa.

## Lo que cambió

### De Nunjucks a Vento

El cambio más visible. Donde antes escribía:

```html
{% for post in collections.bitacora %} {% include "partials/postcard.njk" %} {%
endfor %}
```

Ahora escribo:

```html
{{ for post of search.pages("bitacora", "date=desc") }} {{ include
"partials/postcard.vto" { post } }} {{ /for }}
```

`search.pages()` sustituye a las colecciones de Eleventy. Es más potente — puedes filtrar por tags, ordenar, paginar — y la sintaxis es JavaScript estándar.

### De colecciones a search

En Eleventy, las colecciones se alimentaban de los tags del frontmatter y de la cascada de datos (`posts.11tydata.js`). En Lume, uso un preprocessor que inyecta el tag de sección solo a los archivos Markdown:

```typescript
site.preprocess([".md"], (pages) => {
	for (const page of pages) {
		if (page.src.path.startsWith("/bitacora/")) {
			page.data.tags = [...(page.data.tags || []), "bitacora"];
		}
	}
});
```

Más explícito, sin efectos colaterales, y sin depender de una cascada de datos que puede sorprenderte.

### De bundling a postcss + inline

Eleventy tiene un plugin de bundling que concatena CSS y JS desde las plantillas e inyecta todo inline. Lume no tiene equivalente directo, pero la combinación de los plugins `postcss` e `inline` consigue el mismo resultado:

```html
<link rel="stylesheet" href="/css_main.css" inline />
```

PostCSS resuelve los `@import` y concatena. El plugin `inline` sustituye el `<link>` por un `<style>` con el contenido. Cada página puede declarar CSS adicional en su frontmatter con `pageCss`, así que solo carga lo que necesita — igual que antes.

### De Sharp a resvg-wasm

Las imágenes Open Graph se generaban con `@11ty/eleventy-img` (que usa Sharp internamente). Sharp no funciona en Deno, así que la conversión SVG→PNG ahora usa `resvg-wasm`, una versión WebAssembly del renderizador SVG de Mozilla. Funciona en cualquier plataforma sin binarios nativos.

### De Node a Deno para publicar

El script de publicación (`publicar.mjs`) era Node.js con `dotenv`. Ahora es `publicar.ts` con APIs nativas de Deno: `Deno.env`, `Deno.readFile`, `Deno.Command`. Cero dependencias npm.

## Lo que no cambió

Todo lo que importa se mantuvo intacto:

- **El diseño** — el mismo CSS, los mismos tokens, el mismo sistema de layout "límites"
- **El contenido** — los archivos Markdown no se tocaron (salvo el frontmatter de `permalink` a `url`)
- **El tema claro/oscuro** — misma implementación con `data-theme` y localStorage
- **El rendimiento** — CSS y JS inline, HTML minificado, cero frameworks en el cliente
- **El despliegue** — Git → Build → Bunny CDN → Purga de caché

El sitio se ve exactamente igual. Si no lees el footer donde ahora dice "Hecho con Lume", no sabrías que cambió nada.

## El resultado

El build genera 159 archivos en unos 2 segundos. Las 42 imágenes Open Graph se convierten de SVG a PNG solo cuando su contenido cambia — en builds sucesivos se sirven desde una caché local. El proyecto no tiene ninguna dependencia de Node.js. Todo corre sobre Deno.

Después de la migración aproveché para limpiar: eliminé filtros que Vento hacía innecesarios (de 12 a 5), moví la versión anterior del sitio a un subdominio propio para no arrastrar 17 MB en cada deploy, y reorganicé los assets para que solo los archivos realmente externos (cookieconsent) se copien al output — el CSS y JS funcional se incrusta inline directamente desde las plantillas.

Para un sitio que predica la simplicidad y el código limpio, la arquitectura ahora es coherente con el mensaje. Y si te interesan los detalles técnicos de la migración, los he documentado en [un artículo aparte](/bitacora/migrar-eleventy-a-lume/) con los tres problemas que más tiempo me costaron resolver.
