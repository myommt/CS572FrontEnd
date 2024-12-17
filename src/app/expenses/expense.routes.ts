import { Routes } from "@angular/router";
import { ExpenselistComponent } from "./expenselist.component";
import { ExpenseformComponent } from "./expenseform.component";

export const expenses_routes: Routes = [
    {
        path: '', loadComponent: () => import('./expenselist.component').then(c => c.ExpenselistComponent)
    },
    {
        path: 'new', loadComponent: () => import('./expenseform.component').then(c => c.ExpenseformComponent)
    },
    {
        path: ':expense_id', loadComponent: () => import('./expenseedit.component').then(c => c.ExpenseeditComponent)
    }
];
