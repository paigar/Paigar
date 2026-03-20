---
title: "Desplegar webs estáticas: opciones reales para 2025"
description: "Comparación práctica de las plataformas de hosting para sitios estáticos. De Netlify a Bunny CDN, pasando por StaticHost.eu — mi recorrido y dónde he terminado."
date: 2025-09-28
tags:
  - eleventy
  - hosting
  - herramientas
destacado: false
---

Una de las grandes ventajas de las webs estáticas es la simplicidad del despliegue. No necesitas configurar servidores, bases de datos ni entornos de ejecución. Son ficheros HTML, CSS y JavaScript que cualquier servidor web puede servir. Pero "cualquier servidor" no significa que todas las opciones sean iguales.

Después de probar varias plataformas para mis proyectos con Eleventy, estas son mis conclusiones. No es una lista teórica — es un recorrido por las que he usado realmente y por qué he acabado donde he acabado.

## Netlify

Fue pionera en popularizar el hosting estático con builds automáticos. Conectas un repositorio Git, configuras el comando de build (`npx eleventy`), y cada push despliega automáticamente. Durante años fue la referencia del sector, y con razón.

**Lo bueno**: Configuración trivial, previews de PR, redirects con `_redirects`, formularios nativos, functions serverless. El plan gratuito es generoso (100GB de ancho de banda, 300 minutos de build).

**Lo malo**: Los builds pueden ser lentos (arrancar el entorno lleva más que el build en sí). El CDN no es tan rápido como el de Cloudflare. Y las funciones serverless añaden complejidad que contradice la filosofía del sitio estático. Con el tiempo, la plataforma ha ido creciendo en funcionalidades hasta convertirse en algo que ya no se siente tan simple.

Yo usé Netlify durante una buena temporada. Cumple, pero llegó un momento en que busqué alternativas que se ajustaran mejor a mi forma de trabajar.

**Ideal para**: proyectos con formularios, funciones serverless o equipos que necesitan previews de PR.

## Cloudflare Pages

Es más reciente que Netlify pero la infraestructura de CDN de Cloudflare es difícil de superar. Para quien ya está en el ecosistema Cloudflare (DNS, protección DDoS), la integración es natural.

**Lo bueno**: CDN global rapidísimo, builds razonablemente rápidos, plan gratuito sin límites prácticos de ancho de banda (ilimitado), integración con el ecosistema Cloudflare (DNS, protección DDoS, analytics server-side).

**Lo malo**: Menos funcionalidades "de conveniencia" que Netlify. No tiene formularios nativos ni redirects con fichero de texto (usa `_headers` y `_redirects`, pero con limitaciones). La documentación es menos madura.

La he probado para algunas pruebas puntuales, poco más. Funciona bien, pero no me ha dado motivos para adoptarla como opción principal.

**Ideal para**: proyectos donde el rendimiento de entrega es prioritario y ya estás en el ecosistema Cloudflare.

## StaticHost.eu

