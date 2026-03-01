---
title: "Implementar un tema claro/oscuro con CSS custom properties"
description: "Cómo construir un sistema de temas sin frameworks ni JavaScript innecesario. Solo custom properties, un atributo data y un par de líneas de JS."
date: 2025-10-05
tags:
  - css
  - javascript
  - técnicas
destacado: false
---

El tema oscuro dejó de ser un capricho de programadores. Hoy lo esperan los usuarios, los sistemas operativos lo soportan de forma nativa, y CSS tiene las herramientas para implementarlo sin dolor. Así lo hago en mis proyectos.

## La estructura

Todo el sistema se basa en tres piezas:

1. **Custom properties** para los colores del tema
2. **Un atributo `data-theme`** en el `<html>` para cambiar entre temas
3. **Un script mínimo** para persistir la preferencia

## Los colores como variables

En vez de usar colores directos en los componentes, todo pasa por custom properties:

```css
:root {
  --color-texto: #1a1b2e;
  --color-texto-alt: #4a4a68;
  --color-fondo: #fafaf8;
  --color-fondo-alt: #f0f0ec;
  --color-acento: #f86624;
  --color-borde: #d4d4cc;
}

[data-theme="dark"] {
  --color-texto: #e0e0d8;
  --color-texto-alt: #a0a098;
  --color-fondo: #111118;
  --color-fondo-alt: #1c1c26;
  --color-acento: #f86624;
  --color-borde: #2a2a3e;
}
```

Lo importante: el acento no cambia entre temas. Es la identidad visual del sitio. Lo que cambia son los fondos, los textos y los bordes. Parece un detalle menor, pero mantener la coherencia del color de marca en ambos temas es lo que hace que el cambio se sienta natural.

## Los componentes no saben de temas

Una vez definidas las variables, los componentes las usan sin saber si estamos en tema claro u oscuro:

```css
.tarjeta {
  background: var(--color-fondo-alt);
  color: var(--color-texto);
  border: 1px solid var(--color-borde);
}
```

No hay `.tarjeta--dark`, no hay `@media (prefers-color-scheme: dark)` repetido en cada componente, no hay clases condicionales. El cambio de tema se resuelve en un solo lugar: la definición de las variables.

## Evitar el flash (FOUC)

El error más común al implementar temas es poner el JavaScript al final del body. El resultado: la página carga en el tema por defecto (claro) y medio segundo después salta al oscuro. Ese parpadeo es molesto y fácil de evitar.

La solución es un script inline en el `<head>`, antes del CSS:

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

Este script se ejecuta síncronamente antes de que el navegador renderice nada. Lee la preferencia guardada en localStorage; si no hay ninguna, respeta la del sistema operativo. El atributo `data-theme` se aplica antes del primer paint, así que no hay flash.

## El botón de toggle

El botón es simple: cambia el atributo y guarda en localStorage.

```javascript
document.querySelectorAll(".theme-toggle").forEach(btn => {
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("theme", next);
    // Actualizar icono
    document.querySelectorAll(".theme-toggle").forEach(b => {
      b.textContent = next === "dark" ? "☀" : "☾";
    });
  });
});
```

## Detalles que importan

### Imágenes y contraste

En tema oscuro, las imágenes con fondo blanco quedan como focos en una habitación a oscuras. Puedo reducir su brillo con CSS:

```css
[data-theme="dark"] img {
  filter: brightness(0.9);
}
```

### Sombras

Las sombras que funcionan en tema claro son invisibles en tema oscuro. En vez de sombras negras, uso sombras basadas en el color de fondo con transparencia.

### Transiciones

Un `transition` en el body suaviza el cambio:

```css
body {
  transition: background-color 0.3s ease, color 0.3s ease;
}
```

Pero ojo: esto puede causar transiciones no deseadas al cargar la página. Una opción es añadir la transición solo después del primer paint con JavaScript, o usar una clase temporal.

## Lo que no hago

No uso `prefers-color-scheme` como selector principal. Lo uso solo como fallback cuando no hay preferencia guardada. La razón: si el usuario ha elegido explícitamente un tema en mi web, esa decisión debe prevalecer sobre la del sistema operativo.

Tampoco intento hacer una transición automática entre temas según la hora del día. Si el usuario quiere claro a las 3 de la mañana, es su decisión. El toggle está ahí para eso.
