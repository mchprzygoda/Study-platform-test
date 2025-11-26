import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent {
  @Input() title: string = '';
  @Input() content: string = '';
  @Input() subjectName: string = '';
  @Input() showActions: boolean = true;
  @Input() clickable: boolean = false;

  @Output() edit = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();
  @Output() cardClick = new EventEmitter<void>();

  onEditClick() {
    this.edit.emit();
  }

  onDeleteClick() {
    this.delete.emit();
  }

  onCardClick() {
    if (this.clickable) {
      this.cardClick.emit();
    }
  }
}