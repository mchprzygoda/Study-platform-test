import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { FooterComponent } from "../../footer/footer.component";
import { HeaderComponent } from "../../header/header.component";
import { SubjectService } from "./subject.service";
import { SubjectModel } from "./subject.model";
import { FormsModule } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";
import { CardComponent } from "../../card/card.component";
import { ModalNoteComponent } from "../modal-note/modal-note.component";
import { NoteModel } from "./note.model";

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    FormsModule,
    FooterComponent,
    HeaderComponent,
    CardComponent,
    ModalNoteComponent
  ],
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent {
  subjectService = inject(SubjectService);

  newSubjectName = '';
  newSubjectType = '';

  isModalOpen = false;
  isEditMode = false;
  selectedNote: { id?: string; title: string; content: string } | null = null;
  selectedSubjectId: string | null = null;

  readonly subjects = toSignal(this.subjectService.getSubjects(), {
    initialValue: []
  });

  notesMap: Record<string, NoteModel[]> = {};

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

  async onFormSubmit(noteData: { title: string; content: string }) {
    if (!this.selectedSubjectId) {
      console.error('Brak subjectId przy dodawaniu/edycji notatki');
      return;
    }

    try {
      if (this.isEditMode && this.selectedNote?.id) {
        console.warn('Brak implementacji updateNote w serwisie');
      } else {
        await this.subjectService.addNote(this.selectedSubjectId, noteData);
        this.loadNotes(this.selectedSubjectId);
      }
    } catch (err) {
      console.error('Błąd podczas zapisu notatki:', err);
    }

    this.closeModal();
  }

  openModal(mode: 'create' | 'edit', subjectId: string, note?: any) {
    this.isModalOpen = true;
    this.isEditMode = mode === 'edit';
    this.selectedNote = note ?? { title: '', content: '' };
    this.selectedSubjectId = subjectId;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedNote = null;
    this.selectedSubjectId = null;
  }

  loadNotes(subjectId: string) {
    this.subjectService.getNotes(subjectId).subscribe(notes => {
      this.notesMap[subjectId] = notes;
    });
  }

  getNotes(subjectId: string): NoteModel[] {
    return this.notesMap[subjectId] ?? [];
  }
}