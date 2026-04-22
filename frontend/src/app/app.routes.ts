import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DoramaListComponent } from './components/dorama-list/dorama-list.component';
import { DoramaDetailComponent } from './components/dorama-detail/dorama-detail.component';
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, title: 'Login' },
  { path: 'doramas', component: DoramaListComponent, title: 'Doramas Catalog' },
  { path: 'doramas/:id', component: DoramaDetailComponent, title: 'Dorama Detail' },
  { path: 'profile', component: ProfileComponent, title: 'My Profile' },
  { path: '', redirectTo: '/doramas', pathMatch: 'full' }
];
