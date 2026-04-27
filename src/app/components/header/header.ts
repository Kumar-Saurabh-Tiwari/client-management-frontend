import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(private authService: AuthService, private router: Router) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  userName(): string {
    return this.authService.getUserName();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

}
