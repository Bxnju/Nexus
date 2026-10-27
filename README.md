# Nexus Platform Lab

Laboratorio local de arquitectura de software para demostrar una plataforma compuesta por dos Shells, un MFE orquestador y cinco Micro Frontends de negocio independientes.

> **Creador:** Andres Benjumea
> **Estado:** laboratorio local en evolución

Este documento concentra la información necesaria para instalar, ejecutar, comprobar, detener y mantener el proyecto. El alcance es técnico y arquitectónico; la interfaz visual se considera reemplazable y no forma parte de las decisiones descritas aquí.

---

## 1. Objetivo

Nexus Platform Lab permite demostrar:

- Separación entre Shells, orquestador y Micro Frontends.
- Carga y exposición de aplicaciones mediante Native Federation.
- Configuración distinta por portal.
- Comunicación desacoplada mediante contratos tipados y eventos.
- Detección de servicios saludables.
- Gestión segura de procesos en Windows.
- Recuperación de procesos caídos sin terminar procesos externos.
- Manejo de configuraciones y contratos versionados.

No requiere backend, Docker, servicios de pago ni credenciales privadas. Los datos utilizados son ficticios y locales.

---

## 2. Clonar y preparar el repositorio

```powershell
git clone <URL_DEL_REPOSITORIO> nexus-platform-lab
cd nexus-platform-lab
git pull --ff-only
npm ci
```

Si ya tienes una copia local, omite `git clone`. Usa `npm install` únicamente cuando necesites regenerar o actualizar el lockfile. No es necesario instalar Angular CLI globalmente.

---

## 3. Requisitos previos

El proyecto fue preparado para:

- Windows 11.
- PowerShell.
- Node.js `24.11.1`.
- npm `11.7.0`.
- Angular `21`.
- Angular CLI `21.2.27`.

La versión de Node también está indicada en [.nvmrc](C:/Users/bxnju/lab-microfrontends/.nvmrc).

Comprobar versiones:

```powershell
node --version
npm --version
npx ng version
```

Todos los comandos de este documento se ejecutan desde la raíz:

```powershell
cd C:\Users\bxnju\lab-microfrontends
```

---

## 4. Instalación

Desde la raíz del workspace:

```powershell
cd C:\Users\bxnju\lab-microfrontends
npm ci
```

La instalación utiliza [package.json](C:/Users/bxnju/lab-microfrontends/package.json) y [package-lock.json](C:/Users/bxnju/lab-microfrontends/package-lock.json).

No es necesario instalar Angular CLI globalmente. Se recomienda utilizar siempre `npx ng` o los scripts npm del proyecto.

---

## 5. Aplicaciones del workspace

| Identificador | Responsabilidad | Carpeta | Puerto |
|---|---|---|---:|
| `nexus-platform-lab` | CustomerPortal, Shell de clientes | `src/` | 4200 |
| `admin-portal` | AdminPortal, Shell administrativo | `projects/admin-portal/` | 4201 |
| `workspace-hub` | MFE orquestador | `projects/workspace-hub/` | 4202 |
| `account-switcher` | MFE de cambio de cuenta | `projects/account-switcher/` | 4203 |
| `investments` | MFE de inversiones | `projects/investments/` | 4204 |
| `documents` | MFE de documentos | `projects/documents/` | 4205 |
| `movements` | MFE de actividad y movimientos | `projects/movements/` | 4206 |
| `summary` | MFE de resumen financiero | `projects/summary/` | 4207 |

Cada aplicación tiene su propio `main.ts`, configuración Angular, código fuente y configuración de Federation. No son componentes agrupados artificialmente dentro de una única aplicación.

---

## 6. Estructura del proyecto

