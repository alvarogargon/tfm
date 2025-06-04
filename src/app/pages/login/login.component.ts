import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule,  Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

declare var VANTA: any;

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements AfterViewInit, OnDestroy {

  loginForm: FormGroup;
  private vantaEffect: any;

  ngAfterViewInit() {
      // this.vantaEffect = VANTA.FOG({
      //   el: "#vanta-bg",
      //   mouseControls: true,
      //   touchControls: true,
      //   gyroControls: false,
      //   minHeight: 200.00,
      //   minWidth: 200.00,
      //   highlightColor: 0x93939d,
      //   midtoneColor: 0x5f37ff,
      //   lowlightColor: 0xff,
      //   blurFactor: 0.20,
      //   speed: 0.20,
      //   zoom: 0.10
      // });

      this.vantaEffect = VANTA.FOG({
        el: '#vanta-bg-login',
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
      })
  }

  ngOnDestroy(): void {
    if (this.vantaEffect) {
      this.vantaEffect.destroy();
    }
  }

  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\w+\@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
    ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16)
      ])
    });
  }

  loginData() {
    this.loginForm.reset();
  }

    checkControl(controlName: string, errorName: string): boolean | undefined {
    return this.loginForm.get(controlName)?.hasError(errorName) && this.loginForm.get(controlName)?.touched
  }

}
