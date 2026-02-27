# Contenido del Reto Técnico - Liderazgo en Ingeniería de Plataforma

Este directorio contiene los archivos Markdown que alimentan la aplicación web de visualización del roadmap.

## Estructura de Archivos

### `roadmap.md`
Documento principal que contiene:
- Resumen ejecutivo
- Fases del proyecto (Fase 1, 2, 3)
- Capacidades a entregar por fase
- Criterios de transición entre fases
- Dependencias
- Indicadores de éxito
- Acciones para abordar a las personas
- Arquitectura de largo plazo
- Gestión de riesgos

**Formato esperado por el parser**:
```markdown
## Fase N: Nombre de la Fase
**ID**: phase-n
**Estado**: not_started | in_progress | completed | blocked
**Duración estimada**: X meses

### Capacidades a Entregar
#### CAP-N.M: Nombre de la Capacidad
**Prioridad**: critical | high | medium | low
**Estado**: planned | in_progress | completed | deferred
**Descripción**: ...
**Entregables**: ...
**Esfuerzo estimado**: ...
**Dependencias**: ...
```

### `decision-framework.md`
Marco de decisión que define:
- Áreas no negociables (seguridad, observabilidad, ownership, costos)
- Áreas flexibles (stack tecnológico, arquitectura, procesos)
- Guardrails para áreas flexibles
- Proceso de excepciones
- Resolución de conflictos

**Formato esperado**:
```markdown
### N. Nombre del Área
**Área**: Descripción breve
**Rationale**: Por qué es importante
**Políticas Específicas**: Lista de políticas
**Enforcement**: Cómo se aplica
```

### Archivos Adicionales (Opcionales)

Puedes crear archivos adicionales para organizar mejor el contenido:
- `success-metrics.md` - Indicadores de éxito detallados
- `people-actions.md` - Acciones específicas para stakeholders
- `architecture.md` - Detalles arquitectónicos
- `risks.md` - Análisis de riesgos

## Cómo Actualizar el Contenido

1. **Edita los archivos `.md`** en este directorio
2. **Guarda los cambios**
3. **La aplicación web detectará automáticamente los cambios** (en desarrollo con file watcher)
4. **El roadmap se actualizará en tiempo real** en el navegador

## Formato Markdown Soportado

El parser soporta:
- Headers (`#`, `##`, `###`)
- Listas (`-`, `*`, `1.`)
- Énfasis (`**bold**`, `*italic*`)
- Links (`[text](url)`)
- Code blocks (` ``` `)
- Metadata en formato `**Key**: Value`
- Frontmatter YAML (`---`)

## Validación

El sistema validará automáticamente:
- Referencias entre fases y capacidades
- Dependencias circulares
- Orden secuencial de fases
- Completitud de criterios de transición
- Integridad referencial

## Ejemplo de Flujo de Trabajo

1. **Ajustar roadmap**: Edita `roadmap.md` para agregar nueva capacidad en Fase 2
2. **Actualizar decisiones**: Modifica `decision-framework.md` si hay nueva política
3. **Guardar cambios**: Los archivos se guardan en el sistema de archivos
4. **Ver en web**: Abre el navegador y ve los cambios reflejados automáticamente
5. **Presentar**: Usa la vista ejecutiva para presentar a stakeholders

## Notas Técnicas

- Los archivos deben estar en UTF-8
- Tamaño máximo recomendado: 10MB por archivo
- El parser es tolerante a errores (parseará lo que pueda)
- Los IDs deben ser únicos (phase-1, phase-2, CAP-1.1, etc.)
