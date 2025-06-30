import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { RoutineService } from '../../../services/routine.service';
import { IRoutine } from '../../../interfaces/iroutine.interface';
import { toast } from 'ngx-sonner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-routines-modal',
  standalone: true,
  imports: [FormsModule], // Asegúrate que FormsModule está aquí
  templateUrl: './shared-routines-modal.component.html',
  styleUrls: ['./shared-routines-modal.component.css']
})
export class SharedRoutinesModalComponent implements OnInit {
  @Output() closed = new EventEmitter<void>();
  @Output() routineCopied = new EventEmitter<IRoutine>();

  publicRoutines: IRoutine[] = [];
  selectedTemplateId: number | null = null;
  selectedTemplate: IRoutine | null = null;
  startTime: string = '';
  endTime: string = '';
  dailyRoutine: string = 'Daily';

  constructor(private routineService: RoutineService) {}

  async ngOnInit() {
    try {
      this.publicRoutines = await this.routineService.getPublicRoutines();
    } catch (error) {
      console.error('Error al cargar rutinas públicas:', error);
      toast.error('Error al cargar las plantillas.');
    }
  }

  onTemplateSelected() {
    if (this.selectedTemplateId) {
      this.selectedTemplate = this.publicRoutines.find(r => r.routine_id === this.selectedTemplateId) || null;
      if (this.selectedTemplate) {
        this.startTime = this.selectedTemplate.start_time ? this.formatDateForInput(this.selectedTemplate.start_time) : '';
        this.endTime = this.selectedTemplate.end_time ? this.formatDateForInput(this.selectedTemplate.end_time) : '';
        this.dailyRoutine = this.selectedTemplate.daily_routine;
      }
    }
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16); // Formato YYYY-MM-DDTHH:mm
  }

  async onCopy() {
    if (!this.selectedTemplateId) {
      toast.error('Por favor, selecciona una plantilla.');
      return;
    }

    if (!this.startTime || !this.endTime) {
      toast.error('Las fechas de inicio y fin son obligatorias.');
      return;
    }

    try {
      const newRoutine = await this.routineService.createRoutineFromTemplate(
        this.selectedTemplateId,
        new Date(this.startTime).toISOString(),
        new Date(this.endTime).toISOString(),
        this.dailyRoutine
      );
      toast.success('Rutina copiada con éxito.');
      this.routineCopied.emit(newRoutine);
      this.closed.emit();
    } catch (error) {
      console.error('Error al copiar rutina:', error);
      toast.error('Error al copiar la rutina.');
    }
  }

  onCancel() {
    this.closed.emit();
  }
}