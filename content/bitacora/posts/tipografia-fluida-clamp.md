---
title: "Tipografía fluida con clamp(): adiós a las media queries para tamaños"
description: "Cómo usar clamp() para crear una escala tipográfica que se adapta al viewport sin necesidad de breakpoints. Con ejemplos prácticos y la lógica detrás de los valores."
date: 2025-06-10
tags:
  - css
  - tipografía
  - técnicas
destacado: false
---

Durante años, el enfoque estándar para adaptar el tamaño de texto al dispositivo eran las media queries: un tamaño para móvil, otro para tablet, otro para escritorio. Tres o cuatro breakpoints con valores discretos que saltaban de uno a otro.

```css
/* El enfoque antiguo */
h1 { font-size: 1.5rem; }
@media (min-width: 768px) { h1 { font-size: 2rem; } }
@media (min-width: 1200px) { h1 { font-size: 2.5rem; } }
```

Funciona, pero tiene un problema: los saltos son bruscos. En 767px tienes un tamaño, en 768px otro. Y tienes que decidir cuántos breakpoints usar, qué valores poner en cada uno, y mantener toda esa cascada cuando cambias la escala.

## La función clamp()

`clamp()` acepta tres valores: un mínimo, un valor preferido (fluido), y un máximo.

```css
h1 {
  font-size: clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem);
}
```

Esto significa: el tamaño será `1.2rem + 1.5vw`, pero nunca menor que `1.5rem` ni mayor que `2.5rem`. El texto crece suavemente con el viewport, sin saltos, sin breakpoints.

## Cómo calcular los valores

El valor fluido (`1.2rem + 1.5vw`) no es arbitrario. Se calcula a partir de los dos extremos que quieres:

- **Viewport mínimo**: 320px → tamaño mínimo: 1.5rem (24px)
- **Viewport máximo**: 1200px → tamaño máximo: 2.5rem (40px)

La fórmula es:

```
valor fluido = mínimo + (máximo - mínimo) * ((100vw - viewport_min) / (viewport_max - viewport_min))
```

Simplificado:

```
pendiente = (40 - 24) / (1200 - 320) = 16 / 880 ≈ 0.01818
intercepto = 24 - (0.01818 * 320) = 24 - 5.818 ≈ 18.18px ≈ 1.136rem
```

Redondeando: `clamp(1.5rem, 1.14rem + 1.82vw, 2.5rem)`.

No hace falta hacer esto a mano — hay calculadoras online. Pero entender la lógica te permite ajustar los valores con criterio en vez de copiar y pegar sin saber por qué.

## Mi escala tipográfica

En este sitio uso una escala modular fluida definida con custom properties:

```css
:root {
  --fs-1: clamp(0.833rem, 0.8rem + 0.17vw, 0.9rem);
  --fs0: clamp(1rem, 0.95rem + 0.25vw, 1.125rem);
  --fs1: clamp(1.125rem, 1.05rem + 0.38vw, 1.313rem);
  --fs2: clamp(1.266rem, 1.15rem + 0.58vw, 1.563rem);
  --fs3: clamp(1.424rem, 1.25rem + 0.87vw, 1.875rem);
  --fs4: clamp(1.602rem, 1.35rem + 1.26vw, 2.25rem);
  --fs5: clamp(1.802rem, 1.45rem + 1.76vw, 2.75rem);
}
```

Cada nivel de la escala crece proporcionalmente más que el anterior. En móvil, la diferencia entre un `h1` y un `h2` es sutil. En pantalla grande, es mucho más pronunciada. Esto es intencional: en pantallas pequeñas no puedes permitirte titulares enormes, pero en pantallas grandes quieres más contraste visual.

## Tipografía fluida más allá del font-size

`clamp()` no solo sirve para tamaños de texto. Lo uso para:

**Espaciado vertical entre secciones:**
```css
:root {
  --space-l: clamp(1.5rem, 1.2rem + 1.5vw, 2.5rem);
  --space-xl: clamp(2rem, 1.5rem + 2.5vw, 4rem);
}
```

**Interlineado que se ajusta al tamaño:**
```css
body {
  line-height: clamp(1.5, 1.4 + 0.2vw, 1.7);
}
```

**Márgenes laterales:**
```css
.contenido {
  padding-inline: clamp(1rem, 0.5rem + 2vw, 3rem);
}
```

El resultado es un diseño que fluye de forma natural entre cualquier tamaño de pantalla, sin los saltos artificiales de las media queries.

## Accesibilidad

Un detalle importante: al usar `rem` como base y unidad mínima/máxima, la tipografía fluida respeta la configuración de tamaño de texto del usuario. Si alguien ha aumentado el tamaño base en su navegador, todos los `rem` escalan con él. Si usases solo `px` o solo `vw`, romperías esa preferencia.

La combinación de `rem` (accesible, respeta preferencias) con `vw` (fluido, se adapta al viewport) es lo que hace que `clamp()` sea la herramienta correcta para tipografía responsive.
