import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-author-dashboard',
  standalone: true, // Si c'est un standalone component
  imports: [CommonModule, RouterModule],
  templateUrl: './author-dashboard.component.html',
  styleUrls: ['./author-dashboard.component.css'], // Correction : "styleUrls" avec un "s"
})
export class AuthorDashboardComponent {}
