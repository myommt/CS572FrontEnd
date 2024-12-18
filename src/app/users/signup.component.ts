import { Component, effect, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UsersService } from './users.service';
import { Router } from '@angular/router';
import { User } from './user.type';
import { error } from 'console';
import { response } from 'express';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule],
  template: ` 
    <form [formGroup]="form" (ngSubmit)="go()">
    <div class="form-group">
      <input placeholder="Email" [formControl]="form.controls.email" class="form-control"/>
      @if(form.controls.email.invalid && (form.controls.email.dirty || form.controls.email.touched)){
        @if(form.controls.email.hasError('required')){
            <div class="error-message">Email is required</div>
        }
        @else if(form.controls.email.hasError('email')){
          <div class="error-message">Email is invalid</div>
        } 
      }
      @if(this.$errorMessage()!==''){
           <div class="error-message">{{this.$errorMessage()}}</div>
      }
    </div>
    <div class="form-group">
      <input placeholder="Full Name" [formControl]="form.controls.fullname" class="form-control"/>
    </div>
    <div class="form-group">
      <input type="password" placeholder="Password" [formControl]="form.controls.password" class="form-control"/>
    </div>
    <div class="form-group">
      <input type="password" placeholder="Confirm password" [formControl]="form.controls.confirmpassword" class="form-control"/>
    </div>
      @if(form.controls.password.invalid && (form.controls.password.dirty || form.controls.password.touched)){
        @if(form.controls.password.hasError('required')){
            <div class="error-message">Passwords is required</div>
        }
        @else if(form.controls.password.hasError('minlength')){
            <div class="error-message">Password requires 3 or more characters.</div>
        }  
      }
      @if(form.hasError('mismatchError')){
            <div class="error-message">Passowrds do not match</div> 
        }
        <div class="form-group">
      <input type="file" [formControl]="form.controls.file" (change)="pickup_file($event)" class="form-control"/>
      </div>
      <button [disabled]="form.invalid" class="btn btn-primary">Go</button>
    </form>
  `,
  styles: `
      form {
        display: flex;
        flex-direction: column;
        max-width: 400px;
        margin: 50px auto;
        padding: 20px;
        border: 1px solid #ddd;
        border-radius: 10px;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      }
      .form-group {
        margin-bottom: 15px;
      }
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
        margin-top: 5px;
        margin-bottom: 10px;
      }

`
})
export class SignupComponent {
  #profile_picture!: File;
  #users_service = inject(UsersService);
  #router = inject(Router);
  $errorMessage = signal('');

  form = inject(FormBuilder).nonNullable.group({
    'email': ['', [Validators.required, Validators.email]],
    'fullname': ['', Validators.required],
    'password': ['', [Validators.required, Validators.minLength(3)]],
    'confirmpassword': ['', [Validators.required, Validators.minLength(3)]],
    'file': ['', Validators.required],
  }, { validators: this.matchPasswordValidator });

  pickup_file(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files!.length) {
      this.#profile_picture = input.files![0];
    }

  }
  constructor() {
    //this.form.controls.password.statusChanges.subscribe(console.log);
    //effect(() => console.log(this.$errorMessage()));

    this.form.controls.email.valueChanges.subscribe(() => {
      if (this.form.controls.email.dirty || this.form.controls.email.touched) {
        this.$errorMessage.set('');
      }
    });
  }
  go() {
    const formData = new FormData();
    formData.append('email', this.form.controls.email.value);
    formData.append('fullname', this.form.controls.fullname.value);
    formData.append('password', this.form.controls.password.value);
    formData.append('profile_picture', this.#profile_picture);

    this.#users_service.signup(formData).subscribe(
      {
        next: response => {
          if (response.success) {
            alert(`Sign up successfully`);
            this.#router.navigate(['', 'signin']);
          }
        },
        error: err => {
          const errResponse = err as HttpErrorResponse;
          if (errResponse && errResponse.error && errResponse.error.data) {
            if (errResponse.error.data.includes('email_1 dup key')) {
              this.$errorMessage.set('This email address is already in used. Please use a different email.');
            }
            else {
              this.$errorMessage.set(errResponse.error.data);
            }
          } else {
            this.$errorMessage.set('Something went wrong. Please try again later.');
          }

        }
      });
  }

  matchPasswordValidator(controls: AbstractControl): ValidationErrors | null {
    return controls.get('password')?.value === controls.get('confirmpassword')?.value ? null : { mismatchError: true };
  }
}
