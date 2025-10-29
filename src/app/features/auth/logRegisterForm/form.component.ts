import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-log-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class LogRegisterFormComponent {
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
    password: ['', Validators.required]
  });

  onSubmit(): void {
    if (this.form.valid) {
      this.formSubmitted.emit(this.form.getRawValue());
    }
  }

  ngOnInit(): void {
  if (this.isLoginOpen) {
    this.form.get('username')?.clearValidators();
    this.form.get('username')?.updateValueAndValidity();
  }
}
}