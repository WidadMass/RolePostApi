import { Component, OnInit } from '@angular/core';
import { Post, PostService } from '../service/post.service';
import { User, UserService } from '../service/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css'],
  imports: [CommonModule, FormsModule],
})

export class AdminDashboardComponent implements OnInit {
  modalContent: string | null = null; // Contenu de la modale actuelle
  userProfile: User | null = null; // Informations du profil de l'utilisateur
  users: User[] = []; // Liste des utilisateurs
  posts: Post[] = []; // Liste des publications de l'utilisateur
  newPost = {
    title: '',
    content: '',
    category: '',
    tags: '',
    file: null
  }; // Données pour la nouvelle publication

  // Indicateurs de chargement
  isLoadingProfile = false;
  isLoadingPosts = false;
  isLoadingUsers = false;
  isCreatingPost = false;

  constructor(
    private userService: UserService,
    private postService: PostService
  ) { }

  ngOnInit(): void {
    // Optionnel : charger des données initiales si nécessaire
  }

  /**
   * Ouvre une modale spécifique en fonction du contenu souhaité.
   * @param content Le type de contenu à afficher dans la modale.
   */
  openModal(content: string): void {
    this.modalContent = content;
    if (content === 'profile') {
      this.loadUserProfile();
    } else if (content === 'myPosts') {
      this.loadMyPosts();
    } else if (content === 'users') {
      this.loadUsers();
    }
  }

  /**
   * Ferme la modale actuellement ouverte.
   */
  closeModal(): void {
    this.modalContent = null;
  }

  /**
   * Déconnecte l'utilisateur en supprimant le token et en redirigeant vers la page de connexion.
   */
  logout(): void {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

  /**
   * Charge les informations du profil de l'utilisateur connecté.
   */
  loadUserProfile(): void {
    this.isLoadingProfile = true;
    this.userService.getProfile().subscribe(
      (data: User) => {
        this.userProfile = data;
        this.isLoadingProfile = false;
      },
      (error) => {
        console.error('Erreur lors de la récupération du profil :', error);
        this.isLoadingProfile = false;
      }
    );
  }

  /**
   * Charge les publications de l'utilisateur connecté.
   */
  loadMyPosts(): void {
    this.isLoadingPosts = true;
    this.postService.getMyPosts().subscribe(
      (data: Post[]) => {
        this.posts = data;
        this.isLoadingPosts = false;
      },
      (error) => {
        console.error('Erreur lors de la récupération des publications :', error);
        this.isLoadingPosts = false;
      }
    );
  }

  /**
   * Charge la liste de tous les utilisateurs.
   */
  loadUsers(): void {
    this.isLoadingUsers = true;
    this.userService.getAllUsers().subscribe(
      (data: User[]) => {
        this.users = data;
        this.isLoadingUsers = false;
      },
      (error) => {
        console.error('Erreur lors de la récupération des utilisateurs :', error);
        this.isLoadingUsers = false;
      }
    );
  }

  /**
   * Gère la soumission du formulaire de création de publication.
   * @param form Le formulaire NgForm contenant les données de la nouvelle publication.
   */
  createPost(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.isCreatingPost = true;

    const formData = new FormData();
    formData.append('title', this.newPost.title);
    formData.append('content', this.newPost.content);
    formData.append('category', this.newPost.category);
    formData.append('tags', this.newPost.tags);
    if (this.newPost.file) {
      formData.append('file', this.newPost.file);
    }

    this.postService.createPost(formData).subscribe(
      (response) => {
        console.log('Publication créée avec succès :', response);
        this.loadMyPosts(); // Rafraîchir la liste des publications
        this.resetNewPost(); // Réinitialiser le formulaire
        this.closeModal(); // Fermer la modale
        this.isCreatingPost = false;
      },
      (error) => {
        console.error('Erreur lors de la création de la publication :', error);
        this.isCreatingPost = false;
      }
    );
  }

  /**
   * Gère la sélection de fichier pour la publication.
   * @param event L'événement de sélection de fichier.
   */
  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.newPost.file = event.target.files[0];
    }
  }

  /**
   * Réinitialise les données de la nouvelle publication.
   */
  resetNewPost(): void {
    this.newPost = {
      title: '',
      content: '',
      category: '',
      tags: '',
      file: null
    };
  }
}