```text
nexus-platform-lab/
├── angular.json
├── package.json
├── package-lock.json
├── tsconfig.json
├── .nvmrc
├── README.md
│
├── src/                              # CustomerPortal
├── projects/
│   ├── admin-portal/                 # AdminPortal
│   ├── workspace-hub/                # Orquestador
│   ├── account-switcher/             # Remote de cuentas
│   ├── investments/                  # Remote de inversiones
│   ├── documents/                    # Remote de documentos
│   ├── movements/                    # Remote de movimientos
│   └── summary/                      # Remote de resumen
│
├── shared/
│   └── contracts/
│       └── src/index.ts              # Tipos y versión de contratos
│
├── config/
│   ├── mfe-registry.json             # Registro común de remotes
│   ├── portal-config.customer.json   # Configuración del portal cliente
│   └── portal-config.admin.json      # Configuración del portal admin
│
├── scripts/
│   ├── portal.js                     # Arranque por portal
│   ├── start-lab.js                 # Arranque completo
│   ├── status-lab.js                # Estado y health checks
│   ├── stop-lab.js                  # Detención segura
│   ├── sync-lab.js                  # Sincronización Git segura
│   ├── health-check.js              # Comprobación individual
│   └── lib/process-manager.js        # Gestión de procesos
│
├── docs/
│   ├── ARCHITECTURE.md
│   ├── COMMUNICATION.md
│   ├── RUNBOOK.md
│   └── WORKSHOP.md
│
└── .runtime/                        # Estado y logs locales, ignorado por Git
```

---

## 7. Comandos npm

Todos se ejecutan desde:

```powershell
cd C:\Users\bxnju\lab-microfrontends
```

### 7.1 Instalación

```powershell
npm ci
```

### 7.2 Portal de clientes

Inicia CustomerPortal y los servicios requeridos:

```powershell
npm run portal:cliente
```

URL:

```text
http://localhost:4200
```

### 7.3 Portal administrativo

Inicia AdminPortal y los servicios requeridos:

```powershell
npm run portal:admin
```

URL:

```text
http://localhost:4201
```

Los servicios compartidos se reutilizan si ya están activos y saludables.

### 7.4 Alias genérico

Estos comandos utilizan la misma lógica de `portal.js`:

```powershell
npm run portal -- cliente
npm run portal -- admin
```

### 7.5 Laboratorio completo

Inicia los dos Shells y todos los remotes:

```powershell
npm run lab:start
```

La operación es idempotente: si un proceso ya responde correctamente en el puerto esperado, no se inicia una segunda instancia.

### 7.6 Estado

```powershell
npm run lab:status
```

El resultado muestra:

- Identificador del servicio.
- Estado `READY` o `DOWN`.
- URL y puerto.
- Si el proceso fue administrado por el laboratorio.
- Si el servicio fue detectado como externo.

### 7.7 Detención

```powershell
npm run lab:stop
```

Solo detiene procesos registrados con `managed: true`. No finaliza todos los procesos `node.exe` del equipo y no termina servicios externos.

### 7.8 Sincronización Git

```powershell
npm run lab:sync -- C:\ruta\del\repositorio
```

Ejemplo:

```powershell
npm run lab:sync -- C:\Users\bxnju\repos\investments
```

El script:

1. Revisa `git status --porcelain`.
2. Detiene la actualización si hay cambios locales.
3. Ejecuta `git pull --ff-only` solo en un repositorio limpio.
4. No ejecuta `git reset --hard`.
5. No sobrescribe trabajo local silenciosamente.

Si se pasan varias rutas:

```powershell
npm run lab:sync -- C:\repos\workspace-hub C:\repos\documents
```

---

## 8. Ejecución recomendada

### Ejecutar ambos portales

Terminal 1:

```powershell
cd C:\Users\bxnju\lab-microfrontends
npm run portal:cliente
```

Terminal 2:

```powershell
cd C:\Users\bxnju\lab-microfrontends
npm run portal:admin
```

Comprobar desde una tercera terminal:

```powershell
cd C:\Users\bxnju\lab-microfrontends
npm run lab:status
```

### Ejecutar todo en una sola terminal

```powershell
cd C:\Users\bxnju\lab-microfrontends
npm run lab:start
npm run lab:status
```

