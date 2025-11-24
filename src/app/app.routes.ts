import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { MainPage } from './page/main/main.page';
import { authGuard } from './features/auth/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { SubjectsPage } from './page/subjects/subjects.page';

export const routes: Routes = [
  {
    path:'',
    pathMatch: 'full',
    redirectTo: 'main'
  },
  {
    path: 'main',
    component: MainPage,
    canActivate: [authGuard]
  },
  {
    path: 'login', 
    component: LoginComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'subjects',
    component: SubjectsPage
  },
  // {
  //   path: 'quiz',
  //   component: QuizComponent
  // },
  // {
  //   path: 'calendar',
  //   component: CalendarComponent
  // },
  {
    path: '**',
    redirectTo: 'auth'
  }
];
