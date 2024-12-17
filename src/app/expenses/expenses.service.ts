import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { apiUrl } from '../app.config';
import { Observable } from 'rxjs';
import { Expense, ExpenseSummary, StandardResponse } from './expense.type';



@Injectable({
  providedIn: 'root'
})
export class ExpensesService {

  readonly #http = inject(HttpClient);
  readonly #apiUrl = inject(apiUrl);

  getExpenses(pageSize: number, page: number, year: number, month: number): Observable<StandardResponse<Expense[]>> {
    return this.#http.get<StandardResponse<Expense[]>>(`${this.#apiUrl}/expenses?pageSize=${pageSize}&page=${page}&year=${year}&month=${month}`);
  }

  getExpensesByYear(year: number, limit: number = 20, skip: number = 0): Observable<StandardResponse<Expense[]>> {

    const url = `${this.#apiUrl}?year=${year}&limit=${limit}&skip=${skip}`;
    return this.#http.get<StandardResponse<Expense[]>>(url);
  }
  getExpensesByYearMonth(year: number, month: number, limit: number = 20, skip: number = 0): Observable<StandardResponse<Expense[]>> {

    const url = `${this.#apiUrl}?year=${year}&month=${month}&limit=${limit}&skip=${skip}`;
    return this.#http.get<StandardResponse<Expense[]>>(url);
  }
  getExpensesCount(year: number, month: number): Observable<StandardResponse<number>> {
    return this.#http.get<StandardResponse<number>>(`${this.#apiUrl}/expenses/gettotal?year=${year}&month=${month}`);
  }
  getExpenseById(id: string): Observable<StandardResponse<Expense>> {

    return this.#http.get<StandardResponse<Expense>>(`${this.#apiUrl}/expenses/${id}`);
  }

  addExpense(expense: Partial<Expense>): Observable<StandardResponse<Expense>> {
    return this.#http.post<StandardResponse<Expense>>(this.#apiUrl + "/expenses", expense);
  }

  updateExpense(id: string, expense: Partial<Expense>): Observable<StandardResponse<Expense>> {
    return this.#http.put<StandardResponse<Expense>>(`${this.#apiUrl}/expenses/${id}`, expense);
  };

  deleteExpense(id: string): Observable<StandardResponse<number>> {
    return this.#http.delete<StandardResponse<number>>(`${this.#apiUrl}/expenses/${id}`);
  }

  getExpensesSummary(year: number, month: number): Observable<{ success: boolean; data: ExpenseSummary[]; }> {
    return this.#http.get<{ success: boolean; data: ExpenseSummary[]; }>(`${this.#apiUrl}/expenses/getexpensesummary?year=${year}&month=${month}`);
  }
}
