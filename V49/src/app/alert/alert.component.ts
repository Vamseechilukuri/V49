import { Component, OnInit } from '@angular/core';
import { AlertService } from '../alert.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone:true,
  imports:[CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  alerts: { message: string; type: string }[] = [];

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.alertService.alert$.subscribe((alert) => {
      this.alerts.push(alert);

      // Remove the alert after 3-4 seconds
      setTimeout(() => {
        this.alerts.shift();
      }, 6000);
    });
  }
}
