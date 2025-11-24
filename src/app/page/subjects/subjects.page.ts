import { Component } from '@angular/core';
import { SubjectComponent } from '../../features/subject/subject.component';
import { HeaderComponent } from '../../header/header.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-subjects-page',
  standalone: true,
  imports: [HeaderComponent, SubjectComponent, FooterComponent],
  templateUrl: './subjects.page.html',
})
export class SubjectsPage {}


