import { Component } from '@angular/core';

@Component({
  selector: 'app-calltoaction',
  templateUrl: './calltoaction.component.html',
  styleUrl: './calltoaction.component.css',
  standalone: true,
})
export class CalltoactionComponent {
  scrollToSection() {
    const section = document.querySelector('.container3');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}