import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AuthorDashboardComponent } from './author-dashboard/author-dashboard.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';


export const routes: Routes = [
  // Route par défaut qui redirige vers /login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Page de connexion
  { path: 'login', component: LoginComponent },

  // Page d'inscription
  { path: 'register', component: RegisterComponent },

  // Tableau de bord de l'administrateur
  { path: 'admin-dashboard', component: AdminDashboardComponent },

  { path: 'author-dashboard', component: AuthorDashboardComponent },
  
  { path: 'user-dashboard', component: UserDashboardComponent },

  // Route pour les erreurs 404 (optionnel, si souhaité)
  { path: '**', redirectTo: 'login' }, // Redirige vers la page de connexion si la route est introuvable
];
