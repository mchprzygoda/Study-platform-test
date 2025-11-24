import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { SubjectService } from "../subject/subject.service";
import { SubjectModel } from "../subject/subject.model";

@Component({
  selector: 'study-platform',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './study-platform.component.html',
  styleUrls: ['./study-platform.component.scss']
})
export class StudyPlatform {
  private subjectService = inject(SubjectService);

  readonly subjects$ = toSignal(this.subjectService.getSubjects(), { initialValue: [] as SubjectModel[] });
}