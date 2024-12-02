import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service'; // Make sure the AuthService is properly imported
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AlertService } from '../alert.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule], // Make sure ReactiveFormsModule is imported
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  signupError = ''; // To hold error messages during signup

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, // Make sure this service is implemented
    private router: Router, // Make sure this is imported correctly
    private alertService:AlertService
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(3)]], // Full Name field with validation
      email: ['', [Validators.required, Validators.email]], // Email field with validation
      username: ['', [Validators.required]], // Username field with validation
      password: ['', [Validators.required]], // Password field with validation
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']); // Navigate to login page
  }

  onSubmit(): void {
    const { fullName, email, username, password } = this.signupForm.value;

    // Ensure the form is valid before making the HTTP call
    if (this.signupForm.valid) {
      this.authService.signup(fullName, email, username, password).subscribe(
        (response) => {
          this.alertService.triggerAlert('Signup successful! Please log in.', 'success');
          this.router.navigate(['/login']);
        },
        (error) => {
          // Handle errors that may come from the backend
          this.signupError = error.error.message || 'An error occurred during sign-up.';
          this.alertService.triggerAlert(this.signupError, 'danger');
        }
      );
    } else {
      // Optional: You can add a message here to indicate the form is invalid
      this.signupError = 'Please fill in the required fields correctly.';
    }
  }
}
