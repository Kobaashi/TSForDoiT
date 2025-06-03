import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../shared/service/auth/auth.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  standalone: true,
  providers: [AuthService],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email: string = '';
  password: string = '';

  emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  logInForm: FormGroup;

  constructor(private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router) {
    this.logInForm = this.fb.group({
      email: new FormControl("", [Validators.required, Validators.maxLength(32), Validators.minLength(8), Validators.pattern(this.emailRegex)]),
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]],
    });
  }

  getControl(name: any) : AbstractControl | null {
    return this.logInForm.get(name)
  }

  async logInFn() {
    const email = this.logInForm.get('email')?.value;
    const password = this.logInForm.get('password')?.value;

    try {
      const response: any = await this.authService.login({ email, password }).toPromise();
      console.log('Login response:', response);

      if (response?.message === 'Login successful' && response?.token) {
        this.setJwtCookie(response.token);
        this.router.navigate(['/']);

        console.log('Login successful! JWT saved in cookies.');
      } else {
        console.warn('Unexpected response:', response);
      }
    } catch (error: any) {
      console.error('Login failed:', error?.error?.message || error);
    }
  }

  private setJwtCookie(token: string): void {
    const expiresDays = 7;
    const d = new Date();
    d.setTime(d.getTime() + (expiresDays * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();

    document.cookie = `jwt=${token};${expires};path=/;SameSite=Lax`;

    window.location.reload();
  }

}
