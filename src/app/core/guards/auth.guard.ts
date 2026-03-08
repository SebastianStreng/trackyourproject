import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/auth-service/authentification-service';

export const authGuard = () => {
  const authService = inject(AuthenticationService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true;
  }

  router.navigate(['/Login']);
  return false;
};
