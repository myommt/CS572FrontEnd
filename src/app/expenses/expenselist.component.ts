import { Component, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ExpensesService } from './expenses.service';
import { DateOption, Expense } from './expense.type';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-expenselist',
  imports: [DatePipe, RouterLink, CurrencyPipe, ReactiveFormsModule],
  template: ` 
    <select [formControl]="dateControl" (change)="onDateChange()" class="date-dropdown">
      @for(option of dateOptions(); track option.value) {
        <option [value]="option.value"> {{ option.display }} </option>
      }
    </select>

    @for(expense of expenses(); track expense.expense_id) {
      <li class="expense-item">
        <a [routerLink]="['/expenses', expense.expense_id]" class="expense-link">
          <span class="expense-date">{{expense.date | date: 'MM/dd/yyyy'}}</span>
          <span class="expense-title">{{expense.title}}</span>
          <span class="expense-category">{{expense.category}}</span>
          <span class="expense-amount">{{expense.amount | currency}}</span>
        </a>
        <button (click)="deleteExpense(expense.expense_id)" class="delete-button" alt="Delete">X</button>
      </li>
    }@empty {
      <p class="no-expense">No expense found.</p>
    }

    <div class="pagination">
      <button (click)="previousPage()" [disabled]="currentPage === 1">Previous</button>
      <span>Page {{currentPage}} of {{totalPages}}</span>
      <button (click)="nextPage()" [disabled]="currentPage === totalPages">Next</button>
      <span>Number of Expenses {{totalExpenses}}</span>
    </div>
  `,
  styles: [`
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

    .expense-item {
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

    .expense-item:hover {
      background-color: #f1f1f1;
    }

    .expense-link {
      display: flex;
      flex-grow: 1;
      justify-content: space-between;
      align-items: center;
      text-decoration: none;
      color: #333;
    }

    .expense-date, .expense-title, .expense-category, .expense-amount {
      margin: 0 10px;
    }

    .expense-date {
      flex-basis: 15%;
      font-size: 0.9em;
      color: #555;
    }

    .expense-title {
      flex-basis: 35%;
      font-weight: bold;
      font-size: 1em;
      color: #222;
    }

    .expense-category {
      flex-basis: 20%;
      font-size: 0.9em;
      color: #888;
    }

    .expense-amount {
      flex-basis: 20%;
      font-size: 0.9em;
      text-align: right;
      color: #27ae60;
    }

    .no-expense {
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
  `]
})
export class ExpenselistComponent {
  #router = inject(Router);
  #expenseservice = inject(ExpensesService);
  expenses = signal<Expense[]>([]);
  currentPage = 1;
  pageSize = 20;
  totalExpenses = 0;
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
    this.selectedMonth.set(currentDate.getMonth() + 1); // JavaScript months are 0-11

    this.dateOptions.set(this.generateDateOptions());
    this.loadExpenses(currentDate.getFullYear(), currentDate.getMonth() + 1);
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
      this.loadExpenses(year, month);
    } else {
      console.warn('Selected date is null or undefined');
    }
  }

  loadExpenses(year?: number, month?: number) {
    const selectedYear = year ?? new Date().getFullYear();
    const selectedMonth = month ?? new Date().getMonth() + 1; // JavaScript months are 0-11

    this.#expenseservice.getExpensesCount(selectedYear, selectedMonth).subscribe(response => {
      if (response.success) {
        this.totalExpenses = response.data;
        this.totalPages = Math.ceil(this.totalExpenses / this.pageSize);
        if (this.totalExpenses > 0) {
          this.#expenseservice.getExpenses(this.pageSize, this.currentPage, selectedYear, selectedMonth).subscribe(response => {
            if (response.success) {
              this.expenses.set(response.data);
              // Recompute totalPages in case expenses were deleted
              this.totalPages = Math.ceil(this.totalExpenses / this.pageSize);
            }
          });
        } else {
          this.expenses.set([]); // Clear expenses if there are none
        }
      }
    });
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadExpenses(this.selectedYear(), this.selectedMonth());
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadExpenses(this.selectedYear(), this.selectedMonth());
    }
  }

  deleteExpense(expenseId: string) {
    this.#expenseservice.deleteExpense(expenseId).subscribe(response => {
      if (response.success) {
        this.totalExpenses--;
        this.totalPages = Math.ceil(this.totalExpenses / this.pageSize);
        this.expenses.set(this.expenses().filter(expense => expense.expense_id !== expenseId));
        this.loadExpenses(this.selectedYear(), this.selectedMonth());
      }
    });
  }
}
