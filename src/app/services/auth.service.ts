import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_BASE_URL } from '../core/api.config';

interface AuthPayload {
  name?: string;
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly tokenKey = 'cms_token';
  private readonly userKey = 'cms_user';
  private readonly authApiUrl = `${API_BASE_URL}/users`;

  constructor(private http: HttpClient, @Inject(PLATFORM_ID) private platformId: object) {}

  register(payload: AuthPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.authApiUrl}/register`, payload)
      .pipe(tap((response) => this.persistAuth(response)));
  }

  login(payload: AuthPayload): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.authApiUrl}/login`, payload)
      .pipe(tap((response) => this.persistAuth(response)));
  }

  logout(): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }

  getToken(): string | null {
    if (!this.isBrowser()) {
      return null;
    }

    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUserName(): string {
    if (!this.isBrowser()) {
      return '';
    }

    const rawUser = localStorage.getItem(this.userKey);

    if (!rawUser) {
      return '';
    }

    try {
      const user = JSON.parse(rawUser) as { name?: string };
      return user.name || '';
    } catch {
      return '';
    }
  }

  private persistAuth(response: AuthResponse): void {
    if (!this.isBrowser()) {
      return;
    }

    localStorage.setItem(this.tokenKey, response.token);
    localStorage.setItem(this.userKey, JSON.stringify(response.user));
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }
}
