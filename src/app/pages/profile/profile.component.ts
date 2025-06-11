import { Component } from '@angular/core';
import { EditProfileComponent } from "./edit-profile/edit-profile.component";

@Component({
  selector: 'app-profile',
  imports: [EditProfileComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  showEditForm = false;
}
