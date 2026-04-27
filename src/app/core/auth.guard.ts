import { Injectable } from '@angular/core';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  canActivate(): boolean | UrlTree {
    // During SSR, allow route rendering and defer auth enforcement to browser.
    if (!isPlatformBrowser(this.platformId)) {
      return true;
    }

    if (this.authService.isAuthenticated()) {
      return true;
    }

    return this.router.createUrlTree(['/login']);
  }
}
