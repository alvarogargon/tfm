import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { GuideUserService } from '../../../services/guide-user.service';
import { toast } from 'ngx-sonner';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-guide-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Asignar Usuario a Guía</h5>
            <button type="button" class="btn-close" (click)="close.emit()" aria-label="Cerrar"></button>
          </div>
          <div class="modal-body">
            <form [formGroup]="guideUserForm" (ngSubmit)="onSubmit()">
              <div class="mb-3">
                <label for="guideId" class="form-label">ID del Guía</label>
                <input type="number" class="form-control" id="guideId" formControlName="guideId" required>
              </div>
              <div class="mb-3">
                <label for="userId" class="form-label">ID del Usuario</label>
                <input type="number" class="form-control" id="userId" formControlName="userId" required>
              </div>
              <button type="submit" class="btn btn-primary" [disabled]="guideUserForm.invalid">Asignar</button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-backdrop fade show"></div>
  `,
  styleUrls: ['./add-guide-user-modal.component.css']
})
export class AddGuideUserModalComponent {
  @Output() close = new EventEmitter<void>();
  guideUserForm: FormGroup;
  private guideUserService = inject(GuideUserService);
  private fb = inject(FormBuilder);

  constructor() {
    this.guideUserForm = this.fb.group({
      guideId: ['', [Validators.required, Validators.min(1)]],
      userId: ['', [Validators.required, Validators.min(1)]]
    });
  }

  async onSubmit() {
    if (this.guideUserForm.valid) {
      try {
        const { guideId, userId } = this.guideUserForm.value;
        await this.guideUserService.createGuideUserRelation(Number(guideId), Number(userId));
        toast.success('Relación guía-usuario creada con éxito.');
        this.close.emit();
      } catch (error) {
        console.error('Error al crear relación:', error as Error);
        toast.error('Error al asignar el usuario al guía.');
      }
    }
  }
}