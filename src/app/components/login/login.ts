import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loginForm: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isSubmitting = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigate(['/clients']);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error?.error?.errors?.[0]?.msg || error?.error?.message || 'Login failed';
      }
    });
  }

  isInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
