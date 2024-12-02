import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone:true,
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loginError = false;  // Flag to display error message if login fails
  token:string|null=null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialize the login form with required validations
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],  // Username is required
      password: ['', [Validators.required]],  // Password is required
    });
  }

  navigateToSignup(): void {
    this.router.navigate(['/signup']);  // Navigate to the signup page
  }
  onSubmit(): void {
    const { username, password } = this.loginForm.value;

    // Call the AuthService to validate credentials against the backend
    this.authService.login(username, password).subscribe((response) => {
      if (response.token) {
        // If login is successful, store the token and navigate to the dashboard
        localStorage.setItem('jwtToken', response.token);
        this.token=response.token;
        console.log("Token:,",this.token);
        this.router.navigate(['/dashboard']);
      } else {
        // If login fails, show the error message
        this.loginError = true;
      }
    });
  }
}
