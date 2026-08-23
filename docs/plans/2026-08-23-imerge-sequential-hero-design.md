# Imerge Corporate Center — Hero secuencial

**Fecha:** 2026-08-23  
**Estado:** aprobado

## Comportamiento

El hero mostrará una sola imagen activa en cada instante. Cada foto realizará un zoom/paneo durante seis segundos, se fundirá aproximadamente un segundo hacia la siguiente y el ciclo reiniciará el movimiento en la nueva imagen.

## Implementación

- React mantiene el índice de la única imagen activa.
- Un temporizador avanza el índice cada seis segundos.
- La transición se aplica únicamente entre la imagen actual y la siguiente; no habrá capas paralelas permanentes ni mosaicos.
- Con `prefers-reduced-motion`, permanece estática la primera imagen.

## Verificación

- Comprobar que se ve solo una foto durante la permanencia.
- Comprobar fundido y reinicio del zoom al cambiar.
- Ejecutar el build de producción.
