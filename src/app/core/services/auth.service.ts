import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.currentUserSubject.next({ token });
    }
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials)
      .pipe(tap(response => {
        if (response && response.token) {
          localStorage.setItem('token', response.token);
          this.currentUserSubject.next(response);
        }
      }));
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }
}
