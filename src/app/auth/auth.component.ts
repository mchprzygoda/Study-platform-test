import { Component, inject } from "@angular/core";
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from "@angular/common";
import { Observable } from "rxjs";
import { Router } from "@angular/router";


@Component({
  selector:'app-auth',
  imports: [ FormsModule ],
  standalone: true,
  templateUrl: './auth.component.html'
})
export class AuthComponent {
  isLoginMode = true;

  private router: Router = inject(Router);

  // onSwitchMode() {
  //   this.isLoginMode = !this.isLoginMode;
  // }

  // onSubmit(form: NgForm) {
  //   if (!form.valid) {
  //     return;
  //   }
  //   const email =  form.value.email;
  //   const password = form.value.password;

  //   let authObs: Observable<AuthResponseData>;

  //   if (this.isLoginMode) {
  //     authObs = this.authService.logIn(email, password);
  //   } else {
  //     authObs = this.authService.signUp(email, password);
  //   }


  //   authObs.subscribe({
  //     next: (resData) => {
  //       console.log(resData);
  //       this.router.navigate(['/main']);
  //     },
  //     error: (err) => console.error(err),
  //   });

  //   form.reset();
  // }

  
}