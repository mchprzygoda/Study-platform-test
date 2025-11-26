import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { Router, RouterModule } from "@angular/router";
import { toSignal } from "@angular/core/rxjs-interop";
import { SubjectService } from "../subject/subject.service";
import { AuthService } from "../auth/auth.service";
import { NoteModel } from "../subject/note.model";
import { CardComponent } from "../../card/card.component";

interface RecentNote extends NoteModel {
  subjectId: string;
  subjectName: string;
}

@Component({
  selector: 'study-platform',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent],
  templateUrl: './study-platform.component.html',
  styleUrls: ['./study-platform.component.scss']
})
export class StudyPlatform {
  private subjectService = inject(SubjectService);
  private authService = inject(AuthService);
  private router = inject(Router);

  readonly currentUser = this.authService.userSignal();
  readonly recentNotes = toSignal(this.subjectService.getRecentNotes(5), { 
    initialValue: [] as RecentNote[] 
  });

  navigateToNote(note: RecentNote) {
    this.router.navigate(['/subjects'], { 
      queryParams: { subjectId: note.subjectId } 
    });
  }
}