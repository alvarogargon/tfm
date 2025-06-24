import { Component, ElementRef, inject, ViewChild, signal } from '@angular/core';
import { EditProfileComponent } from './edit-profile/edit-profile.component';
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
  imports: [EditProfileComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  showEditForm = false;
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
      const user = await this.userService.getProfile();
      this.user.set(user);
      if (user?.colorPalette) {
        this.setThemeColors(user.colorPalette);
      }

      const interests = await this.userService.getInterests();
      this.interests.set(interests);

      const goals = await this.goalService.getGoals();
      this.goals.set(goals);

      const routines = await this.routineService.getRoutines();
      this.routines.set(routines);

      if (user?.role === 'guide') {
        const relations = await this.guideUserService.getGuideUserRelations();
        this.guideUserRelations.set(relations);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
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
      toast.success('Imagen de perfil actualizada.');
    } catch (error) {
      console.error('Error uploading profile image:', error);
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
      toast.success('Objetivo eliminado.');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Error al eliminar el objetivo.');
    }
  }

  async deleteGuideUserRelation(guideUserId: number) {
    try {
      await this.guideUserService.deleteGuideUserRelation(guideUserId);
      this.guideUserRelations.update(relations => relations.filter(r => r.guide_user_id !== guideUserId));
      toast.success('Relación eliminada.');
    } catch (error) {
      console.error('Error deleting guide-user relation:', error);
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
}