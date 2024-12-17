import { Component, effect, inject, input, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpenaiService } from './openai.service';
import { SummaryResponse } from './openai.type';

@Component({
  selector: 'app-openai',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
  @if (summaryResponse().summary) {
    <div [innerHTML]="summaryResponse().summary" class="summary-content"></div>
  } @else {
    <p class="loading-text">Loading...</p>
  }
</div>
  `,
  styles: [
    `
      .container {
        padding: 20px;
        font-family: Arial, sans-serif;
      }
        
      .summary-content {
        background-color:rgb(215, 84, 84);
        padding: 15px;
        border-radius: 5px;
        margin-bottom: 20px;
      }
      .loading-text {
        font-size: 16px;
        color: rgb(180, 236, 240);
      }
    `
  ]
})
export class OpenaiComponent {
  #openaiservice = inject(OpenaiService);

  selectedDate = input('');
  summaryResponse = signal<SummaryResponse>({ combinedResults: { expenses: [], budgets: [] }, summary: '' });

  constructor() {
    effect(() => {
      const [year, month] = this.selectedDate().split('-').map(Number);
      this.summaryResponse.set({ combinedResults: { expenses: [], budgets: [] }, summary: '' }); // Clear previous summary
      this.#openaiservice.combinedVectorAndAnalysis(year, month).subscribe({
        next: (response) => {
          if (response.success) {
            this.summaryResponse.set(response.data);
          }
        },
        error: (error) => {
          console.error('Error fetching summary:', error);
        }
      });
    });
  }
}
