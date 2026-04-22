import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { Bookmark } from '../../models/catalog.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
            <a routerLink="/doramas" class="btn-back" style="text-decoration: none; color: var(--text-primary);">На главную</a>
          </div>
        </div>
      </nav>

      <main class="main-container">
        <div class="content-wrapper" style="max-width: 1200px; margin: 0 auto; display: flex; gap: 30px;">
          
          <aside class="filter-panel" style="width: 250px; flex-shrink: 0; background: var(--bg-color-alt); padding: 20px; border-radius: 8px;">
            <h3 class="filter-title">Мои списки</h3>
            <ul class="genre-list">
              <li><button class="genre-btn" [class.active]="selectedStatus === 'favorite'" (click)="setStatus('favorite')">❤️ Избранное</button></li>
              <li><button class="genre-btn" [class.active]="selectedStatus === 'watching'" (click)="setStatus('watching')">👀 Смотрю</button></li>
              <li><button class="genre-btn" [class.active]="selectedStatus === 'watched'" (click)="setStatus('watched')">✅ Просмотрено</button></li>
              <li><button class="genre-btn" [class.active]="selectedStatus === 'planned'" (click)="setStatus('planned')">🕒 В планах</button></li>
            </ul>
          </aside>

          <section class="grid-section" style="flex: 1;">
            <div class="section-header">
              <h2 style="font-size: 1.5rem; margin-bottom: 25px; color: var(--text-primary); border-left: 4px solid var(--accent-color); padding-left: 10px;">{{ getStatusTitle() }}</h2>
            </div>

            <div class="dorama-poster-grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 20px;">
              @for (bookmark of filteredBookmarks; track bookmark.id) {
                <div class="poster-card" [routerLink]="['/doramas', bookmark.dorama]" style="cursor: pointer;">
                  <div class="poster-image" style="margin-bottom: 10px;">
                    <div class="poster-placeholder" style="width: 100%; aspect-ratio: 2 / 3; background: linear-gradient(135deg, #2a2a35, #1a1a24); border-radius: 8px; position: relative; overflow: hidden; box-shadow: var(--shadow);">
                      @if (bookmark.dorama_details?.image_url) {
                        <img [src]="bookmark.dorama_details?.image_url" alt="" style="width: 100%; height: 100%; object-fit: cover; position: absolute; z-index: 1;">
                      }
                      <div class="status-badge" style="position: absolute; top: 8px; left: 8px; padding: 4px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; color: #fff; z-index: 2; background-color: var(--status-ongoing);">
                        {{ bookmark.status === 'favorite' ? 'Избранное' : (bookmark.status === 'watching' ? 'Смотрю' : (bookmark.status === 'watched' ? 'Просмотрено' : 'В планах')) }}
                      </div>
                    </div>
                  </div>
                  <div class="poster-info">
                    <h3 class="poster-title" style="font-size: 1.05rem; font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">{{ bookmark.dorama_details?.title }}</h3>
                  </div>
                </div>
              } @empty {
                <div class="empty-state" style="grid-column: 1 / -1; text-align: center; padding: 60px; color: var(--text-secondary); background: var(--bg-color-alt); border-radius: 8px;">
                  <p>В этом списке пока ничего нет</p>
                </div>
              }
            </div>
          </section>

        </div>
      </main>
    </div>
  `,
  styles: [`
    .doramclub-layout { min-height: 100vh; background-color: var(--bg-color); }
    .top-header { background-color: var(--bg-color-alt); padding: 10px 0; border-bottom: 1px solid var(--border-color); }
    .header-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; padding: 0 20px; }
    .logo { display: flex; align-items: center; gap: 8px; }
    .logo-icon { color: var(--accent-color); font-size: 1.5rem; }
    .logo h1 { font-size: 1.4rem; color: var(--text-primary); margin: 0; }
    .highlight { color: var(--accent-color); }
    
    .filter-title { color: var(--text-primary); font-size: 1.1rem; margin: 0 0 20px 0; padding-bottom: 12px; border-bottom: 1px solid var(--border-color); }
    .genre-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px; }
    .genre-btn { background: transparent; border: none; color: var(--text-secondary); padding: 8px 12px; width: 100%; text-align: left; border-radius: 6px; cursor: pointer; transition: 0.2s; font-size: 0.95rem; }
    .genre-btn:hover { background: rgba(255, 255, 255, 0.05); color: var(--text-primary); }
    .genre-btn.active { background: rgba(212, 109, 142, 0.15); color: var(--accent-color); font-weight: 600; border-left: 3px solid var(--accent-color); border-top-left-radius: 0; border-bottom-left-radius: 0; }
  `]
})
export class ProfileComponent implements OnInit {
  bookmarks: Bookmark[] = [];
  filteredBookmarks: Bookmark[] = [];
  selectedStatus: string = 'favorite'; // default
  catalogService = inject(CatalogService);

  ngOnInit() {
    this.catalogService.getBookmarks().subscribe({
      next: (data) => {
        this.bookmarks = data;
        this.filterByStatus();
      },
      error: (err) => console.error('Failed to load bookmarks', err)
    });
  }

  setStatus(status: string) {
    this.selectedStatus = status;
    this.filterByStatus();
  }

  filterByStatus() {
    this.filteredBookmarks = this.bookmarks.filter(b => b.status === this.selectedStatus);
  }

  getStatusTitle(): string {
    switch(this.selectedStatus) {
      case 'favorite': return '💖 Избранное';
      case 'watching': return '👀 Смотрю';
      case 'watched': return '✅ Просмотрено';
      case 'planned': return '🕒 В планах';
      default: return 'Мой список';
    }
  }
}
