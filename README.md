# Paigar.es

Sitio web personal de [Juanjo Marcos](https://paigar.es), desarrollador web. Un cuaderno de desarrollo con artículos técnicos, reflexiones sobre el oficio y trayectoria profesional.

## Tech Stack

- **[Lume](https://lume.land/)** — Generador de sitios estáticos sobre Deno
- **Vento** + **Markdown** — Templates y contenido
- **CSS puro** — Custom properties, Grid, Flexbox, `clamp()` para tipografía fluida
- **JavaScript vanilla** — Sin frameworks ni dependencias en el cliente

## Características

- Tema claro/oscuro con persistencia y respeto a preferencias del sistema
- Generación automática de imágenes Open Graph (SVG → PNG con resvg)
- Feed RSS + JSON Feed, sitemap y metadatos SEO
- Diseño responsive sin frameworks CSS
- HTML minificado en producción
- Syntax highlighting con PrismJS
- Estimación de tiempo de lectura
- Navegación por tags

## Estructura del proyecto

```
_config.ts            # Configuración de Lume
deno.json             # Configuración de Deno (tareas, imports)
scripts/
└── publicar.ts       # Script de publicación (git + build + Bunny CDN)
src/
├── bitacora/         # Artículos técnicos (.md)
├── reflexiones/      # Reflexiones sobre desarrollo (.md)
├── sobre-mi/         # Página "Sobre mí"
├── trayectoria/      # Trayectoria profesional
├── herramientas/     # Stack tecnológico
├── legal/            # Páginas legales
├── tags/             # Índice de tags
├── _includes/        # Layouts y componentes parciales (.vto)
├── _data/            # Datos globales (metadata, menú, herramientas)
└── public/           # Assets estáticos (CSS, JS, fuentes, imágenes)
```

## Desarrollo

```bash
# Servidor de desarrollo con recarga automática
deno task serve

# Build de producción
deno task build

# Publicar (git push + build + subir a Bunny CDN + purgar caché)
deno task publicar
```

Requiere [Deno](https://deno.land/). El build genera el sitio estático en `_site/`.

## Licencia

El código fuente de este sitio es de uso libre. El contenido de los artículos es propiedad de su autor.
