import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrl } from '../app.config';
import { Observable } from 'rxjs';
import { Budget, StandardResponse } from './budget.type';



@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  readonly #http = inject(HttpClient);
  readonly #apiUrl = inject(apiUrl);

  getBudgets(pageSize: number, page: number, year: number, month: number): Observable<StandardResponse<Budget[]>> {
    return this.#http.get<StandardResponse<Budget[]>>(`${this.#apiUrl}/budgets?pageSize=${pageSize}&page=${page}&year=${year}&month=${month}`);
  }
  getBudgetCount(year: number, month: number): Observable<StandardResponse<number>> {
    return this.#http.get<StandardResponse<number>>(`${this.#apiUrl}/budgets/gettotal?year=${year}&month=${month}`);
  }

  getBudgetById(id: string): Observable<StandardResponse<Budget>> {

    return this.#http.get<StandardResponse<Budget>>(`${this.#apiUrl}/budgets/${id}`);
  }


  addBudget(budget: Partial<Budget>): Observable<StandardResponse<Budget>> {
    return this.#http.post<StandardResponse<Budget>>(this.#apiUrl + "/budgets", budget);
  }

  updateBudget(id: string, budget: Partial<Budget>): Observable<StandardResponse<Budget>> {
    return this.#http.put<StandardResponse<Budget>>(`${this.#apiUrl}/budgets/${id}`, budget);
  };

  deleteBudget(id: string): Observable<StandardResponse<number>> {
    return this.#http.delete<StandardResponse<number>>(`${this.#apiUrl}/budgets/${id}`);
  }
}
