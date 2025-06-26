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
      day_of_week: [''],
      start_time: [''],
      end_time: [''],
      location: [''],
      icon: [''],
      category_id: [null],
      routine_id: [0, Validators.required]
    });
  }

  async ngOnInit() {
    try {
      const categories = await this.categoryService.getCategories();
      this.categories.set(categories);
      this.activityForm.patchValue({
        title: this.activity.title,
        description: this.activity.description,
        datetime_start: this.activity.datetime_start,
        datetime_end: this.activity.datetime_end,
        day_of_week: this.activity.day_of_week,
        start_time: this.activity.start_time,
        end_time: this.activity.end_time,
        location: this.activity.location,
        icon: this.activity.icon,
        category_id: this.activity.category_id,
        routine_id: this.activity.routine_id
      });
    } catch (error) {
      console.error('Error al cargar categorías:', error);
      toast.error('Error al cargar las categorías.');
    }
  }

  async onSubmit() {
    if (this.activityForm.invalid) {
      toast.error('Por favor, completa todos los campos requeridos.');
      return;
    }
    try {
      await this.activityService.updateActivity(this.activity.activity_id, this.activityForm.value);
      toast.success('Actividad actualizada con éxito.');
      this.close.emit();
    } catch (error) {
      console.error('Error al actualizar actividad:', error);
      toast.error('Error al actualizar la actividad.');
    }
  }
}