import { Component } from '@angular/core';
import { ReactiveFormsModule, AbstractControl, FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  registerForm: FormGroup;

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
      repitepassword: new FormControl("", []),
    }, [])
  }

  getDataForm() {
    console.log(this.registerForm.value)
    this.registerForm.reset()
  }

  checkControl(controlName: string, errorName: string): boolean | undefined {
    return this.registerForm.get(controlName)?.hasError(errorName) && this.registerForm.get(controlName)?.touched
  }

}


