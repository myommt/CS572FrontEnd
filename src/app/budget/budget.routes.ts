import { Routes } from "@angular/router";
import { BudgetlistComponent } from "./budgetlist.component";
import { BudgetformComponent } from "./budgetform.component";

export const budget_routes: Routes = [
    {
        path: '', loadComponent: () => import('./budgetlist.component').then(c => c.BudgetlistComponent)
    },
    {
        path: 'new', loadComponent: () => import('./budgetform.component').then(c => c.BudgetformComponent)
    },
    {
        path: ':budget_id', loadComponent: () => import('./budgetedit.component').then(c => c.BudgeteditComponent)
    }
];
