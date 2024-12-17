import { Component, effect, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { BudgetService } from './budget.service';
import { Router } from '@angular/router';
import { Budget } from './budget.type';

@Component({
  selector: 'app-budgetedit',
  imports: [ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, MatInputModule],
  template: `
  <h1>Edit Budget</h1>
    <form [formGroup]="form" (ngSubmit)="save()" class="budget-form">
      <input placeholder="title" [formControl]="form.controls.title" />
      <input placeholder="category" [formControl]="form.controls.category" />
      <mat-form-field>
        <mat-label>Date</mat-label>
        <input matInput [matDatepicker]="picker" placeholder="Choose a date" [formControl]="form.controls.date" />
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker startView="multi-year" (yearSelected)="chosenYearHandler($event)" (monthSelected)="chosenMonthHandler($event, picker)" panelClass="month-picker"></mat-datepicker>
      </mat-form-field>
      <input placeholder="amount" [formControl]="form.controls.amount" />
      <button [disabled]="form.invalid">Update</button>
    </form>
  `,
  styles: [`
    .budget-form {
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
  `],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: {
        parse: { dateInput: 'MM/YYYY' },
        display: {
          dateInput: 'MM/YYYY',
          monthYearLabel: 'MM YYYY',
          dateA11yLabel: 'MM/YYYY',
          monthYearA11yLabel: 'MMMM YYYY'
        }
      }
    }
  ]
})
export class BudgeteditComponent {
  budget_id = input('');
  #budgetService = inject(BudgetService);
  #router = inject(Router);

  form = inject(FormBuilder).nonNullable.group({
    'title': ['', Validators.required],
    'category': ['', Validators.required],
    'date': ['', Validators.required],
    'amount': ['0', [Validators.required]]
  });

  constructor() {
    effect(() => {
      if (this.budget_id) {
        this.getBudgetById(this.budget_id());
      }
    });
  }

  getBudgetById(id: string) {
    this.#budgetService.getBudgetById(id).subscribe(response => {
      if (response.success) {
        this.populateForm(response.data);
      }
    });
  }

  populateForm(budget: Budget) {
    const date = new Date(budget.date);
    // Set date to the first day of the month and correct for timezone offset
    const correctDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 2));

    this.form.setValue({
      title: budget.title,
      category: budget.category,
      date: correctDate.toISOString(), // YYYY-MM-DD format
      amount: budget.amount.toString()
    });
  }

  chosenYearHandler(normalizedYear: Date) {
    const ctrlValue = this.form.controls.date.value ? new Date(this.form.controls.date.value) : new Date();
    ctrlValue.setFullYear(normalizedYear.getFullYear());
    this.form.controls.date.setValue(ctrlValue.toISOString());
  }

  chosenMonthHandler(normalizedMonth: Date, datepicker: MatDatepicker<Date>) {
    const ctrlValue = this.form.controls.date.value ? new Date(this.form.controls.date.value) : new Date();
    ctrlValue.setMonth(normalizedMonth.getMonth());
    ctrlValue.setDate(1); // Set the first day of the month
    ctrlValue.setHours(0, 0, 0, 0); // Set time to 00:00 
    this.form.controls.date.setValue(ctrlValue.toISOString());
    datepicker.close();
  }

  save() {
    const updatedBudget: Partial<Budget> = {
      title: this.form.controls.title.value,
      category: this.form.controls.category.value,
      date: this.setToFirstDayOfMonth(this.form.controls.date.value),
      amount: Number(this.form.controls.amount.value),
      budget_id: this.budget_id()
    };

    this.#budgetService.updateBudget(this.budget_id(), updatedBudget).subscribe(response => {
      if (response.success) {
        alert('Budget updated successfully');
        this.#router.navigate(['/budget']);
      }
    });
  }

  setToFirstDayOfMonth(date: string) {
    const ctrlValue = this.form.controls.date.value ? new Date(this.form.controls.date.value) : new Date();
    ctrlValue.setMonth(ctrlValue.getMonth());
    ctrlValue.setDate(1); // Set the first day of the month
    ctrlValue.setHours(0, 0, 0, 0); // Set time to 00:00 
    return new Date(ctrlValue);
  }
}
