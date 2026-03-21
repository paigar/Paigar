---
title: "Anatomía de .visually-hidden — cada propiedad tiene su razón"
description: "Desglose línea por línea del patrón CSS visually-hidden: por qué cada propiedad existe, qué problema resuelve, y por qué no puedes simplemente usar display:none."
date: 2026-02-12
tags:
  - css
  - accesibilidad
  - técnicas
destacado: false
---

Si has trabajado con accesibilidad web, conoces `.visually-hidden` (o `.sr-only`, su nombre en Bootstrap). Es una clase CSS que oculta contenido visualmente pero lo mantiene accesible para lectores de pantalla. La usas para skip links, etiquetas adicionales en formularios, texto descriptivo que complementa iconos sin etiqueta.

Lo que probablemente no conoces es *por qué* cada propiedad está ahí. Y no, no es casual. Cada línea resuelve un problema específico, y si quitas una, algo se rompe en algún lugar.

## El patrón completo

```css
.visually-hidden:not(:focus):not(:active) {
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
```

Seis propiedades y dos pseudo-clases negadas. Vamos línea por línea.

## Por qué no `display: none`

Empecemos por lo que **no** se usa. `display: none` elimina el elemento del árbol de accesibilidad. Los lectores de pantalla no lo leen. `visibility: hidden` hace lo mismo. Ambos son invisibles para todos, no solo visualmente.

Lo que necesitamos es algo más sutil: un elemento que **existe** en el árbol de accesibilidad, que el lector de pantalla puede leer, pero que no ocupa espacio visual en la pantalla. Es como susurrar algo que solo ciertos oyentes pueden escuchar.

## `position: absolute`

Saca el elemento del flujo del documento. Hasta aquí, nada sorprendente.

Pero el detalle está en lo que **no** hace: no usa coordenadas negativas como `left: -9999px`. Esa fue la técnica clásica durante años, y tiene problemas reales:

- En páginas con dirección RTL (árabe, hebreo), el contenido desplazado a la izquierda puede generar barras de scroll horizontales.
- Algunos lectores de pantalla intentan desplazar la vista hasta donde está el contenido, provocando saltos de scroll desconcertantes.
- JAWS tiene una función llamada Visual Tracking que muestra un borde rojo alrededor del elemento que está leyendo. Con `left: -9999px`, ese borde se dibuja fuera de la pantalla y el indicador visual se pierde.

`position: absolute` sin coordenadas simplemente coloca el elemento donde estaría en el flujo, pero sin afectar a los demás. Sin saltos, sin scrollbars fantasma.

## `width: 1px` y `height: 1px`

¿Por qué no `0`? Porque dimensiones cero pueden sacar el elemento del árbol de accesibilidad en algunos navegadores. En Safari, un elemento con ancho o alto cero no puede recibir foco — lo que rompe los skip links para usuarios de teclado.

Un píxel es el mínimo necesario para que el navegador considere que el elemento "existe" lo suficiente como para mantenerlo accesible. No lo verás, pero el navegador sabe que está ahí.

## `overflow: hidden`

Con un contenedor de 1×1 píxeles, el texto del interior se desbordaría y sería visible. `overflow: hidden` corta cualquier contenido que se escape de esa caja mínima. Combinado con las dimensiones, el resultado visual es nada. Cero píxeles visibles.

## `clip-path: inset(50%)`

Esta es la propiedad que hace el trabajo pesado de ocultar. `inset(50%)` recorta el elemento desde los cuatro lados hacia dentro un 50%, lo que resulta en un área de recorte de 0×0. Visualmente desaparece.

Lo importante es que `clip-path` solo afecta la representación visual. El contenido sigue existiendo en el árbol de accesibilidad. Es como poner una máscara sobre algo — no lo destruyes, solo lo tapas.

Quizá hayas visto versiones antiguas del patrón que usan la propiedad `clip` (sin el `-path`). Eso era necesario para Internet Explorer. `clip` está deprecated desde hace años, así que si no necesitas soportar IE, puedes quedarte solo con `clip-path`.

## `white-space: nowrap`

Esta es la propiedad que más me sorprendió cuando entendí su razón de ser.

Sin `nowrap`, el texto dentro de la caja de 1×1 píxeles se envuelve. Cada palabra acaba en su propia "línea" dentro de esa caja mínima. Y aquí vienen dos problemas reales:

**NVDA interpreta los saltos como líneas separadas.** Si tu texto es "Ir al contenido principal", sin `nowrap` NVDA puede leerlo como cinco anuncios separados: "Ir", "al", "contenido", "principal". Una experiencia confusa para el usuario.

**JAWS Visual Tracking se descuadra.** El borde rojo que JAWS dibuja alrededor del elemento leído se extiende verticalmente para acomodar todas esas "líneas" de una palabra, creando un rectángulo alto y estrecho que se superpone con otros elementos de la página.

`white-space: nowrap` fuerza todo el texto en una sola línea lógica. El desbordamiento ya lo gestiona `overflow: hidden` y `clip-path`.

## `:not(:focus):not(:active)`

