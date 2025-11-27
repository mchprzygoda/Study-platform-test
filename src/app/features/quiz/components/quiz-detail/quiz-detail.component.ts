import { CommonModule } from '@angular/common';
import { Component, inject, signal, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { QuizService } from '../../services/quiz.service';
import { SubjectService } from '../../../subject/subject.service';
import { QuestionModel, AnswerOption } from '../../models/question.model';
import { SubjectModel } from '../../../subject/subject.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { Subscription, filter, first } from 'rxjs';

@Component({
  selector: 'app-quiz-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './quiz-detail.component.html',
  styleUrls: ['./quiz-detail.component.scss']
})
export class QuizDetailComponent implements OnInit, OnDestroy {
  private quizService = inject(QuizService);
  private subjectService = inject(SubjectService);
  private route = inject(ActivatedRoute);
  router = inject(Router);
  private fb = inject(FormBuilder);

  private questionsSubscription?: Subscription;

  subjectId = signal<string | null>(null);
  subject = signal<SubjectModel | null>(null);
  questions = signal<QuestionModel[]>([]);

  // Modal state
  isQuestionModalOpen = signal(false);
  isEditMode = signal(false);
  selectedQuestion = signal<QuestionModel | null>(null);

  // Quiz start panel state
  isQuizStartPanelOpen = signal(false);
  numberOfQuestions = signal(5);
  duration = signal(5); // in minutes

  // Form for question
  questionForm = this.fb.nonNullable.group({
    question: ['', [Validators.required, Validators.minLength(1)]],
    type: ['single' as 'single' | 'multiple', Validators.required],
    answers: this.fb.array<FormControl<{ id: string; text: string; isCorrect: boolean }>>([])
  });

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.subjectId.set(id);
        this.loadSubject(id);
        this.loadQuestions(id);
      }
    });
  }

  ngOnDestroy() {
    if (this.questionsSubscription) {
      this.questionsSubscription.unsubscribe();
    }
  }

  loadSubject(subjectId: string) {
    this.subjectService.getSubjects().pipe(
      filter(subjects => subjects.length > 0),
      first()
    ).subscribe(subjects => {
      const subject = subjects.find(s => s.id === subjectId);
      if (subject) {
        this.subject.set(subject);
      } else {
        this.router.navigate(['/quiz']);
      }
    });
  }

  loadQuestions(subjectId: string) {
    if (this.questionsSubscription) {
      this.questionsSubscription.unsubscribe();
    }
    this.questionsSubscription = this.quizService.getQuestions(subjectId).subscribe(questions => {
      this.questions.set(questions);
    });
  }

  get answersFormArray() {
    return this.questionForm.get('answers') as FormArray;
  }

  // Question modal methods
  openQuestionModal(question?: QuestionModel) {
    if (question) {
      this.isEditMode.set(true);
      this.selectedQuestion.set(question);
      this.questionForm.patchValue({
        question: question.question,
        type: question.type
      });
      
      // Clear existing answers
      while (this.answersFormArray.length > 0) {
        this.answersFormArray.removeAt(0);
      }
      
      // Add answers from question
      question.answers.forEach(answer => {
        this.answersFormArray.push(
          this.fb.control({
            id: answer.id,
            text: answer.text,
            isCorrect: answer.isCorrect
          } as AnswerOption)
        );
      });
    } else {
      this.isEditMode.set(false);
      this.selectedQuestion.set(null);
      this.questionForm.reset({
        question: '',
        type: 'single',
        answers: []
      });
      // Clear answers array
      while (this.answersFormArray.length > 0) {
        this.answersFormArray.removeAt(0);
      }
      // Add two default answers
      this.addAnswer();
      this.addAnswer();
    }
    this.isQuestionModalOpen.set(true);
  }

  closeQuestionModal() {
    this.isQuestionModalOpen.set(false);
    this.questionForm.reset();
    while (this.answersFormArray.length > 0) {
      this.answersFormArray.removeAt(0);
    }
    this.isEditMode.set(false);
    this.selectedQuestion.set(null);
  }

  addAnswer() {
    const answerControl = this.fb.control({
      id: this.generateId(),
      text: '',
      isCorrect: false
    } as AnswerOption);
    this.answersFormArray.push(answerControl);
  }

  removeAnswer(index: number) {
    if (this.answersFormArray.length > 2) {
      this.answersFormArray.removeAt(index);
    }
  }

  updateAnswerText(index: number, text: string) {
    const answerControl = this.answersFormArray.at(index);
    const currentValue = answerControl.value;
    answerControl.patchValue({
      ...currentValue,
      text: text
    });
  }

  toggleCorrectAnswer(index: number) {
    const answerControl = this.answersFormArray.at(index);
    const currentValue = answerControl.value;
    const questionType = this.questionForm.get('type')?.value;
    
    if (questionType === 'single') {
      // For single choice, uncheck all others and check this one
      this.answersFormArray.controls.forEach((control, i) => {
        if (i === index) {
          control.patchValue({ ...control.value, isCorrect: true });
        } else {
          control.patchValue({ ...control.value, isCorrect: false });
        }
      });
    } else {
      // For multiple choice, just toggle this one
      answerControl.patchValue({
        ...currentValue,
        isCorrect: !currentValue.isCorrect
      });
    }
  }

  async saveQuestion() {
    if (this.questionForm.invalid) return;
    if (this.answersFormArray.length < 2) {
      alert('Musisz dodać przynajmniej 2 odpowiedzi');
      return;
    }

    const formValue = this.questionForm.getRawValue();
    const subjectId = this.subjectId();
    if (!subjectId) return;

    const answers: AnswerOption[] = formValue.answers.map((a, index) => ({
      id: a.id || this.generateId(),
      text: a.text.trim(),
      isCorrect: a.isCorrect
    }));

    // Validate at least one correct answer
    if (!answers.some(a => a.isCorrect)) {
      alert('Musisz zaznaczyć przynajmniej jedną poprawną odpowiedź');
      return;
    }

    // Validate all answers have text
    if (answers.some(a => !a.text)) {
      alert('Wszystkie odpowiedzi muszą mieć tekst');
      return;
    }

    try {
      if (this.isEditMode() && this.selectedQuestion()?.id) {
        await this.quizService.updateQuestion(
          subjectId,
          this.selectedQuestion()!.id!,
          {
            question: formValue.question.trim(),
            answers: answers,
            type: formValue.type
          }
        );
      } else {
        await this.quizService.addQuestion({
          subjectId: subjectId,
          question: formValue.question.trim(),
          answers: answers,
          type: formValue.type
        });
      }
      this.closeQuestionModal();
    } catch (error) {
      console.error('Error saving question:', error);
      alert('Wystąpił błąd podczas zapisywania pytania');
    }
  }

  async deleteQuestion(question: QuestionModel) {
    if (!confirm('Czy na pewno chcesz usunąć to pytanie?')) return;
    
    const subjectId = this.subjectId();
    if (!subjectId || !question.id) return;

    try {
      await this.quizService.deleteQuestion(subjectId, question.id);
    } catch (error) {
      console.error('Error deleting question:', error);
      alert('Wystąpił błąd podczas usuwania pytania');
    }
  }

  // Quiz start panel methods
  toggleQuizStartPanel() {
    this.isQuizStartPanelOpen.set(!this.isQuizStartPanelOpen());
  }

  startQuiz() {
    const subjectId = this.subjectId();
    if (!subjectId) return;

    if (this.questions().length === 0) {
      alert('Brak pytań dla tego przedmiotu');
      return;
    }

    if (this.numberOfQuestions() > this.questions().length) {
      alert(`Masz tylko ${this.questions().length} pytań. Wybierz mniejszą liczbę.`);
      return;
    }

    // Navigate to quiz take component with parameters
    this.router.navigate(['/quiz', subjectId, 'take'], {
      queryParams: {
        questions: this.numberOfQuestions(),
        duration: this.duration()
      }
    });
    this.isQuizStartPanelOpen.set(false);
  }

  getDurationOptions(): number[] {
    const options: number[] = [];
    for (let i = 5; i <= 60; i += 5) {
      options.push(i);
    }
    return options;
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15);
  }
}

