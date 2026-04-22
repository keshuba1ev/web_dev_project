import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { Dorama } from '../../models/catalog.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dorama-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="doramclub-layout">
      <nav class="top-header">
        <div class="header-container">
          <div class="logo" routerLink="/" style="cursor: pointer;">
            <span class="logo-icon">▶</span>
            <h1>Doram<span class="highlight">Club</span></h1>
          </div>
          <div class="header-actions" style="display: flex; gap: 10px; align-items: center;">
            <button class="btn-theme" (click)="catalogService.toggleTheme()" style="background: transparent; color: var(--text-primary); border: 1px solid var(--border-color); padding: 8px 12px; border-radius: 4px;">
              {{ catalogService.isLightTheme ? '🌙 Темная' : '☀️ Светлая' }}
            </button>
            <button (click)="goBack()" class="btn-back">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Назад к списку
            </button>
          </div>
        </div>
      </nav>

      <main class="main-container">
        <div class="content-wrapper">
          @if (dorama) {
            <div class="detail-container">
              <div class="detail-header">
                <div class="detail-poster-container">
                  <div class="poster-placeholder" [class.has-image]="!!dorama.image_url">
                    @if (dorama.image_url) {
                      <img [src]="dorama.image_url" alt="{{ dorama.title }}" class="poster-img">
                    }
                    <div class="status-badge" [class.completed]="dorama.id % 2 === 0" [class.ongoing]="dorama.id % 2 !== 0">
                      {{ dorama.id % 2 === 0 ? 'Завершена' : 'Выходит' }}
                    </div>
                  </div>
                </div>
                <div class="detail-info">
                  <h2>{{ dorama.title }}</h2>
                  <div class="meta-tags">
                    <span class="tag">{{ dorama.release_year }} год</span>
                    <span class="tag accent-tag">{{ dorama.category_name }}</span>
                  </div>
                  
                  <div class="meta-details-grid" style="margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 0.95rem; background: rgba(0,0,0,0.1); padding: 15px; border-radius: 8px;">
                    <div><span style="color: var(--text-secondary); margin-right: 8px;">Страна:</span><span>Южная Корея</span></div>
                    <div><span style="color: var(--text-secondary); margin-right: 8px;">Эпизоды:</span><span>16</span></div>
                    <div><span style="color: var(--text-secondary); margin-right: 8px;">Время:</span><span>60 мин.</span></div>
                    <div><span style="color: var(--text-secondary); margin-right: 8px;">Возраст:</span><span>15+</span></div>
                  </div>
                  
                  <div class="description-block">
                    <h3>Описание</h3>
                    <p class="description">{{ dorama.description }}</p>
                    
                    @if (dorama.cast && dorama.cast.length > 0) {
                      <h3 style="margin-top: 25px;">В главных ролях</h3>
                      <div class="cast-list" style="display: flex; gap: 15px; overflow-x: auto; padding-bottom: 10px; margin-bottom: 30px;">
                        @for (actor of dorama.cast; track actor.name) {
                          <div class="cast-item" style="text-align: center; width: 80px; flex-shrink: 0;">
                            <img [src]="actor.image_url" alt="{{ actor.name }}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin: 0 auto 8px; border: 2px solid var(--border-color);">
                            <div style="font-size: 0.8rem; line-height: 1.2;">{{ actor.name }}</div>
                          </div>
                        }
                      </div>
                    }
                  </div>
                  
                  @if (isAuth) {
                    <div class="bookmark-controls">
                      <button class="btn-bookmark" [class.active]="currentBookmarkStatus === 'favorite'" (click)="setBookmark('favorite')">❤️ В избранное</button>
                      <button class="btn-bookmark" [class.active]="currentBookmarkStatus === 'watching'" (click)="setBookmark('watching')">👀 Смотрю</button>
                      <button class="btn-bookmark" [class.active]="currentBookmarkStatus === 'watched'" (click)="setBookmark('watched')">✅ Просмотрено</button>
                      <button class="btn-bookmark" [class.active]="currentBookmarkStatus === 'planned'" (click)="setBookmark('planned')">🕒 В планах</button>
                    </div>
                  }
                  
                  @if (reviewsLoaded || reviews.length > 0) {
                    <div class="reviews-section" style="margin-top: 40px; border-top: 1px solid var(--border-color); padding-top: 30px;">
                      <h3 style="margin-bottom: 20px; font-size: 1.2rem; display: flex; align-items: center; justify-content: space-between;">
                        Отзывы зрителей
                        <div class="rating-summary" *ngIf="reviews.length > 0" style="font-size: 0.95rem; font-weight: normal; color: var(--text-secondary);">
                          Всего отзывов: {{ reviews.length }}
                        </div>
                      </h3>
                      @for (review of reviews; track review.id) {
                        <div class="review-item" style="display: flex; gap: 15px; background: var(--bg-color-alt); padding: 20px; border-radius: 8px; margin-bottom: 15px; border: 1px solid var(--border-color);">
                          <div class="review-avatar" style="width: 45px; height: 45px; flex-shrink: 0; border-radius: 50%; background: rgba(212, 109, 142, 0.1); display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem; color: var(--accent-color);">
                            {{ review.user_name[0] | uppercase }}
                          </div>
                          <div class="review-content" style="flex: 1;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
                              <h4 style="margin: 0; font-size: 1rem; color: var(--text-primary);">{{ review.user_name }}</h4>
                              <span style="background: rgba(255, 255, 255, 0.1); padding: 2px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: bold; color: #ffca28;">★ {{ review.rating }}</span>
                            </div>
                            <p style="color: var(--text-secondary); margin: 0; line-height: 1.5; font-size: 0.95rem;">{{ review.comment }}</p>
                          </div>
                        </div>
                      } @empty {
                        <p style="color: var(--text-secondary); margin-bottom: 20px;">Пока нет отзывов. Станьте первым!</p>
                      }
                      
                      @if (isAuth) {
                        <div class="add-review-section" style="margin-top: 20px; background: rgba(0,0,0,0.2); padding: 20px; border-radius: 8px; border: 1px solid var(--border-color);">
                          <h4 style="margin: 0 0 15px 0; font-size: 1.05rem;">Оставить отзыв</h4>
                          <textarea [(ngModel)]="newReviewText" placeholder="Напишите свои впечатления..." style="width: 100%; height: 80px; padding: 12px; border-radius: 6px; border: 1px solid var(--border-color); background: var(--bg-color-alt); color: var(--text-primary); margin-bottom: 15px; font-family: var(--font-family); resize: vertical;"></textarea>
                          <div style="display: flex; justify-content: space-between; align-items: center;">
                            <div class="rating-select" style="display: flex; align-items: center; gap: 10px;">
                              <label style="color: var(--text-secondary); font-size: 0.95rem;">Оценка:</label>
                              <select [(ngModel)]="newReviewRating" style="padding: 8px 12px; background: var(--bg-color-alt); color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 4px; font-weight: 600; font-family: var(--font-family);">
                                <option [value]="5">5 / 5 ★</option>
                                <option [value]="4">4 / 5 ★</option>
                                <option [value]="3">3 / 5 ★</option>
                                <option [value]="2">2 / 5 ★</option>
                                <option [value]="1">1 / 5 ★</option>
                              </select>
                            </div>
                            <button (click)="submitReview()" class="btn-action" style="padding: 10px 20px; background-color: var(--accent-color); color: white; border: none; border-radius: 4px; font-size: 0.95rem; font-weight: 600; cursor: pointer; transition: background 0.2s;" [disabled]="!newReviewText.trim()">
                              Отправить
                            </button>
                          </div>
                        </div>
                      }
                    </div>
                  } @else {
                    <button (click)="loadReviews()" class="btn-action" style="padding: 12px 24px; background-color: var(--accent-color); color: white; border: none; border-radius: 4px; font-size: 1rem; font-weight: 600; cursor: pointer; transition: background 0.2s;">
                      Показать отзывы
                    </button>
                  }
                </div>
              </div>
            </div>
          } @else {
            <div class="loading-state">
              <p>Загрузка информации...</p>
            </div>
          }
        </div>
      </main>
    </div>
  `,
  styles: [`
    .doramclub-layout { min-height: 100vh; background-color: var(--bg-color); color: var(--text-primary); }
    .top-header { background-color: var(--bg-color-alt); border-bottom: 1px solid var(--border-color); padding: 10px 0; position: sticky; top: 0; z-index: 100; }
    .header-container { max-width: 1200px; margin: 0 auto; padding: 0 20px; display: flex; justify-content: space-between; align-items: center; }
    .logo { display: flex; align-items: center; gap: 8px; }
    .logo-icon { color: var(--accent-color); font-size: 1.5rem; }
    .logo h1 { font-size: 1.4rem; font-weight: 700; margin: 0; color: var(--text-primary); }
    .logo .highlight { color: var(--accent-color); }
    .btn-back { display: flex; align-items: center; gap: 8px; padding: 8px 16px; background: transparent; color: var(--text-primary); border: 1px solid var(--border-color); border-radius: 4px; }
    .btn-back:hover { background: rgba(128, 128, 128, 0.1); }
    .btn-back svg { width: 18px; height: 18px; }

    .main-container { padding: 40px 20px; }
    .content-wrapper { max-width: 1000px; margin: 0 auto; }
    
    .detail-container { background-color: var(--bg-color-alt); border-radius: 8px; padding: 30px; }
    
    .detail-header { display: flex; gap: 30px; margin-bottom: 40px; }
    .detail-poster-container { width: 250px; flex-shrink: 0; }
    
    .poster-placeholder { width: 100%; aspect-ratio: 2 / 3; background: linear-gradient(135deg, #2a2a35, #1a1a24); border-radius: 8px; position: relative; overflow: hidden; box-shadow: var(--shadow); }
    .poster-img { width: 100%; height: 100%; object-fit: cover; position: absolute; top: 0; left: 0; z-index: 1; }
    
    .status-badge { position: absolute; top: 12px; left: 12px; padding: 4px 10px; border-radius: 4px; font-size: 0.8rem; font-weight: 600; color: #fff; z-index: 2; }
    .status-badge.completed { background-color: var(--status-completed); }
    .status-badge.ongoing { background-color: var(--status-ongoing); }

    .detail-info { flex: 1; }
    .detail-info h2 { font-size: 2.2rem; font-weight: 700; margin: 0 0 15px; line-height: 1.2; }
    
    .meta-tags { display: flex; gap: 10px; margin-bottom: 30px; }
    .tag { background: #2b2b2b; padding: 6px 12px; border-radius: 4px; font-size: 0.9rem; }
    .accent-tag { background: var(--accent-color); font-weight: 600; }
    
    .description-block h3 { margin-bottom: 10px; font-size: 1.1rem; border-left: 3px solid var(--accent-color); padding-left: 10px; }
    .description { font-size: 1rem; line-height: 1.6; color: var(--text-secondary); margin-bottom: 30px; }
    
    .btn-action { padding: 12px 24px; background-color: var(--accent-color); color: white; border: none; border-radius: 4px; font-size: 1rem; font-weight: 600; transition: background 0.2s; }
    .btn-action:hover { background-color: var(--accent-hover); }
    
    .bookmark-controls { margin-bottom: 20px; display: flex; gap: 8px; flex-wrap: wrap; }
    .btn-bookmark { flex: 1; min-width: 130px; background: rgba(255, 255, 255, 0.05); color: var(--text-primary); border: 1px solid var(--border-color); padding: 10px; border-radius: 6px; cursor: pointer; transition: 0.2s; font-size: 0.9rem; }
    .btn-bookmark:hover { background: rgba(255,255,255,0.1); }
    .btn-bookmark.active { background: rgba(212, 109, 142, 0.15); color: var(--accent-color); font-weight: 600; border-color: var(--accent-color); }
    
    .reviews-section { margin-top: 40px; border-top: 1px solid var(--border-color); padding-top: 30px; }
    .reviews-section h3 { margin-bottom: 20px; font-size: 1.2rem; }
    .review-item { display: flex; gap: 15px; background: #1a1a1a; padding: 20px; border-radius: 8px; }
    .review-avatar { width: 45px; height: 45px; border-radius: 50%; background: #2b2b2b; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.2rem; color: var(--accent-color); }
    .review-content h4 { margin: 0 0 5px 0; font-size: 1rem; }
    .review-content p { color: var(--text-secondary); margin: 0; line-height: 1.5; }
    
    .loading-state { padding: 60px; text-align: center; color: var(--text-secondary); }
    
    @media (max-width: 768px) {
      .detail-header { flex-direction: column; }
      .detail-poster-container { width: 200px; margin: 0 auto; }
      .detail-info { text-align: center; }
      .meta-tags { justify-content: center; }
      .description-block { text-align: left; }
    }
  `]
})
export class DoramaDetailComponent implements OnInit {
  dorama: Dorama | undefined;
  reviewsLoaded = false;
  reviews: any[] = [];
  currentBookmarkStatus: string | null = null;
  newReviewText: string = '';
  newReviewRating: number = 5;
  
  private route = inject(ActivatedRoute);
  catalogService = inject(CatalogService);
  private location = inject(Location);

  get isAuth(): boolean {
    return typeof window !== 'undefined' && !!localStorage.getItem('access_token');
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.catalogService.getDoramas().subscribe(doramas => {
      this.dorama = doramas.find(d => d.id === id);
    });

    const token = localStorage.getItem('access_token');
    if (token) {
      this.catalogService.getBookmarks().subscribe(bookmarks => {
        const bm = bookmarks.find(b => b.dorama === id);
        if (bm) {
          this.currentBookmarkStatus = bm.status;
        }
      });
    }
  }

  setBookmark(status: string) {
    if (!this.dorama) return;
    if (this.currentBookmarkStatus === status) {
      this.catalogService.removeBookmark(this.dorama.id).subscribe(() => {
        this.currentBookmarkStatus = null;
      });
    } else {
      this.catalogService.setBookmark(this.dorama.id, status).subscribe(bm => {
        this.currentBookmarkStatus = bm.status;
      });
    }
  }

  submitReview() {
    if (!this.dorama || !this.newReviewText.trim()) return;
    this.catalogService.addReview(this.dorama.id, Number(this.newReviewRating), this.newReviewText).subscribe({
      next: (review) => {
        this.reviews.push(review);
        this.newReviewText = '';
        this.newReviewRating = 5;
      },
      error: (err) => console.error('Failed to add review:', err)
    });
  }

  goBack() {
    this.location.back();
  }

  loadReviews() {
    if (!this.dorama) return;
    this.catalogService.getReviews(this.dorama.id).subscribe((reviews) => {
      this.reviews = reviews;
      this.reviewsLoaded = true;
    });
  }
}
