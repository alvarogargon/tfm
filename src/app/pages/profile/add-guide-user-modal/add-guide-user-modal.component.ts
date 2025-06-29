import { Component, EventEmitter, Output, Input, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GuideUserService } from '../../../services/guide-user.service';
import { UserService } from '../../../services/user.service';
import { toast } from 'ngx-sonner';

@Component({
  selector: 'app-add-guide-user-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-guide-user-modal.component.html',
  styleUrls: ['./add-guide-user-modal.component.css']
})
export class AddGuideUserModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() relationCreated = new EventEmitter<void>();
  @Input() selectedUserId: number | null = null;

  guideUserForm: FormGroup;
  isSubmitting = false;
  unassignedUsers: any[] = []; // Almacena los usuarios sin guía asignada
  isLoading = false; // Estado de carga para usuarios

  private fb = inject(FormBuilder);
  private guideUserService = inject(GuideUserService);
  private userService = inject(UserService);

  constructor() {
    // Actualizar validación para userId (solo required)
    this.guideUserForm = this.fb.group({
      guideId: ['', [Validators.required, Validators.min(1)]],
      userId: ['', [Validators.required]] // Removido Validators.min
    });
  }

  async ngOnInit() {
    // Auto-rellenar el campo guideId con el selectedUserId del perfil
    if (this.selectedUserId) {
      this.guideUserForm.patchValue({
        guideId: this.selectedUserId
      });
    }
    
    // Cargar usuarios no asignados al inicializar el componente
    await this.loadUnassignedUsers();
  }
  
  // Cargar usuarios sin guía asignada
  async loadUnassignedUsers() {
    this.isLoading = true;
    try {
      this.unassignedUsers = await this.guideUserService.getUnassignedUsers();
    } catch (error) {
      console.error('Error al cargar usuarios sin guía:', error);
      toast.error('Error al cargar usuarios disponibles');
    } finally {
      this.isLoading = false;
    }
  }

  async onSubmit() {
    if (this.guideUserForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      
      try {
        const guideId = this.guideUserForm.get('guideId')?.value;
        const userId = this.guideUserForm.get('userId')?.value;

        // Crear la relación guía-usuario con ambos IDs del formulario
        await this.guideUserService.createGuideUserRelation(guideId, userId);
        
        toast.success('Usuario asignado correctamente.');
        this.relationCreated.emit(); // Emitir evento de actualización
        this.onCancel();
        
      } catch (error) {
        console.error('Error al asignar usuario:', error);
        toast.error('Error al asignar usuario. Por favor, inténtalo de nuevo.');
      } finally {
        this.isSubmitting = false;
      }
    } else {
      // Verificar si hay errores específicos en userId
      if (this.userId?.errors?.['required']) {
        toast.error('Por favor, selecciona un usuario de la lista.');
      } else {
        toast.error('Por favor, completa correctamente el formulario.');
      }
    }
  }

  onCancel() {
    this.guideUserForm.reset();
    this.close.emit();
  }

  // Getters para facilitar el acceso a los controles del formulario
  get guideId() {
    return this.guideUserForm.get('guideId');
  }

  get userId() {
    return this.guideUserForm.get('userId');
  }
}