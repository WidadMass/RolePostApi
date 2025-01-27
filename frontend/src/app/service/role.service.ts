import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  private apiUrl = 'http://localhost:5000/api/roles'; // URL de votre backend

  constructor(private http: HttpClient) {}

  // Attribuer un rôle à un utilisateur
  assignRole(userId: string, role: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/assign`, { userId, role });
  }

  // Récupérer tous les rôles disponibles
  getAllRoles(): Observable<any> {
    return this.http.get(`${this.apiUrl}`);
  }
}
