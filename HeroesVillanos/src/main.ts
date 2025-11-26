import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { addIcons } from 'ionicons';
import { star, heart, settings, trash, swapVertical, filterOutline, reload, heartOutline, mail } from 'ionicons/icons';

addIcons({
  'star': star,
  'heart': heart,
  'heart-outline': heartOutline,
  'settings': settings,
  'trash': trash,
  "swap-vertical": swapVertical,
  'filter-outline': filterOutline,
  'reload': reload,
  'mail': mail,
});

import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(),
  ],
});
