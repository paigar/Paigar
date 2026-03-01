---
title: "El problema de los diseñadores con la web"
description: "Diseñar para web no es diseñar para papel. Reflexión sobre los conflictos entre diseño gráfico y realidad del navegador: responsive, accesibilidad, color y tipografía."
date: 2025-10-28
tags:
  - diseño
  - opinión
  - accesibilidad
destacado: false
---

He trabajado con muchos diseñadores gráficos a lo largo de mi carrera. La mayoría son buenos profesionales con un ojo para la composición, el color y la tipografía que yo no tengo. Pero hay un patrón que se repite: muchos diseñan para web como si diseñaran para papel. Y la web no es papel.

## El lienzo no tiene medidas fijas

El error más fundamental es diseñar una web para una sola resolución. Me han llegado diseños en Figma o Photoshop a 1440px de ancho, pixel-perfect, con cada elemento colocado al milímetro. Y cuando preguntas "¿qué pasa en 375px?", te miran como si les hubieras hablado en otro idioma.

La web es un medio fluido. El mismo contenido se va a ver en una pantalla de 320px y en una de 3840px. En un monitor panorámico y en un móvil en vertical. Con el texto al 100% y con el texto al 200% porque el usuario tiene baja visión. Diseñar una sola versión estática y esperar que "se adapte" no es diseño responsive — es no entender el medio.

Un buen diseño web no es una imagen fija. Es un **sistema de reglas** que define cómo se comporta el contenido en diferentes contextos. Qué pasa cuando hay más texto del previsto. Qué pasa cuando una línea se parte. Qué pasa cuando no hay imagen. Los diseños que mejor implemento son los que vienen con estas preguntas ya respondidas.

## El color no es lo que parece

En impresión, los colores se calibran con Pantone y se comprueban en pruebas de imprenta. El resultado final es predecible: lo que ves en la prueba es lo que sale de la máquina.

En web, cada monitor muestra los colores de forma diferente. Un MacBook Pro con pantalla P3 no muestra lo mismo que un monitor de oficina con sRGB básico. Y un móvil OLED con saturación alta muestra colores completamente distintos a un LCD de gama baja.

He tenido conversaciones del tipo "este naranja no es el mismo que en mi Figma". Claro que no lo es. Es el mismo código hexadecimal, pero el monitor del diseñador, el del desarrollador y el del cliente muestran tres naranjas diferentes. Y el de los miles de usuarios que van a ver la web, miles de naranjas más.

La solución no es intentar controlar lo incontrolable. Es diseñar con suficiente contraste y robustez para que el diseño funcione en cualquier monitor, no solo en el tuyo.

## La accesibilidad no es opcional

Este es quizás el punto donde más desconexión hay. He visto diseños con texto gris claro sobre fondo blanco — elegantísimos en la pantalla del diseñador, ilegibles para cualquier persona con agudeza visual reducida. Botones de 24px de alto en los que es imposible acertar con el dedo en un móvil. Navegaciones que dependen exclusivamente de hover, que no existe en pantallas táctiles.

Las pautas WCAG no son sugerencias. Son requisitos, y en muchos contextos, obligaciones legales. Un contraste mínimo de 4.5:1 para texto normal. Áreas de toque de al menos 44px. Navegación por teclado. Alternativas textuales para contenido visual.

Cuando un diseñador me pasa un diseño que no cumple con estas pautas, tengo dos opciones: implementarlo tal cual y entregar una web inaccesible, o modificarlo y arriesgarme a que me digan que "no es lo que aprobamos". La mejor opción es que estas conversaciones ocurran antes de que el diseño llegue a desarrollo.

## La tipografía en pantalla

En impresión, puedes usar la tipografía que quieras. No tiene coste de rendimiento, no hay problemas de carga, cada glifo se renderiza con la resolución de la impresora.

En web, cada fuente es un archivo que el navegador tiene que descargar. He visto diseños que usan cinco familias tipográficas diferentes, cada una con cuatro pesos. Eso son veinte archivos de fuente — más de 1MB de tipografía antes de mostrar una sola letra.

Además, el renderizado tipográfico varía entre sistemas operativos. La misma fuente se ve diferente en Windows, macOS y Linux. El hinting, el antialiasing y el subpixel rendering son diferentes en cada plataforma. Un diseñador que ajusta el kerning al píxel en su Mac se lleva un disgusto cuando ve cómo se renderiza en Windows.

## El diseñador web ideal

Los mejores diseñadores web que he conocido comparten algo: entienden las limitaciones del medio y diseñan dentro de ellas, no a pesar de ellas.

- Entregan sistemas, no imágenes fijas
- Diseñan para el peor caso, no solo para el mejor
- Conocen las pautas de accesibilidad y las aplican desde el principio
- Limitan la paleta tipográfica a lo esencial
- Hablan con los desarrolladores antes de cerrar el diseño
- Aceptan que la web es un medio imperfecto y lo aprovechan en vez de luchar contra él

Diseñar para web es diseñar para la incertidumbre. Y eso requiere una mentalidad diferente a la del diseño gráfico tradicional. No mejor ni peor — diferente.
