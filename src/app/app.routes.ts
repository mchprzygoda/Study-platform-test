import { Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { StudyPlatform } from './study-platform/study-platform.component';
import { authGuard } from './auth/auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SubjectComponent } from './subject/subject.component';

export const routes: Routes = [
  {
    path:'',
    pathMatch: 'full',
    redirectTo: 'main'
  },
  {
    path: 'main',
    component: StudyPlatform,
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
    component: SubjectComponent
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
