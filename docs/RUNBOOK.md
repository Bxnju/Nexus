# Runbook

1. `npm install`.
2. `npm run portal:cliente` para CustomerPortal o `npm run portal:admin` para AdminPortal.
3. `npm run lab:start` para levantar todo; `npm run lab:status` para verificar identidad y salud.
4. Logs: `.runtime/logs/<servicio>.log`. El estado de procesos está en `.runtime/state.json`.
5. `npm run lab:stop` detiene solo PIDs marcados `managed: true`.

Rutas útiles del WorkspaceHub:

- `http://localhost:4200/?view=overview` monta exclusivamente el MFE Summary (puerto 4207).
- `http://localhost:4200/?view=documents` monta exclusivamente el MFE Documents (puerto 4205).
- `http://localhost:4200/?view=movements` monta exclusivamente el MFE Movements (puerto 4206).
- `http://localhost:4200/?view=investments` monta exclusivamente el MFE Investments (puerto 4204).

Las mismas rutas están disponibles desde el Admin Portal en el puerto 4201.

Si un servicio cae, repetir el comando del portal lo inicia de nuevo. Si un puerto está ocupado, no se mata el proceso externo: usar `Get-NetTCPConnection -LocalPort 4202` para identificarlo, cerrar el programa ajeno conscientemente o cambiar el puerto en el registro y en el script. Los scripts usan `child_process`, no comandos Unix. `npm run lab:sync -- ruta\repo` aborta cada repositorio sucio antes de actualizar y nunca hace reset destructivo.
