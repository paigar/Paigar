---
title: "Web fonts: carga eficiente sin sacrificar el diseño"
description: "Estrategias para usar tipografías web sin penalizar el rendimiento. font-display, preload, subsetting y cuándo usar system fonts."
date: 2025-04-15
tags:
  - rendimiento
  - css
  - tipografía
destacado: false
---

Las tipografías web son una de las principales causas de rendimiento deficiente en sitios que, por lo demás, están bien optimizados. Cada fuente es un archivo que el navegador tiene que descargar antes de renderizar el texto (por defecto). Y la mayoría de sitios cargan más fuentes de las que necesitan.

## El problema real

Cuando el navegador encuentra texto que usa una fuente web que aún no ha descargado, tiene dos opciones:

- **FOIT (Flash of Invisible Text)**: no muestra nada hasta que la fuente carga. Es el comportamiento por defecto en la mayoría de navegadores y es la peor experiencia para el usuario — ve una página en blanco donde debería haber texto.
- **FOUT (Flash of Unstyled Text)**: muestra el texto con la fuente del sistema y la reemplaza cuando la fuente web carga. Hay un parpadeo, pero al menos el contenido es legible inmediatamente.

FOUT es siempre preferible a FOIT. El contenido es lo primero.

## font-display: la propiedad imprescindible

```css
@font-face {
  font-family: "MiFuente";
  src: url("/fonts/mifuente-regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
```

`font-display: swap` le dice al navegador: "muestra la fuente del sistema inmediatamente y cámbiala cuando cargue la fuente web". Es una línea que debería estar en toda declaración `@font-face`. No hay excusa para no usarla.

Otras opciones:
- `optional` — muestra la fuente web solo si ya está en caché. Si no, usa la del sistema permanentemente. Ideal para fuentes decorativas.
- `fallback` — espera 100ms. Si no ha cargado, usa la del sistema. Si carga antes de 3s, la aplica.

## Formatos: solo woff2

En 2025, el único formato de fuente web que necesitas es **woff2**. Tiene soporte del 97%+ de navegadores en uso y es el más comprimido (30-50% más pequeño que woff). Si estás sirviendo TTF, OTF o incluso woff (sin el 2), estás enviando bytes innecesarios.

```css
/* No hagas esto */
@font-face {
  src: url("font.eot");
  src: url("font.eot?#iefix") format("embedded-opentype"),
       url("font.woff2") format("woff2"),
       url("font.woff") format("woff"),
       url("font.ttf") format("truetype");
}

/* Haz esto */
@font-face {
  src: url("font.woff2") format("woff2");
}
```

Esa cascada de formatos era necesaria cuando IE11 era relevante. Ya no lo es.

## Subsetting: usa solo lo que necesitas

Una fuente completa incluye glifos para latín, cirílico, griego, símbolos matemáticos y cientos de caracteres que tu sitio nunca mostrará. Un archivo de fuente que pesa 120KB puede reducirse a 30KB si incluyes solo los caracteres latinos.

Herramientas como `glyphhanger` o `pyftsubset` te permiten generar un subset de la fuente con solo los caracteres que usas:

```bash
pyftsubset mifuente.ttf \
  --output-file=mifuente-latin.woff2 \
  --flavor=woff2 \
  --layout-features="kern,liga" \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F"
```

Para un sitio en español, necesitas el rango latino básico más los caracteres específicos (ñ, acentos, signos de interrogación/exclamación invertidos). Todo lo demás sobra.

## Preload: cuando sabes qué necesitas

Si la fuente es crítica (la usas para el body text), puedes decirle al navegador que empiece a descargarla antes de parsear el CSS:

```html
<link rel="preload" href="/fonts/mifuente-regular.woff2"
      as="font" type="font/woff2" crossorigin>
```

El atributo `crossorigin` es obligatorio incluso si la fuente está en tu propio dominio. Es un requisito de la especificación de fuentes.

Úsalo solo para una o dos fuentes críticas. Si haces preload de cinco pesos, estás compitiendo por ancho de banda con otros recursos.

## La opción radical: system fonts

La forma más rápida de servir tipografía es no servir ninguna:

```css
body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto,
    "Helvetica Neue", Arial, sans-serif;
}
```

El texto aparece instantáneamente, sin descargas, sin FOUT, sin FOIT. Y las fuentes del sistema están diseñadas para ser legibles en pantalla — no necesitan hinting especial.

Para un blog o una web de documentación, esta es probablemente la mejor opción. La tipografía web aporta personalidad visual, pero esa personalidad tiene un coste en rendimiento. ¿El 90% de tus visitantes notará la diferencia entre Inter y la fuente del sistema? Probablemente no. ¿Notarán que la web carga medio segundo más lento? Probablemente sí.

Es la opción que uso en este sitio. La pila tipográfica es:

```css
:root {
  --font-body: "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", "Cascadia Code", ui-monospace, monospace;
}
```

No descargo ninguna fuente. Si el visitante tiene Inter instalada (muchos desarrolladores la tienen), la verá. Si no, verá Segoe UI en Windows, San Francisco en macOS, o la que su sistema ofrezca. Lo mismo con el código: JetBrains Mono si la tiene, y si no, la monoespaciada del sistema.

El resultado es cero bytes de tipografía transferidos. El texto aparece instantáneamente. Y el aspecto visual es más que aceptable en cualquier sistema operativo.

Es una decisión de diseño, no técnica. Y como toda decisión de diseño, merece ser tomada conscientemente.
