import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { filter } from 'rxjs'; // Ensure 'filter' is imported from 'rxjs'
import { AlertComponent } from './alert/alert.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent,AlertComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'] // Corrected the typo from 'styleUrl' to 'styleUrls'
})
export class AppComponent implements OnInit {
  title = 'v49';

  showAlert = false; // Flag to show the alert
  alertMessage = ''; // Message to be shown in the alert
  alertType = 'success'; // Type of the alert ('success', 'error', 'info')

  triggerAlert(type: string, message: string) {
    this.alertType = type;
    this.alertMessage = message;
    this.showAlert = true;

    // Automatically hide alert after 4 seconds
    setTimeout(() => {
      this.showAlert = false;
    }, 4000);
  }
  constructor(private router: Router) {}

  ngOnInit(): void {
    // Subscribe to the router events, filtering to get only NavigationEnd
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd) // Only process NavigationEnd events
      )
      .subscribe((event) => {
        // Handle the event as NavigationEnd explicitly
        const navigationEndEvent = event as NavigationEnd;

        // Use the event to check the URL and manage the background class
        if (navigationEndEvent.urlAfterRedirects.includes('/summary') || navigationEndEvent.urlAfterRedirects.includes('/reports')) {
          document.body.classList.add('no-background');
        } else {
          document.body.classList.remove('no-background');
        }
      });
  }
}
