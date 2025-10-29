import { Routes } from '@angular/router';
import { AuthComponent } from './features/auth/auth.component';
import { StudyPlatform } from './features/study-platform/study-platform.component';
import { authGuard } from './features/auth/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { SubjectComponent } from './features/subject/subject.component';

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
