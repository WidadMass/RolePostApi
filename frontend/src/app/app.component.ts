import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; // Importer HttpClientModule
import { RegisterComponent } from './register/register.component'


//Le module HttpClientModule permet 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule] 
})
export class AppComponent {
  title = 'PostApi';
}
