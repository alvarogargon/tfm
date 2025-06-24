import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/category.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-add-category-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-category-modal.component.html',
  styleUrls: ['./add-category-modal.component.css']
})
export class AddCategoryModalComponent {
  @Output() close = new EventEmitter<void>();
  addCategoryForm: FormGroup;
  categoryService = inject(CategoryService);

  constructor(private fb: FormBuilder) {
    this.addCategoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      color: ['#4682B4'],
      icon: [''],
      description: ['']
    });
  }

  async onSubmit() {
    if (this.addCategoryForm.invalid) {
      toast.error('Por favor, completa el nombre de la categoría (mínimo 3 caracteres).');
      return;
    }

    try {
      const categoryData = this.addCategoryForm.value;
      await this.categoryService.createCategory(categoryData);
      toast.success('Categoría creada con éxito.');
      this.closeModal();
    } catch (error: any) {
      console.error('Error al crear categoría:', error);
      toast.error(error.message || 'Error al crear la categoría.');
    }
  }

  closeModal() {
    this.close.emit();
  }
}