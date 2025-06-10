import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card card">
        <h1>Create Account</h1>
        
        <form [formGroup]="signupForm" (ngSubmit)="onSubmit()">
          <div class="form-row two-columns">
            <div class="form-group">
              <label for="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                formControlName="firstName"
                class="form-control"
                placeholder="John"
              >
              <div *ngIf="firstName?.invalid && (firstName?.dirty || firstName?.touched)" class="error-message">
                <div *ngIf="firstName?.errors?.['required']">First name is required</div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                formControlName="lastName"
                class="form-control"
                placeholder="Doe"
              >
              <div *ngIf="lastName?.invalid && (lastName?.dirty || lastName?.touched)" class="error-message">
                <div *ngIf="lastName?.errors?.['required']">Last name is required</div>
              </div>
            </div>
          </div>
          
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
              <div *ngIf="password?.errors?.['minlength']">Password must be at least 8 characters</div>
              <div *ngIf="password?.errors?.['pattern']">Password must include at least one letter and one number</div>
            </div>
          </div>
          
          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <div class="password-input">
              <input
                [type]="showConfirmPassword ? 'text' : 'password'"
                id="confirmPassword"
                formControlName="confirmPassword"
                class="form-control"
                placeholder="••••••••"
              >
              <button 
                type="button" 
                class="password-toggle"
                (click)="toggleConfirmPasswordVisibility()"
                aria-label="Toggle password visibility"
              >
                <span class="material-icons">{{ showConfirmPassword ? 'visibility_off' : 'visibility' }}</span>
              </button>
            </div>
            <div *ngIf="confirmPassword?.invalid && (confirmPassword?.dirty || confirmPassword?.touched)" class="error-message">
              <div *ngIf="confirmPassword?.errors?.['required']">Please confirm your password</div>
            </div>
            <div *ngIf="signupForm.errors?.['passwordMismatch'] && confirmPassword?.touched" class="error-message">
              Passwords do not match
            </div>
          </div>
          
          <div class="form-group terms">
            <div class="checkbox-wrapper">
              <input type="checkbox" id="termsAgreed" formControlName="termsAgreed">
              <label for="termsAgreed">I agree to the <a>Terms of Service</a> and <a>Privacy Policy</a></label>
            </div>
            <div *ngIf="termsAgreed?.invalid && (termsAgreed?.dirty || termsAgreed?.touched)" class="error-message">
              <div *ngIf="termsAgreed?.errors?.['required']">You must agree to the terms</div>
            </div>
          </div>
          
          <button type="submit" class="btn btn-primary auth-button" [disabled]="signupForm.invalid">
            Create Account
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
          Already have an account? <a routerLink="/signin">Sign In</a>
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
      max-width: 550px;
    }
    
    .auth-card h1 {
      text-align: center;
      margin-bottom: 2rem;
      color: var(--primary-color);
    }
    
    .form-row {
      margin-bottom: 0;
    }
    
    .two-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
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
    
    .terms {
      margin-top: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .checkbox-wrapper {
      display: flex;
      align-items: flex-start;
    }
    
    .checkbox-wrapper input {
      margin-right: 0.5rem;
      margin-top: 0.25rem;
    }
    
    .checkbox-wrapper a {
      color: var(--primary-color);
      cursor: pointer;
    }
    
    .checkbox-wrapper a:hover {
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
    
    @media (max-width: 768px) {
      .two-columns {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SignupComponent {
  signupForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
      ]],
      confirmPassword: ['', Validators.required],
      termsAgreed: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  get firstName() { return this.signupForm.get('firstName'); }
  get lastName() { return this.signupForm.get('lastName'); }
  get email() { return this.signupForm.get('email'); }
  get password() { return this.signupForm.get('password'); }
  get confirmPassword() { return this.signupForm.get('confirmPassword'); }
  get termsAgreed() { return this.signupForm.get('termsAgreed'); }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onSubmit() {
    if (this.signupForm.valid) {
      // This would call a registration service in a real application
      console.log('Sign up form submitted', this.signupForm.value);
      
      // For demo purposes, redirect to sign in page
      setTimeout(() => {
        this.router.navigate(['/signin']);
      }, 1000);
    } else {
      this.markFormGroupTouched(this.signupForm);
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