Una alternativa europea que merece atención. [StaticHost](https://statichost.eu) es un servicio de hosting pensado específicamente para webs estáticas, con una filosofía que me atrae: simplicidad, transparencia y servidores en Europa.

**Lo bueno**: Filosofía alineada con la web estática (sin funciones serverless, sin complejidad innecesaria). Precios claros. Servidores europeos. Soporte cercano — cuando hay un problema, hablas con personas, no con un chatbot. El proyecto avanza con paso firme y cada actualización demuestra que hay un criterio detrás.

**Lo malo**: Al ser un servicio más joven, todavía tiene algunas limitaciones técnicas. Nada que impida alojar un sitio estático, pero las opciones de configuración avanzada no están al nivel de los grandes. Es un servicio en crecimiento, y eso implica que no todo está pulido aún.

Me gusta lo que están construyendo. Es el tipo de servicio que quieres que funcione, porque representa una alternativa real a los gigantes estadounidenses.

**Ideal para**: proyectos estáticos que valoren privacidad, servidores europeos y un servicio con filosofía clara.

## Bunny CDN

Y aquí es donde he acabado. [Bunny CDN](https://bunny.net) es, técnicamente, una CDN — no una plataforma de hosting estático al uso. Pero su servicio de Storage + Pull Zone funciona perfectamente como hosting para webs estáticas, y con una flexibilidad que las plataformas especializadas no ofrecen.

**Lo bueno**: Red global de servidores rápida y fiable. Puedo subir ficheros por FTP, usar su API, o automatizar el despliegue desde GitHub con Actions — cada proyecto puede usar el flujo que más le convenga. El panel de control es claro y sin artificios. Los precios son de pago por uso real, sin sorpresas. Y lo que más me convence: puedo agrupar todos mis proyectos en un mismo proveedor con un mismo flujo de trabajo.

**Lo malo**: No es "conectar repositorio y olvidarse" como Netlify o Cloudflare Pages. Hay que configurar el storage, la pull zone, los headers, el certificado SSL. No es difícil, pero es trabajo que en otras plataformas viene hecho. Tampoco tiene builds automáticos — tú haces el build y subes el resultado.

Para mí, esa "desventaja" es parte del atractivo. Quiero controlar el proceso de despliegue, no delegarlo en una caja negra.

**Ideal para**: desarrolladores que quieren flexibilidad real, múltiples vías de despliegue y una CDN de verdad detrás del hosting.

## GitHub Pages

La opción gratuita más simple. Sin build automático (necesitas GitHub Actions o hacer el build local), pero para proyectos personales es difícil de superar en simplicidad.

**Lo bueno**: Gratis, integrado con GitHub, sin configuración si usas Jekyll. Con un GitHub Action de unas pocas líneas puedes desplegar Eleventy sin problemas.

**Lo malo**: Sin CDN propio (aunque puedes poner Cloudflare delante), dominio personalizado con HTTPS requiere configuración manual, sin headers personalizables.

**Ideal para**: proyectos personales, documentación de repositorios, webs de organizaciones de GitHub.

## Un servidor propio (VPS)

Para quien quiere control total. Un VPS barato (5-10€/mes) con Nginx sirviendo ficheros estáticos es la opción más controlable.

**Lo bueno**: Control absoluto sobre headers, redirects, configuración del servidor, logs. Sin límites artificiales de ningún plan. Puedes alojar múltiples sitios.

**Lo malo**: Tú te encargas de todo: actualizaciones de seguridad, certificados SSL (Let's Encrypt lo automatiza, pero hay que configurarlo), backups, monitorización. Si el servidor cae, es tu problema.

**Ideal para**: desarrolladores que quieren control total y no les importa la administración de sistemas.

## FTP a un hosting compartido

Sí, sigue existiendo. Y para un sitio estático, funciona perfectamente. Generas el build local, subes por FTP, listo.

**Lo bueno**: Funciona con cualquier hosting. No necesitas Git, ni CI/CD, ni cuenta en ningún servicio. Si ya tienes hosting para otra cosa, no cuesta nada adicional.

**Lo malo**: Despliegue manual (o script que automatices tú). Sin previews, sin rollbacks fáciles, sin builds automáticos.

**Ideal para**: proyectos donde ya tienes un hosting contratado y no quieres añadir otra plataforma.

## Mi recorrido y dónde he acabado

Mi camino ha sido: Netlify → StaticHost → Bunny CDN. Cada salto tenía un motivo.

De Netlify me fui porque quería algo más simple y más alineado con mi forma de trabajar. StaticHost me atrajo por su filosofía — un servicio europeo, pensado para webs estáticas, sin artificios. Me gusta mucho lo que están haciendo y sigo su evolución con interés.

Pero al final me decanté por Bunny CDN por una razón práctica: flexibilidad. Puedo subir ficheros por FTP cuando estoy haciendo pruebas rápidas, usar su API para scripts de despliegue, o configurar GitHub Actions para proyectos donde quiero automatización completa. Cada proyecto elige su flujo. Y al final, por comodidad, estoy agrupando todos los proyectos en un mismo proveedor. Este sitio y Bilbonauta están en Bunny.

No es la solución para todo el mundo. Si lo que buscas es conectar un repositorio y olvidarte, Netlify o Cloudflare Pages siguen siendo opciones excelentes. Pero si prefieres entender y controlar cada paso del despliegue, Bunny merece que le eches un vistazo.

Lo importante no es qué plataforma elijas, sino entender que para un sitio estático, el hosting es un problema resuelto. No dejes que la decisión de dónde alojar te retrase. Pon los ficheros en cualquier servidor y ocúpate de lo que importa: el contenido.
