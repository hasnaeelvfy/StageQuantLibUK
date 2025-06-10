import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card card">
        <h1>Sign In</h1>
        
        <form [formGroup]="signinForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              formControlName="email"
              class="form-control"
              placeholder="your@email.com"
            >
            <div *ngIf="email?.invalid && (email?.dirty || email?.touched)" class="error-message">
              <div *ngIf="email?.errors?.['required']">Email is required</div>
              <div *ngIf="email?.errors?.['email']">Please enter a valid email</div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <div class="password-input">
              <input
                [type]="showPassword ? 'text' : 'password'"
                id="password"
                formControlName="password"
                class="form-control"
                placeholder="••••••••"
              >
              <button 
                type="button" 
                class="password-toggle"
                (click)="togglePasswordVisibility()"
                aria-label="Toggle password visibility"
              >
                <span class="material-icons">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <div *ngIf="password?.invalid && (password?.dirty || password?.touched)" class="error-message">
              <div *ngIf="password?.errors?.['required']">Password is required</div>
              <div *ngIf="password?.errors?.['minlength']">Password must be at least 6 characters</div>
            </div>
          </div>
          
          <div class="form-options">
            <div class="remember-me">
              <input type="checkbox" id="remember" formControlName="rememberMe">
              <label for="remember">Remember me</label>
            </div>
            <a class="forgot-password">Forgot password?</a>
          </div>
          
          <button type="submit" class="btn btn-primary auth-button" [disabled]="signinForm.invalid">
            Sign In
          </button>
        </form>
        
        <div class="auth-separator">
          <span>or</span>
        </div>
        
        <div class="auth-alternatives">
          <button class="btn btn-outline social-button">
            <span class="material-icons">mail</span>
            Continue with Google
          </button>
        </div>
        
        <div class="auth-footer">
          Don't have an account? <a routerLink="/signup">Sign Up</a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 300px);
      padding: 2rem 1rem;
    }
    
    .auth-card {
      width: 100%;
      max-width: 450px;
    }
    
    .auth-card h1 {
      text-align: center;
      margin-bottom: 2rem;
      color: var(--primary-color);
    }
    
    .password-input {
      position: relative;
    }
    
    .password-toggle {
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: var(--text-color);
      opacity: 0.6;
      cursor: pointer;
      padding: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .password-toggle:hover {
      opacity: 1;
    }
    
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      font-size: 0.9rem;
    }
    
    .remember-me {
      display: flex;
      align-items: center;
    }
    
    .remember-me input {
      margin-right: 0.5rem;
    }
    
    .forgot-password {
      color: var(--primary-color);
      cursor: pointer;
    }
    
    .forgot-password:hover {
      text-decoration: underline;
    }
    
    .auth-button {
      width: 100%;
      padding: 0.75rem;
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .auth-separator {
      display: flex;
      align-items: center;
      margin: 1.5rem 0;
      color: var(--text-color);
      opacity: 0.6;
    }
    
    .auth-separator::before,
    .auth-separator::after {
      content: '';
      flex: 1;
      height: 1px;
      background-color: var(--border-color);
    }
    
    .auth-separator span {
      padding: 0 0.5rem;
    }
    
    .auth-alternatives {
      margin-bottom: 1.5rem;
    }
    
    .social-button {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      font-size: 1rem;
    }
    
    .auth-footer {
      text-align: center;
      font-size: 0.9rem;
    }
    
    .auth-footer a {
      color: var(--primary-color);
      font-weight: 500;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .auth-card {
      animation: fadeIn 0.5s ease-in-out;
    }
  `]
})
export class SigninComponent {
  signinForm: FormGroup;
  showPassword = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false]
    });
  }

  get email() { return this.signinForm.get('email'); }
  get password() { return this.signinForm.get('password'); }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.signinForm.valid) {
      // This would call an authentication service in a real application
      console.log('Sign in form submitted', this.signinForm.value);
      
      // For demo purposes, redirect to home page
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 1000);
    } else {
      this.markFormGroupTouched(this.signinForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}