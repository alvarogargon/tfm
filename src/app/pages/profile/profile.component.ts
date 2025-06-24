import { Component, ElementRef, inject, ViewChild, signal, computed } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { AddInterestModalComponent } from './add-interest-modal/add-interest-modal.component';
import { AddGoalModalComponent } from './add-goal-modal/add-goal-modal.component';
import { EditGoalModalComponent } from './edit-goal-modal/edit-goal-modal.component';
import { AddRoutineModalComponent } from './add-routine-modal/add-routine-modal.component';
import { AddGuideUserModalComponent } from './add-guide-user-modal/add-guide-user-modal.component';
import { IUser } from '../../interfaces/iuser.interface';
import { UserService } from '../../services/user.service';
import { RoutineService } from '../../services/routine.service';
import { GoalService } from '../../services/goal.service';
import { GuideUserService } from '../../services/guide-user.service';
import { toast } from 'ngx-sonner';
import { IProfileInterest } from '../../interfaces/iprofile-interest.interface';
import { IProfileGoal } from '../../interfaces/iprofile-goal.interface';
import { IRoutine } from '../../interfaces/iroutine.interface';
import { IGuideUser } from '../../interfaces/iguide-user.interface';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    RouterModule,
    EditProfileComponent,
    AddInterestModalComponent,
    AddGoalModalComponent,
    EditGoalModalComponent,
    AddRoutineModalComponent,
    AddGuideUserModalComponent
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
  showAddGuideUserModal = signal(false);
  selectedGoal = signal<IProfileGoal | null>(null);
  user = signal<IUser | undefined>(undefined);
  interests = signal<IProfileInterest[]>([]);
  goals = signal<IProfileGoal[]>([]);
  routines = signal<IRoutine[]>([]);
  guideUserRelations = signal<IGuideUser[]>([]);
  completedGoalsCount = computed(() => this.goals().filter(g => g.status === 'completed').length);
  userService = inject(UserService);
  routineService = inject(RoutineService);
  goalService = inject(GoalService);
  guideUserService = inject(GuideUserService);
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  async ngOnInit() {
    await this.loadProfileData();
  }

  async loadProfileData() {
    try {
      const [user, interests, goals, routines] = await Promise.all([
        this.userService.getProfile(),
        this.userService.getInterests(),
        this.goalService.getGoals(),
        this.routineService.getRoutines(),
      ]);

      this.user.set(user);
      if (user?.colorPalette) {
        this.setThemeColors(user.colorPalette);
      }

      this.interests.set(interests);
      this.goals.set(goals);
      this.routines.set(routines);

      if (user?.role === 'guide') {
        const relations = await this.guideUserService.getGuideUserRelations();
        this.guideUserRelations.set(relations);
      }
    } catch (error) {
      console.error('Error al cargar datos del perfil:', error);
      toast.error('Error al cargar los datos del perfil.');
    }
  }

  onAvatarClick() {
    this.fileInput.nativeElement.click();
  }

  async onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      await this.uploadProfileImage(file);
    }
  }

  async uploadProfileImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);
    try {
      const updatedUser = await this.userService.updateProfileImage(formData);
      this.user.set(updatedUser);
      toast.success('Imagen de perfil actualizada con éxito.');
    } catch (error) {
      console.error('Error al actualizar imagen de perfil:', error);
      toast.error('Error al actualizar la imagen de perfil.');
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

  openAddGuideUserModal() {
    this.showAddGuideUserModal.set(true);
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
      toast.success('Relación eliminada con éxito.');
    } catch (error) {
      console.error('Error al eliminar relación guía-usuario:', error);
      toast.error('Error al eliminar la relación.');
    }
  }

  setThemeColors(palette: any) {
    const root = document.documentElement;
    if (palette.primary) root.style.setProperty('--primary-color', palette.primary);
    if (palette.secondary) root.style.setProperty('--secondary-color', palette.secondary);
    if (palette.accent) root.style.setProperty('--accent-color', palette.accent);
    if (palette.background) root.style.setProperty('--background-color', palette.background);
  }

  onModalClosed() {
    this.showAddInterestModal.set(false);
    this.showAddGoalModal.set(false);
    this.showEditGoalModal.set(false);
    this.showAddRoutineModal.set(false);
    this.showAddGuideUserModal.set(false);
    this.loadProfileData();
  }
}