import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Post {
  _id: string;
  userId: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  files: string[];
  createdAt: string;
  // Ajoutez d'autres propriétés selon votre modèle Post
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'http://localhost:3000/api/posts'; // Remplacez par votre URL API

  constructor(private http: HttpClient) { }

  // Créer une nouvelle publication
  createPost(postData: FormData): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(`${this.apiUrl}/create`, postData, { headers });
  }

  // Récupérer les publications de l'utilisateur connecté
  getMyPosts(): Observable<Post[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Post[]>(`${this.apiUrl}/myPosts`, { headers });
  }

  // Fonction utilitaire pour inclure le token d'authentification
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Assurez-vous que le token est stocké correctement
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
