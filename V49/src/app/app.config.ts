// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';  // For reactive forms
import { HttpClientModule, provideHttpClient } from '@angular/common/http';  // Import HttpClientModule
import { ApplicationConfig } from '@angular/core';  // Import provideRouter and ApplicationConfig
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';  // Your login component
import { AppRoutingModule,routes } from './app.routes';  // If you're using routing
import { NavbarComponent } from './navbar/navbar.component';
import { SummaryComponent } from './summary/summary.component';
import { ReportsComponent } from './reports/reports.component';
import { SignupComponent } from './signup/signup.component';
import { AlertComponent } from './alert/alert.component';

NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    SummaryComponent,
    ReportsComponent,
    SignupComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,  // For reactive forms
    HttpClientModule,     // Add HttpClientModule here
    AppRoutingModule,      // If using routing
    NavbarComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes),provideHttpClient()]
};
