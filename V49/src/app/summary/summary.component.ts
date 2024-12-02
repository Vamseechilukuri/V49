import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent implements AfterViewInit, OnDestroy {
  materials = [
    'materials_excl_rock', 'rock', 'concrete', 'steel', 'aluminum', 'chromium', 'glass',
    'iron', 'lithium', 'manganese', 'nickel', 'phosphate', 'solar_pv_cover_glass', 'silicon',
    'copper', 'niobium', 'molybdenum', 'magnesium', 'lead', 'graphite', 'silver', 'tin',
    'cobalt', 'boron', 'rare_earths', 'uranium', 'titanium', 'tungsten', 'zinc'
  ];

  selectedMaterial = 'concrete'; // Default material to be displayed
  chartInstance: Chart | null = null; // Store chart instance to destroy later
  chartDescription: string = ''; // Description for the chart
  sourceLink: string = ''; // Source URL

  constructor(private http: HttpClient) {}

  ngAfterViewInit() {
    this.loadChart(this.selectedMaterial); // Initial chart load
  }

  ngOnDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy(); // Destroy chart instance when the component is destroyed
    }
  }

  loadChart(material: string) {
    this.http.get(`http://localhost:3000/api/summary-chart?material=${material}`).subscribe((data: any) => {
      // Destroy previous chart instance if exists
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      // Bar chart for clean energy data
      this.chartInstance = new Chart('summaryBarChart', {
        type: 'bar',
        data: {
          labels: data.map((item: any) => item.label),
          datasets: [
            {
              label: `${material} Usage`,
              data: data.map((item: any) => item.value),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      // Pie chart for energy source distribution
      new Chart('summaryPieChart', {
        type: 'pie',
        data: {
          labels: data.map((item: any) => item.label),
          datasets: [
            {
              label: `${material} Distribution`,
              data: data.map((item: any) => item.value),
              backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 159, 64, 0.6)',
                'rgba(75, 192, 192, 0.6)',
                'rgba(153, 102, 255, 0.6)',
              ],
              borderColor: 'rgba(255, 159, 64, 1)',
              borderWidth: 1,
            },
          ],
        },
      });

      // Set the description and source
      this.chartDescription = `The bar chart shows the usage of the material "${material}" across different entities for the year 2022. The values represent the amount of material used in different clean energy technologies.`;
      this.sourceLink = "Source: Your data source URL here (e.g., database or report)";
    });
  }

  onMaterialChange(material: string) {
    this.selectedMaterial = material;
    this.loadChart(material); // Reload the chart with the new material
  }
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
}
