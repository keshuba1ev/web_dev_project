import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Dorama, AuthResponse, Bookmark, Review } from '../models/catalog.model';

@Injectable({
  providedIn: 'root'
})
export class CatalogService {
  private http = inject(HttpClient);
  private apiUrl = 'http://127.0.0.1:8000/api';

  isLightTheme = false;

  initTheme() {
    if (typeof window !== 'undefined' && localStorage.getItem('theme') === 'light') {
      this.isLightTheme = true;
      document.body.classList.add('light-theme');
    }
  }

  toggleTheme() {
    this.isLightTheme = !this.isLightTheme;
    if (typeof window !== 'undefined') {
      if (this.isLightTheme) {
        document.body.classList.add('light-theme');
        localStorage.setItem('theme', 'light');
      } else {
        document.body.classList.remove('light-theme');
        localStorage.setItem('theme', 'dark');
      }
    }
  }

  getDoramas(): Observable<Dorama[]> {
    return this.http.get<Dorama[]>(`${this.apiUrl}/doramas/`).pipe(
      catchError(this.handleError)
    );
  }

  getCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/categories/`).pipe(
      catchError(this.handleError)
    );
  }

  filterDoramas(query: string = '', categoryId?: number): Observable<Dorama[]> {
    let url = `${this.apiUrl}/doramas/filter/?query=${query}`;
    if (categoryId) {
      url += `&category=${categoryId}`;
    }
    return this.http.get<Dorama[]>(url).pipe(
      catchError(this.handleError)
    );
  }

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login/`, credentials).pipe(
      catchError(this.handleError)
    );
  }

  getBookmarks(): Observable<Bookmark[]> {
    return this.http.get<Bookmark[]>(`${this.apiUrl}/bookmarks/`).pipe(
      catchError(this.handleError)
    );
  }

  setBookmark(doramaId: number, status: string): Observable<Bookmark> {
    return this.http.post<Bookmark>(`${this.apiUrl}/bookmarks/`, { dorama: doramaId, status }).pipe(
      catchError(this.handleError)
    );
  }

  removeBookmark(doramaId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/bookmarks/${doramaId}/`).pipe(
      catchError(this.handleError)
    );
  }

  getReviews(doramaId: number): Observable<Review[]> {
    return this.http.get<Review[]>(`${this.apiUrl}/reviews/?dorama=${doramaId}`).pipe(
      catchError(this.handleError)
    );
  }

  addReview(doramaId: number, rating: number, comment: string): Observable<Review> {
    return this.http.post<Review>(`${this.apiUrl}/reviews/`, { dorama: doramaId, rating, comment }).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }
}
