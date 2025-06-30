import { Component, EventEmitter, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { RoutineService } from '../../../services/routine.service';
import { IRoutine } from '../../../interfaces/iroutine.interface';
import { toast } from 'ngx-sonner';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-routines-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './shared-routines-modal.component.html',
  styleUrls: ['./shared-routines-modal.component.css']
})
export class SharedRoutinesModalComponent implements OnInit {
  @Output() closed = new EventEmitter<void>();
  @Output() routineCopied = new EventEmitter<IRoutine>();

  publicRoutines: IRoutine[] = [];
  selectedTemplateId: number | null = null;
  selectedTemplate: IRoutine | null = null;
  selectedTemplateDescription: string = '';
  startTime: string = '';
  endTime: string = '';
  dailyRoutine: string = 'Daily';

  constructor(private routineService: RoutineService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    try {
      this.publicRoutines = await this.routineService.getPublicRoutines();
      console.log('Rutinas públicas cargadas:', this.publicRoutines);
      this.cdr.detectChanges(); // Forzar detección de cambios tras cargar rutinas
    } catch (error) {
      console.error('Error al cargar rutinas públicas:', error);
      toast.error('Error al cargar las plantillas.');
    }
  }

  onTemplateSelected() {
    console.log('selectedTemplateId:', this.selectedTemplateId, typeof this.selectedTemplateId);
    console.log('publicRoutines:', this.publicRoutines);
    
    if (this.selectedTemplateId !== null && this.selectedTemplateId !== undefined) {
      // Convertir selectedTemplateId a número para evitar problemas de tipo
      const templateId = Number(this.selectedTemplateId);
      this.selectedTemplate = this.publicRoutines.find(r => r.routine_id === templateId) || null;
      console.log('Plantilla seleccionada:', this.selectedTemplate);
      
      if (this.selectedTemplate) {
        this.selectedTemplateDescription = this.selectedTemplate.description || '';
        this.startTime = this.selectedTemplate.start_time ? this.formatDateForInput(this.selectedTemplate.start_time) : '';
        this.endTime = this.selectedTemplate.end_time ? this.formatDateForInput(this.selectedTemplate.end_time) : '';
        this.dailyRoutine = this.selectedTemplate.daily_routine;
        console.log('Valores actualizados:', {
          description: this.selectedTemplateDescription,
          startTime: this.startTime,
          endTime: this.endTime,
          dailyRoutine: this.dailyRoutine
        });
      } else {
        console.warn('No se encontró la rutina con ID:', templateId);
        this.selectedTemplateDescription = '';
        this.startTime = '';
        this.endTime = '';
        this.dailyRoutine = 'Daily';
      }
      this.cdr.detectChanges(); // Forzar detección de cambios
    } else {
      console.warn('selectedTemplateId es null o undefined');
      this.selectedTemplate = null;
      this.selectedTemplateDescription = '';
      this.startTime = '';
      this.endTime = '';
      this.dailyRoutine = 'Daily';
      this.cdr.detectChanges();
    }
  }

  private formatDateForInput(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error('Fecha inválida:', dateString);
      return '';
    }
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
        Number(this.selectedTemplateId), // Asegurar que es número
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