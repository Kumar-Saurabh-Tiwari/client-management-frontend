import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  registerForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    this.authService.register(this.registerForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/clients']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.errors?.[0]?.msg || error?.error?.message || 'Registration failed';
      }
    });
  }

  isInvalid(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
