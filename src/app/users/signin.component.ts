import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from './users.service';
import { Router } from '@angular/router';
import { Token, User } from './user.type';
import { StateService } from '../state.service';
import { jwtDecode } from 'jwt-decode';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule],
  template: ` 
   <form [formGroup]="form" (ngSubmit)="go()">
    <div class="form-group">
      <input placeholder="Email" [formControl]="form.controls.email" class="form-control"/>
    </div>
    @if(this.$errorMessage()!==''){
           <div class="error-message">{{this.$errorMessage()}}</div>
      }
    <div class="form-group">
      <input type="password" placeholder="Password" [formControl]="form.controls.password" class="form-control"/>
    </div>
    <button [disabled]="form.invalid" class="btn btn-primary">Sign In</button>
  </form>
  `,
  styles: [` 
  form {
    display: flex; flex-direction:
    column; max-width: 400px;
    margin: 50px auto; padding:
    20px;
    border: 1px solid #ddd;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
  .form-group { 
    margin-bottom: 15px; }
  .form-control { 
    width: 95%;
    padding: 10px;
    font-size: 1em;
    border: 1px solid #ccc; 
    border-radius: 5px;
    }
  .btn {
    padding: 10px;
    font-size: 1em;
    border: none;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
    cursor: pointer;
     transition: background-color 0.3s;
     }
  .btn:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
  .btn:hover:not(:disabled) {
    background-color: #0056b3;
  }
  .error-message {
    color: red;
    font-size: 0.9em;
    margin-top: -10px;
    margin-bottom: 10px; 
  }
`]
})
export class SigninComponent {
  #users_service = inject(UsersService);
  #state = inject(StateService);
  #router = inject(Router);
  $errorMessage = signal('');
  form = inject(FormBuilder).nonNullable.group({
    'email': ['', Validators.required],
    'password': ['', Validators.required],
  });

  constructor() {
    this.form.controls.email.valueChanges.subscribe(() => {
      if (this.form.controls.email.dirty || this.form.controls.email.touched) {
        this.$errorMessage.set('');
      }
    });
  }

  go() {
    this.#users_service.signin(this.form.value as User).subscribe({
      next: response => {
        const decoded = jwtDecode(response.data.token) as Token;
        this.#state.$state.set({
          _id: decoded._id,
          fullname: decoded.fullname,
          email: decoded.email,
          jwt: response.data.token,
          picture_url: decoded.picture_url
        });
        this.#router.navigate(['', 'expenses']);
      },
      error: err => {
        const errResponse = err as HttpErrorResponse;
        if (errResponse && errResponse.error && errResponse.error.data) {
          this.$errorMessage.set(errResponse.error.data);
        } else {
          this.$errorMessage.set('Something went wrong. Please try again later.');
        }
      }
    }
    );
  }
}
