import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  private apiUrl = 'http://localhost:5000/api'; // URL du backend

  constructor(private http: HttpClient) {}

  /**
   * Méthode pour inscrire un nouvel utilisateur
   * @param userData - Les données de l'utilisateur à inscrire
   * @returns Observable<any> - La réponse de l'API
   */
  register(userData: {
    firstName: string;
    lastName: string;
    email: string; 
    password: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/register`, userData);
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   * @returns boolean - True si un token est présent dans le localStorage
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Vérifie si un token est présent
  }

  /**
   * Déconnecte l'utilisateur
   */
  logout(): void {
    localStorage.removeItem('token');
  }
}
