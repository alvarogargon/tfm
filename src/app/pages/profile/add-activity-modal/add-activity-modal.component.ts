import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityService } from '../../../services/activity.service';
import { CategoryService } from '../../../services/category.service';
import { IActivity } from '../../../interfaces/iactivity.interface';
import { ICategory } from '../../../interfaces/icategory.interface';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-add-activity-modal',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-activity-modal.component.html',
  styleUrls: ['./add-activity-modal.component.css']
})
export class AddActivityModalComponent {
  @Input() routineId!: number;
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
      routine_id: [0, Validators.required]
    });
  }

  async ngOnInit() {
    try {
      const token = localStorage.getItem('token');
      console.log('Token encontrado:', token ? 'Sí' : 'No');
      if (!token) {
        toast.error('No se encontró el token de autenticación. Por favor, inicia sesión.');
        return;
      }
      const categories = await this.categoryService.getCategories();
      console.log('Categorías cargadas:', categories);
      this.categories.set(categories);
      this.activityForm.patchValue({ routine_id: this.routineId });
      console.log('Formulario inicializado:', this.activityForm.value);
      console.log('Estado del formulario:', this.activityForm.valid ? 'Válido' : 'Inválido');
      if (categories.length === 0) {
        toast.warning('No hay categorías disponibles. Por favor, crea una categoría primero.');
      }
    } catch (error: any) {
      console.error('Error al cargar categorías:', error);
      toast.error(error.message || 'Error al cargar las categorías.');
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
      toast.error('Por favor, completa todos los campos requeridos: título, fechas y categoría.');
      return;
    }
    try {
      const { datetime_start, datetime_end, ...rest } = this.activityForm.value;
      const activity: Partial<IActivity> = {
        ...rest,
        routine_id: this.routineId,
        datetime_start: datetime_start ? new Date(datetime_start).toISOString() : null,
        datetime_end: datetime_end ? new Date(datetime_end).toISOString() : null,
        day_of_week: null,
        start_time: null,
        end_time: null
      };
      console.log('Enviando actividad al backend:', activity);
      await this.activityService.createActivity(activity);
      toast.success('Actividad creada con éxito.');
      this.close.emit();
    } catch (error: any) {
      console.error('Error al crear actividad:', error);
      toast.error(error.message || 'Error al crear la actividad.');
    }
  }
}