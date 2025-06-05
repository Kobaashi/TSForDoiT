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
    return this.logInForm.get(name);
  }

  async logInFn() {
    const email = this.logInForm.get('email')?.value;
    const password = this.logInForm.get('password')?.value;

    try {
      const httpResponse = await this.authService.login({ email, password }).toPromise();

      if (!httpResponse) {
        console.warn('No response from server');
        return;
      }

      console.log('Full HTTP response:', httpResponse);
      console.log('Response body:', httpResponse.body);

      const token = this.getCookie('accessToken');

      if (token) {
        console.log('JWT token from cookie:', token);
        const userId = this.getUserIdFromToken(token);

        if (userId) {
          this.setUserIdCookie(userId);
          console.log('Decoded user_id:', userId);
          this.router.navigate(['/']);
        } else {
          console.warn('user_id not found in token');
        }
      } else {
        console.warn('Token not found in cookies');
      }

    } catch (error: any) {
      console.error('Login failed:', error?.error?.message || error);
    }
  }

  private getCookie(name: string): string | null {
    const matches = document.cookie.match(new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)'));
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  private getUserIdFromToken(token: string): string | null {
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'));
      const payload = JSON.parse(payloadJson);

      console.log('JWT payload:', payload);

      return payload.user_id || null;
    } catch (e) {
      console.error('Failed to decode JWT payload', e);
      return null;
    }
  }

  private setUserIdCookie(userId: string): void {
    const expiresDays = 7;
    const d = new Date();
    d.setTime(d.getTime() + expiresDays * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();

    document.cookie = `user_id=${userId};${expires};path=/;SameSite=Lax`;
  }
}
