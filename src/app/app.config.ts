import { ApplicationConfig, inject, InjectionToken, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, Routes, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { StateService } from './state.service';

export const apiUrl = new InjectionToken<string>('common url for all');

function initialize() {
  const state_service = inject(StateService);
  const state = localStorage.getItem('LOGIN_STATE');
  if (state) {
    state_service.$state.set(JSON.parse(state));
  }
}


const appRoutes: Routes = [
  { path: '', redirectTo: '/expenses', pathMatch: 'full' },
  { path: 'summary', loadComponent: () => import("./summary.component").then(c => c.SummaryComponent) },
  {
    path: 'expenses',
    loadChildren: () => import('./expenses/expense.routes').then(r => r.expenses_routes),
    canActivate: [() => inject(StateService).isLoggedIn()]
  },
  {
    path: 'budget',
    loadChildren: () => import('./budget/budget.routes').then(r => r.budget_routes),
    canActivate: [() => inject(StateService).isLoggedIn()]
  }

];


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true })
    , { provide: apiUrl, useValue: 'http://localhost:3000' }
    , provideHttpClient()
    , provideAppInitializer(initialize)
    , provideRouter(appRoutes, withComponentInputBinding())
    , provideAnimationsAsync(), provideAnimationsAsync()
  ]
};


