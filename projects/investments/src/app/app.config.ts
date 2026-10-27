import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeCo from '@angular/common/locales/es-CO';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

registerLocaleData(localeCo);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'es-CO' }
  ]
};
