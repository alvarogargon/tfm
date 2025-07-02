import { Component, ElementRef, inject, ViewChild, signal, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AddInterestModalComponent } from './add-interest-modal/add-interest-modal.component';
import { AddGoalModalComponent } from './add-goal-modal/add-goal-modal.component';
import { EditGoalModalComponent } from './edit-goal-modal/edit-goal-modal.component';
import { AddRoutineModalComponent } from './add-routine-modal/add-routine-modal.component';
import { EditRoutineModalComponent } from './edit-routine-modal/edit-routine-modal.component';
import { AddGuideUserModalComponent } from './add-guide-user-modal/add-guide-user-modal.component';
import { AddCategoryModalComponent } from './add-category-modal/add-category-modal.component';
import { AddActivityModalComponent } from './add-activity-modal/add-activity-modal.component';
import { SharedRoutinesModalComponent } from './shared-routines-modal/shared-routines-modal.component';
import { IUser } from '../../interfaces/iuser.interface';
import { UserService } from '../../services/user.service';
import { RoutineService } from '../../services/routine.service';
import { GoalService } from '../../services/goal.service';
import { GuideUserService } from '../../services/guide-user.service';
import { CategoryService } from '../../services/category.service';
import { ActivityService } from '../../services/activity.service';
import { toast } from 'ngx-sonner';
import { IProfileInterest } from '../../interfaces/iprofile-interest.interface';
import { IProfileGoal } from '../../interfaces/iprofile-goal.interface';
import { IRoutine, IReceivedRoutine } from '../../interfaces/iroutine.interface';
import { IGuideUser } from '../../interfaces/iguide-user.interface';
import { ICategory } from '../../interfaces/icategory.interface';
import { IActivity } from '../../interfaces/iactivity.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    EditProfileComponent,
    AddInterestModalComponent,
    AddGoalModalComponent,
    EditGoalModalComponent,
    AddRoutineModalComponent,
    EditRoutineModalComponent,
    AddGuideUserModalComponent,
    AddCategoryModalComponent,
    AddActivityModalComponent,
    DateFormatPipe,
    SharedRoutinesModalComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  showEditForm = signal(false);
  showAddInterestModal = signal(false);
  showAddGoalModal = signal(false);
  showEditGoalModal = signal(false);
  showAddRoutineModal = signal(false);
  showEditRoutineModal = signal(false);
  showAddGuideUserModal = signal(false);
  showAddCategoryModal = signal(false);
  showAddActivityModal = signal(false);
  selectedGoal = signal<IProfileGoal | null>(null);
  selectedRoutine = signal<IRoutine | null>(null);
  user = signal<IUser | undefined>(undefined);
  interests = signal<IProfileInterest[]>([]);
  goals = signal<IProfileGoal[]>([]);
  routines = signal<IRoutine[]>([]);
  activities = signal<IActivity[]>([]);
  guideUserRelations = signal<IGuideUser[]>([]);
  categories = signal<ICategory[]>([]);
  selectedUserId = signal<number | null>(null);
  showSharedRoutinesModal = signal(false);
  receivedRoutines = signal<IReceivedRoutine[]>([]);
  completedGoalsCount = computed(() => this.goals().filter(g => g.status === 'completed').length);
  activeRoutinesCount = computed(() => this.routines().filter(r => !this.isExpired(r.end_time)).length);
  activitiesCount = computed(() => this.activities().length);
  userService = inject(UserService);
  routineService = inject(RoutineService);
  goalService = inject(GoalService);
  guideUserService = inject(GuideUserService);
  categoryService = inject(CategoryService);
  activityService = inject(ActivityService);
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  async ngOnInit() {
    await this.loadProfileData();
  }

  async loadProfileData() {
    try {
      const user = await this.userService.getProfile();
      this.user.set(user);
      if (!user || !user.user_id) {
        throw new Error('No se pudo obtener el perfil del usuario.');
      }
      if (user.colorPalette) {
        this.setThemeColors(user.colorPalette);
      }

      if (user.role === 'guide') {
        const relations = await this.guideUserService.getGuideUserRelations();
        console.log('guideUserRelations:', relations);
        const guideRelation: IGuideUser = {
          guide_user_id: 0,
          guide_id: user.user_id,
          user_id: user.user_id,
          created_at: new Date().toISOString(),
          user: {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            age: user.age,
            numTel: user.numTel,
            gender: user.gender,
            image: user.image,
            role: user.role,
            colorPalette: user.colorPalette,
            availability: user.availability
          }
        };
        this.guideUserRelations.set([guideRelation, ...relations]);
        this.selectedUserId.set(user.user_id);
        await this.loadUserData(user.user_id);
      } else {
        await this.loadUserData(null);
      }

      const categories = await this.categoryService.getCategories();
      this.categories.set(categories);

      const receivedRoutines = await this.routineService.getReceivedRoutinesByUser();
      this.receivedRoutines.set(receivedRoutines);
      console.log('Rutinas compartidas recibidas:', receivedRoutines);

      this.markRoutinesFromTemplates();
    } catch (error) {
      console.error('Error al cargar datos del perfil:', error);
      toast.error('Error al cargar los datos del perfil.');
    }
  }

  async loadUserData(userId: number | null) {
    try {
      console.log('Cargando datos para userId:', userId);
      const [interests, goals, routines, activities] = await Promise.all([
        this.userService.getInterests(userId),
        this.goalService.getGoals(userId),
        this.routineService.getRoutines(userId),
        this.activityService.getActivities()
      ]);
      this.interests.set(interests);
      this.goals.set(goals);
      this.routines.set(routines);
      this.activities.set(activities);
      console.log('Actividades cargadas:', activities);

      this.markRoutinesFromTemplates();
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      toast.error('Error al cargar los datos del usuario.');
    }
  }

  private markRoutinesFromTemplates() {
    const receivedRoutineIds = new Set(this.receivedRoutines().map(r => r.new_routine.routine_id));
    this.routines.update(routines =>
      routines.map(routine => ({
        ...routine,
        from_template: receivedRoutineIds.has(routine.routine_id)
      }))
    );
    console.log('Rutinas actualizadas con from_template:', this.routines());
  }

  async onUserSelected() {
    const userId = this.selectedUserId();
    console.log('selectedUserId:', userId, typeof userId);
    if (userId === null || userId === undefined) {
      console.error('selectedUserId es null o undefined:', userId);
      toast.error('Por favor, selecciona un usuario válido.');
      return;
    }
    await this.loadUserData(userId);
  }

  onAvatarClick() {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const formData = new FormData();
      formData.append('image', input.files[0]);

      try {
        const updatedUser = await this.userService.updateProfile(formData);
        this.user.set(updatedUser);
        if (updatedUser.colorPalette) {
          this.setThemeColors(updatedUser.colorPalette);
        }
        toast.success('Imagen de perfil actualizada con éxito.');
      } catch (error) {
        console.error('Error al actualizar la imagen de perfil:', error);
        toast.error('Error al actualizar la imagen de perfil.');
      }

      input.value = '';
    }
  }

  openAddInterestModal() {
    this.showAddInterestModal.set(true);
  }

  openAddGoalModal() {
    this.showAddGoalModal.set(true);
  }

  openEditGoalModal(goal: IProfileGoal) {
    this.selectedGoal.set(goal);
    this.showEditGoalModal.set(true);
  }

  openAddRoutineModal() {
    this.showAddRoutineModal.set(true);
  }

  openEditRoutineModal(routine: IRoutine) {
    this.selectedRoutine.set(routine);
    this.showEditRoutineModal.set(true);
  }

  openAddActivityModal(routine: IRoutine) {
    this.selectedRoutine.set(routine);
    this.showAddActivityModal.set(true);
  }

  openSharedRoutinesModal() {
    this.showSharedRoutinesModal.set(true);
  }

  async onRoutineCopied(newRoutine: IRoutine) {
    try {
      this.routines.update(routines => [...routines, { ...newRoutine, from_template: true }]);
      const receivedRoutines = await this.routineService.getReceivedRoutinesByUser();
      this.receivedRoutines.set(receivedRoutines);
      console.log('Rutinas compartidas recibidas actualizadas:', receivedRoutines);
      this.markRoutinesFromTemplates();
      this.showSharedRoutinesModal.set(false);
      toast.success('Rutina añadida a tu perfil.');
    } catch (error) {
      console.error('Error al actualizar las rutinas compartidas recibidas:', error);
      toast.error('Error al añadir la rutina.');
    }
  }

  async deleteRoutine(routineId: number) {
    try {
      await this.routineService.deleteRoutine(routineId);
      this.routines.update(routines => routines.filter(r => r.routine_id !== routineId));
      toast.success('Rutina eliminada con éxito.');
    } catch (error) {
      console.error('Error al eliminar rutina:', error);
      toast.error('Error al eliminar la rutina.');
    }
  }

  openAddGuideUserModal() {
    this.showAddGuideUserModal.set(true);
  }

  openAddCategoryModal() {
    this.showAddCategoryModal.set(true);
  }

  async deleteGoal(goalId: number) {
    try {
      await this.goalService.deleteGoal(goalId);
      this.goals.update(goals => goals.filter(g => g.goal_id !== goalId));
      toast.success('Objetivo eliminado con éxito.');
    } catch (error) {
      console.error('Error al eliminar objetivo:', error);
      toast.error('Error al eliminar el objetivo.');
    }
  }

  async deleteGuideUserRelation(guideUserId: number) {
    try {
      await this.guideUserService.deleteGuideUserRelation(guideUserId);
      this.guideUserRelations.update(relations => relations.filter(r => r.guide_user_id !== guideUserId));
      if (this.selectedUserId() === this.guideUserRelations().find(r => r.guide_user_id === guideUserId)?.user_id) {
        this.selectedUserId.set(this.guideUserRelations()[0]?.user_id || null);
        await this.loadUserData(this.selectedUserId());
      }
      toast.success('Relación eliminada con éxito.');
    } catch (error) {
      console.error('Error al eliminar relación guía-usuario:', error);
      toast.error('Error al eliminar la relación.');
    }
  }

  setThemeColors(palette: any) {
    const root = document.documentElement;
    if (palette?.primary) root.style.setProperty('--primary-color', palette.primary);
    if (palette?.secondary) root.style.setProperty('--secondary-color', palette.secondary);
    if (palette?.accent) root.style.setProperty('--accent-color', palette.accent);
    if (palette?.background) root.style.setProperty('--background-color', palette.background);
  }

  async onModalClosed() {
    this.showAddInterestModal.set(false);
    this.showAddGoalModal.set(false);
    this.showEditGoalModal.set(false);
    this.showAddRoutineModal.set(false);
    this.showEditRoutineModal.set(false);
    this.showAddGuideUserModal.set(false);
    this.showAddCategoryModal.set(false);
    this.showAddActivityModal.set(false);
    this.showSharedRoutinesModal.set(false);
    const userId = this.user()?.role === 'guide' ? this.selectedUserId() : null;
    await this.loadUserData(userId);
  }

  isExpired(endTime: string | null): boolean {
    if (!endTime) return false;
    const endDate = new Date(endTime);
    const currentDate = new Date();
    return endDate.getTime() < currentDate.getTime();
  }

  isWarning(endTime: string | null): boolean {
    if (!endTime) return false;
    const endDate = new Date(endTime);
    const currentDate = new Date();
    const diffDays = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 3 && diffDays > 1;
  }

  isDanger(endTime: string | null): boolean {
    if (!endTime) return false;
    const endDate = new Date(endTime);
    const currentDate = new Date();
    const diffDays = Math.ceil((endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays <= 1 && diffDays >= 0;
  }

  async onGuideUserRelationCreated() {
    try {
      await this.loadGuideUserRelations();
      this.showAddGuideUserModal.set(false);
      console.log('Relaciones guía-usuario actualizadas');
    } catch (error) {
      console.error('Error al recargar las relaciones:', error);
      toast.error('Error al actualizar la lista de usuarios asignados.');
    }
  }

  private async loadGuideUserRelations() {
    if (this.user()?.role === 'guide') {
      try {
        const relations = await this.guideUserService.getGuideUserRelations();
        const user = this.user();
        if (user) {
          const guideRelation: IGuideUser = {
            guide_user_id: 0,
            guide_id: user.user_id,
            user_id: user.user_id,
            created_at: new Date().toISOString(),
            user: {
              user_id: user.user_id,
              username: user.username,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              age: user.age,
              numTel: user.numTel,
              gender: user.gender,
              image: user.image,
              role: user.role,
              colorPalette: user.colorPalette,
              availability: user.availability
            }
          };
          this.guideUserRelations.set([guideRelation, ...relations]);
        } else {
          this.guideUserRelations.set(relations);
        }
      } catch (error) {
        console.error('Error al cargar relaciones guía-usuario:', error);
      }
    }
  }
  
 async generatePDF() {
    try {
      const element = document.getElementById('profile-content');
      if (!element) {
        console.error('Elemento para PDF no encontrado');
        toast.error('No se encontró el contenido para exportar.');
        return;
      }

      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('perfil.pdf');
    } catch (error) {
      console.error('Error generando PDF:', error);
      toast.error('Error al generar el PDF.');
    }
  }
}