import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  query,
  where,
  Timestamp,
  doc,
  updateDoc,
  deleteDoc,
  orderBy,
} from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { QuestionModel, AnswerOption } from '../models/question.model';
import { AuthService } from '../../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class QuizService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  // Get all questions for a subject
  getQuestions(subjectId: string): Observable<QuestionModel[]> {
    const questionsRef = collection(this.firestore, `quizzes/${subjectId}/questions`);
    const q = query(questionsRef, orderBy('createdAt', 'desc'));
    return collectionData(q, { idField: 'id' }) as Observable<QuestionModel[]>;
  }

  // Add a new question
  async addQuestion(question: Omit<QuestionModel, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> {
    const user = this.authService.getUser();
    if (!user) throw new Error('User not logged in');

    const questionsRef = collection(this.firestore, `quizzes/${question.subjectId}/questions`);
    
    await addDoc(questionsRef, {
      subjectId: question.subjectId,
      question: question.question,
      answers: question.answers,
      type: question.type,
      createdAt: Timestamp.now(),
    });
  }

  // Update an existing question
  async updateQuestion(
    subjectId: string,
    questionId: string,
    question: { question: string; answers: AnswerOption[]; type: 'single' | 'multiple' }
  ): Promise<void> {
    const questionDocRef = doc(this.firestore, `quizzes/${subjectId}/questions/${questionId}`);
    await updateDoc(questionDocRef, {
      question: question.question,
      answers: question.answers,
      type: question.type,
      updatedAt: Timestamp.now(),
    });
  }

  // Delete a question
  async deleteQuestion(subjectId: string, questionId: string): Promise<void> {
    const questionDocRef = doc(this.firestore, `quizzes/${subjectId}/questions/${questionId}`);
    await deleteDoc(questionDocRef);
  }
}

