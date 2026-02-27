---
title: "Marco de Decisión - Autonomía vs Gobernanza"
version: "1.0"
lastUpdated: "2026-02-26"
---

# Marco de Decisión: Equilibrio entre Autonomía y Gobernanza

## Filosofía Central

La autonomía y la gobernanza no son fuerzas opuestas, sino complementarias cuando se diseñan correctamente. Este marco establece límites claros entre lo no negociable (por seguridad, cumplimiento y sostenibilidad organizacional) y lo flexible (para permitir innovación y adaptación a contextos específicos).

## Áreas No Negociables

### 1. Seguridad y Cumplimiento

**Área**: Controles de seguridad fundamentales
**Rationale**: La seguridad es responsabilidad compartida pero no negociable. Una brecha afecta a toda la organización.

**Políticas Específicas**:
- Encriptación TLS 1.3+ para todo tráfico en tránsito
- Encriptación AES-256 para datos en reposo
- MFA obligatorio para acceso a producción
- Rotación de credenciales cada 90 días máximo
- Escaneo de vulnerabilidades en todas las imágenes de contenedor
- Políticas de IAM con mínimo privilegio
- Logs de auditoría completos con retención de 2 años

**Enforcement**:
- Validación automática en pipelines de CI/CD
- Bloqueo de despliegues que no cumplan
- Alertas automáticas a equipo de seguridad
- Scorecards públicos de cumplimiento

**Consecuencias de Incumplimiento**:
- Bloqueo automático de despliegue
- Escalación a CISO si se intenta bypass
- Revisión de accesos del equipo

### 2. Observabilidad Básica

**Área**: Capacidades mínimas de monitoreo y debugging
**Rationale**: Sin observabilidad, no hay capacidad de respuesta ante incidentes ni mejora continua.

**Políticas Específicas**:
- Métricas RED (Rate, Errors, Duration) instrumentadas
- Logs estructurados en formato JSON
- Health checks (liveness y readiness) configurados
- Distributed tracing para servicios críticos
- Alertas configuradas para errores críticos
- Dashboards básicos de servicio

**Enforcement**:
- Templates incluyen observabilidad por defecto
- Validación en scorecards de madurez
- Revisión en post-mortems de incidentes

**Consecuencias de Incumplimiento**:
- Penalización en scorecard de madurez
- Servicio no elegible para producción crítica
- Soporte de plataforma limitado


### 3. Ownership y Responsabilidad

**Área**: Claridad de ownership y accountability
**Rationale**: Equipos autónomos requieren ownership claro para escalar efectivamente.

**Políticas Específicas**:
- Todo servicio debe tener equipo owner identificado
- Contactos de escalación (primario y secundario) actualizados
- SLAs documentados para servicios de producción
- Participación en rotación de on-call para servicios críticos
- Documentación mínima de arquitectura y runbooks

**Enforcement**:
- Catálogo de Backstage requiere metadata de ownership
- Alertas automáticas si metadata desactualizada (>30 días)
- Revisión trimestral de ownership

**Consecuencias de Incumplimiento**:
- Servicio marcado como "huérfano" en catálogo
- Escalación a management para asignación de owner
- Posible deprecación si no se asigna owner

### 4. Gestión de Costos

**Área**: Visibilidad y control básico de costos
**Rationale**: Autonomía sin consciencia de costos lleva a desperdicio insostenible.

**Políticas Específicas**:
- Tagging obligatorio de recursos AWS (owner, environment, cost-center)
- Presupuestos definidos por equipo/proyecto
- Alertas de anomalías de costos configuradas
- Revisión mensual de costos por equipo
- Justificación de recursos costosos (>$5k/mes)

**Enforcement**:
- Terraform modules incluyen tagging por defecto
- Dashboards de costos por equipo en Backstage
- Alertas automáticas en anomalías >20%

**Consecuencias de Incumplimiento**:
- Revisión de costos con FinOps
- Posible congelamiento de nuevos recursos
- Escalación a VP si costos fuera de control

---

## Áreas Flexibles

### 1. Stack Tecnológico

**Área**: Selección de lenguajes, frameworks y herramientas
**Rationale**: Diferentes problemas requieren diferentes herramientas. Imponer un stack único limita innovación y atracción de talento.

**Flexibilidad Permitida**:
- Equipos pueden elegir lenguajes de programación
- Libertad para seleccionar frameworks y librerías
- Experimentación con nuevas tecnologías
- Adopción de paradigmas (OOP, funcional, reactivo)

**Guardrails**:
- Tecnología debe tener comunidad activa y soporte
- Equipo debe demostrar expertise o plan de capacitación
- Consideraciones de seguridad y mantenimiento documentadas
- Evaluación de costos de licenciamiento si aplica
- No introducir tecnologías con vulnerabilidades conocidas críticas

**Proceso de Decisión**:
1. Equipo documenta propuesta con justificación
2. Revisión por arquitectura si es tecnología nueva en org
3. Aprobación automática si cumple guardrails
4. Compartir aprendizajes con otros equipos

