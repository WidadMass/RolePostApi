import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../app/service/auth.service'; 
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule 
  ],
  standalone: true // J'ai déclarer que le composant est déclaré comme standalone
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isModalOpen = false;
  errorMessage: string | null = null; 

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router 
  ) {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {}

  // Ouvrir le modal
  openModal(): void {
    this.isModalOpen = true;
  }

  // Fermer le modal
  closeModal(): void {
    this.isModalOpen = false;
  }

  // Soumission du formulaire de Login
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { login, password } = this.loginForm.value;
      this.authService.login(login, password).subscribe({
        next: (response: { token: string; user: { role: string } }) => {
          if (response.token) {
            // Stocker le token et le rôle dans le localStorage
            localStorage.setItem('token', response.token);
            localStorage.setItem('role', response.user.role);

            // Redirection basée sur le rôle
            this.redirectBasedOnRole(response.user.role);
          } else {
            this.errorMessage = 'Erreur : Aucun token reçu.';
          }
        },
        error: (err: any) => {
          this.errorMessage = 'Login ou mot de passe incorrect.';
          console.error('Erreur lors de la connexion :', err);
        },
      });
    }
  }

  // Rediriger l'utilisateur en fonction de son rôle
  private redirectBasedOnRole(role: string): void {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/admin-dashboard']);
        break;
      case 'AUTHOR':
        this.router.navigate(['/author-dashboard']);
        break;
      case 'USER':
        this.router.navigate(['/user-dashboard']);
        break;
      default:
        this.router.navigate(['/dashboard']);
        break;
    }
  }
}
