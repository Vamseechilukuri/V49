import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators'; // Import tap here
import { AlertService } from './alert.service'; // Import AlertService
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'http://104.131.166.122:3000'; // Base URL of the backend API

  constructor(private http: HttpClient, private alertService: AlertService, private router: Router) {} // Inject AlertService

  // Login method to call backend API
  login(username: string, password: string): Observable<any> {
    return this.http.post<{ token: string }>(`${this.apiUrl}/auth/login`, { username, password }).pipe(
      tap((response) => {
        if (response.token && !localStorage.getItem('jwtToken')) {
          localStorage.setItem('jwtToken', response.token); // Store JWT token
          this.alertService.triggerAlert('Login successful!', 'success'); // Trigger success alert

          // Track token expiration
          this.trackTokenExpiry(response.token);
        }
      }),
      catchError((error) => {
        this.alertService.triggerAlert('Invalid username or password.', 'error'); // Trigger error alert
        return of({ error: 'Invalid username or password' });
      })
    );
  }

  // Handle token expiration
  handleTokenExpiry(error: any): void {
    if (error.status === 401) {
      this.logout();  // Logout if token has expired
      this.alertService.triggerAlert('Your session has expired. Please log in again.', 'error');
      this.router.navigate(['/login']);  // Redirect to login page
    }
  }

  // Any other authenticated API call
  getProtectedData(): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.apiUrl}/some-protected-endpoint`, { headers }).pipe(
      catchError((error) => {
        this.handleTokenExpiry(error);  // Handle token expiry on protected routes
        return of({});
      })
    );
  }

  signup(fullName: string, email: string, username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, { fullName, email, username, password });
  }

  // Check if the user is logged in by checking if a token exists in localStorage
  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwtToken');
  }

  // Method to get the stored JWT token
  getToken(): string | null {
    return localStorage.getItem('jwtToken');
  }

  // Method to attach the token to outgoing HTTP requests
  getAuthHeaders(): { [header: string]: string } {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Log out the user by clearing the JWT token from localStorage
  logout(): void {
    localStorage.removeItem('jwtToken'); // Clear token
    this.alertService.triggerAlert('Logout successful!', 'success'); // Trigger success alert
  }

  // New function to automatically check token expiration on page load (optional)
  checkTokenExpiry(): void {
    const token = this.getToken();
    if (token) {
      const tokenExpiration = this.getTokenExpiration(token);
      const currentTime = Math.floor(Date.now() / 1000);
      if (tokenExpiration < currentTime) {
        this.logout();  // Automatically log out if the token is expired
        this.alertService.triggerAlert('Your session has expired. Please log in again.', 'error');
        this.router.navigate(['/login']);  // Redirect to login page
      }
    }
  }

  // Decode JWT token and get expiration time (in seconds)
  private getTokenExpiration(token: string): number {
    const payload = JSON.parse(atob(token.split('.')[1])); // Decode the JWT payload
    return payload.exp;  // Return the expiration time (in seconds)
  }

  // Track token expiration and show a warning 10 seconds before it expires
  private trackTokenExpiry(token: string): void {
    const tokenExpiration = this.getTokenExpiration(token) * 1000; // Get expiration time in milliseconds
    const currentTime = Date.now();
    const timeLeft = tokenExpiration - currentTime;

    if (timeLeft > 0) {
      setTimeout(() => {
        this.showSessionExpiryWarning();
      }, timeLeft - 10000); // Show warning 10 seconds before expiry
    }
  }

  // Show a session expiration warning
  private showSessionExpiryWarning(): void {
    // Trigger a custom alert before logout
    this.alertService.triggerAlert('Your session will expire in 10 seconds. Please log in again.', 'error');

    // Automatically log the user out and redirect to login
    setTimeout(() => {
      this.logout();
      this.router.navigate(['/login']);  // Redirect to login page
    }, 10000); // After 10 seconds, logout the user
  }
}