**Alternatives**:
- Si tecnología no cumple guardrails, plataforma puede ofrecer alternativas
- Path de adopción con mitigación de riesgos
- Prueba de concepto limitada antes de adopción completa

### 2. Arquitectura de Aplicación

**Área**: Patrones arquitectónicos y diseño de sistemas
**Rationale**: Microservicios, monolitos, serverless - cada patrón tiene trade-offs válidos según contexto.

**Flexibilidad Permitida**:
- Equipos deciden arquitectura según necesidades
- Patrones híbridos permitidos
- Refactoring y evolución arquitectónica apoyados
- Decisiones de particionamiento de servicios

**Guardrails**:
- Arquitectura debe ser documentada y justificada
- Interfaces públicas deben seguir estándares de API
- Consideraciones de escalabilidad evaluadas
- Plan de resiliencia y manejo de fallos
- Impacto en otros equipos considerado

**Proceso de Decisión**:
1. Documento de diseño arquitectónico (ADR)
2. Revisión por pares dentro del equipo
3. Presentación a comité de arquitectura si impacto multi-equipo
4. Iteración basada en feedback

**Alternatives**:
- Consultoría de arquitectura disponible
- Patrones de referencia como guías (no imposiciones)
- Revisiones arquitectónicas opcionales


### 3. Proceso de Desarrollo

**Área**: Metodologías, ceremonias y herramientas de gestión
**Rationale**: Equipos maduros pueden optimizar sus procesos internos mejor que imposiciones top-down.

**Flexibilidad Permitida**:
- Metodologías ágiles adaptadas por equipo (Scrum, Kanban, híbrido)
- Frecuencia de releases decidida por equipo
- Herramientas de gestión de proyecto a elección
- Estructura de reuniones y ceremonias
- Definición de "done" por equipo

**Guardrails**:
- Cambios en producción deben ser rastreables
- Proceso de code review requerido (mínimo 1 aprobación)
- Métricas de calidad monitoreadas (cobertura, bugs)
- Retrospectivas regulares (mínimo trimestrales)
- Documentación de decisiones importantes

**Proceso de Decisión**:
- Decisión interna del equipo
- Compartir prácticas exitosas en comunidades de práctica
- Experimentación y ajuste continuo

**Alternatives**:
- Coaching ágil disponible si equipo lo solicita
- Benchmarking con otros equipos
- Comunidades de práctica para compartir aprendizajes

### 4. Estrategia de Testing

**Área**: Tipos de tests, cobertura y herramientas
**Rationale**: Contexto del servicio determina estrategia óptima de testing.

**Flexibilidad Permitida**:
- Niveles de cobertura de tests definidos por equipo
- Tipos de tests priorizados según riesgo
- Herramientas de testing a elección
- Estrategia de tests en ambientes (staging, canary, etc.)

**Guardrails**:
- Tests automatizados en CI/CD obligatorios
- Tests críticos de regresión identificados
- Estrategia de rollback definida
- Tests de performance para servicios críticos

**Proceso de Decisión**:
- Equipo define estrategia en documento de testing
- Revisión en post-mortems si incidentes relacionados
- Ajuste continuo basado en incidentes

**Alternatives**:
- Consultoría de QA disponible
- Herramientas de testing recomendadas (no obligatorias)
- Compartir estrategias exitosas

### 5. Estrategia de Datos

**Área**: Selección de bases de datos y modelado
**Rationale**: Diferentes casos de uso requieren diferentes soluciones de persistencia.

**Flexibilidad Permitida**:
- Selección de tipo de base de datos (SQL, NoSQL, grafo, etc.)
- Modelado de datos según necesidades
- Estrategias de caché
- Particionamiento y sharding

**Guardrails**:
- Backups automatizados configurados
- Encriptación en reposo habilitada
- Plan de disaster recovery documentado
- Consideraciones de GDPR/privacidad evaluadas
- Costos de almacenamiento monitoreados

**Proceso de Decisión**:
1. Documento de diseño de datos
2. Evaluación de trade-offs (consistencia, disponibilidad, costos)
3. Revisión por DBA si base de datos nueva en org
4. Aprobación automática si cumple guardrails

**Alternatives**:
- Consultoría de arquitectura de datos disponible
- Bases de datos managed recomendadas para reducir overhead
- Patrones de referencia para casos comunes

---

## Proceso de Excepciones

### Cuándo Solicitar Excepción

Una excepción es necesaria cuando:
- Requisito de negocio urgente conflictúa con política no negociable
- Contexto específico hace política no aplicable o contraproducente
- Tecnología legacy requiere tiempo para cumplir con estándar
- Innovación requiere experimentación fuera de guardrails

### Proceso de Solicitud

1. **Documentación**:
   - Descripción de la excepción solicitada
   - Justificación de negocio o técnica
   - Análisis de riesgos y mitigaciones propuestas
   - Duración de la excepción (temporal vs permanente)
   - Plan de remediación si es temporal

