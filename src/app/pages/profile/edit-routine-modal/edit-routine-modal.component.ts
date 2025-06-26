import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoutineService } from '../../../services/routine.service';
import { IRoutine, IRoutinePayload } from '../../../interfaces/iroutine.interface';
import { toast } from 'ngx-sonner';
import { IGuideUser } from '../../../interfaces/iguide-user.interface';

@Component({
  selector: 'app-edit-routine-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-routine-modal.component.html',
  styleUrls: ['./edit-routine-modal.component.css']
})
export class EditRoutineModalComponent {
  @Input() routine!: IRoutine;
  @Input() guideUserRelations: IGuideUser[] = [];
  @Output() close = new EventEmitter<void>();
  routineService = inject(RoutineService);

  routineData = signal<IRoutinePayload>({ targetUserId: 0, name: '' });
  selectedUserId = signal<number | null>(null);

  ngOnInit() {
    // Precargar los datos de la rutina
    this.routineData.set({
      targetUserId: this.routine.user_id,
      name: this.routine.name,
      description: this.routine.description,
      is_template: this.routine.is_template,
      start_time: this.routine.start_time,
      end_time: this.routine.end_time,
      daily_routine: this.routine.daily_routine
    });
    this.selectedUserId.set(this.routine.user_id);
  }

  async onSubmit() {
    try {
      const updatedRoutine = await this.routineService.updateRoutine(this.routine.routine_id, {
        ...this.routineData(),
        targetUserId: this.selectedUserId()!
      });
      toast.success('Rutina actualizada con éxito.');
      this.close.emit();
    } catch (error) {
      console.error('Error al actualizar la rutina:', error);
      toast.error('Error al actualizar la rutina.');
    }
  }

  onCancel() {
    this.close.emit();
  }
}