import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

import { AppComponent } from './app.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'login', 
    pathMatch: 'full' 
  },
  { 
    path: 'login', 
    component: AppComponent 
  },
  { 
    path: 'home', 
    component: HomeComponent,
    canActivate: [authGuard]
  },
  { 
    path: '**', 
    redirectTo: 'login' 
  }
];
