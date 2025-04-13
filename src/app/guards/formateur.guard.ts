
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../authentification/auth.service';


@Injectable({
  providedIn: 'root',
})
export class formateurGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('CC_Token');
    const role = localStorage.getItem('role');

    if (token && role === 'formateur') {
      return true;
    }

    this.router.navigate(['/login']); // ou ['/unauthorized']
    return false;
  }
}
