import { AfterViewInit, Component, OnDestroy } from '@angular/core';

declare var VANTA: any;

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit, OnDestroy {
  
  private vantaEffect: any;

  ngAfterViewInit() {
    this.vantaEffect = VANTA.FOG({
      el: '#vanta-bg-dashboard',
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

  ngOnDestroy(): void {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }

}
