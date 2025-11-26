import { CommonModule } from "@angular/common";
import { Component, inject, signal, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SubjectService } from "./subject.service";
import { SubjectModel } from "./subject.model";
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from "@angular/forms";
import { toSignal } from "@angular/core/rxjs-interop";
import { NoteModel } from "./note.model";
import { CardComponent } from "../../card/card.component";
import { Subscription } from "rxjs";
import { filter, first } from "rxjs/operators";

@Component({
  selector: 'app-subject',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent
  ],
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.scss']
})
export class SubjectComponent implements OnDestroy, OnInit {
  subjectService = inject(SubjectService);
  fb = inject(FormBuilder);
  route = inject(ActivatedRoute);
  router = inject(Router);
  
  private notesSubscription?: Subscription;
  private queryParamsSubscription?: Subscription;

  // Selected subject
  selectedSubject = signal<SubjectModel | null>(null);
  
  // Modals
  isSubjectModalOpen = signal(false);
  isNoteModalOpen = signal(false);
  
  // Note modal state
  isEditMode = signal(false);
  selectedNote = signal<NoteModel | null>(null);

  // Forms
  subjectForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    subjectType: ['', [Validators.required, Validators.minLength(1)]]
  });

  noteForm = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(1)]],
    content: ['', [Validators.required]]
  });

  readonly subjects = toSignal(this.subjectService.getSubjects(), {
    initialValue: [] as SubjectModel[]
  });

  notes = signal<NoteModel[]>([]);

  ngOnInit() {
    // Check for subjectId in query params first
    this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
      if (!params['subjectId']) return;
      
      const subjectId = params['subjectId'];
      
      // Wait for subjects to load, then find and select the subject
      this.subjectService.getSubjects().pipe(
        filter(subjects => subjects.length > 0),
        first()
      ).subscribe(subjects => {
        const subject = subjects.find(s => s.id === subjectId);
        
        if (subject) {
          // Use setTimeout to ensure view is ready
          setTimeout(() => {
            this.selectSubject(subject);
            // Clear query params after selection
            this.router.navigate([], {
              relativeTo: this.route,
              queryParams: {},
              replaceUrl: true
            });
          }, 150);
        }
      });
    });
  }

  // Subject methods
  openSubjectModal() {
    this.subjectForm.reset();
    this.isSubjectModalOpen.set(true);
  }

  closeSubjectModal() {
    this.isSubjectModalOpen.set(false);
    this.subjectForm.reset();
  }

  async addSubject() {
    if (this.subjectForm.invalid) return;

    const formValue = this.subjectForm.getRawValue();
    await this.subjectService.addSubject({
      name: formValue.name.trim(),
      subjectType: formValue.subjectType.trim()
    });

    this.closeSubjectModal();
  }

  selectSubject(subject: SubjectModel) {
    this.selectedSubject.set(subject);
    this.loadNotes(subject.id!);
  }

  loadNotes(subjectId: string) {
    if (this.notesSubscription) {
      this.notesSubscription.unsubscribe();
    }
    this.notesSubscription = this.subjectService.getNotes(subjectId).subscribe(notes => {
      this.notes.set(notes);
    });
  }

  ngOnDestroy() {
    if (this.notesSubscription) {
      this.notesSubscription.unsubscribe();
    }
    if (this.queryParamsSubscription) {
      this.queryParamsSubscription.unsubscribe();
    }
  }

  // Note methods
  openNoteModal(mode: 'create' | 'edit', note?: NoteModel) {
    if (mode === 'edit' && note) {
      this.isEditMode.set(true);
      this.selectedNote.set(note);
      this.noteForm.patchValue({
        title: note.title,
        content: note.content
      });
    } else {
      this.isEditMode.set(false);
      this.selectedNote.set(null);
      this.noteForm.reset();
    }
    this.isNoteModalOpen.set(true);
  }

  closeNoteModal() {
    this.isNoteModalOpen.set(false);
    this.isEditMode.set(false);
    this.selectedNote.set(null);
    this.noteForm.reset();
  }

  async saveNote() {
    if (this.noteForm.invalid || !this.selectedSubject()) return;

    const formValue = this.noteForm.getRawValue();
    const subjectId = this.selectedSubject()!.id!;

    try {
      if (this.isEditMode() && this.selectedNote()?.id) {
        await this.subjectService.updateNote(subjectId, this.selectedNote()!.id!, {
          title: formValue.title.trim(),
          content: formValue.content.trim()
        });
      } else {
        await this.subjectService.addNote(subjectId, {
          title: formValue.title.trim(),
          content: formValue.content.trim()
        });
      }
      this.loadNotes(subjectId);
      this.closeNoteModal();
    } catch (err) {
      console.error('Błąd podczas zapisu notatki:', err);
    }
  }

  async deleteNote(noteId: string) {
    if (!this.selectedSubject() || !confirm('Czy na pewno chcesz usunąć tę notatkę?')) return;

    try {
      await this.subjectService.deleteNote(this.selectedSubject()!.id!, noteId);
      this.loadNotes(this.selectedSubject()!.id!);
    } catch (err) {
      console.error('Błąd podczas usuwania notatki:', err);
    }
  }

  onEditNote(note: NoteModel) {
    this.openNoteModal('edit', note);
  }

  onDeleteNote(noteId: string) {
    this.deleteNote(noteId);
  }
}