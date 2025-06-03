import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterResponse } from '../../interface/registerResponce.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = `${environment.apiUrl}`;
  // private jwtUserUrl = `${environment.apiUrl}/auth/user-token`;

  constructor(
    private cookieService: CookieService,
    private http: HttpClient) { }

  register(userData: {
    name: string;
    full_name: string;
    email: string;
    password: string;
  }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/api/auth/register`, userData);
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/auth/login`, credentials, { withCredentials: true });
  }



}
