import { inject, Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  collectionData,
  addDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { SubjectModel } from './subject.model';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class SubjectService {
  private firestore = inject(Firestore);
  private authService = inject(AuthService);

  async addSubject(subject: { name: string; subjectType: string }): Promise<void> {
    const user = this.authService.getUser();
    if (!user) throw new Error('User not logged in');

    const subjectsRef = collection(this.firestore, 'subjects');

    await addDoc(subjectsRef , {
      name: subject.name,
      subjectType: subject.subjectType,
      ownerId: user.uid
    })
  }

  getSubjects(): Observable<SubjectModel[]> {
    return this.authService.userChanges().pipe(
      switchMap(user => {
        if (!user) return of([]);

        const subjectsRef = collection(this.firestore, 'subjects');
        const q = query(subjectsRef, where('ownerId', '==', user.uid));
        return collectionData(q, { idField: 'id' }) as Observable<SubjectModel[]>;
      })
    );
  }
}