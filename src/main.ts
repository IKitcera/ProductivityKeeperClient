import { enableProdMode, provideZoneChangeDetection } from '@angular/core';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, { applicationProviders: [provideZoneChangeDetection()], })
  .catch(err => console.error(err));

