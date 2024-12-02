import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service'; // Import AuthService
import { Router } from '@angular/router'; // Import Router for redirection

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  topicSummary = `
    Clean energy innovations have seen significant advancements over the last six months.
    Breakthroughs in solar panel efficiency now allow for up to 40% energy conversion rates
    by utilizing multi-junction cells, making solar energy more viable in areas with lower sunlight.
    Additionally, the wind energy sector has introduced modular turbine designs that are easier to
    transport and assemble, enabling deployment in remote regions. Battery technology has also
    improved, with solid-state batteries emerging as a safer and more efficient option for electric
    vehicles and grid storage. These innovations collectively drive the shift towards more
    sustainable and scalable energy solutions, reducing the reliance on fossil fuels and minimizing
    environmental impact.

    Another key area of focus is the integration of AI in energy grid optimization. Smart grid
    technologies powered by AI algorithms can now predict energy demand more accurately, optimize
    energy distribution, and reduce wastage. Furthermore, carbon capture and storage (CCS) solutions
    have advanced, with pilot projects successfully capturing and reusing industrial CO₂ emissions
    in concrete production and synthetic fuel manufacturing.
  `;
  sourceUrl =
    'https://ourworldindata.org/low-carbon-technologies-need-far-less-mining-fossil-fuels';

  techDetails = `
    This application is a Single Page Application (SPA) designed to provide insights into recent
    innovations in clean energy. The frontend is built using Angular, leveraging its powerful
    two-way data binding and component-based architecture to ensure a responsive user experience.
    The backend is developed using Node.js with Express.js for handling API routes and CORS-enabled
    HTTP calls. MySQL is used as the relational database for storing user information and chart data,
    ensuring robust data management.

    JWT (JSON Web Token) authentication secures access to the application, ensuring only authorized
    users can interact with protected routes like the Dashboard, Summary, and Reports pages. The
    Summary and Reports pages feature dynamic charts created using charts.js, which visualize data fetched
    asynchronously from the backend. These charts are designed to provide users with meaningful insights
    into clean energy trends.
  `;

  constructor(private authService: AuthService, private router: Router) {}

  // On component initialization, check if the token is expired
  ngOnInit(): void {
    this.authService.checkTokenExpiry(); // Check if the token has expired on page load
    this.loadData(); // Load any data or logic for the dashboard here
  }

  // This method is just a placeholder for any logic you'd need on the dashboard
  loadData(): void {
    // Example: load some data for your dashboard
    console.log('Dashboard data loaded');
  }
}
