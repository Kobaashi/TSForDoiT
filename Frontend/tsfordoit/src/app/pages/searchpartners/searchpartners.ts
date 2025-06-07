import { Component } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environment/environment';
import { Status } from '../../shared/enum/status';

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
  resultsPendingFor: any[] = [];
  resultsPendingFrom: any[] = [];
  resultsAcceptedFor: any[] = [];
  isActivePendingFor: boolean = false;
  isActivePendingFrom: boolean = false;
  isActiveAccept: boolean = false;

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

  sendRequest(to_user_id: number) {
    const from_user_id = Number(this.getCookie('user_id'));
     if (!from_user_id) {
      console.error('User not authenticated');
      return;
    }

    if (!to_user_id) {
      console.error('to_user_id is undefined or null');
      return;
    }

    const apiUrl = `${environment.apiUrl}/api/req/requests/pending`

    const body = {
      from_user_id: from_user_id,
      to_user_id: to_user_id,
      status: Status.PENDING
    }

    console.log('Sending request with body:', body);

    this.http.post<any>(apiUrl, body, { withCredentials: true })
      .subscribe({
        next: (response) => {
          console.log('Request sent successfully:', response);
        },
        error: (error) => {
          console.error('Error sending request:', error);
        }
      });
  }

  getAllPendingRequestsFor() {
    const user_id = Number(this.getCookie('user_id'));
    if (!user_id) {
      console.error('User not authenticated');
      return;
    }

    const apiUrl = `${environment.apiUrl}/api/req/requests/incoming`;

    this.http.get<any>(apiUrl, { withCredentials: true })
      .subscribe({
        next: (response) => {
          this.resultsPendingFor = response.data.filter( (req: any) => req.to_user_id === user_id && req.status === Status.PENDING);
          console.log('Pending requests for:', this.resultsPendingFor);
        },
        error: (error) => {
          console.error('Error fetching pending requests:', error);
        }
      });
  }

  getAllPendingRequestsFrom() {
      const user_id = Number(this.getCookie('user_id'));
      if (!user_id) {
        console.error('User not authenticated');
        return;
      }

      const apiUrl = `${environment.apiUrl}/api/req/requests/outcoming`;

      this.http.get<any>(apiUrl, { withCredentials: true })
        .subscribe({
          next: (response) => {
            this.resultsPendingFrom = response.data.filter( (req: any) => req.from_user_id === user_id && req.status === Status.PENDING);
            console.log('Pending requests from:', this.resultsPendingFrom);
          },
          error: (error) => {
            console.error('Error fetching pending requests:', error);
          }
        });
    }

    getAllAcceptedRequestsFor() {
    const user_id = Number(this.getCookie('user_id'));
    
    if (!user_id) {
      console.error('User not authenticated');
      return;
    }

    const apiUrl = `${environment.apiUrl}/api/req/requests/accept`;

    this.http.get<any>(apiUrl, { withCredentials: true })
      .subscribe({
        next: (response) => {
          this.resultsAcceptedFor = response.data.filter( (req: any) => req.to_user_id === user_id && req.status === Status.ACCEPTED);
          console.log('Pending requests for:', this.resultsAcceptedFor);
        },
        error: (error) => {
          console.error('Error fetching pending requests:', error);
        }
      });
  }

  protected getCookie(name: string): string | null {
    if (typeof document === 'undefined') return null;
    const matches = document.cookie.match(
      new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
    );
    return matches ? decodeURIComponent(matches[1]) : null;
  }

  toogleActivePendingFor() {
    this.isActivePendingFor = !this.isActivePendingFor;
    if (this.isActivePendingFor) {
      this.getAllPendingRequestsFor();
    } else {
      this.resultsPendingFor = [];
    }
  }

  toogleActivePendingFrom() {
    this.isActivePendingFrom = !this.isActivePendingFrom;
    if (this.isActivePendingFrom) {
      this.getAllPendingRequestsFrom();
    } else {
      this.resultsPendingFrom = [];
    }
  }

    toogleActiveAccept() {
      this.isActiveAccept = !this.isActiveAccept;
      if (this.isActiveAccept) {
        this.getAllAcceptedRequestsFor();
      } else {
        this.resultsAcceptedFor = [];
      }
    }
}
