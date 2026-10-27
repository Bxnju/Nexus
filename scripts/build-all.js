const { spawnSync } = require('node:child_process');

const projects = [
  'nexus-platform-lab',
  'admin-portal',
  'workspace-hub',
  'account-switcher',
  'investments',
  'documents',
  'movements',
  'summary'
];

for (const project of projects) {
  console.log(`\n=== Compilando ${project} ===`);
  const result = spawnSync(
    process.execPath,
    [require.resolve('@angular/cli/bin/ng.js'), 'build', project],
    { stdio: 'inherit', shell: false }
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('\nTodos los proyectos se compilaron correctamente.');
