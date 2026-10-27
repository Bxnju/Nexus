# Workshop de 90 minutos

La demo es contexto visual; los equipos no dependen de este código para resolver los ejercicios. Cada decisión debe incluir alternativas, riesgos y una validación observable.

1. **Federation:** elegir Native Federation o build-time federation con compatibilidad Angular 21.
2. **Contratos:** definir cómo evolucionar `AccountChangedEvent` sin romper remotes viejos.
3. **Orquestación:** decidir si el registro JSON debe ser estático, remoto o versionado.
4. **Aislamiento:** comparar montaje directo federado, Web Components e iframe ante un remote caído.
5. **Seguridad:** diseñar validación de contratos, endpoints permitidos y límites de origen para una futura comunicación entre ventanas.
6. **Procesos:** resolver cómo detectar servicios externos sin matar procesos ajenos en Windows.
7. **Configuración:** proponer feature flags por portal y estrategia de auditoría.
8. **Observabilidad:** elegir métricas, health checks y correlación de eventos.
9. **Datos:** decidir qué datos puede compartir el contexto y qué debe permanecer local.
10. **Entrega:** definir cómo sincronizar remotes independientes sin sobrescribir cambios locales.

Para cada punto: 5 minutos de análisis, 3 de comparación, 1 de defensa y 1 de criterio de prueba. Reservar los últimos 15 minutos para contrastar decisiones con el panel de WorkspaceHub.
