const fs = require('node:fs');
const path = require('node:path');
const { LOGS } = require('./lib/process-manager');

const services = {
  customer: ['workspace-hub', 'account-switcher', 'investments', 'documents', 'movements', 'summary', 'customer-portal'],
  admin: ['workspace-hub', 'account-switcher', 'documents', 'movements', 'summary', 'admin-portal'],
  all: ['customer-portal', 'admin-portal', 'workspace-hub', 'account-switcher', 'investments', 'documents', 'movements', 'summary']
};
const aliases = { cliente: 'customer', customer: 'customer', admin: 'admin', all: 'all' };
const args = process.argv.slice(2);
const follow = args.includes('--follow') || args.includes('-f');
const linesArg = args.find(arg => arg.startsWith('--lines='));
const lines = linesArg ? Number(linesArg.slice('--lines='.length)) : 80;
const requested = args.find(arg => !arg.startsWith('-')) || 'all';
const group = aliases[requested];

if (!Number.isInteger(lines) || lines < 1) {
  console.error('Uso: npm run lab:logs -- cliente|admin|all|servicio [--follow] [--lines=80]');
  process.exit(1);
}

const selected = services[group] || (services.all.includes(requested) ? [requested] : null);
if (!selected) {
  console.error(`Servicio desconocido: ${requested}`);
  console.error(`Servicios disponibles: ${services.all.join(', ')}`);
  process.exit(1);
}

function logPath(service) {
  return path.join(LOGS, `${service}.log`);
}

function readTail(file, count) {
  if (!fs.existsSync(file)) return [];
  const content = fs.readFileSync(file, 'utf8');
  return content.split(/\r?\n/).filter(Boolean).slice(-count);
}

function print(service, text, prefix) {
  const output = prefix ? `[${service}] ${text}` : text;
  process.stdout.write(`${output}\n`);
}

const positions = new Map();
for (const service of selected) {
  const file = logPath(service);
  const existing = readTail(file, lines);
  if (!existing.length) {
    print(service, `Sin logs todavía: ${file}`, selected.length > 1);
  } else {
    existing.forEach(line => print(service, line, selected.length > 1));
  }
  positions.set(service, fs.existsSync(file) ? fs.statSync(file).size : 0);
}

if (!follow) process.exit(0);

console.log(`\nSiguiendo logs de ${selected.join(', ')}. Pulsa Ctrl+C para salir.`);
const watchers = selected.map(service => {
  const file = logPath(service);
  return fs.watchFile(file, { interval: 500 }, (current, previous) => {
    if (current.size < previous.size) positions.set(service, 0);
    const position = positions.get(service) || 0;
    if (current.size <= position) return;
    const handle = fs.openSync(file, 'r');
    const buffer = Buffer.alloc(current.size - position);
    fs.readSync(handle, buffer, 0, buffer.length, position);
    fs.closeSync(handle);
    positions.set(service, current.size);
    buffer.toString('utf8').split(/\r?\n/).filter(Boolean).forEach(line => print(service, line, selected.length > 1));
  });
});

function stop() {
  watchers.forEach((_, index) => fs.unwatchFile(logPath(selected[index])));
  process.exit(0);
}
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
