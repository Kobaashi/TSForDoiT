import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl: string = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  // searchPartner(native: string, target: string) {
  //   return this.http.get(`${this.apiUrl}/api/users/native/${native}/target/${target}`, { withCredentials: true });
  // }

}
