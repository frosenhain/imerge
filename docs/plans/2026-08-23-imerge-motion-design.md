# Imerge Corporate Center — Movimiento visual

**Fecha:** 2026-08-23  
**Estado:** aprobado

## Dirección

Movimiento cinematográfico, continuo y sutil para reforzar el carácter tecnológico-premium de Imerge sin competir con la información ni con el llamado a consultar disponibilidad.

## Comportamiento

- El hero realizará un paneo horizontal lento con un zoom mínimo en loop.
- Las imágenes de los espacios entrarán mediante una transición de opacidad y desplazamiento al aparecer en pantalla.
- Cada imagen tendrá una respiración muy sutil, sin carruseles ni cambios de imagen automáticos.
- La interacción hover conserva un acercamiento leve para escritorio.

## Accesibilidad y rendimiento

- Se respetará `prefers-reduced-motion`, desactivando las animaciones para personas que lo soliciten.
- Las animaciones se implementarán con `transform` y `opacity`, propiedades adecuadas para composición eficiente.
- La animación de entrada se activará con `IntersectionObserver`; no se incorporan dependencias externas.

## Verificación

- Confirmar que el hero y los tres espacios animan en una sesión normal.
- Confirmar que con movimiento reducido no hay animación.
- Validar el build de producción.
