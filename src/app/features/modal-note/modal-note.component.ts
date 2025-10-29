import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormNoteComponent } from '../form-note/form-note.component';

@Component({
  selector: 'app-modal-note',
  standalone: true,
  imports: [CommonModule, FormNoteComponent],
  templateUrl: './modal-note.component.html',
  styleUrls: ['./modal-note.component.scss']
})
export class ModalNoteComponent {
  @Output() submitted = new EventEmitter<{ title: string; content: string }>();
  @Output() cancelled = new EventEmitter<void>();

  onFormSubmit(data: { title: string; content: string }) {
    this.submitted.emit(data);
  }

  onFormCancel() {
    this.cancelled.emit();
  }
}