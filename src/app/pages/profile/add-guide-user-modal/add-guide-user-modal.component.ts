import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GuideUserService } from '../../../services/guide-user.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-add-guide-user-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-guide-user-modal.component.html',
  styleUrls: ['./add-guide-user-modal.component.css']
})
export class AddGuideUserModalComponent {
  @Output() close = new EventEmitter<void>();
  guideUserForm: FormGroup;
  guideUserService = inject(GuideUserService);

  constructor(private fb: FormBuilder) {
    this.guideUserForm = this.fb.group({
      user_id: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.guideUserForm.invalid) {
      toast.error('Por favor, introduce un ID de usuario válido.');
      return;
    }
    try {
      await this.guideUserService.createGuideUserRelation(this.guideUserForm.value);
      toast.success('Relación guía-usuario creada con éxito.');
      this.close.emit();
    } catch (error) {
      console.error('Error al crear relación guía-usuario:', error);
      toast.error('Error al crear la relación.');
    }
  }
}