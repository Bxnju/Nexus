const { readState, writeState } = require('./lib/process-manager');
const state = readState();
for (const [id, service] of Object.entries(state)) {
  if (!service.managed || !service.pid) continue;
  try { process.kill(service.pid); console.log(`Detenido ${id} (${service.pid})`); } catch (error) { console.warn(`No se pudo detener ${id}: ${error.message}`); }
  delete state[id];
}
writeState(state);
