import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UsersService } from './users.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-user-profile',
  imports: [ReactiveFormsModule],
  template: ` 
    <form [formGroup]="form" (ngSubmit)="changePassword()">
      <div class="form-group">
        <input type="password" placeholder="Old Password" [formControl]="form.controls.oldPassword" class="form-control"/>
      </div>
      <div class="form-group">
        <input type="password" placeholder="New Password" [formControl]="form.controls.newPassword" class="form-control"/>
      </div>
      @if(form.controls.newPassword.invalid && (form.controls.newPassword.dirty || form.controls.newPassword.touched)){
        @if(form.controls.newPassword.hasError('required')){
            <div class="error-message">Passwords is required</div>
        }
        @else if(form.controls.newPassword.hasError('minlength')){
            <div class="error-message">Password requires 3 or more characters.</div>
        }  
      }
      <div class="form-group">
        <input type="password" placeholder="Confirm New Password" [formControl]="form.controls.confirmNewPassword" class="form-control"/>
      </div>
     
      @if(form.controls.confirmNewPassword.invalid && (form.controls.confirmNewPassword.dirty || form.controls.confirmNewPassword.touched)){
        @if(form.controls.confirmNewPassword.hasError('required')){
            <div class="error-message">Passwords is required</div>
        }
        @else if(form.controls.confirmNewPassword.hasError('minlength')){
            <div class="error-message">Password requires 3 or more characters.</div>
        }  
      }
      @if(form.hasError('mismatchError')){
            <div class="error-message">Passowrds do not match</div> 
        }
      <button [disabled]="form.invalid" class="btn btn-primary">Change Password</button>
      
      @if(this.$errorMessage()!==''){
           <div class="error-message">{{this.$errorMessage()}}</div>
      }
    </form>
  `,
  styles: [`
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
      margin-top: 10px;
    }
  `]
})
export class UserprofileComponent {
  #users_service = inject(UsersService);
  #router = inject(Router);
  $errorMessage = signal('');

  form = inject(FormBuilder).nonNullable.group({
    'oldPassword': ['', Validators.required],
    'newPassword': ['', [Validators.required, Validators.minLength(3)]],
    'confirmNewPassword': ['', [Validators.required, Validators.minLength(3)]]
  }, { validators: this.matchPasswordValidator });
  constructor() {
    this.form.controls.oldPassword.valueChanges.subscribe(() => {
      if (this.form.controls.oldPassword.dirty || this.form.controls.oldPassword.touched) {
        this.$errorMessage.set('');
      }
    });
    this.form.controls.newPassword.valueChanges.subscribe(() => {
      if (this.form.controls.newPassword.dirty || this.form.controls.newPassword.touched) {
        this.$errorMessage.set('');
      }
    });
    this.form.controls.confirmNewPassword.valueChanges.subscribe(() => {
      if (this.form.controls.confirmNewPassword.dirty || this.form.controls.confirmNewPassword.touched) {
        this.$errorMessage.set('');
      }
    });
  }

  changePassword() {
    const oldPassword = this.form.controls.oldPassword.value;
    const newPassword = this.form.controls.confirmNewPassword.value;
    this.#users_service.changePassword(oldPassword, newPassword).subscribe({
      next: response => {
        if (response.success) {
          alert(response.data);
          this.$errorMessage.set('');
          this.#router.navigate(['', 'expenses']);
        }
      },
      error: (err: HttpErrorResponse) => {
        if (err.error && err.error.data) {
          this.$errorMessage.set(err.error.data);
        } else {
          this.$errorMessage.set('Something went wrong. Please try again later.');
        }
      }
    });
  }

  matchPasswordValidator(controls: AbstractControl): ValidationErrors | null {
    return controls.get('newPassword')?.value === controls.get('confirmNewPassword')?.value ? null : { mismatchError: true };
  }
}
