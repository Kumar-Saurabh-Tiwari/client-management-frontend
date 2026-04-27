import { Component, signal } from '@angular/core';
import { HealthService } from './services/health.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  standalone: false,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('client-management-frontend');
  constructor(private healthService: HealthService) { }

  ngOnInit(): void {
    this.healthService.checkHealth().subscribe({
      next: (response) => {
        console.log('Health check result:', response);
      },
      error: (error) => {
        console.error('Error occurred while checking health:', error);
      }
    });
  }
}
