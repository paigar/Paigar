# Paigar.es

Sitio web personal de [Juanjo Marcos](https://paigar.es), desarrollador web. Un cuaderno de desarrollo con artículos técnicos, reflexiones sobre el oficio y trayectoria profesional.

## Tech Stack

- **[Eleventy (11ty)](https://www.11ty.dev/)** v3 — Generador de sitios estáticos
- **Nunjucks** + **Markdown** — Templates y contenido
- **CSS puro** — Custom properties, Grid, Flexbox, `clamp()` para tipografía fluida
- **JavaScript vanilla** — Sin frameworks ni dependencias en el cliente

## Características

- Tema claro/oscuro con persistencia y respeto a preferencias del sistema
- Generación automática de imágenes Open Graph (SVG → PNG con caché MD5)
- Feed RSS, sitemap y metadatos SEO
- Diseño responsive sin frameworks CSS
- HTML minificado en producción
- Estimación de tiempo de lectura
- Navegación por tags

## Estructura del proyecto

```
src/
├── content/          # Páginas y artículos (Markdown + Nunjucks)
│   ├── bitacora/     # Artículos técnicos
│   ├── reflexiones/  # Reflexiones sobre desarrollo
│   ├── sobre-mi/     # Página "Sobre mí"
│   ├── trayectoria/  # Trayectoria profesional
│   └── herramientas/ # Stack tecnológico
├── _includes/        # Layouts y componentes parciales
├── _data/            # Datos globales (metadata, menú, herramientas)
└── public/           # Assets estáticos (CSS, JS, fuentes, imágenes)
```

## Desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo con recarga automática
npm start

# Build de producción
npm run build
```

Requiere Node 18+. El build genera el sitio estático en `_site/`.

## Licencia

El código fuente de este sitio es de uso libre. El contenido de los artículos es propiedad de su autor.
