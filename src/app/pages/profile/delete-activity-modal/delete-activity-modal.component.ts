import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { ActivityService } from '../../../services/activity.service';
import { IActivity } from '../../../interfaces/iactivity.interface';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-delete-activity-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-activity-modal.component.html',
  styleUrls: ['./delete-activity-modal.component.css']
})
export class DeleteActivityModalComponent {
  @Input() activity!: IActivity;
  @Output() close = new EventEmitter<void>();
  activityService = inject(ActivityService);

  async onDelete() {
    console.log('Iniciando eliminación de actividad:', this.activity.activity_id); // Añadido para depuración
    try {
      await this.activityService.deleteActivity(this.activity.activity_id);
      console.log('Actividad eliminada con éxito:', this.activity.activity_id); // Añadido para depuración
      toast.success('Actividad eliminada con éxito.');
      this.close.emit();
    } catch (error) {
      console.error('Error al eliminar actividad:', error);
      toast.error('Error al eliminar la actividad.');
    }
  }
}