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
      routine_id: [0, Validators.required]
    });

    // Escuchar cambios en category_id para depuración
    this.activityForm.get('category_id')?.valueChanges.subscribe(value => {
      console.log('category_id seleccionado:', value);
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
      this.activityForm.patchValue({
        ...this.activity,
        routine_id: this.activity.routine_id,
        category_id: this.activity.category_id || null,
        day_of_week: null,
        start_time: null,
        end_time: null
      });
      if (categories.length === 0) {
        toast.warning('No hay categorías disponibles. Por favor, crea una categoría primero.');
      }
    } catch (error: any) {
      console.error('Error al cargar categorías:', error);
      toast.error(error.message || 'Error al cargar las categorías.');
    }
  }

  async onSubmit() {
    console.log('Formulario antes de enviar:', this.activityForm.value);
    if (this.activityForm.invalid) {
      console.log('Campos inválidos:', this.activityForm.errors);
      console.log('Errores de category_id:', this.activityForm.get('category_id')?.errors);
      toast.error('Por favor, completa todos los campos requeridos, incluida la categoría.');
      return;
    }
    try {
      const activity = {
        ...this.activityForm.value,
        routine_id: this.activity.routine_id,
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
      toast.error(error.message || 'Error al actualizar la actividad.');
    }
  }
}