import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('CC_Token');

    if (token) {
      return true;
    }

    // Sinon rediriger vers login
    this.router.navigate(['/login']);
    return false;
  }
}
