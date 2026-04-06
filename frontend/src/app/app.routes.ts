import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DoramaListComponent } from './components/dorama-list/dorama-list.component';
import { DoramaDetailComponent } from './components/dorama-detail/dorama-detail.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'doramas', component: DoramaListComponent, title: 'Doramas Catalog' },
  { path: 'doramas/:id', component: DoramaDetailComponent, title: 'Dorama Detail' },
  { path: '', redirectTo: '/doramas', pathMatch: 'full' }
];