### Detener el laboratorio

```powershell
cd C:\Users\bxnju\lab-microfrontends
npm run lab:stop
npm run lab:status
```

---

## 9. Ejecución individual de aplicaciones

También se puede ejecutar una aplicación directamente desde la raíz:

```powershell
npx ng serve nexus-platform-lab --port 4200
npx ng serve admin-portal --port 4201
npx ng serve workspace-hub --port 4202
npx ng serve account-switcher --port 4203
npx ng serve investments --port 4204
npx ng serve documents --port 4205
npx ng serve movements --port 4206
npx ng serve summary --port 4207
```

Para detener una ejecución directa, usar `Ctrl+C` en la terminal que la inició.

Se recomienda ejecutar desde la raíz y no desde las carpetas de cada aplicación, porque `angular.json` y las dependencias están centralizados en el workspace.

---

## 10. Module Federation

La solución utiliza:

- `@angular-architects/native-federation@21.2.6`.
- `@softarc/native-federation-node@3.3.4`.
- Exposición de `./Component` en los remotes.
- Exposición adicional de `./LatestMovements` en Movements.
- Carga runtime con `loadRemoteModule` y montaje con `NgComponentOutlet`.
- `remoteEntry.json` explícito para la composición anidada.
- Dependencias Angular compartidas como singletons.

Configuraciones:

- [federation.config.js](C:/Users/bxnju/lab-microfrontends/federation.config.js): CustomerPortal.
- [projects/admin-portal/federation.config.js](C:/Users/bxnju/lab-microfrontends/projects/admin-portal/federation.config.js): AdminPortal.
- [projects/workspace-hub/federation.config.js](C:/Users/bxnju/lab-microfrontends/projects/workspace-hub/federation.config.js): WorkspaceHub.
- Configuraciones equivalentes en cada remote.

Manifest de hosts:

- [public/federation.manifest.json](C:/Users/bxnju/lab-microfrontends/public/federation.manifest.json).
- [projects/admin-portal/public/federation.manifest.json](C:/Users/bxnju/lab-microfrontends/projects/admin-portal/public/federation.manifest.json).

El registro funcional está en [config/mfe-registry.json](C:/Users/bxnju/lab-microfrontends/config/mfe-registry.json). Sus puertos y URLs deben coincidir con las aplicaciones reales.

La cadena de composición es:

```text
Portal cliente/admin
  -> Workspace Hub
      -> Account Switcher, Summary, Movements, Investments, Documents
          -> Summary consume Movements/LatestMovements
```

No se usan iframes, `postMessage` ni Shadow DOM para la composición. Los manifests conservan endpoints para escenarios standalone; la cadena principal usa entradas remotas explícitas.

---

## 11. Configuración por portal

### CustomerPortal

Archivo:

[config/portal-config.customer.json](C:/Users/bxnju/lab-microfrontends/config/portal-config.customer.json)

Módulos habilitados:

- `account-switcher`
- `investments`
- `documents`
- `movements`
- `summary`

### AdminPortal

Archivo:

[config/portal-config.admin.json](C:/Users/bxnju/lab-microfrontends/config/portal-config.admin.json)

Módulos habilitados:

- `account-switcher`
- `documents`
- `movements`
- `summary`

Investments está disponible como remote del Workspace Hub, aunque no aparece como opción principal en la navegación administrativa.

---

## 12. Contratos y comunicación

Los contratos se encuentran en:

[shared/contracts/src/index.ts](C:/Users/bxnju/lab-microfrontends/shared/contracts/src/index.ts)

Incluyen:

- `PortalId`.
- `MfeId`.
- `PortalContext`.
- `Account`.
- `AccountChangedEvent`.
- `CommunicationContract`.
- `CONTRACT_VERSION`.

La versión actual del contrato es:

```text
1.0.0
```

Flujo:

