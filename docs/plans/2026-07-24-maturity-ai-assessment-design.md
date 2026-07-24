# Diseño: experiencia de madurez y adopción de AI

## Objetivo

Construir una demo local para una clase de maestría de la Universidad Torcuato Di Tella. La aplicación convierte un assessment de adopción de AI en una experiencia de exploración, discusión y presentación. Debe funcionar sin una fuente externa al principio y permitir reemplazar el dataset demostrativo por una planilla real más adelante.

## Alcance del MVP

El MVP incluirá un dataset simulado, scoring configurable, análisis descriptivo, segmentación segura, comparador de grupos, detección explicable de tensiones, asistente grounded local, modo clase, tres dinámicas participativas y un constructor básico de relato.

No incluye inicialmente autenticación, persistencia multiusuario, Google Sheets API, votación sincronizada ni llamadas a un modelo externo. Los límites de integración se diseñarán para incorporarlos sin reescribir las vistas ni los cálculos.

## Arquitectura

- Next.js con TypeScript y Tailwind CSS.
- Datos, configuración del assessment y lógica estadística en módulos independientes y testeables.
- Un único estado de exploración mantiene filtros, segmentos, modo de scoring y visualización activa. Tanto el modo libre como el modo clase consumen ese estado.
- Un adaptador de fuente de datos expone el dataset demostrativo. Adaptadores futuros importarán CSV/XLSX y Google Sheets y producirán el mismo modelo normalizado.
- Un adaptador de asistente local consulta funciones analíticas tipadas y produce respuestas en español con evidencia. Un adaptador de modelo generativo podrá reemplazarlo después.

## Modelo de datos

- `Assessment`: título, fecha de actualización, fuente, umbrales y configuración de privacidad.
- `Dimension` y `Question`: definición, escala, peso, dirección de puntuación y texto pedagógico.
- `Participant`: identificador anónimo y atributos de segmentación.
- `Response`: participante, pregunta, valor cuantitativo u observación abierta.
- `ScoringConfig`: normalización, preguntas excluidas, pesos y umbrales de etapas.
- `Finding` y `StoryItem`: hallazgos guardados y elementos de la narrativa de clase.
- `LiveActivity`: predicción, votación de hipótesis o priorización, inicialmente de alcance local.

La capa analítica no usa identificadores personales. Los segmentos de menos de cinco respuestas se suprimen o se agrupan en “Otros”.

## Navegación y experiencia

La portada muestra título, participantes, actualización, fuente y las dos entradas principales:

1. **Explorar libremente**: pulso general, radar, ranking, preguntas, heatmap, brechas, comparación y conversación con datos.
2. **Modo clase**: una secuencia de escenas para revelar información progresivamente, lanzar actividades, registrar hallazgos y avanzar hacia el cierre.

La aplicación conserva filtros, segmentos, modo de ponderación y hallazgos al alternar entre ambos recorridos. Una barra persistente permite volver a inicio, restaurar filtros y acceder al relato.

## Análisis y trazabilidad

El motor calcula promedio, mediana, dispersión, completitud y tamaño de muestra. Normaliza scores a 0–100 solo cuando la configuración está validada; de otro modo marca el índice como experimental.

Las contradicciones se detectan mediante reglas explícitas, por ejemplo estrategia alta con ejecución baja o alta experimentación con bajo gobierno. Cada tarjeta separa dato observado, interpretación posible e hipótesis de discusión; incluye preguntas fuente, brecha, muestra y precauciones.

El asistente local responde exclusivamente sobre resultados calculados. Cada respuesta muestra evidencia, preguntas/dimensiones analizadas, filtros activos, tamaño muestral y limitaciones. Si no hay soporte suficiente, indica que no encuentra evidencia disponible.

## Visualización y accesibilidad

La interfaz será clara, académica y de alto contraste, pensada para proyectores. Usará radar como resumen complementado por barras ordenables, distribuciones por pregunta y heatmap. Nunca ocultará tamaño muestral ni reemplazará la distribución por un único promedio. Tendrá modo claro/oscuro y una variante de presentación de tipografía grande.

## Validación

- Pruebas unitarias para normalización, inversión de escalas, supresión de segmentos y reglas de contradicción.
- Validación de tipos y lint.
- Prueba de compilación de producción.
- Revisión visual de las rutas clave y estados vacío/error usando datos demostrativos.

## Evolución prevista

La siguiente etapa agregará un asistente de importación CSV/XLSX/Google Sheets, mapeo flexible de columnas y persistencia de sesión y participación en vivo. Los contratos normalizados del dataset y del estado de exploración evitan acoplar las visualizaciones a encabezados específicos de una planilla.

## Importación por planilla pública

El MVP incorpora actualización manual desde una URL CSV pública de Google Sheets. El docente puede pegar la URL de exportación o una URL de edición pública; el servidor la normaliza a CSV, acepta únicamente hosts de Google Sheets y analiza los encabezados antes de entregar los datos al navegador.

La importación no mezcla datos reales y demostrativos: si se detectan columnas compatibles con una dimensión, se reemplaza el dataset activo y se identifica la fuente como “Planilla real”. Si la estructura no permite calcular al menos dos dimensiones, se conserva el dataset actual y se explica qué columnas deben mapearse. La URL se recuerda únicamente en el navegador hasta que exista una configuración persistente de sesión.

## Recorrido visual final

La visualización se limita a siete campos de la fuente: score general, nivel de madurez, estrategia y visión, gobernanza y CoE, datos y tecnología, talento y cultura, y adopción y escala. El modo principal es una secuencia de presentación con portada, resultado general, radar de cinco dimensiones, ranking de fortalezas y oportunidades, comparador seguro de segmentos y cierre de discusión. No se derivan ni se muestran otras dimensiones.

## Impacto en clase

El recorrido suma tres intervenciones pedagógicas: una predicción local antes de revelar el perfil, una escena de tensión que contrapone la dimensión relativa más fuerte y la oportunidad principal, y un narrador basado en los resultados visibles. El narrador distingue observación, importancia, límite interpretativo y pregunta de debate; no formula causalidad ni inventa evidencia.
