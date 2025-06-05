import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl: string = `${environment.apiUrl}`;

  constructor(private http: HttpClient) { }

  searchPartner(native: number, target: number) {
    return this.http.get(`${this.apiUrl}/api/users`, {
      params: {
        native: native.toString(),
        target: target.toString()
      }
    });
  }

}
