const { readState, health } = require('./lib/process-manager');
const services = [
  ['customer-portal', 4200], ['admin-portal', 4201], ['workspace-hub', 4202],
  ['account-switcher', 4203], ['investments', 4204], ['documents', 4205], ['movements', 4206], ['summary', 4207]
];
(async () => { const state = readState(); for (const [id, port] of services) console.log(`${id.padEnd(18)} ${await health(port, id) ? 'READY' : 'DOWN '} http://localhost:${port} ${state[id]?.managed ? '(lab)' : state[id] ? '(externo)' : '(no registrado)'}`); })();
