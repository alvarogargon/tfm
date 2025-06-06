import { Component, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule,  Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { IUserLogin } from '../../interfaces/iuser.interface';
import { toast } from 'ngx-sonner';

declare var VANTA: any;

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements AfterViewInit, OnDestroy {

  authService = inject(AuthService);
  router = inject(Router);
  loginForm: FormGroup;
  private vantaEffect: any;
  showPassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

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
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16)
      ])
    });
  }

  async loginData() {
    const credentials: IUserLogin = this.loginForm.value;
    try {
      const res = await this.authService.login(credentials);
      localStorage.setItem('token', res.token);
      toast.success(res.message);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      toast.error((error as Error).message);
    }
    this.loginForm.reset();
  }

  checkControl(controlName: string, errorName: string): boolean | undefined {
    return this.loginForm.get(controlName)?.hasError(errorName) && this.loginForm.get(controlName)?.touched
  }

}
