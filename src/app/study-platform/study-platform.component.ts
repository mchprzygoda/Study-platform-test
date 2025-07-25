import { CommonModule } from "@angular/common";
import { Component, inject, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { Firestore, collection, collectionData } from "@angular/fire/firestore";
import { toSignal } from "@angular/core/rxjs-interop";

interface SubjectModel {
  readonly name: string;
  readonly subjectType: string;
}

@Component({
  selector: 'study-platform',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FooterComponent, HeaderComponent],
  templateUrl: './study-platform.component.html',
  styleUrls: ['./study-platform.component.scss']
})
export class StudyPlatform {
  private firestore = inject(Firestore);
  authService = inject(AuthService);

  getSubjects(): Observable<SubjectModel[]> {
    const col = collection(this.firestore, 'subjects');
    return collectionData(col, { idField: 'id' }) as Observable<SubjectModel[]>;
  }

  readonly subjects$ = toSignal(this.getSubjects(), { initialValue: [] });
}