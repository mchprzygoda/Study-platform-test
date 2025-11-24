import { Component, EventEmitter, inject, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-log-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class LogRegisterFormComponent implements OnChanges {
  @Input() isLoginOpen: boolean = true;

  @Output() formSubmitted = new EventEmitter<{ 
    email: string; 
    password: string; 
    username?: string;
  }>();

  fb = inject(FormBuilder);

  form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLoginOpen']) {
      const usernameControl = this.form.get('username');
      if (this.isLoginOpen) {
        // Podczas logowania username nie jest wymagany
        usernameControl?.clearValidators();
      } else {
        // Podczas rejestracji username jest wymagany
        usernameControl?.setValidators([Validators.required]);
      }
      usernameControl?.updateValueAndValidity();
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.getRawValue());
    }
  }
}
