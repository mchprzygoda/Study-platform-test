import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
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
    this.authService
      .register(data.email, data.username ?? '', data.password)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.errorMessage = err.code;
        }
      });
  }
}