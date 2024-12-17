import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ExpensesService } from './expenses.service';
import { Router } from '@angular/router';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
@Component({
  selector: 'app-expenseform',
  imports: [ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, MatInputModule,],
  template: ` 
  <h1>Add Expense</h1>
    <form [formGroup]="form" (ngSubmit)="go()"  class="expense-form">
      <input placeholder="title" [formControl]="form.controls.title"/>
      <input placeholder="category" [formControl]="form.controls.category"/>
      <mat-form-field> <mat-label>Date</mat-label> <input matInput [matDatepicker]="picker" placeholder="Choose a date" [formControl]="form.controls.date"/> <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle> <mat-datepicker #picker></mat-datepicker> </mat-form-field>
      <input placeholder="amount" [formControl]="form.controls.amount"/>
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
   }`
})
export class ExpenseformComponent {
  #expenseService = inject(ExpensesService);
  #router = inject(Router);
  form = inject(FormBuilder).nonNullable.group({
    'title': ['', Validators.required],
    'category': ['', Validators.required],
    'date': ['', Validators.required],
    'amount': ['0', [Validators.required]]
  });
  go() {

    const expense = {
      title: this.form.controls.title.value,
      category: this.form.controls.category.value,
      date: new Date(this.form.controls.date.value),
      amount: Number(this.form.controls.amount.value)
    };

    this.#expenseService.addExpense(expense)
      .subscribe(response => {
        if (response.success) {
          this.#router.navigate(['', 'expenses']);
        }
      });
  }


}