2. **Revisión**:
   - Excepciones de bajo riesgo: Líder de Plataforma (SLA: 24 horas)
   - Excepciones de riesgo medio: Comité de Arquitectura (SLA: 3 días)
   - Excepciones de alto riesgo: Liderazgo Ejecutivo (SLA: 1 semana)

3. **Aprobación**:
   - Aprobación documentada con condiciones
   - Fecha de expiración si es temporal
   - Revisión periódica programada

4. **Seguimiento**:
   - Excepciones registradas en Backstage
   - Alertas antes de expiración
   - Revisión trimestral de todas las excepciones activas

### Criterios de Evaluación

- **Impacto de Negocio**: ¿Cuál es el costo de no aprobar?
- **Riesgo Técnico**: ¿Qué puede salir mal?
- **Riesgo de Seguridad**: ¿Aumenta superficie de ataque?
- **Precedente**: ¿Abrirá compuertas para más excepciones?
- **Alternativas**: ¿Hay otra forma de lograr el objetivo?
- **Temporalidad**: ¿Es realmente temporal o permanente disfrazado?

### Ejemplos de Excepciones Aprobadas

**Caso 1: Servicio Legacy en Migración**
- **Excepción**: No cumple con estándares de observabilidad
- **Justificación**: Servicio legacy en proceso de reescritura
- **Duración**: 6 meses
- **Condiciones**: Plan de migración documentado, revisión mensual de progreso
- **Resultado**: Aprobada con condiciones

**Caso 2: Experimento de ML con GPU**
- **Excepción**: Uso de instancias GPU costosas sin presupuesto pre-aprobado
- **Justificación**: Prueba de concepto de modelo de ML crítico para negocio
- **Duración**: 1 mes
- **Condiciones**: Límite de $2k, métricas de éxito definidas, apagado automático
- **Resultado**: Aprobada con límites

### Ejemplos de Excepciones Rechazadas

**Caso 1: Desactivar MFA por "Inconveniencia"**
- **Excepción**: Desactivar MFA para acceso a producción
- **Justificación**: "Es molesto y ralentiza el trabajo"
- **Resultado**: Rechazada - Seguridad no negociable, alternativas ofrecidas (SSO, hardware keys)

**Caso 2: Despliegue sin Code Review**
- **Excepción**: Saltarse code review por urgencia
- **Justificación**: "Hotfix crítico, no hay tiempo"
- **Resultado**: Rechazada - Code review post-deploy requerido, proceso de hotfix mejorado

---

## Resolución de Conflictos

### Escenario: Conflicto entre Seguridad y Velocidad

**Situación**: Equipo de producto necesita desplegar feature urgente pero no pasa validación de seguridad.

**Proceso**:
1. **Entender el Contexto**: ¿Por qué es urgente? ¿Cuál es el riesgo real?
2. **Evaluar Alternativas**: ¿Hay forma de mitigar riesgo sin bloquear?
3. **Negociar Solución**: Feature flag, despliegue limitado, monitoreo intensivo
4. **Decisión Documentada**: Quién decidió, por qué, con qué condiciones
5. **Retrospectiva**: ¿Cómo evitar este conflicto en el futuro?

**Principios de Resolución**:
- Empatía con ambas perspectivas
- Buscar soluciones creativas (no solo sí/no)
- Documentar decisión y aprendizajes
- Mejorar proceso para prevenir recurrencia

### Escenario: Conflicto entre Equipos

**Situación**: Equipo A necesita cambio en API de Equipo B, pero B tiene otras prioridades.

**Proceso**:
1. **Facilitación**: Líder de Plataforma facilita conversación
2. **Entender Impacto**: ¿Qué bloquea? ¿Cuál es el costo de esperar?
3. **Explorar Opciones**: ¿Puede A hacer workaround temporal? ¿Puede B priorizar?
4. **Escalación si Necesario**: Comité de Arquitectura o management
5. **Acuerdo Documentado**: Timelines, compromisos, seguimiento

**Principios de Resolución**:
- No hay "culpables", solo prioridades diferentes
- Buscar win-win cuando sea posible
- Escalación es herramienta, no fracaso
- Aprender y mejorar coordinación

---

## Evolución del Marco

Este marco de decisión es un documento vivo que debe evolucionar con la organización.

**Revisión Trimestral**:
- Análisis de excepciones solicitadas y aprobadas
- Identificación de patrones (¿muchas excepciones en un área?)
- Ajuste de políticas si es necesario
- Incorporación de aprendizajes

**Métricas de Salud del Marco**:
- Tasa de excepciones solicitadas vs aprobadas
- Tiempo promedio de resolución de excepciones
- Satisfacción de equipos con el proceso
- Incidentes relacionados con excepciones

**Señales de que el Marco Necesita Ajuste**:
- Muchas excepciones en la misma área (política muy restrictiva)
- Pocas excepciones pero muchos incidentes (políticas muy laxas)
- Frustración generalizada con el proceso
- Equipos evitando el proceso oficial (shadow IT)
