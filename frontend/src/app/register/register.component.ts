import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegisterService } from '../../app/service/register.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  imports: [FormsModule, CommonModule],
})
export class RegisterComponent {
  // Objet pour stocker les données du formulaire
  user = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  // Messages de retour
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private registerService: RegisterService,
    private router: Router
  ) {}

  onSubmit(): void {
    // Vérification que tous les champs sont remplis
    if (!this.user.firstName || !this.user.lastName || !this.user.email || !this.user.password) {
      this.errorMessage = 'Tous les champs sont obligatoires.';
      return;
    }

    // Appel au service d'inscription
    this.registerService.register(this.user).subscribe({
      next: (response) => {
        console.log('Inscription réussie !', response);
        this.successMessage = 'Inscription réussie !';
        this.errorMessage = '';
        this.router.navigate(['/login']); // Redirection après succès
      },
      error: (err) => {
        console.error('Erreur lors de l’inscription :', err);
        this.errorMessage = err.error.message || 'Une erreur est survenue lors de l’inscription.';
        this.successMessage = '';
      },
    });
  }
}
