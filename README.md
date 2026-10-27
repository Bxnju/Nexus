# Nexus Platform Lab

Local Angular microfrontend laboratory built with [Native Federation](https://github.com/angular-architects/module-federation-plugin).

Repository: <https://github.com/Bxnju/Nexus>

## What is included

The workspace contains **8 Angular applications**:

- **2 shells**
  - `customer-portal` — Customer Portal, port `4200`
  - `admin-portal` — Admin Portal, port `4201`
- **6 microfrontends**
  - `workspace-hub` — composition and runtime orchestration, port `4202`
  - `account-switcher` — account selection, port `4203`
  - `investments` — investments, port `4204`
  - `documents` — documents, port `4205`
  - `movements` — account activity, port `4206`
  - `summary` — financial summary, port `4207`

The two portals load `Workspace Hub`. The hub loads the business microfrontends at runtime. The application uses local fictional data and does not require a backend, Docker, credentials, or external services.

## Requirements

- Windows and PowerShell
- Node.js `24.11.1`
- npm `11.7.0`

The required Node.js version is also defined in [.nvmrc](https://github.com/Bxnju/Nexus/blob/master/.nvmrc).

Check the installed tools:

```powershell
node --version
npm --version
```

## Install

Clone the repository and install the locked dependencies:

```powershell
git clone https://github.com/Bxnju/Nexus
cd Nexus
npm ci
```

Run all commands from the repository root.

## Run the lab

Start the complete lab:

```powershell
npm run lab:start
```

Open either portal:

- Customer Portal: <http://localhost:4200>
- Admin Portal: <http://localhost:4201>

To start only one portal and the microfrontends it requires:

```powershell
npm run portal:cliente
npm run portal:admin
```

The portal commands are the current script names; `cliente` means the Customer Portal.

Check service health and status:

```powershell
npm run lab:status
```

Stop processes started by the lab:

```powershell
npm run lab:stop
```

The stop command only terminates processes managed by the lab. It does not kill unrelated Node.js processes.

## Build

Build every application:

```powershell
npm run build:all
```

Build the default application only:

```powershell
npm run build
```

## Workspace layout

```text
src/                         Customer Portal shell
projects/admin-portal/       Admin Portal shell
projects/workspace-hub/      MFE orchestrator
projects/account-switcher/   Account Switcher MFE
projects/investments/        Investments MFE
projects/documents/          Documents MFE
projects/movements/          Movements MFE
projects/summary/            Summary MFE
shared/contracts/            Shared TypeScript contracts
config/                      Portal and MFE configuration
scripts/                     Lab startup, status, logs, and shutdown tools
docs/                        Architecture and operational documentation
```

For the runtime design and federation boundaries, see [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md). For troubleshooting and operational details, see [docs/RUNBOOK.md](docs/RUNBOOK.md).
