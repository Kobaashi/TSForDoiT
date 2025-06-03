import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/service/auth/auth.service';
import { Subscription } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  standalone: true,
  providers: [AuthService],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {

  private authSub?: Subscription;
  password: string = '';
  confirmPassword: string = '';

  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      username: new FormControl("", [Validators.required, Validators.maxLength(32)]),
      fullname: new FormControl("", [Validators.required, Validators.maxLength(32)]),
      email: new FormControl("", [Validators.required, Validators.maxLength(32), Validators.minLength(8), Validators.pattern(this.emailRegex)]),
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(32)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  getControl(name: any) : AbstractControl | null {
    return this.registerForm.get(name)
  }

  passwordsMatch(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  registerFn() {
    if (this.registerForm.invalid || !this.passwordsMatch()) {
      console.log('Form is invalid or passwords do not match');
      return;
    }
  
    const { username, fullname, email, password } = this.registerForm.value;

    const payload = {
      name: username,
      full_name: fullname,
      email,
      password
    };
  
    this.authSub = this.authService.register(payload).subscribe({
      next: (response) => {
        console.log('Registration successful:', response);
      },
      error: (error) => {
        console.error('Registration error:', error);
      }
    });
  }

  ngOnDestroy() {
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
  }
}
