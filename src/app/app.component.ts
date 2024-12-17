import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
   <h1>{{title}}</h1>
   <div class="divrouter">
    <nav> 
      <a [routerLink]="['','expenses']">EXPENSE LIST</a><br/>
      <a [routerLink]="['','expenses','new']">ADD EXPENSE</a><br/>
      <a [routerLink]="['','budget']">BUDGET LIST</a><br/>
      <a [routerLink]="['','budget','new']">ADD BUDGET</a><br/>
      <a [routerLink]="['','summary']">SUMMARY</a>
    </nav> 
  <div class="divoutlet">
    <router-outlet></router-outlet>
    </div>
</div>


    
  `,
  styles: [
    `
    .divrouter{
      display: flex;
    }
    .divoutlet{
      flex-grow: 1;
      padding: 10px;
      background-color:rgb(232, 159, 159); 
      margin-bottom: 20px;
    }
      nav {
        width: 200px; 
        margin-bottom: 20px;
        background-color:rgb(215, 84, 84);
        padding: 10px;
        text-align: left;
      }
      a {
        margin-right: 10px;
        text-decoration: none;
        color: rgb(236, 183, 183); 
      }

    `
  ],
})
export class AppComponent {
  title = 'Welcome to Expenses';
}
