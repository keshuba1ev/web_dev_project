import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  errorMessage = '';
  private catalogService = inject(CatalogService);
  private router = inject(Router);

  onSubmit() {
    this.catalogService.login(this.credentials).subscribe({
      next: (response) => {
        localStorage.setItem('access_token', response.access);
        localStorage.setItem('username', response.username);
        this.router.navigate(['/doramas']);
      },
      error: (err) => {
        this.errorMessage = err.message;
      }
    });
  }
}
