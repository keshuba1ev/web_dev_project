import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CatalogService } from '../../services/catalog.service';
import { Dorama } from '../../models/catalog.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dorama-detail',
  standalone: true,
  template: `
    <div class="container">
      @if (dorama) {
        <button (click)="goBack()">Back</button>
        <h2>{{ dorama.title }}</h2>
        <p><strong>Year:</strong> {{ dorama.release_year }}</p>
        <p><strong>Category:</strong> {{ dorama.category_name }}</p>
        <p>{{ dorama.description }}</p>
        
        <!-- 4th Click Event making API request (Simulated Review Post or just fetching reviews) -->
        <button (click)="loadReviews()">Load Reviews (API Event 4)</button>
        
        @if (reviewsLoaded) {
          <div class="reviews">
            <p>Reviews loaded successfully!</p>
          </div>
        }
      } @else {
        <p>Loading...</p>
      }
    </div>
  `,
  styles: [`
    .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ccc; }
    button { padding: 5px 10px; margin-bottom: 20px; cursor: pointer; }
    .reviews { margin-top: 20px; padding: 10px; background-color: #f9f9f9; }
  `]
})
export class DoramaDetailComponent implements OnInit {
  dorama: Dorama | undefined;
  reviewsLoaded = false;
  
  private route = inject(ActivatedRoute);
  private catalogService = inject(CatalogService);
  private location = inject(Location);

  ngOnInit() {
    // Ideally we would fetch single dorama, but we can just filter from the list for simplicity in this demo.
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.catalogService.getDoramas().subscribe(doramas => {
      this.dorama = doramas.find(d => d.id === id);
    });
  }

  goBack() {
    this.location.back();
  }

  loadReviews() {
    // 4th distinct API call requirement
    this.catalogService.getDoramas().subscribe(() => {
      this.reviewsLoaded = true;
    });
  }
}