El selector completo incluye dos negaciones que anulan todo el ocultamiento cuando el elemento recibe foco.

¿Por qué? Piensa en un skip link: "Ir al contenido principal". Ese enlace debe ser invisible por defecto, pero cuando un usuario de teclado presiona Tab y el enlace recibe foco, **tiene que hacerse visible**. Un usuario con visión que navega con teclado necesita ver dónde está el foco.

Si el skip link es invisible incluso con foco, el usuario presiona Tab, no ve nada, presiona Enter sin saber qué va a pasar, y la experiencia se rompe. Es peor que no tener skip link.

La adición de `:not(:active)` es un matiz para Safari. En Safari, al hacer clic en un elemento, este pierde momentáneamente el estado `:focus` durante el estado `:active`. Sin esta negación, el elemento parpadearía — visible durante el foco, invisible durante el click, visible de nuevo. El `:not(:active)` lo mantiene visible durante toda la interacción.

## El caso estrella: "Ir al contenido principal"

He mencionado los skip links varias veces, pero merece la pena detenerse en por qué existen.

Cuando un usuario de lector de pantalla o de teclado llega a una página, lo primero que encuentra es la navegación: logo, menú principal, enlaces secundarios, quizá un buscador. En un sitio con una cabecera compleja, pueden ser 20 o 30 tabulaciones antes de llegar al contenido real. En cada página. Imagina tener que cruzar el mismo pasillo de 30 puertas cada vez que entras en una habitación.

Un skip link es un atajo: el primer elemento focusable de la página, antes incluso de la navegación, que enlaza directamente al contenido principal:

```html
<body>
  <a href="#contenido" class="visually-hidden">
    Ir al contenido principal
  </a>
  <header>...</header>
  <main id="contenido">
    ...
  </main>
</body>
```

Para un usuario con visión que usa ratón, este enlace no existe — está oculto con `.visually-hidden`. Pero para un usuario de teclado, aparece en la primera pulsación de Tab. Y para un usuario de lector de pantalla, es lo primero que escucha.

### Darle estilo al foco

Que el enlace se haga visible con `:not(:focus)` es solo la mitad del trabajo. Si al recibir foco simplemente "aparece" con los estilos por defecto del navegador, el resultado es un texto sin contexto flotando en algún rincón de la página. Necesita estilos propios que lo hagan reconocible:

```css
.visually-hidden:focus {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 9999;
  padding: 0.75rem 1.5rem;
  background: var(--color-fondo, #1a1a1a);
  color: var(--color-texto, #ffffff);
  font-size: 1rem;
  font-weight: 600;
  text-decoration: none;
  border-radius: 0.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  outline: 2px solid currentColor;
  outline-offset: 2px;
  width: auto;
  height: auto;
  overflow: visible;
  clip-path: none;
  white-space: normal;
}
```

Hay varios detalles que importan:

- **`position: fixed` con coordenadas explícitas** — lo coloca en una posición predecible, siempre visible, independientemente del scroll.
- **Contraste alto** — fondo oscuro con texto claro (o al revés). El usuario necesita verlo inmediatamente.
- **`outline` visible** — refuerza que el elemento tiene foco. Nunca quites el outline sin dar una alternativa.
- **Resetear las propiedades de ocultamiento** — `width: auto`, `height: auto`, `clip-path: none`, `overflow: visible` y `white-space: normal` deshacen explícitamente cada propiedad del patrón `.visually-hidden`. Si no las reseteas, el elemento sigue recortado o limitado a 1×1 píxeles aunque tenga foco.

El skip link es probablemente la mejora de accesibilidad con mejor relación esfuerzo-impacto que puedes implementar. Unas pocas líneas de HTML y CSS, y la experiencia de navegación con teclado mejora drásticamente.

## Un hack robusto sigue siendo un hack

James Edwards, el autor del [análisis original en Vispero](https://vispero.com/resources/the-anatomy-of-visually-hidden/), lo describe perfectamente: es "un hack robusto y probado". Y tiene razón. Cada una de estas propiedades existe para parchear un caso límite de un navegador o un lector de pantalla específico.

No hay una forma nativa de decirle al navegador "este contenido es solo para lectores de pantalla". Tenemos `aria-label` y `aria-labelledby` para algunos casos, pero para bloques de texto más largos o skip links, seguimos necesitando este truco CSS.

Lo ideal sería algo como un valor nativo — un hipotético `content-visibility: assistive-only` o similar — que declare la intención directamente en vez de simular el efecto con seis propiedades. Pero mientras ese día llega, `.visually-hidden` cumple su función.

## Llévate esto

Si mantienes un archivo de utilidades CSS, asegúrate de que tu `.visually-hidden` incluye las seis propiedades. No recortes. No "simplifiques". Cada línea está ahí por una razón, probada en campo durante años por la comunidad de accesibilidad.

Y la próxima vez que alguien te diga que la accesibilidad web es fácil, enséñale que necesitamos seis propiedades CSS y dos pseudo-clases negadas solo para ocultar un texto de forma inclusiva.
