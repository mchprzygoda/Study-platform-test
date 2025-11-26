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
  limit,
  getDocs,
} from '@angular/fire/firestore';
import { Observable, of, switchMap, map, from } from 'rxjs';
import { SubjectModel } from './subject.model';
import { AuthService } from '../auth/auth.service';
import { NoteModel } from './note.model';

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

  getNotes(subjectId: string): Observable<NoteModel[]> {
    const notesRef = collection(this.firestore, `subjects/${subjectId}/notes`);
    return collectionData(notesRef, { idField: 'id' }) as Observable<NoteModel[]>;
  }

  async addNote(subjectId: string, note: { title: string; content: string }): Promise<void> {
    const notesRef = collection(this.firestore, `subjects/${subjectId}/notes`);
    await addDoc(notesRef, {
      title: note.title,
      content: note.content,
      createdAt: Timestamp.now(),
    });
  }

  async updateNote(subjectId: string, noteId: string, note: { title: string; content: string }): Promise<void> {
    const noteDocRef = doc(this.firestore, `subjects/${subjectId}/notes/${noteId}`);
    await updateDoc(noteDocRef, {
      title: note.title,
      content: note.content,
      updatedAt: Timestamp.now(),
    });
  }

  async deleteNote(subjectId: string, noteId: string): Promise<void> {
    const noteDocRef = doc(this.firestore, `subjects/${subjectId}/notes/${noteId}`);
    await deleteDoc(noteDocRef);
  }

  getRecentNotes(limitCount: number = 5): Observable<Array<NoteModel & { subjectId: string; subjectName: string }>> {
    return this.authService.userChanges().pipe(
      switchMap(user => {
        if (!user) return of([]);

        return this.getSubjects().pipe(
          switchMap(subjects => {
            if (subjects.length === 0) return of([]);

            // Pobierz notatki ze wszystkich przedmiotów
            const notePromises = subjects.map(subject =>
              getDocs(
                query(
                  collection(this.firestore, `subjects/${subject.id}/notes`),
                  orderBy('createdAt', 'desc'),
                  limit(limitCount)
                )
              ).then(snapshot => 
                snapshot.docs.map(doc => ({
                  ...doc.data() as NoteModel,
                  id: doc.id,
                  subjectId: subject.id!,
                  subjectName: subject.name
                }))
              )
            );

            return from(Promise.all(notePromises)).pipe(
              map(allNotes => {
                // Połącz wszystkie notatki i posortuj po dacie
                const flattened = allNotes.flat();
                return flattened
                  .sort((a, b) => {
                    const aTime = a.createdAt?.toMillis?.() || 0;
                    const bTime = b.createdAt?.toMillis?.() || 0;
                    return bTime - aTime;
                  })
                  .slice(0, limitCount);
              })
            );
          })
        );
      })
    );
  }
}