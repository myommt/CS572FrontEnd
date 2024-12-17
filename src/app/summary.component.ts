import { Component, effect, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ExpenseChartComponent } from "./expenses/expensechart.component";
import { ExpensePieComponent } from "./expenses/expensepie.component";
import { OpenaiComponent } from "./openai/openai.component";

interface DateOption {
  display: string;
  value: string;
}

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [ExpenseChartComponent, ExpensePieComponent, OpenaiComponent, ReactiveFormsModule],
  template: `
    <h1>Expense Summary of <select [formControl]="dateControl" (change)="onDateChange()" class="date-dropdown">
      @for(option of dateOptions(); track option.value) {
        <option [value]="option.value"> {{ option.display }} </option>
      }
    </select></h1>
    <div class="chart-container">
      <div class="chart-box">
        <app-expense-chart [selectedDate]="selectedDate()"></app-expense-chart>
      </div>
      <div class="chart-box">
         <app-expense-pie [selectedDate]="selectedDate()"></app-expense-pie> 
      </div>
    </div>
    <div>
       <app-openai [selectedDate]="selectedDate()"></app-openai> 
    </div>
  `,
  styles: [`
    .chart-container {
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
    }
    .chart-box {
      flex: 1;
      max-width: 45%; 
      padding: 10px;
      margin: 10px;  
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
export class SummaryComponent {
  dateOptions = signal<DateOption[]>([]);
  selectedDate = signal<string>('');
  dateControl = new FormControl('');

  constructor() {
    const currentDate = new Date();
    const defaultDate = `${currentDate.getFullYear()}-${('0' + (currentDate.getMonth() + 1)).slice(-2)}`;
    this.dateControl.setValue(defaultDate);
    this.selectedDate.set(defaultDate);
    this.dateOptions.set(this.generateDateOptions());

    effect(() => {
      this.onDateChange();
    });
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
      this.selectedDate.set(selectedDate);
    } else {
      console.warn('Selected date is null or undefined');
    }
  }
}
