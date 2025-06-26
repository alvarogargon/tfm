import { Component, EventEmitter, inject, Input, Output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RoutineService } from '../../../services/routine.service';
import { IRoutinePayload } from '../../../interfaces/iroutine.interface';
import { toast } from 'ngx-sonner';
import { IGuideUser } from '../../../interfaces/iguide-user.interface';

@Component({
  selector: 'app-add-routine-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-routine-modal.component.html',
  styleUrls: ['./add-routine-modal.component.css']
})
export class AddRoutineModalComponent implements OnInit {
  @Input() guideUserRelations: IGuideUser[] = [];
  @Input() selectedUserId: number | null = null;
  @Output() close = new EventEmitter<void>();
  routineService = inject(RoutineService);
  formBuilder = inject(FormBuilder);

  routineForm: FormGroup = this.formBuilder.group({
    name: ['', Validators.required],
    description: [''],
    is_template: [false],
    start_time: [''],
    end_time: [''],
    daily_routine: ['Daily', Validators.required],
    targetUserId: [null]
  });

  ngOnInit() {
    if (this.selectedUserId) {
      this.routineForm.patchValue({ targetUserId: this.selectedUserId });
    }
  }

  async onSubmit() {
    if (this.routineForm.invalid) {
      toast.error('Por favor, completa todos los campos requeridos.');
      return;
    }

    try {
      const routineData: IRoutinePayload = this.routineForm.value;
      const newRoutine = await this.routineService.createRoutine(routineData);
      toast.success('Rutina creada con éxito.');
      this.close.emit();
    } catch (error) {
      console.error('Error al crear la rutina:', error);
      toast.error('Error al crear la rutina.');
    }
  }

  onCancel() {
    this.close.emit();
  }
}