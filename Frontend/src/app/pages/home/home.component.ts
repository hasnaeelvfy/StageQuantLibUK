import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1>Accurate Gilt Calculations Made Simple</h1>
          <p>
            Easily calculate gilt yields, prices, and returns with our comprehensive calculator.
            Make informed investment decisions with precision and confidence.
          </p>
          <div class="hero-actions">
            <a routerLink="/single-gilt" class="btn btn-primary">Try Single Gilt Calculator</a>
            <a routerLink="/multi-gilt" class="btn btn-outline">Compare Multiple Gilts</a>
          </div>
        </div>
      </div>
    </section>
    
    <section class="features">
      <div class="container">
        <h2 class="section-title">Why Choose Our Gilt Calculator</h2>
        
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <span class="material-icons">calculate</span>
            </div>
            <h3>Precise Calculations</h3>
            <p>Get accurate yields, prices, and returns using industry-standard formulas.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <span class="material-icons">insights</span>
            </div>
            <h3>Market Analysis</h3>
            <p>Compare your gilt investments against market benchmarks and indices.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <span class="material-icons">account_balance</span>
            </div>
            <h3>Investment Planning</h3>
            <p>Plan your investment strategy with comprehensive gilt performance data.</p>
          </div>
          
          <div class="feature-card">
            <div class="feature-icon">
              <span class="material-icons">phonelink</span>
            </div>
            <h3>Access Anywhere</h3>
            <p>Use our calculator on any device, whenever and wherever you need it.</p>
          </div>
        </div>
      </div>
    </section>
    
    <section class="how-it-works">
      <div class="container">
        <h2 class="section-title">How It Works</h2>
        
        <div class="steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>Enter Gilt Details</h3>
              <p>
                Input the gilt's ISIN, coupon rate, and key dates to start your calculation.
              </p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>Review Results</h3>
              <p>
                Get instant calculations of yields, prices, and returns based on current market conditions.
              </p>
            </div>
          </div>
          
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>Make Informed Decisions</h3>
              <p>
                Use the comprehensive analysis to optimize your investment strategy.
              </p>
            </div>
          </div>
        </div>
        
        <div class="cta-container">
          <a routerLink="/signup" class="btn btn-primary">Create Free Account</a>
          <p class="cta-note">No credit card required. Start calculating in seconds.</p>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .hero {
      background: linear-gradient(135deg, var(--primary-color) 0%, #0d47a1 100%);
      color: white;
      padding: 4rem 0;
      margin-bottom: 3rem;
      border-radius: 0 0 50% 50% / 5%;
    }
    
    .hero-content {
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    
    .hero h1 {
      font-size: 2.5rem;
      margin-bottom: 1.5rem;
      font-weight: 700;
    }
    
    .hero p {
      font-size: 1.25rem;
      margin-bottom: 2rem;
      opacity: 0.9;
    }
    
    .hero-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 1rem;
    }
    
    .hero .btn {
      padding: 0.75rem 1.5rem;
      font-size: 1.1rem;
    }
    
    .hero .btn-outline {
      border-color: white;
      color: white;
    }
    
    .hero .btn-outline:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    .section-title {
      text-align: center;
      margin-bottom: 3rem;
      position: relative;
      padding-bottom: 1rem;
    }
    
    .section-title::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 80px;
      height: 3px;
      background-color: var(--primary-color);
    }
    
    .features {
      padding: 4rem 0;
    }
    
    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
    }
    
    .feature-card {
      background-color: var(--card-background);
      border-radius: 8px;
      padding: 2rem;
      box-shadow: 0 4px 12px var(--shadow-color);
      text-align: center;
      transition: transform 0.3s, box-shadow 0.3s;
    }
    
    .feature-card:hover {
      transform: translateY(-10px);
      box-shadow: 0 8px 24px var(--shadow-color);
    }
    
    .feature-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 70px;
      height: 70px;
      background-color: rgba(25, 118, 210, 0.1);
      border-radius: 50%;
      margin: 0 auto 1.5rem;
    }
    
    .feature-icon .material-icons {
      font-size: 32px;
      color: var(--primary-color);
    }
    
    .feature-card h3 {
      margin-bottom: 1rem;
    }
    
    .how-it-works {
      padding: 4rem 0;
      background-color: var(--background-color);
    }
    
    .steps {
      max-width: 800px;
      margin: 0 auto 3rem;
    }
    
    .step {
      display: flex;
      margin-bottom: 2rem;
      position: relative;
    }
    
    .step:not(:last-child)::after {
      content: '';
      position: absolute;
      top: 70px;
      left: 25px;
      width: 2px;
      height: calc(100% - 50px);
      background-color: var(--primary-color);
    }
    
    .step-number {
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 50px;
      height: 50px;
      background-color: var(--primary-color);
      color: white;
      border-radius: 50%;
      font-weight: bold;
      margin-right: 1.5rem;
      z-index: 1;
    }
    
    .step-content {
      padding-top: 0.5rem;
    }
    
    .cta-container {
      text-align: center;
      margin-top: 3rem;
    }
    
    .cta-container .btn {
      padding: 0.75rem 2rem;
      font-size: 1.1rem;
    }
    
    .cta-note {
      margin-top: 1rem;
      font-size: 0.9rem;
      opacity: 0.8;
    }
    
    @media (max-width: 768px) {
      .hero {
        padding: 3rem 0;
      }
      
      .hero h1 {
        font-size: 2rem;
      }
      
      .hero p {
        font-size: 1.1rem;
      }
      
      .step {
        flex-direction: column;
      }
      
      .step-number {
        margin-bottom: 1rem;
      }
      
      .step:not(:last-child)::after {
        display: none;
      }
    }
  `]
})
export class HomeComponent {}