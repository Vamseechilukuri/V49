import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent implements OnInit {
  chart: any;
  chartData: any[] = []; // Holds the fetched data

  // Define the API URL for fetching reports data
  private apiUrl = 'http://104.131.166.122:3000/api/reports-chart'; // Replace with your backend URL

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Fetch data from the backend API
    this.http.get<any[]>(this.apiUrl).subscribe(
      (data) => {
        console.log('Raw Data:', data); // Debug: log the raw data from the API
        this.chartData = data.filter((item) => item.entity !== 'Gold');
        console.log('Filtered Data:', this.chartData); // Debug: log the filtered data

        if (this.chartData.length > 0) {
          this.renderChart();
        } else {
          console.error('No data available for the chart after filtering.');
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  renderChart() {
    const entities = this.chartData.map((item) => item.entity);
    const ratios = this.chartData.map((item) => item.ratio);

    console.log('Entities for chart:', entities);
    console.log('Ratios for chart:', ratios);

    if (this.chart) {
      this.chart.destroy(); // Destroy any existing chart instance to avoid conflicts
    }

    this.chart = new Chart('chartCanvas', {
      type: 'bar',
      data: {
        labels: entities,
        datasets: [
          {
            label: 'Rock to Metal Ratio',
            data: ratios,
            backgroundColor: '#3e95cd',
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Entity',
            },
          },
          y: {
            title: {
              display: true,
              text: 'Ratio',
            },
          },
        },
      },
    });
  }
}