1. AccountSwitcher selecciona una cuenta ficticia.
2. Emite un evento `account-changed`.
3. WorkspaceHub actúa como coordinador.
4. Investments recibe el contexto de cuenta.
5. Documents recibe el contexto de cuenta.
6. Cada MFE actualiza su propia información sin importar la implementación interna de otro MFE.

La implementación técnica utiliza `CustomEvent` en la misma ventana, porque los MFEs se montan como componentes Angular federados. No hay contextos aislados ni `postMessage`. La decisión está documentada en [docs/COMMUNICATION.md](C:/Users/bxnju/lab-microfrontends/docs/COMMUNICATION.md).

---

## 13. Health checks y gestión de procesos

Cada aplicación publica un archivo `/health` con:

- Identificador.
- Nombre del servicio.
- Estado.
- Puerto.

Antes de iniciar una aplicación, `process-manager.js`:

1. Consulta `http://localhost:<puerto>/health`.
2. Comprueba que la identidad coincida con el servicio esperado.
3. Reutiliza el proceso si responde correctamente.
4. Inicia una nueva instancia si no existe un servicio válido.
5. Guarda el PID y el estado en `.runtime/state.json`.
6. Espera hasta que el servicio esté listo.
7. Guarda la salida en `.runtime/logs/<servicio>.log`.

Archivos locales:

```text
.runtime/
├── state.json
└── logs/
    ├── customer-portal.log
    ├── admin-portal.log
    ├── workspace-hub.log
    ├── account-switcher.log
    ├── investments.log
    ├── documents.log
    ├── movements.log
    └── summary.log
```

`.runtime` está excluido de Git y no debe compartirse como parte del código fuente.

Para consultar los logs del laboratorio:

```powershell
npm run lab:logs -- cliente
npm run lab:logs -- admin --follow
npm run lab:logs -- workspace-hub --lines=120
```

El modo `--follow` mantiene la consola abierta y muestra nuevas líneas a medida que se escriben. También se puede usar `all` para ver todos los servicios.

---

## 14. Health check manual

Comprobar un servicio específico:

```powershell
node scripts/health-check.js 4202 workspace-hub
```

Código de salida:

- `0`: el servicio responde y tiene la identidad esperada.
- `1`: no responde, devuelve un payload inválido o la identidad no coincide.

Comprobar directamente desde PowerShell:

```powershell
Invoke-WebRequest http://localhost:4202/health -UseBasicParsing
```

---

## 15. Compilación

Compilar CustomerPortal:

```powershell
npm run build
```

Compilar en modo desarrollo:

```powershell
npm run build -- --configuration development
```

Compilar una aplicación concreta:

```powershell
npx ng build admin-portal
npx ng build workspace-hub
npx ng build account-switcher
npx ng build investments
npx ng build documents
```

Compilar todas las aplicaciones con un único comando:

```powershell
npm run build:all
```

También se puede compilar cada aplicación por separado:

```powershell
npx ng build nexus-platform-lab
npx ng build admin-portal
npx ng build workspace-hub
npx ng build account-switcher
npx ng build investments
npx ng build documents
npx ng build movements
npx ng build summary
```

Los artefactos se generan bajo `dist/`, que no debe incluirse en Git.

---

## 16. Tests y validaciones

Ejecutar los tests configurados:

```powershell
npm test
```

Alternativa:

```powershell
npx ng test
```

Validar sintaxis de los scripts Node:

```powershell
node --check scripts/lib/process-manager.js
node --check scripts/portal.js
node --check scripts/start-lab.js
node --check scripts/status-lab.js
node --check scripts/stop-lab.js
node --check scripts/sync-lab.js
```

Validación operativa recomendada:

```powershell
npm run lab:start
npm run lab:status
npm run lab:stop
npm run lab:status
```

---

## 17. Solución de problemas

### El puerto ya está ocupado

Consultar el proceso que usa un puerto:

```powershell
Get-NetTCPConnection -LocalPort 4202 -ErrorAction SilentlyContinue
```

