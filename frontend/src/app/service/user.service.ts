import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
role: any;
  id: string;
  name: string;
  email: string;
  // Ajoutez d'autres propriétés selon votre modèle User
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:3000/api/users'; // Remplacez par votre URL API

  constructor(private http: HttpClient) { }

  // Récupérer les informations du profil de l'utilisateur connecté
  getProfile(): Observable<User> {
    const headers = this.getAuthHeaders();
    return this.http.get<User>(`${this.apiUrl}/profile`, { headers });
  }

  // Récupérer la liste de tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<User[]>(`${this.apiUrl}/`, { headers });
  }

  // Fonction utilitaire pour inclure le token d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Assurez-vous que le token est stocké correctement
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
