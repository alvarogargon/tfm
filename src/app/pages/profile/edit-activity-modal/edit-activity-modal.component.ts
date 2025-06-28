// edit-activity-modal.component.ts
import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityService } from '../../../services/activity.service';
import { CategoryService } from '../../../services/category.service';
import { IActivity } from '../../../interfaces/iactivity.interface';
import { ICategory } from '../../../interfaces/icategory.interface';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-edit-activity-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-activity-modal.component.html',
  styleUrls: ['./edit-activity-modal.component.css']
})
export class EditActivityModalComponent {
  @Input() activity!: IActivity;
  @Output() close = new EventEmitter<void>();
  activityForm: FormGroup;
  activityService = inject(ActivityService);
  categoryService = inject(CategoryService);
  categories = signal<ICategory[]>([]);

  constructor(private fb: FormBuilder) {
    this.activityForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      datetime_start: ['', Validators.required],
      datetime_end: ['', Validators.required],
      location: [''],
      icon: [''],
      category_id: [null, Validators.required],
      routine_id: [0, [Validators.required, Validators.min(1)]]
    });
  }

  async ngOnInit() {
    // Verificar que activity esté disponible
    if (!this.activity) {
      console.error('No se recibió la actividad para editar');
      toast.error('No se pudo cargar la actividad. Por favor, intenta de nuevo.');
      this.close.emit();
      return;
    }

    console.log('Actividad recibida para editar:', this.activity);

    try {
      const token = localStorage.getItem('token');
      console.log('Token encontrado:', token ? 'Sí' : 'No');
      if (!token) {
        toast.error('No se encontró el token de autenticación. Por favor, inicia sesión.');
        return;
      }

      // Cargar categorías
      const categories = await this.categoryService.getCategories();
      console.log('Categorías cargadas:', categories);
      this.categories.set(categories);

      // Validar routine_id
      if (!this.activity.routine_id || this.activity.routine_id <= 0) {
        console.error('routine_id inválido en la actividad:', this.activity);
        toast.error('No se pudo cargar la rutina de la actividad. Por favor, intenta de nuevo.');
        this.close.emit();
        return;
      }

      // Formatear fechas para datetime-local (YYYY-MM-DDTHH:mm)
      const datetimeStart = this.activity.datetime_start
        ? new Date(this.activity.datetime_start).toISOString().slice(0, 16)
        : '';
      const datetimeEnd = this.activity.datetime_end
        ? new Date(this.activity.datetime_end).toISOString().slice(0, 16)
        : '';

      // Inicializar formulario
      this.activityForm.patchValue({
        title: this.activity.title || '',
        description: this.activity.description || '',
        datetime_start: datetimeStart,
        datetime_end: datetimeEnd,
        location: this.activity.location || '',
        icon: this.activity.icon || '',
        category_id: this.activity.category_id || null,
        routine_id: this.activity.routine_id
      });

      console.log('Formulario inicializado:', this.activityForm.value);
      console.log('Estado del formulario:', this.activityForm.valid ? 'Válido' : 'Inválido');
      
      if (!this.activityForm.valid) {
        console.log('Errores del formulario:', {
          title: this.activityForm.get('title')?.errors,
          datetime_start: this.activityForm.get('datetime_start')?.errors,
          datetime_end: this.activityForm.get('datetime_end')?.errors,
          category_id: this.activityForm.get('category_id')?.errors,
          routine_id: this.activityForm.get('routine_id')?.errors
        });
      }

      if (categories.length === 0) {
        toast.warning('No hay categorías disponibles. Por favor, crea una categoría primero.');
      }
    } catch (error: any) {
      console.error('Error al cargar datos del modal:', error);
      toast.error(error.message || 'Error al cargar los datos del modal.');
    }
  }

  async onSubmit() {
    if (this.activityForm.invalid) {
      this.activityForm.markAllAsTouched();
      console.log('Formulario inválido:', {
        title: this.activityForm.get('title')?.errors,
        datetime_start: this.activityForm.get('datetime_start')?.errors,
        datetime_end: this.activityForm.get('datetime_end')?.errors,
        category_id: this.activityForm.get('category_id')?.errors,
        routine_id: this.activityForm.get('routine_id')?.errors
      });
      toast.error('Por favor, completa todos los campos requeridos: título, fechas, categoría y rutina.');
      return;
    }

    try {
      const { datetime_start, datetime_end, ...rest } = this.activityForm.value;
      const activity = {
        ...rest,
        routine_id: this.activity.routine_id, // Asegurar que routine_id se envíe
        datetime_start: datetime_start ? new Date(datetime_start).toISOString() : null,
        datetime_end: datetime_end ? new Date(datetime_end).toISOString() : null,
        day_of_week: null,
        start_time: null,
        end_time: null
      };

      console.log('Enviando actividad al backend:', activity);
      await this.activityService.updateActivity(this.activity.activity_id, activity);
      toast.success('Actividad actualizada con éxito.');
      this.close.emit();
    } catch (error: any) {
      console.error('Error al actualizar actividad:', error);
      if (error.status === 400) {
        toast.error(error.error?.message || 'Datos inválidos. Verifica los campos requeridos.');
      } else if (error.status === 403) {
        toast.error('No autorizado para actualizar esta actividad.');
      } else if (error.status === 404) {
        toast.error('Actividad no encontrada.');
      } else {
        toast.error('Error al actualizar la actividad: ' + (error.message || 'Error desconocido.'));
      }
    }
  }
}