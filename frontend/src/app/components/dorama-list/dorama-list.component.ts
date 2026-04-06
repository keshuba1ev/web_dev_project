import { Component, inject, OnInit } from '@angular/core';
import { CatalogService } from '../../services/catalog.service';
import { Dorama } from '../../models/catalog.model';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dorama-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './dorama-list.component.html',
  styleUrls: ['./dorama-list.component.css']
})
export class DoramaListComponent implements OnInit {
  doramas: Dorama[] = [];
  searchQuery: string = '';
  errorMessage: string = '';
  private catalogService = inject(CatalogService);
  private router = inject(Router);

  get isAuth(): boolean {
    return !!localStorage.getItem('access_token');
  }

  get username(): string | null {
    return localStorage.getItem('username');
  }

  ngOnInit(): void {
    this.loadDoramas();
  }

  loadDoramas(): void {
    this.catalogService.getDoramas().subscribe({
      next: (data) => this.doramas = data,
      error: (err) => this.errorMessage = err.message
    });
  }

  filterDoramas(): void {
    this.catalogService.filterDoramas(this.searchQuery).subscribe({
      next: (data) => this.doramas = data,
      error: (err) => this.errorMessage = err.message
    });
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']);
  }
}
