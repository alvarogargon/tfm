import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

declare var VANTA: any;

@Component({
  selector: 'app-calltoaction',
  imports: [RouterLink],
  templateUrl: './calltoaction.component.html',
  styleUrl: './calltoaction.component.css'
})
export class CalltoactionComponent implements AfterViewInit, OnDestroy {

  private vantaEffect: any;

  ngAfterViewInit() {
    this.vantaEffect = VANTA.FOG({
      el: '.vanta-bg-home',
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      highlightColor: 0xdbedff,
      midtoneColor: 0x3434dc,
      lowlightColor: 0x4646a2,
      baseColor: 0xffffff,
      blurFactor: 0.20,
      speed: 0.10,
      zoom: 0.10
    });
  }

  ngOnDestroy() {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }

}
