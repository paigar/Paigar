---
title: "Imágenes responsive con picture y srcset: la guía práctica"
description: "Cómo servir la imagen correcta para cada dispositivo sin cargar bytes innecesarios. picture, srcset, sizes, lazy loading y formatos modernos."
date: 2025-12-20
tags:
  - html
  - rendimiento
  - técnicas
destacado: false
---

Las imágenes suelen ser el recurso más pesado de una web. En una página media representan más del 50% del peso total. Y en la mayoría de casos, el navegador está descargando imágenes más grandes de lo que necesita.

Un móvil con pantalla de 375px no necesita una imagen de 2000px de ancho. Un navegador que soporta WebP no debería recibir un JPEG. Pero si no le das opciones al navegador, descargará la única imagen que le ofreces, sea o no la adecuada.

## El atributo srcset

La forma más sencilla de ofrecer alternativas:

```html
<img
  src="foto-800.jpg"
  srcset="foto-400.jpg 400w,
          foto-800.jpg 800w,
          foto-1200.jpg 1200w"
  sizes="(max-width: 600px) 100vw,
         (max-width: 900px) 50vw,
         33vw"
  alt="Descripción de la foto"
  loading="lazy"
  width="1200"
  height="800"
>
```

`srcset` le dice al navegador qué imágenes están disponibles y su ancho real en píxeles. `sizes` le dice cuánto espacio ocupará la imagen en el layout. Con esa información, el navegador elige la imagen más adecuada considerando el ancho del viewport y la densidad de píxeles de la pantalla.

El `src` original es el fallback para navegadores que no soportan `srcset` (prácticamente ninguno en 2025, pero por compatibilidad).

## El elemento picture

Cuando necesitas cambiar el formato de imagen (no solo el tamaño), `<picture>` es la herramienta:

```html
<picture>
  <source srcset="foto.avif" type="image/avif">
  <source srcset="foto.webp" type="image/webp">
  <img src="foto.jpg" alt="Descripción" loading="lazy"
       width="800" height="450">
</picture>
```

El navegador recorre las `<source>` en orden y usa la primera que soporta. Si soporta AVIF (el más comprimido), lo usa. Si no, prueba WebP. Si no soporta ninguno, usa el JPEG del `<img>`.

También puedes combinar formatos con tamaños:

```html
<picture>
  <source
    srcset="foto-400.avif 400w, foto-800.avif 800w"
    sizes="(max-width: 600px) 100vw, 50vw"
    type="image/avif">
  <source
    srcset="foto-400.webp 400w, foto-800.webp 800w"
    sizes="(max-width: 600px) 100vw, 50vw"
    type="image/webp">
  <img
    src="foto-800.jpg"
    srcset="foto-400.jpg 400w, foto-800.jpg 800w"
    sizes="(max-width: 600px) 100vw, 50vw"
    alt="Descripción"
    loading="lazy"
    width="800" height="450">
</picture>
```

Es verboso, sí. Pero puede reducir el peso de las imágenes en un 50-70%.

## Lazy loading nativo

```html
<img src="foto.jpg" alt="..." loading="lazy">
```

Una línea. Le dice al navegador que no descargue la imagen hasta que esté cerca del viewport. No necesitas IntersectionObserver, no necesitas una librería. Es un atributo HTML.

Úsalo en todas las imágenes que no estén en el viewport inicial (above the fold). Para la imagen hero o el logo, usa `loading="eager"` (o simplemente no pongas el atributo, que es el valor por defecto).

## Width y height: evitar el layout shift

Siempre incluye `width` y `height` en tus imágenes:

```html
<img src="foto.jpg" alt="..." width="800" height="450">
```

No es para definir el tamaño visual (eso lo hace CSS). Es para que el navegador pueda calcular el aspect ratio **antes** de descargar la imagen y reservar el espacio correcto en el layout. Sin estos atributos, el contenido "salta" cuando la imagen carga — eso es un layout shift, y es una de las métricas que más penaliza en Core Web Vitals.

## Formatos: AVIF > WebP > JPEG

- **AVIF**: la mejor compresión disponible. Archivos 50% más pequeños que JPEG a calidad equivalente. Soporte del 92%+ de navegadores.
- **WebP**: buen compromiso entre compresión y soporte. 25-35% más pequeño que JPEG. Soporte prácticamente universal.
- **JPEG**: el fallback universal. Sigue siendo necesario como último recurso.
- **PNG**: solo para imágenes que necesitan transparencia y no pueden ser WebP/AVIF.

## En la práctica

Para una web con pocas imágenes (como esta), la optimización manual es factible: generas las variantes una vez y las subes. Para una web con muchas imágenes, necesitas automatización — `eleventy-img` para Eleventy, `sharp` en Node, o un servicio de transformación como Cloudinary.

Lo importante es no servir imágenes sin optimizar. Una foto de 4000x3000 pixels directo de la cámara en un `<img>` sin srcset ni lazy loading es el error de rendimiento más común y más fácil de corregir en la web.
