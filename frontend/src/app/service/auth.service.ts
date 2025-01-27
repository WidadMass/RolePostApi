import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api'; 

  constructor(private http: HttpClient) {}

  // Méthode pour se connecter
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/login`, { email, password });
  }

  // Vérifie si l'utilisateur est authentifié
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Retourne true si un token est présent
  }

  // Méthode pour se déconnecter
  logout(): void {
    localStorage.removeItem('token');
  }
}
