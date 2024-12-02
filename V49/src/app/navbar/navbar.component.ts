import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent implements OnInit {
  isSignupPage: boolean = false;

  constructor(public authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Listen for route changes to determine if we are on the signup page
    this.router.events.subscribe(() => {
      this.isSignupPage = this.router.url.includes('/signup');
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect to login page
  }
}
