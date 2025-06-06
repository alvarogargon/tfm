import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';

declare var VANTA: any;

@Component({
  selector: 'app-features',
  imports: [RouterLink],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css'
})

export class FeaturesComponent implements AfterViewInit, OnDestroy {
  private vantaEffect: any;

  ngAfterViewInit() {
    this.vantaEffect = VANTA.FOG({
      el: ".vanta-bg-features",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      scale: 0.5,  
      scaleMobile: 0.6,
      minHeight: 100.00,
      minWidth: 100.00,
      baseColor: 0xfaf1f1
    });

    this.vantaEffect = VANTA.FOG({
      el: ".vanta-bg-features2",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      scale: 0.5,  
      scaleMobile: 0.6,
      minHeight: 100.00,
      minWidth: 100.00,
      highlightColor: 0x1f62af,
      midtoneColor: 0xffffff,
      lowlightColor: 0xfafafa,
      baseColor: 0xffffff,
      blurFactor: 0.51,
      speed: 0.50
    });

    this.vantaEffect = VANTA.FOG({
      el: ".vanta-bg-features3",
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      scale: 0.5,  
      scaleMobile: 0.6,
      minHeight: 100.00,
      minWidth: 100.00,
      highlightColor: 0xcf6464,
      midtoneColor: 0xa8caff,
      lowlightColor: 0x1547e6,
      baseColor: 0xffffff,
      blurFactor: 0.57,
      zoom: 1.40
    });
  }

  ngOnDestroy(): void {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }
  
}