El laboratorio no termina procesos externos automáticamente. Esto evita afectar otras aplicaciones Node.js del equipo.

### Un servicio aparece como `DOWN`

1. Consultar el estado:

   ```powershell
   npm run lab:status
   ```

2. Leer el log:

   ```powershell
   Get-Content .runtime\logs\workspace-hub.log -Tail 80
   ```

3. Ejecutar el health check:

   ```powershell
   node scripts/health-check.js 4202 workspace-hub
   ```

4. Reintentar:

   ```powershell
   npm run lab:start
   ```

### Existe un estado obsoleto

Si el proceso murió pero quedó registrado, ejecutar:

```powershell
npm run lab:status
npm run lab:start
```

El arranque comprueba la salud real antes de reutilizar el registro y actualiza el estado.

### El laboratorio no puede detener un proceso

No se debe terminar indiscriminadamente `node.exe`. Revisar `.runtime/state.json` y confirmar que el PID pertenece al proceso administrado. Los servicios externos deben detenerse desde la terminal o herramienta que los inició.

### Problemas de dependencias

Desde la raíz:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .angular -ErrorAction SilentlyContinue
npm ci
```

Este procedimiento reinstala exactamente las versiones del lockfile. Ejecutarlo solo si `npm install` no resuelve el problema.

### Problemas de Federation

Revisar:

- Que el remote esté activo en el puerto declarado.
- Que `config/mfe-registry.json` tenga la URL correcta.
- Que el manifest del host apunte a `workspace-hub`.
- Que `remoteEntry.json` exista en el servidor correspondiente.
- Que las versiones Angular sean compatibles.

La configuración Native Federation se compila correctamente. En desarrollo, cada remote conserva su propio servidor y proceso, pero la composición se realiza mediante montaje directo federado. Esta decisión y sus trade-offs están explicados en [docs/ARCHITECTURE.md](C:/Users/bxnju/lab-microfrontends/docs/ARCHITECTURE.md).

---

## 18. Detención y limpieza local

Detener procesos administrados:

```powershell
npm run lab:stop
```

Limpiar solo artefactos generados:

```powershell
Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .angular -ErrorAction SilentlyContinue
```

No eliminar `.runtime` mientras se necesiten los logs para diagnóstico. Si se requiere reiniciar únicamente el estado local después de confirmar que no hay procesos administrados activos:

```powershell
npm run lab:status
```

---

## 19. Documentación adicional

- [Arquitectura](C:/Users/bxnju/lab-microfrontends/docs/ARCHITECTURE.md)
- [Comunicación](C:/Users/bxnju/lab-microfrontends/docs/COMMUNICATION.md)
- [Runbook operativo](C:/Users/bxnju/lab-microfrontends/docs/RUNBOOK.md)
- [Workshop de arquitectura](C:/Users/bxnju/lab-microfrontends/docs/WORKSHOP.md)
- [Contratos compartidos](C:/Users/bxnju/lab-microfrontends/shared/contracts/src/index.ts)
- [Registro de remotes](C:/Users/bxnju/lab-microfrontends/config/mfe-registry.json)

---

## 20. Limitaciones conocidas

- La solución está orientada a una demostración local y no incluye backend.
- Los datos son ficticios y no representan un modelo productivo.
- La configuración de Federation requiere que los puertos locales estén disponibles.
- El estado de procesos en `.runtime` es local a cada máquina.
- La sincronización Git requiere que cada repositorio esté limpio.
- Los Shells y remotes comparten dependencias desde el workspace raíz.
- La composición depende de que los `remoteEntry.json` estén disponibles en los puertos locales declarados.
- Los manifests contienen URLs locales y deben parametrizarse para otros entornos.

---

## 21. Resumen rápido

```powershell
cd C:\Users\bxnju\lab-microfrontends
npm ci
npm run build:all
npm run lab:start
npm run lab:status
```

Abrir:

```text
http://localhost:4200
http://localhost:4201
```

Detener:

```powershell
npm run lab:stop
```
