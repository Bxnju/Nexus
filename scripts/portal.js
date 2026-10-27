const { startService } = require('./lib/process-manager');
const services = {
  customer: [
    { id: 'workspace-hub', project: 'workspace-hub', port: 4202 },
    { id: 'account-switcher', project: 'account-switcher', port: 4203 },
    { id: 'investments', project: 'investments', port: 4204 },
    { id: 'documents', project: 'documents', port: 4205 },
    { id: 'movements', project: 'movements', port: 4206 },
    { id: 'summary', project: 'summary', port: 4207 },
    { id: 'customer-portal', project: 'nexus-platform-lab', port: 4200 }
  ],
  admin: [
    { id: 'workspace-hub', project: 'workspace-hub', port: 4202 },
    { id: 'account-switcher', project: 'account-switcher', port: 4203 },
    { id: 'documents', project: 'documents', port: 4205 },
    { id: 'movements', project: 'movements', port: 4206 },
    { id: 'summary', project: 'summary', port: 4207 },
    { id: 'admin-portal', project: 'admin-portal', port: 4201 }
  ]
};
const portal = process.argv[2] === 'admin' ? 'admin' : process.argv[2] === 'cliente' ? 'customer' : process.argv[2];
if (!portal || !services[portal]) { console.error('Uso: npm run portal -- cliente|admin'); process.exit(1); }
(async () => {
  for (const service of services[portal]) {
    try { console.log(`${service.id}: ${await startService(service)}`); }
    catch (error) { console.error(error.message); process.exitCode = 1; return; }
  }
  console.log(`Portal listo: http://localhost:${portal === 'customer' ? 4200 : 4201}`);
})();
