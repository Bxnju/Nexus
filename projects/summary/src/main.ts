import { initFederation } from '@angular-architects/native-federation';

const runtime = globalThis as typeof globalThis & { ngDevMode?: boolean };
if (typeof runtime.ngDevMode === 'undefined') runtime.ngDevMode = false;

initFederation('federation.manifest.json')
  .catch((err) => console.error(err))
  .then((_) => import('./bootstrap'))
  .catch((err) => console.error(err));
