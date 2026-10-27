const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const http = require('node:http');

const ROOT = path.resolve(__dirname, '../..');
const RUNTIME = path.join(ROOT, '.runtime');
const LOGS = path.join(RUNTIME, 'logs');
const STATE = path.join(RUNTIME, 'state.json');

function ensureRuntime() {
  fs.mkdirSync(LOGS, { recursive: true });
  if (!fs.existsSync(STATE)) fs.writeFileSync(STATE, '{}\n');
}
function readState() { ensureRuntime(); return JSON.parse(fs.readFileSync(STATE, 'utf8')); }
function writeState(state) { ensureRuntime(); fs.writeFileSync(STATE, JSON.stringify(state, null, 2)); }
function health(port, expectedId) {
  return new Promise(resolve => {
    const req = http.get(`http://localhost:${port}/health`, response => {
      let body = '';
      response.on('data', chunk => body += chunk);
      response.on('end', () => {
        try { const data = JSON.parse(body); resolve(response.statusCode === 200 && data.id === expectedId); }
        catch { resolve(false); }
      });
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1200, () => { req.destroy(); resolve(false); });
  });
}
async function waitForHealth(service, timeoutMs = 60000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await health(service.port, service.id)) return true;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  return false;
}
function startService(service) {
  ensureRuntime();
  const state = readState();
  return health(service.port, service.id).then(async active => {
    if (active) { state[service.id] = { ...service, managed: false, status: 'external' }; writeState(state); return 'external'; }
    const log = fs.openSync(path.join(LOGS, `${service.id}.log`), 'a');
    const child = spawn(process.execPath, [require.resolve('@angular/cli/bin/ng.js'), 'serve', service.project, '--port', String(service.port)], {
      cwd: ROOT, detached: true, stdio: ['ignore', log, log], windowsHide: true
    });
    child.unref();
    state[service.id] = { ...service, pid: child.pid, managed: true, status: 'starting' };
    writeState(state);
    const ready = await waitForHealth(service);
    if (!ready) throw new Error(`${service.id} no respondio en ${service.port}. Revisa ${path.join(LOGS, `${service.id}.log`)}`);
    state[service.id].status = 'ready'; writeState(state); return 'started';
  });
}
module.exports = { ROOT, LOGS, readState, writeState, health, waitForHealth, startService };
