import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-single-gilt',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="container">
      <header class="page-header">
        <h1>Single Gilt Calculator</h1>
        <p>Enter the details of your gilt to calculate its metrics</p>
      </header>
      
      <div class="card">
        <form [formGroup]="giltForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label for="name">Name (Optional)</label>
              <input
                type="text"
                id="name"
                formControlName="name"
                class="form-control"
                placeholder="E.g., UK Treasury 4% 2030"
              >
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="isin">ISIN *</label>
              <input
                type="text"
                id="isin"
                formControlName="isin"
                class="form-control"
                placeholder="E.g., GB00BN65R313"
              >
              <div *ngIf="isin?.invalid && (isin?.dirty || isin?.touched)" class="error-message">
                <div *ngIf="isin?.errors?.['required']">ISIN is required</div>
                <div *ngIf="isin?.errors?.['pattern']">ISIN must be a valid format</div>
              </div>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="coupon">Coupon (%) *</label>
              <input
                type="number"
                id="coupon"
                formControlName="coupon"
                class="form-control"
                placeholder="E.g., 4.25"
                step="0.01"
              >
              <div *ngIf="coupon?.invalid && (coupon?.dirty || coupon?.touched)" class="error-message">
                <div *ngIf="coupon?.errors?.['required']">Coupon is required</div>
                <div *ngIf="coupon?.errors?.['min']">Coupon must be at least 0</div>
                <div *ngIf="coupon?.errors?.['max']">Coupon cannot exceed 100</div>
              </div>
            </div>
          </div>
          
          <div class="form-row two-columns">
            <div class="form-group">
              <label for="issueDate">Issue Date *</label>
              <input
                type="date"
                id="issueDate"
                formControlName="issueDate"
                class="form-control"
              >
              <div *ngIf="issueDate?.invalid && (issueDate?.dirty || issueDate?.touched)" class="error-message">
                <div *ngIf="issueDate?.errors?.['required']">Issue date is required</div>
              </div>
            </div>
            
            <div class="form-group">
              <label for="maturityDate">Maturity Date *</label>
              <input
                type="date"
                id="maturityDate"
                formControlName="maturityDate"
                class="form-control"
              >
              <div *ngIf="maturityDate?.invalid && (maturityDate?.dirty || maturityDate?.touched)" class="error-message">
                <div *ngIf="maturityDate?.errors?.['required']">Maturity date is required</div>
              </div>
              <div *ngIf="giltForm.errors?.['maturityDateInvalid']" class="error-message">
                Maturity date must be after issue date
              </div>
            </div>
          </div>
          
          <div class="form-actions">
            <button type="submit" class="btn btn-primary" [disabled]="giltForm.invalid">Calculate</button>
            <button type="button" class="btn btn-outline" (click)="resetForm()">Reset</button>
          </div>
        </form>
      </div>
      
      <div *ngIf="calculationResult" class="card result-card">
        <h2>Calculation Results</h2>
        
        <div class="result-grid">
          <div class="result-item">
            <div class="result-label">Yield to Maturity</div>
            <div class="result-value">{{ calculationResult.ytm }}%</div>
          </div>
          
          <div class="result-item">
            <div class="result-label">Clean Price</div>
            <div class="result-value">£{{ calculationResult.cleanPrice }}</div>
          </div>
          
          <div class="result-item">
            <div class="result-label">Dirty Price</div>
            <div class="result-value">£{{ calculationResult.dirtyPrice }}</div>
          </div>
          
          <div class="result-item">
            <div class="result-label">Duration</div>
            <div class="result-value">{{ calculationResult.duration }} years</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .form-row {
      margin-bottom: 1.5rem;
    }
    
    .two-columns {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }
    
    .form-actions {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-top: 2rem;
    }
    
    .form-actions .btn {
      min-width: 120px;
    }
    
    .result-card {
      margin-top: 2rem;
      background-color: var(--card-background);
      animation: fadeIn 0.5s ease-in-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .result-card h2 {
      text-align: center;
      margin-bottom: 2rem;
      color: var(--primary-color);
    }
    
    .result-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1.5rem;
    }
    
    .result-item {
      text-align: center;
      padding: 1rem;
      border-radius: 8px;
      background-color: rgba(25, 118, 210, 0.05);
    }
    
    .result-label {
      font-size: 0.9rem;
      font-weight: 500;
      margin-bottom: 0.5rem;
      color: var(--text-color);
      opacity: 0.8;
    }
    
    .result-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary-color);
    }
    
    @media (max-width: 768px) {
      .two-columns {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class SingleGiltComponent {
  giltForm: FormGroup;
  calculationResult: any = null;

  constructor(private fb: FormBuilder) {
    this.giltForm = this.fb.group({
      name: [''],
      isin: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}[A-Z0-9]{9}\d$/)]],
      coupon: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      issueDate: ['', Validators.required],
      maturityDate: ['', Validators.required]
    }, { validators: this.maturityDateValidator });
  }

  get isin() { return this.giltForm.get('isin'); }
  get coupon() { return this.giltForm.get('coupon'); }
  get issueDate() { return this.giltForm.get('issueDate'); }
  get maturityDate() { return this.giltForm.get('maturityDate'); }

  maturityDateValidator(group: FormGroup) {
    const issueDate = group.get('issueDate')?.value;
    const maturityDate = group.get('maturityDate')?.value;
    
    if (issueDate && maturityDate && new Date(issueDate) >= new Date(maturityDate)) {
      return { maturityDateInvalid: true };
    }
    
    return null;
  }

  onSubmit() {
    if (this.giltForm.valid) {
      // In a real application, this would call a service to perform calculations
      // For demo purposes, we'll simulate a calculation
      this.simulateCalculation();
    } else {
      this.markFormGroupTouched(this.giltForm);
    }
  }

  resetForm() {
    this.giltForm.reset();
    this.calculationResult = null;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private simulateCalculation() {
    // This is a mock calculation for demonstration purposes
    const coupon = parseFloat(this.giltForm.value.coupon);
    const maturityDate = new Date(this.giltForm.value.maturityDate);
    const today = new Date();
    
    // Calculate years to maturity
    const yearsToMaturity = (maturityDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24 * 365);
    
    // Mock calculation results
    this.calculationResult = {
      ytm: (coupon - 0.2 + (Math.random() * 0.5)).toFixed(2),
      cleanPrice: (100 + Math.random() * 10 - 5).toFixed(2),
      dirtyPrice: (100 + coupon / 4 + Math.random() * 10 - 5).toFixed(2),
      duration: (yearsToMaturity * 0.8).toFixed(2)
    };
  }
}