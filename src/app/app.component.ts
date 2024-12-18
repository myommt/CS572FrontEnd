import { Component, effect, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { initial_state, StateService } from './state.service';
import { apiUrl } from './app.config';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="app-container"> 
      
      @if(!state_service.isLoggedIn()) {
       <h1>{{title}} </h1>
        <div class="divrouternotloggedin">
          <nav>
            <a [routerLink]="['', 'signin']">SIGNIN</a><br>
            <a [routerLink]="['', 'signup']">SIGNUP</a>
          </nav>
          <div class="divoutlet">
            <router-outlet></router-outlet>
          </div>
        </div>
      } @else {
        <h1>Welcome {{ this.state_service.$state().fullname.toUpperCase() }}!</h1>
        @if(this.state_service.$state().picture_url){ 
          <div class="profile-picture-container">
            <img [src]="pictureUrl" alt="Profile Picture" class="profile-picture"/>
         </div> 
        }
       
        <button (click)="signout()" class="signout-button">SIGNOUT</button>
        <div class="divrouter">
          <nav> 
             <a [routerLink]="['', 'budget', 'new']">ADD BUDGET</a><br/> 
             <a [routerLink]="['', 'budget']">BUDGET LIST</a><br/>
             <a [routerLink]="['', 'expenses', 'new']">ADD EXPENSE</a><br/>
             <a [routerLink]="['', 'expenses']">EXPENSE LIST</a><br/>
             <a [routerLink]="['', 'summary']">SUMMARY</a><br/>
             <a [routerLink]="['', 'changepassword']">CHANGE PASSWORD</a>
          </nav>
          <div class="divoutlet">
            <router-outlet></router-outlet>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
    .app-container {
      font-family: Arial, sans-serif;
      color: #333;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    h1 {
      text-align: center;
      color: #3f51b5;
      font-size: 2em;
      margin-top: 20px;
      text-shadow: 1px 1px 2px #888;
    }
    .divrouternotloggedin {
      display: flex;
      justify-content: center;
      padding: 20px;
      background-color: #f4f4f4;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .divrouter {
      display: flex;
      justify-content: center;
      padding: 20px;
      background-color: #f4f4f4;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    nav {
      width: 200px;
      margin-right: 20px;
      padding: 20px;
      border-radius: 8px;
      background-color: #3f51b5;
      color: white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    nav a {
      display: block;
      margin-bottom: 10px;
      text-decoration: none;
      color: #ffffff;
      font-weight: bold;
      transition: color 0.3s ease-in-out;
    }
    nav a:hover {
      color: #ff4081;
    }
    .divoutlet {
      width: 1000px;
      padding: 20px;
      background-color:rgb(139, 167, 227);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .signout-button {
      background-color: #ff4081;
      border: none;
      color: white;
      padding: 10px 20px;
      text-align: center;
      text-decoration: none;
      display: inline-block;
      font-size: 16px;
      margin: 4px 2px;
      cursor: pointer;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease-in-out;
    }
    .signout-button:hover {
      background-color: #ff5a92;
    }
    .profile-picture-container {
      display: flex;
      justify-content:
      center; margin-top: 20px;
    }
    .profile-picture {
      max-width: 100px;
      max-height: 100px;
      border-radius: 50%; 
    }
    `,
  ],
})
export class AppComponent {
  title = 'Expense Tracker';
  state_service = inject(StateService);
  #router = inject(Router);
  readonly #apiUrl = inject(apiUrl);

  signout() {
    this.state_service.$state.set(initial_state);
    this.#router.navigate(['', 'signin']);
  }

  get pictureUrl(): string | null {
    const picture_url = this.state_service.$state().picture_url;
    const picturePath = picture_url ? this.#apiUrl + `/${picture_url.replace(/\\/g, '/')}` : null;
    return picturePath;
  }
}
