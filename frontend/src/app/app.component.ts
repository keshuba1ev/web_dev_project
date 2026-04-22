import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CatalogService } from './services/catalog.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'catalog-frontend';
  private catalogService = inject(CatalogService);

  ngOnInit() {
    this.catalogService.initTheme();
  }
}
