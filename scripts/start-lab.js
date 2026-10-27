const { startService } = require('./lib/process-manager');
const all = [
  { id: 'workspace-hub', project: 'workspace-hub', port: 4202 },
  { id: 'account-switcher', project: 'account-switcher', port: 4203 },
  { id: 'investments', project: 'investments', port: 4204 },
  { id: 'documents', project: 'documents', port: 4205 },
  { id: 'movements', project: 'movements', port: 4206 },
  { id: 'summary', project: 'summary', port: 4207 },
  { id: 'customer-portal', project: 'nexus-platform-lab', port: 4200 },
  { id: 'admin-portal', project: 'admin-portal', port: 4201 }
];
(async () => { for (const service of all) { try { console.log(`${service.id}: ${await startService(service)}`); } catch (error) { console.error(error.message); process.exitCode = 1; return; } } })();
