import { Component, AfterViewInit, OnDestroy } from '@angular/core';
import { ReactiveFormsModule, AbstractControl, FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';

declare var VANTA: any;

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements AfterViewInit, OnDestroy {

  registerForm: FormGroup;
  private vantaEffect: any;
  showPassword = false;
  showRepitePassword = false;

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleRepitePasswordVisibility() {
    this.showRepitePassword = !this.showRepitePassword;
  }

  ngAfterViewInit() {
      this.vantaEffect = VANTA.FOG({
        el: '#vanta-bg-register',
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

  constructor() {
    this.registerForm = new FormGroup({
      type: new FormControl("", [
        Validators.required
      ]),
      name: new FormControl("", [
        Validators.required,
        Validators.minLength(3)
      ]),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(/^\w+\@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/)
      ]),
      edad: new FormControl(null, [
        Validators.required,
        Validators.min(18),
        Validators.max(65)
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16)
      ]),
      repitepassword: new FormControl("", [
        Validators.required
      ]),
    }, this.passwordMatchValidator as Validators)
  }

  getDataForm() {
    console.log(this.registerForm.value)
    this.registerForm.reset()
  }

  checkControl(controlName: string, errorName: string): boolean | undefined {
    return this.registerForm.get(controlName)?.hasError(errorName) && this.registerForm.get(controlName)?.touched
  }
  
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const repitepassword = form.get('repitepassword')?.value;
    return password === repitepassword ? null : { passwordMismatch: true };
  }

}