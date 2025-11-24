import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { LogRegisterFormComponent } from '../logRegisterForm/form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, LogRegisterFormComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  authService = inject(AuthService);
  router = inject(Router);

  errorMessage: string | null = null;

  onSubmit(data: { email: string; password: string; username?: string }): void {
    // Resetuj poprzedni błąd
    this.errorMessage = null;

    // Walidacja - sprawdź czy username jest podany
    if (!data.username || data.username.trim() === '') {
      this.errorMessage = 'Username is required';
      return;
    }

    this.authService
      .register(data.email, data.username.trim(), data.password)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          console.error('Registration error:', err);
          // Lepsza obsługa błędów Firebase
          if (err.code) {
            this.errorMessage = this.getErrorMessage(err.code);
          } else {
            this.errorMessage = err.message || 'An error occurred during registration';
          }
        }
      });
  }

  private getErrorMessage(code: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/email-already-in-use': 'This email is already registered',
      'auth/invalid-email': 'Invalid email address',
      'auth/operation-not-allowed': 'Registration is not allowed',
      'auth/weak-password': 'Password should be at least 6 characters',
      'auth/missing-email': 'Email is required',
      'auth/missing-password': 'Password is required'
    };
    return errorMessages[code] || `Registration failed: ${code}`;
  }
}