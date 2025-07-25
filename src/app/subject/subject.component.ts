import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "../footer/footer.component";
import { HeaderComponent } from "../header/header.component";
import { SubjectService } from "./subject.service";
import { SubjectModel } from "./subject.model";
import { FormsModule } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    FooterComponent,
    HeaderComponent
  ],
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent {
  subjectService = inject(SubjectService);

  newSubjectName = '';
  newSubjectType = '';

  readonly subjects = toSignal(this.subjectService.getSubjects(), {
    initialValue: []
  });

  async addSubject() {
    const name = this.newSubjectName.trim();
    const type = this.newSubjectType.trim();

    if (!name || !type) return;

    await this.subjectService.addSubject({
      name,
      subjectType: type
    });

    this.newSubjectName = '';
    this.newSubjectType = '';
  }
}