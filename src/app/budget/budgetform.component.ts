import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { BudgetService } from './budget.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-budgetform',
  imports: [ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, MatInputModule],
  template: `
  <h1>Add Budget</h1>
    <form class="budget-form" [formGroup]="form" (ngSubmit)="go()">
      <input placeholder="title" [formControl]="form.controls.title"/>
      <input placeholder="category" [formControl]="form.controls.category"/>
      <mat-form-field>
        <mat-label>Date</mat-label>
        <input matInput [matDatepicker]="picker" placeholder="Choose a date" [formControl]="form.controls.date"/>
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker startView="multi-year" (yearSelected)="chosenYearHandler($event)" (monthSelected)="chosenMonthHandler($event, picker)" panelClass="month-picker"></mat-datepicker>
      </mat-form-field>
      <input placeholder="amount" [formControl]="form.controls.amount"/>
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
export class BudgetformComponent {
  #budgetService = inject(BudgetService);
  #router = inject(Router);
  form = inject(FormBuilder).nonNullable.group({
    'title': ['', Validators.required],
    'category': ['', Validators.required],
    'date': ['', Validators.required],
    'amount': ['0', [Validators.required, Validators.min(0)]]
  });

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

  go() {
    const budget = {
      title: this.form.controls.title.value,
      category: this.form.controls.category.value,
      date: new Date(this.form.controls.date.value),
      amount: Number(this.form.controls.amount.value)
    };

    this.#budgetService.addBudget(budget).subscribe(response => {
      if (response.success) {
        this.#router.navigate(['', 'budget']);
      }
    });
  }
}
