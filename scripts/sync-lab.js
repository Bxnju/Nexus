const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const path = require('node:path');
const repos = process.argv.slice(2);
if (!repos.length) { console.log('Sin repositorios independientes configurados. Use: npm run lab:sync -- ruta1 ruta2'); process.exit(0); }
for (const repo of repos) {
  const cwd = path.resolve(repo);
  const dirty = execFileSync('git', ['status', '--porcelain'], { cwd, encoding: 'utf8' });
  if (dirty.trim()) { console.error(`Cambios locales en ${cwd}; se detiene sin sobrescribir.`); process.exitCode = 1; continue; }
  execFileSync('git', ['pull', '--ff-only'], { cwd, stdio: 'inherit' });
}
