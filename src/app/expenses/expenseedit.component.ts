import { Component, effect, inject, input } from '@angular/core';
import { Expense } from './expense.type';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { ExpensesService } from './expenses.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-expenseedit',
  imports: [ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, MatInputModule],
  template: `
  <h1>Edit Expense</h1>
    <form [formGroup]="form" (ngSubmit)="save()" class="expense-form">
      <input placeholder="title" [formControl]="form.controls.title" />
      <input placeholder="category" [formControl]="form.controls.category" />
      <mat-form-field>
        <mat-label>Date</mat-label>
        <input matInput [matDatepicker]="picker" placeholder="Choose a date" [formControl]="form.controls.date" />
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker></mat-datepicker>
      </mat-form-field>
      <input placeholder="amount" [formControl]="form.controls.amount" />
      <button [disabled]="form.invalid">Update</button>
    </form>
  `,
  styles: `
  .expense-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 500px;
    margin: auto;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    background: #fff;
   }
  `
})
export class ExpenseeditComponent {
  expense_id = input('');
  #expenseservice = inject(ExpensesService);
  #router = inject(Router);

  form = inject(FormBuilder).nonNullable.group({
    'title': ['', Validators.required],
    'category': ['', Validators.required],
    'date': ['', Validators.required],
    'amount': ['0', [Validators.required]]
  });

  constructor() {
    effect(() => {
      if (this.expense_id()) {
        this.getExpenseById(this.expense_id());
      }
    });
  }

  getExpenseById(id: string) {
    this.#expenseservice.getExpenseById(id).subscribe(response => {
      if (response.success) {
        this.populateForm(response.data);
      }
    });
  }

  populateForm(expense: Expense) {
    this.form.setValue({
      title: expense.title,
      category: expense.category,
      date: this.formatDate(expense.date.toString()),
      amount: expense.amount.toString()
    });
  }

  formatDate(date: string): string {
    const formattedDate = new Date(date).toISOString().split('T')[0];
    return formattedDate;
  }

  save() {
    const updatedExpense: Partial<Expense> = {
      title: this.form.controls.title.value,
      category: this.form.controls.category.value,
      date: new Date(this.form.controls.date.value),
      amount: Number(this.form.controls.amount.value),
      expense_id: this.expense_id()
    };

    this.#expenseservice.updateExpense(this.expense_id(), updatedExpense).subscribe(response => {
      if (response.success) {
        alert('Expense updated successfully');
        this.#router.navigate(['/expenses']);
      }
    });
  }
}
