import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GuideUserService } from '../../../services/guide-user.service';
import { UserService } from '../../../services/user.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-add-guide-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-guide-user-modal.component.html',
  styleUrls: ['./add-guide-user-modal.component.css']
})
export class AddGuideUserModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() relationCreated = new EventEmitter<void>();

  guideUserForm: FormGroup;
  isSubmitting = false;
  
  private fb = inject(FormBuilder);
  private guideUserService = inject(GuideUserService);
  private userService = inject(UserService);

  constructor() {
    this.guideUserForm = this.fb.group({
      guideId: ['', [Validators.required, Validators.min(1)]],
      userId: ['', [Validators.required, Validators.min(1)]]
    });
  }

  async onSubmit() {
    if (this.guideUserForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      try {
        const guideId = this.guideUserForm.get('guideId')?.value;
        const userId = this.guideUserForm.get('userId')?.value;

        // Crear la relación guía-usuario con ambos IDs del formulario
        await this.guideUserService.createGuideUserRelation(guideId, userId);
        
        toast.success('Usuario asignado correctamente.');
        this.relationCreated.emit(); // Emitir evento de actualización
        this.onCancel();
        
      } catch (error) {
        console.error('Error al asignar usuario:', error);
        toast.error('Error al asignar usuario. Por favor, verifica que los IDs sean correctos.');
      } finally {
        this.isSubmitting = false;
      }
    } else {
      toast.error('Por favor, introduce IDs válidos para la guía y el usuario.');
    }
  }

  onCancel() {
    this.guideUserForm.reset();
    this.close.emit();
  }

  // Getters para facilitar el acceso a los controles del formulario
  get guideId() {
    return this.guideUserForm.get('guideId');
  }

  get userId() {
    return this.guideUserForm.get('userId');
  }
}