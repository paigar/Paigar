---
title: "Tipografía fluida con clamp(): adiós a las media queries para tamaños"
description: "Cómo usar clamp() para crear una escala tipográfica que se adapta al viewport sin necesidad de breakpoints. Con ejemplos prácticos y la lógica detrás de los valores."
date: 2025-06-08
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

En este sitio uso un enfoque ligeramente diferente al de aplicar `clamp()` a cada nivel por separado. Defino una sola variable base fluida y construyo el resto de la escala con multiplicadores:

```css
:root {
  --fs-base: clamp(1rem, 1.5vw, 1.15rem);
  --fs-2: calc(var(--fs-base) * 0.75);
  --fs-1: calc(var(--fs-base) * 0.85);
  --fs0: var(--fs-base);
  --fs1: calc(var(--fs-base) * 1.2);
  --fs2: calc(var(--fs-base) * 1.45);
  --fs3: calc(var(--fs-base) * 1.75);
  --fs4: calc(var(--fs-base) * 2.1);
  --fs5: calc(var(--fs-base) * 2.5);
  --fs6: calc(var(--fs-base) * 3.2);
}
```

La ventaja de este enfoque es que toda la escala se mueve junta. Si cambio el `clamp()` de la base, todos los tamaños se reajustan proporcionalmente. No tengo que recalcular siete valores diferentes.

Además, para móvil uso una media query que reduce los multiplicadores de los niveles grandes, porque en pantallas pequeñas el contraste entre tamaños tiene que ser más sutil:

```css
@media screen and (max-width: 45rem) {
  :root {
    --fs1: calc(var(--fs-base) * 1.15);
    --fs2: calc(var(--fs-base) * 1.3);
    --fs3: calc(var(--fs-base) * 1.5);
    --fs4: calc(var(--fs-base) * 1.7);
    --fs5: calc(var(--fs-base) * 2);
    --fs6: calc(var(--fs-base) * 2.5);
  }
}
```

Sí, estoy usando una media query — justo lo que este artículo pretende evitar. Pero el `clamp()` de la base se encarga de la fluidez continua, y la media query solo ajusta las proporciones de la escala en viewports estrechos. Es un híbrido pragmático: la transición es suave gracias a la base fluida, y los ratios se ajustan cuando realmente hace falta.

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
