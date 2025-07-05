import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivityService } from '../../../services/activity.service';
import { CategoryService } from '../../../services/category.service';
import { IActivity } from '../../../interfaces/iactivity.interface';
import { ICategory } from '../../../interfaces/icategory.interface';
import { CommonModule } from '@angular/common';
import { toast } from 'ngx-sonner'; 
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

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
  searchResults: any[] = [];
  searchTerm = new Subject<string>();

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

    this.searchTerm.pipe(
    debounceTime(300), // Espera 300ms después de la última tecla
    distinctUntilChanged(), // Solo continua si el término cambió
    switchMap(term => {
      if (term.length < 2) {
        this.searchResults = [];
        return [];
      }
      return this.activityService.search(term);
    })
    ).subscribe(results => {
      this.searchResults = results || [];
    });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('No se encontró el token de autenticación. Por favor, inicia sesión.');
        return;
      }
      const categories = await this.categoryService.getCategories();
      this.categories.set(categories);
      this.activityForm.patchValue({ routine_id: this.routineId });
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
      await this.activityService.createActivity(activity);
      toast.success('Actividad creada con éxito.');
      this.close.emit();
    } catch (error: any) {
      console.error('Error al crear actividad:', error);
      toast.error(error.message || 'Error al crear la actividad.');
    }
  }

  onSearchLocation() {
    const query = this.activityForm.get('location')?.value || '';
    this.searchTerm.next(query);
  }

  selectLocation(location: any) {
    this.activityForm.patchValue({
      location: location.display_name
    });
    this.searchResults = [];
  }

}