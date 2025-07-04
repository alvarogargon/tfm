import { Component, AfterViewInit, OnDestroy, inject } from '@angular/core';
import { ReactiveFormsModule, AbstractControl, FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { IUserRegister } from '../../interfaces/iuser.interface';
import { toast } from 'ngx-sonner';

declare var VANTA: any;

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements AfterViewInit, OnDestroy {

  authService = inject(AuthService);
  router = inject(Router);
  registerForm: FormGroup;
  private vantaEffect: any;
  showPassword = false;
  showRepitePassword = false;
  rawPhoneNumber = '';
  currentStep = 1;
  showCheck = false;
  showProgressBar = true;

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

  ngOnInit() {
    this.registerForm.statusChanges.subscribe(status => {
      if (this.isStepValid(3)) {
        this.showProgressBar = false;
        this.showCheck = true;
        setTimeout(() => {
          this.showCheck = false;
        }, 2000);
      } else {
        this.showProgressBar = true;
        this.showCheck = false;
      }
    });
  }

  constructor() {
    this.registerForm = new FormGroup({
      username: new FormControl("", [
        Validators.required,
        Validators.minLength(5)
      ]),
      email: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]),
      password: new FormControl("", [
        Validators.required,
        Validators.minLength(8),
        Validators.maxLength(16)
      ]),
      repitepassword: new FormControl("", [
        Validators.required
      ]),
      first_name: new FormControl("", [
        Validators.required,
        Validators.minLength(3)
      ]),
      last_name: new FormControl("", [
        Validators.required,
        Validators.minLength(4)
      ]),
      age: new FormControl(null, [
        Validators.required,
        Validators.min(18),
        Validators.max(65)
      ]),
      num_tel: new FormControl("", [
        Validators.required,
        this.phoneValidator
      ]),
      gender: new FormControl("", [
        Validators.required
      ]),
      role: new FormControl("", [
        Validators.required
      ]),
    }, this.passwordMatchValidator as Validators)
  }

  async registerData() {
    const formData = { ...this.registerForm.value, num_tel: this.rawPhoneNumber };
    const credentials: IUserRegister = {
      ...formData,
      image: 'https://i.pinimg.com/736x/2f/15/f2/2f15f2e8c688b3120d3d26467b06330c.jpg'
    };
    try {
      const registerRes = await this.authService.register(credentials);
      toast.success(registerRes.message);
      
      // Automatically log in the user after successful registration
      const loginCredentials = {
        email: credentials.email,
        password: credentials.password
      };
      
      await this.authService.login(loginCredentials);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      toast.error((error as Error).message);
    }
    this.currentStep = 1;
    this.registerForm.reset();
  }

  checkControl(controlName: string, errorName: string): boolean | undefined {
    return this.registerForm.get(controlName)?.hasError(errorName) && this.registerForm.get(controlName)?.touched
  }
  
  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const repitepassword = form.get('repitepassword')?.value;
    return password === repitepassword ? null : { passwordMismatch: true };
  }

  phoneValidator(control: AbstractControl) {
    const digits = (control.value || '').replace(/\D/g, '');
    return /^\d{9}$/.test(digits) ? null : { pattern: true };
  }

  formatPhoneNumber() {
    const control = this.registerForm.get('num_tel');
    if (!control) return;
    // Remove all non-digit characters
    let digits = (control.value || '').replace(/\D/g, '');
    // Keep only the first 9 digits
    digits = digits.slice(0, 9);
    // Store the raw number for submission
    this.rawPhoneNumber = digits;
    // Insert a space every 3 digits for display
    const formatted = digits.replace(/(.{3})/g, '$1 ').trim();
    // Set the formatted value for display
    control.setValue(formatted, { emitEvent: false });
  }

  nextStep() {
    if (this.isStepValid(this.currentStep)) {
      this.currentStep++;
    }
  }
  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
  
  isStepValid(step: number): boolean {
    let controls: string[] = [];
    if (step === 1) controls = ['username', 'email', 'password', 'repitepassword'];
    if (step === 2) controls = ['first_name', 'last_name', 'age', 'num_tel'];
    if (step === 3) controls = ['gender', 'role'];
    const allControlsValid = controls.every(name => this.registerForm.get(name)?.valid);
    if (step === 1) {
      return allControlsValid && !this.registerForm.hasError('passwordMismatch');
    }
    return allControlsValid;
  }

}