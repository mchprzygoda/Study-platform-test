import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuizComponent } from '../../features/quiz/components/quiz-list/quiz.component';
import { QuizDetailComponent } from '../../features/quiz/components/quiz-detail/quiz-detail.component';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, QuizComponent, QuizDetailComponent, FooterComponent],
  templateUrl: './quiz.page.html',
})
export class QuizPage implements OnInit {
  private route = inject(ActivatedRoute);
  
  hasSubjectId = signal(false);

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.hasSubjectId.set(!!params['id']);
    });
  }
}

