import { Component } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environment/environment';

@Component({
  selector: 'app-searchpartners',
  imports: [HttpClientModule, CommonModule, FormsModule],
  templateUrl: './searchpartners.html',
  styleUrl: './searchpartners.css'
})
export class Searchpartners {

  native: string = '';
  target: string = '';  
  results: any[] = [];

  constructor(private http: HttpClient) {}

  searchPartners() {
    if (!this.native || !this.target) {
      console.warn('Native and target fields cannot be empty');
      return;
    }

    const token = this.getCookie('accessToken');
    const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

    const apiUrl = `${environment.apiUrl}/api/users/native/${this.native}/target/${this.target}`;

    this.http.get<any>(apiUrl, { headers, withCredentials: true })
      .subscribe({
        next: (response) => {
          this.results = response.data;
          console.log('Search results:', this.results);
        },
        error: (error) => {
          console.error('Error fetching search results:', error);
        }
      });
  }

    getNativeLanguages(user: any): any[] {
      return user.userLanguages.filter((l: any) => l.type === 'native');
    }

  getTargetLanguages(user: any): any[] {
    return user.userLanguages.filter((l: any) => l.type === 'target');
  }


  private getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const matches = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
    );
    return matches ? decodeURIComponent(matches[1]) : null;
  }


}
