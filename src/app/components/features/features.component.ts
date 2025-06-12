import { Component, AfterViewInit, OnDestroy, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

declare var VANTA: any;

@Component({
  selector: 'app-features',
  imports: [RouterLink],
  templateUrl: './features.component.html',
  styleUrl: './features.component.css'
})

export class FeaturesComponent implements AfterViewInit, OnDestroy {
  private triggers: ScrollTrigger[] = [];
  private vantaEffect: any;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    // Animate each .feature section
    const features = this.el.nativeElement.querySelectorAll('.feature');
    features.forEach((feature: HTMLElement, i: number) => {
      // Animate the whole section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: feature,
          start: "top 70%", // when top of feature hits 80% of viewport
          toggleActions: "play reverse play reverse",
          // once: true
        }
      });

      // Example: fade in and move up
      tl.from(feature, {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: "power2.out"
      });

      const vantas = feature.querySelectorAll('.vanta');
      tl.from(vantas, {
        opacity: 0,
        y: 40,
        duration: 0.7,
        stagger: 0.2,
        ease: "power2.out"
      }, "-=0.7");

      // Optionally, animate children with a stagger
      const texts = feature.querySelectorAll('.text');
      tl.from(texts, {
        opacity: 0,
        y: 40,
        filter: "blur(8px)",
        duration: 2,
        stagger: 0.15,
        ease: "elastic.out(1,0.3)"
      }, "-=0.6");
    });

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
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }
  
}
