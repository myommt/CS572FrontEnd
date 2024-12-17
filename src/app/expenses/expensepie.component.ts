import { Component, effect, inject, input, Input } from '@angular/core';
import { ExpensesService } from './expenses.service';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, registerables, ChartType } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { pieChartData } from './expense.type';

// Register the necessary chart types and plugins
Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-expense-pie',
  standalone: true,
  imports: [BaseChartDirective],
  template: ` 
    <div class="chart-container">
      <canvas baseChart
        [datasets]="pieChartData"
        [labels]="pieChartLabels"
        [options]="pieChartOptions"
        [plugins]="pieChartPlugins"
        [legend]="pieChartLegend"
        [type]="pieChartType">
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
export class ExpensePieComponent {

  #expenseService = inject(ExpensesService);

  selectedDate = input('');

  public pieChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        color: '#ffffff', // Set label color
        formatter: (value: number) => `$${value.toFixed(2)}` // Display values as currency
      }
    }
  };
  public pieChartLegend = true;
  public pieChartType: ChartType = 'pie';
  public pieChartLabels: string[] = [];
  public pieChartData: pieChartData[] = [];
  public pieChartPlugins = [ChartDataLabels];

  constructor() {
    effect(() => {
      const [year, month] = this.selectedDate().split('-').map(Number);
      this.#expenseService.getExpensesSummary(year, month).subscribe(response => {
        if (response.success) {
          const data = response.data;
          this.pieChartLabels = data.map(expense => expense.category);
          this.pieChartData = [
            {
              data: data.map(expense => expense.totalAmount),
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
