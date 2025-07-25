import { HttpClient } from "@angular/common/http";
import { Component, inject } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { LogRegisterFormComponent } from "../logRegisterForm/form.component";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LogRegisterFormComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  isLoginOpen: boolean = true;

  fb = inject(FormBuilder);
  httpClient = inject(HttpClient);
  router = inject(Router);
  authService = inject(AuthService);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  errorMessage: string | null = null;

  onSubmit(data: { email: string; password: string; username?: string }): void {
    this.authService
      .login(data.email, data.password)
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/');
        },
        error: (err) => {
          this.errorMessage = err.code;
        },
      });
  }
}