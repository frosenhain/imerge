# Imerge Corporate Center — Secuencia fotográfica del hero

**Fecha:** 2026-08-23  
**Estado:** aprobado

## Objetivo

Transformar la imagen principal de la home en una secuencia editorial de fotos reales extraídas del video del salón.

## Comportamiento

- Seis fotogramas del video se mostrarán en el hero.
- La secuencia cambiará cada seis segundos con un fundido largo.
- Cada fotograma tendrá paneo o zoom lento para sugerir un clip fotográfico.
- La primera imagen conservará el acceso inmersivo actual para evitar un salto inicial.
- No habrá controles, carrusel ni video automático.

## Accesibilidad y rendimiento

- Con `prefers-reduced-motion`, el hero mantendrá únicamente la primera imagen estática.
- Las seis imágenes serán archivos optimizados locales y se compondrán con opacidad y transformaciones CSS.

## Verificación

- Confirmar que la secuencia avanza cada seis segundos.
- Confirmar transiciones suaves sin cambio brusco de texto.
- Validar la preferencia de movimiento reducido y el build de producción.
