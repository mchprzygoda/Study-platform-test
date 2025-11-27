import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SubjectService } from '../../../subject/subject.service';
import { SubjectModel } from '../../../subject/subject.model';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent {
  private subjectService = inject(SubjectService);
  private router = inject(Router);

  readonly subjects = toSignal(this.subjectService.getSubjects(), {
    initialValue: [] as SubjectModel[]
  });

  navigateToQuizDetail(subjectId: string) {
    this.router.navigate(['/quiz', subjectId]);
  }
}

