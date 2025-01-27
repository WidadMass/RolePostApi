
import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; 
import { AppComponent } from './app/app.component';
import { routes } from '../src/app/app.routes';




bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient() // Ajout de provideHttpClient
    // Ajoute d'autres providers si nécessaire
  ]
})
.catch(err => console.error(err));
