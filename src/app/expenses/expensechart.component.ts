import { Component, effect, inject, input, Input } from '@angular/core';
import { ExpensesService } from './expenses.service';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartType } from 'chart.js';
import { barChartData } from './expense.type';

// Register the necessary chart types
Chart.register(...registerables);

@Component({
  selector: 'app-expense-chart',
  standalone: true,
  imports: [BaseChartDirective],
  template: `
    <div class="chart-container">
      <canvas baseChart
        [datasets]="barChartData"
        [labels]="barChartLabels"
        [options]="barChartOptions"
        [plugins]="[]"
        [legend]="barChartLegend"
        [type]="barChartType">
      </canvas>
    </div>
  `,
  styles: [`
    .chart-container { 
      width: 500px;  
      height: 500px; 
    }
  `]
})
export class ExpenseChartComponent {

  #expenseService = inject(ExpensesService);

  selectedDate = input('');

  public barChartOptions = {
    responsive: true,
  };
  public barChartLegend = true;
  public barChartType: ChartType = 'bar';
  public barChartLabels: string[] = [];
  public barChartData: barChartData[] = [];

  constructor() {
    effect(() => {
      const [year, month] = this.selectedDate().split('-').map(Number);
      this.#expenseService.getExpensesSummary(year, month).subscribe(response => {
        if (response.success) {
          const data = response.data;
          this.barChartLabels = data.map(expense => expense.category);
          this.barChartData = [
            {
              data: data.map(expense => expense.totalAmount),
              label: 'Top Expense of the month',
              backgroundColor: data.map((_, index) => this.getRandomColor(index))
            }
          ];
        }
      });
    });
  }

  getRandomColor(index: number): string {
    const hue = (index * 137.508) % 360; // 137.508 is the golden angle in degrees
    return `hsl(${hue}, 70%, 50%)`;
  }

}
