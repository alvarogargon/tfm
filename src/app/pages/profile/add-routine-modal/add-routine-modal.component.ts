import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoutineService } from '../../../services/routine.service';
import { IRoutinePayload } from '../../../interfaces/iroutine.interface';
import { toast } from 'ngx-sonner';
import { IGuideUser } from '../../../interfaces/iguide-user.interface';

@Component({
  selector: 'app-add-routine-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-routine-modal.component.html',
  styleUrls: ['./add-routine-modal.component.css']
})
export class AddRoutineModalComponent {
  @Input() guideUserRelations: IGuideUser[] = [];
  @Input() selectedUserId: number | null = null;
  @Output() close = new EventEmitter<void>();
  routineService = inject(RoutineService);

  routineData = signal<IRoutinePayload>({ targetUserId: 0, name: '' });
  localSelectedUserId = signal<number | null>(null);

  ngOnInit() {
    if (this.selectedUserId) {
      this.localSelectedUserId.set(this.selectedUserId);
      this.routineData.set({ ...this.routineData(), targetUserId: this.selectedUserId });
    }
  }

  async onSubmit() {
    try {
      const newRoutine = await this.routineService.createRoutine({
        ...this.routineData(),
        targetUserId: this.localSelectedUserId()!
      });
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