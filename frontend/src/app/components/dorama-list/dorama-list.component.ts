import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogService } from '../../services/catalog.service';
import { Dorama, Category } from '../../models/catalog.model';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-dorama-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dorama-list.component.html',
  styleUrls: ['./dorama-list.component.css']
})
export class DoramaListComponent implements OnInit {
  doramas: Dorama[] = [];
  categories: Category[] = [];
  searchQuery: string = '';
  selectedCategoryId: number | undefined;
  errorMessage: string = '';
  catalogService = inject(CatalogService);
  private router = inject(Router);

  get isAuth(): boolean {
    return !!localStorage.getItem('access_token');
  }

  get username(): string | null {
    return localStorage.getItem('username');
  }

  ngOnInit(): void {
    this.loadDoramas();
    this.loadCategories();
  }

  loadDoramas(): void {
    this.searchQuery = '';
    this.selectedCategoryId = undefined;
    this.catalogService.getDoramas().subscribe({
      next: (data) => this.doramas = data,
      error: (err) => this.errorMessage = err.message
    });
  }

  loadCategories(): void {
    this.catalogService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error(err)
    });
  }

  selectCategory(categoryId: number | undefined): void {
    this.selectedCategoryId = categoryId;
    this.filterDoramas();
  }

  filterDoramas(): void {
    this.catalogService.filterDoramas(this.searchQuery, this.selectedCategoryId).subscribe({
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
