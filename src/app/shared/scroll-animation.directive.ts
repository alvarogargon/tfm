import {Directive, ElementRef, Input, OnInit, OnDestroy, Renderer2, numberAttribute} from '@angular/core';

/**
 * Usage:
 * <div scrollAnimation animation="fade-in" delay="200"></div>
 */

@Directive({
  selector: '[scrollAnimation]'
})
export class AnimateOnScrollDirective implements OnInit, OnDestroy {
  @Input() animation: 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'fade-in-left' | 'fade-in-right' |
      'slide-up' | 'slide-down' | 'slide-in-left' | 'slide-in-right' |
      'zoom-in' | 'zoom-out' | 'flip-x' | 'flip-y' | 'rotate' | 'rotate-x' | 'rotate-y' |
      'bounce' | 'pulse' | 'shake' | 'swing' | 'tada' | 'wobble' | 'jello' |
      'heartbeat' | 'hinge' | 'roll-in' | 'roll-out' | 'blur-in' = 'fade-in';

  @Input({transform: numberAttribute}) delay = 0;

  @Input({transform: numberAttribute}) duration = 500;

  @Input() once = true;

  private observer: IntersectionObserver | null = null;
  private hasAnimated = false;

  constructor(
      private el: ElementRef,
      private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    this.setInitialStyles();
    this.ensureKeyframesExist();

    this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              if (this.once && this.hasAnimated) {
                return;
              }
              setTimeout(() => {
                this.animate();
              }, this.delay);
            } else if (!this.once) {
              this.resetAnimation();
            }
          });
        },
        {
          threshold: 0.01,
          rootMargin: '0px'
        }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
  }

  private ensureKeyframesExist(): void {
    if (!document.getElementById('scroll-animation-keyframes')) {
      const style = document.createElement('style');
      style.id = 'scroll-animation-keyframes';
      style.textContent = `
        @keyframes shake-animation {
          0% { transform: translateX(0); }
          20% { transform: translateX(-10px); }
          40% { transform: translateX(10px); }
          60% { transform: translateX(-7px); }
          80% { transform: translateX(7px); }
          100% { transform: translateX(0); }
        }
        
        @keyframes swing-animation {
          20% { transform: rotate3d(0, 0, 1, 15deg); }
          40% { transform: rotate3d(0, 0, 1, -10deg); }
          60% { transform: rotate3d(0, 0, 1, 5deg); }
          80% { transform: rotate3d(0, 0, 1, -5deg); }
          100% { transform: rotate3d(0, 0, 1, 0deg); }
        }
        
        @keyframes tada-animation {
          0% { transform: scale3d(1, 1, 1); }
          10%, 20% { transform: scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg); }
          30%, 50%, 70%, 90% { transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg); }
          40%, 60%, 80% { transform: scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg); }
          100% { transform: scale3d(1, 1, 1); }
        }
        
        @keyframes wobble-animation {
          0% { transform: translate3d(0, 0, 0); }
          15% { transform: translate3d(-25%, 0, 0) rotate3d(0, 0, 1, -5deg); }
          30% { transform: translate3d(20%, 0, 0) rotate3d(0, 0, 1, 3deg); }
          45% { transform: translate3d(-15%, 0, 0) rotate3d(0, 0, 1, -3deg); }
          60% { transform: translate3d(10%, 0, 0) rotate3d(0, 0, 1, 2deg); }
          75% { transform: translate3d(-5%, 0, 0) rotate3d(0, 0, 1, -1deg); }
          100% { transform: translate3d(0, 0, 0); }
        }
        
        @keyframes jello-animation {
          0%, 11.1%, 100% { transform: translate3d(0, 0, 0); }
          22.2% { transform: skewX(-12.5deg) skewY(-12.5deg); }
          33.3% { transform: skewX(6.25deg) skewY(6.25deg); }
          44.4% { transform: skewX(-3.125deg) skewY(-3.125deg); }
          55.5% { transform: skewX(1.5625deg) skewY(1.5625deg); }
          66.6% { transform: skewX(-0.78125deg) skewY(-0.78125deg); }
          77.7% { transform: skewX(0.390625deg) skewY(0.390625deg); }
          88.8% { transform: skewX(-0.1953125deg) skewY(-0.1953125deg); }
        }
        
        @keyframes heartbeat-animation {
          0% { transform: scale(1); }
          14% { transform: scale(1.3); }
          28% { transform: scale(1); }
          42% { transform: scale(1.3); }
          70% { transform: scale(1); }
        }
        
        @keyframes hinge-animation {
          0% { transform-origin: top left; transform: rotate3d(0, 0, 1, 0); }
          20%, 60% { transform-origin: top left; transform: rotate3d(0, 0, 1, 80deg); }
          40%, 80% { transform-origin: top left; transform: rotate3d(0, 0, 1, 60deg); opacity: 1; }
          100% { transform-origin: top left; transform: translate3d(0, 700px, 0); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  private setInitialStyles(): void {
    // Common transition property for simple animations
    this.renderer.setStyle(
        this.el.nativeElement,
        'transition',
        `all ${this.duration}ms ease-out`
    );

    // Animation-specific initial styles
    switch (this.animation) {
      case 'fade-in':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        break;

      case 'fade-in-up':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(20px)');
        break;

      case 'fade-in-down':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-20px)');
        break;

      case 'fade-in-left':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(-20px)');
        break;

      case 'fade-in-right':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(20px)');
        break;

      case 'slide-up':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(30px)');
        break;

      case 'slide-down':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(-30px)');
        break;

      case 'slide-in-left':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(-50px)');
        break;

      case 'slide-in-right':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateX(50px)');
        break;

      case 'zoom-in':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(0.8)');
        break;

      case 'zoom-out':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1.2)');
        break;

      case 'flip-x':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'rotateX(90deg)');
        this.renderer.setStyle(this.el.nativeElement, 'perspective', '1000px');
        break;

      case 'flip-y':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'rotateY(90deg)');
        this.renderer.setStyle(this.el.nativeElement, 'perspective', '1000px');
        break;

      case 'rotate':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'rotate(-180deg)');
        break;

      case 'rotate-x':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'rotateX(-180deg)');
        this.renderer.setStyle(this.el.nativeElement, 'perspective', '1000px');
        break;

      case 'rotate-y':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'rotateY(-180deg)');
        this.renderer.setStyle(this.el.nativeElement, 'perspective', '1000px');
        break;

      case 'bounce':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(30px)');
        this.renderer.setStyle(this.el.nativeElement, 'transition', `opacity ${this.duration}ms ease-out, transform ${this.duration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`);
        break;

      case 'pulse':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(0.95)');
        break;

      case 'shake':
      case 'swing':
      case 'tada':
      case 'wobble':
      case 'jello':
      case 'heartbeat':
      case 'hinge':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        break;

      case 'roll-in':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translate3d(-100%, 0, 0) rotate3d(0, 0, 1, -120deg)');
        break;

      case 'roll-out':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translate3d(100%, 0, 0) rotate3d(0, 0, 1, 120deg)');
        break;

      case 'blur-in':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.el.nativeElement, 'filter', 'blur(10px)');
        break;
    }
  }

  private animate(): void {
    switch (this.animation) {
      case 'fade-in':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        break;

      case 'fade-in-up':
      case 'fade-in-down':
      case 'fade-in-left':
      case 'fade-in-right':
      case 'slide-up':
      case 'slide-down':
      case 'slide-in-left':
      case 'slide-in-right':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translate(0)');
        break;

      case 'zoom-in':
      case 'zoom-out':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)');
        break;

      case 'flip-x':
      case 'flip-y':
      case 'rotate':
      case 'rotate-x':
      case 'rotate-y':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'rotate(0)');
        break;

      case 'bounce':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translateY(0)');
        break;

      case 'pulse':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)');
        // Add pulse animation after initial appearance
        setTimeout(() => {
          this.renderer.setStyle(this.el.nativeElement, 'transition', `transform 300ms ease-in-out`);
          this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1.05)');
          setTimeout(() => {
            this.renderer.setStyle(this.el.nativeElement, 'transform', 'scale(1)');
          }, 300);
        }, this.duration);
        break;

      case 'shake':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        this.renderer.setStyle(this.el.nativeElement, 'animation', `shake-animation 0.8s ease-in-out`);
        setTimeout(() => {
          this.renderer.removeStyle(this.el.nativeElement, 'animation');
        }, 800);
        break;

      case 'swing':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        this.renderer.setStyle(this.el.nativeElement, 'transform-origin', 'top center');
        this.renderer.setStyle(this.el.nativeElement, 'animation', `swing-animation 1s ease-in-out`);
        setTimeout(() => {
          this.renderer.removeStyle(this.el.nativeElement, 'animation');
        }, 1000);
        break;

      case 'tada':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        this.renderer.setStyle(this.el.nativeElement, 'animation', `tada-animation 1s ease-in-out`);
        setTimeout(() => {
          this.renderer.removeStyle(this.el.nativeElement, 'animation');
        }, 1000);
        break;

      case 'wobble':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        this.renderer.setStyle(this.el.nativeElement, 'animation', `wobble-animation 1s ease-in-out`);
        setTimeout(() => {
          this.renderer.removeStyle(this.el.nativeElement, 'animation');
        }, 1000);
        break;

      case 'jello':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        this.renderer.setStyle(this.el.nativeElement, 'animation', `jello-animation 1s ease-in-out`);
        this.renderer.setStyle(this.el.nativeElement, 'transform-origin', 'center');
        setTimeout(() => {
          this.renderer.removeStyle(this.el.nativeElement, 'animation');
        }, 1000);
        break;

      case 'heartbeat':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        this.renderer.setStyle(this.el.nativeElement, 'animation', `heartbeat-animation 1.3s ease-in-out`);
        this.renderer.setStyle(this.el.nativeElement, 'transform-origin', 'center');
        setTimeout(() => {
          this.renderer.removeStyle(this.el.nativeElement, 'animation');
        }, 1300);
        break;

      case 'hinge':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        this.renderer.setStyle(this.el.nativeElement, 'animation', `hinge-animation 2s ease-in-out`);
        this.renderer.setStyle(this.el.nativeElement, 'transform-origin', 'top left');
        // No need to remove animation as the element will be hidden at the end
        break;

      case 'roll-in':
      case 'roll-out':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        this.renderer.setStyle(this.el.nativeElement, 'transform', 'translate3d(0, 0, 0) rotate3d(0, 0, 1, 0)');
        break;

      case 'blur-in':
        this.renderer.setStyle(this.el.nativeElement, 'opacity', '1');
        this.renderer.setStyle(this.el.nativeElement, 'filter', 'blur(0)');
        break;
    }

    this.hasAnimated = true;
  }

  private resetAnimation(): void {
    this.setInitialStyles();
    this.hasAnimated = false;
  }
}