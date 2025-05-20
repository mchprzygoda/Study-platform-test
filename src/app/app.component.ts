import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { RouterOutlet } from '@angular/router';
import { Observable } from 'rxjs';

interface SubjectModel {
  readonly name : string;
  readonly subjectType: string;
}

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent {
  private _client = inject(AngularFirestore);

  getSubjects(): Observable<SubjectModel[]> {
    return this._client.collection<SubjectModel>('subjects').valueChanges()
  }

  readonly subjects$: Observable<SubjectModel[]> = this.getSubjects();
}
