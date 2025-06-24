import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../services/user.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-add-interest-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-interest-modal.component.html',
  styleUrls: ['./add-interest-modal.component.css']
})
export class AddInterestModalComponent {
  @Output() close = new EventEmitter<void>();
  interestForm: FormGroup;
  userService = inject(UserService);

  constructor(private fb: FormBuilder) {
    this.interestForm = this.fb.group({
      interest_name: ['', Validators.required],
      priority: ['medium', Validators.required]
    });
  }

  async onSubmit() {
    if (this.interestForm.invalid) {
      toast.error('Por favor, completa todos los campos requeridos.');
      return;
    }
    try {
      await this.userService.addInterest(this.interestForm.value);
      toast.success('Interés añadido con éxito.');
      this.close.emit();
    } catch (error) {
      console.error('Error al añadir interés:', error);
      toast.error('Error al añadir el interés.');
    }
  }
}