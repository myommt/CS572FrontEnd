import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BudgetService } from './budget.service';
import { Budget, DateOption } from './budget.type';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-budgetlist',
  imports: [DatePipe, RouterLink, CurrencyPipe, ReactiveFormsModule],
  template: `
    <select [formControl]="dateControl" (change)="onDateChange()" class="date-dropdown">
      @for(option of dateOptions(); track option.value) {
        <option [value]="option.value"> {{ option.display }} </option>
      }
    </select>

    @for(budget of budgets(); track budget.budget_id) {
      <li class="budget-item">
        <a [routerLink]="['/budget', budget.budget_id]" class="budget-link">
          <span class="budget-date">{{budget.date | date: 'MM/dd/yyyy'}}</span>
          <span class="budget-title">{{budget.title}}</span>
          <span class="budget-category">{{budget.category}}</span>
          <span class="budget-amount">{{budget.amount | currency}}</span>
        </a>
        <button (click)="deleteBudget(budget.budget_id)" class="delete-button" alt="Delete">X</button>
      </li>
    }@empty {
      <p class="no-budget">No budget found.</p>
    }

    <div class="pagination">
      <button (click)="previousPage()" [disabled]="currentPage === 1">Previous</button>
      <span>Page {{currentPage}} of {{totalPages}}</span>
      <button (click)="nextPage()" [disabled]="currentPage === totalPages">Next</button>
      <span>Number of Budgets {{totalBudget}}</span>
    </div>
  `,
  styles: `
    .delete-button {
      background-color: #e74c3c;
      color: white;
      border: none;
      border-radius: 5px;
      padding: 5px 10px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin-left: 10px;
    }

    .delete-button:hover {
      background-color: #c0392b;
    }

    .budget-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px;
      border-bottom: 1px solid #e0e0e0;
      margin: 10px 0;
      border-radius: 8px;
      background-color: #f8f8f8;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
      transition: background-color 0.3s ease;
    }

    .budget-item:hover {
      background-color: #f1f1f1;
    }

    .budget-link {
      display: flex;
      flex-grow: 1;
      justify-content: space-between;
      align-items: center;
      text-decoration: none;
      color: #333;
    }

    .budget-date, .budget-title, .budget-category, .budget-amount {
      margin: 0 10px;
    }

    .budget-date {
      flex-basis: 15%;
      font-size: 0.9em;
      color: #555;
    }

    .budget-title {
      flex-basis: 35%;
      font-weight: bold;
      font-size: 1em;
      color: #222;
    }

    .budget-category {
      flex-basis: 20%;
      font-size: 0.9em;
      color: #888;
    }

    .budget-amount {
      flex-basis: 20%;
      font-size: 0.9em;
      text-align: right;
      color: #27ae60;
    }

    .no-budget {
      text-align: center;
      font-size: 1.2em;
      color: #999;
      padding: 20px;
    }

    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 20px;
      font-size: 1em;
    }

    .pagination button {
      background-color: #3498db;
      color: white;
      border: none;
      border-radius: 5px;
      padding: 7px 14px;
      font-size: 14px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      margin: 0 10px;
    }

    .pagination button:hover {
      background-color: #2980b9;
    }

    .pagination span {
      font-size: 1em;
      margin: 0 10px;
    }

    .date-dropdown { appearance: none; 
      background-color: #f9f9f9; 
      border: 1px solid #ccc; 
      border-radius: 4px;
       padding: 8px 12px; 
       font-size: 14px; 
       font-family: Arial, sans-serif; 
       color: #333;
        cursor: pointer; 
      } 
      .date-dropdown option { 
        background-color: #ffffff; 
        color: #333; 
      }
  `
})
export class BudgetlistComponent {

  #router = inject(Router);
  #budgeteservice = inject(BudgetService);
  budgets = signal<Budget[]>([]);
  currentPage = 1;
  pageSize = 20;
  totalBudget = 0;
  totalPages = 0;
  dateOptions = signal<DateOption[]>([]);
  selectedYear = signal<number | undefined>(undefined);
  selectedMonth = signal<number | undefined>(undefined);
  dateControl = new FormControl('');

  constructor() {
    const currentDate = new Date();
    const defaultDate = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}`;
    this.dateControl.setValue(defaultDate);

    this.selectedYear.set(currentDate.getFullYear());
    this.selectedMonth.set(currentDate.getMonth() + 1);

    this.dateOptions.set(this.generateDateOptions());
    this.loadBudget(currentDate.getFullYear(), currentDate.getMonth() + 1);
  }

  generateDateOptions(): DateOption[] {
    const options: DateOption[] = [];
    const currentDate = new Date();
    const startYear = currentDate.getFullYear() - 3;
    const endYear = currentDate.getFullYear() + 1;

    for (let year = endYear; year >= startYear; year--) {
      for (let month = 11; month >= 0; month--) {
        const date = new Date(year, month);
        options.push({
          display: date.toLocaleString('default', { year: 'numeric', month: 'long' }),
          value: `${year}-${('0' + (month + 1)).slice(-2)}`
        });
      }
    }
    return options;
  }

  onDateChange() {
    const selectedDate = this.dateControl.value;
    if (selectedDate) {
      const [year, month] = selectedDate.split('-').map(Number);
      this.selectedYear.set(year);
      this.selectedMonth.set(month);
      this.currentPage = 1; // Reset to the first page when date changes
      this.loadBudget(year, month);
    } else {
      console.warn('Selected date is null or undefined');
    }
  }

  loadBudget(year?: number, month?: number) {
    const selectedYear = year ?? new Date().getFullYear();
    const selectedMonth = month ?? new Date().getMonth() + 1;

    this.#budgeteservice.getBudgetCount(selectedYear, selectedMonth).subscribe(response => {
      if (response.success) {
        this.totalBudget = response.data;
        this.totalPages = Math.ceil(this.totalBudget / this.pageSize);
        if (this.totalBudget > 0) {
          this.#budgeteservice.getBudgets(this.pageSize, this.currentPage, selectedYear, selectedMonth).subscribe(response => {
            if (response.success) {
              this.budgets.set(response.data);
              this.totalPages = Math.ceil(this.totalBudget / this.pageSize);
            }
          });
        } else {
          this.budgets.set([]);
        }
      }
    });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBudget(this.selectedYear(), this.selectedMonth());
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBudget(this.selectedYear(), this.selectedMonth());
    }
  }

  deleteBudget(budgetId: string) {
    this.#budgeteservice.deleteBudget(budgetId).subscribe(response => {
      if (response.success) {
        this.totalBudget--;
        this.totalPages = Math.ceil(this.totalBudget / this.pageSize);
        this.budgets.set(this.budgets().filter(budget => budget.budget_id !== budgetId));
        this.loadBudget(this.selectedYear(), this.selectedMonth());
      }
    });
  }
}
