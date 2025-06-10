import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3>Gilt Calculator</h3>
            <p>Your trusted tool for gilt investment calculations</p>
          </div>
          
          <div class="footer-links">
            <div class="footer-section">
              <h4>Navigation</h4>
              <ul>
                <li><a routerLink="/">Home</a></li>
                <li><a routerLink="/single-gilt">Single Gilt</a></li>
                <li><a routerLink="/multi-gilt">Multi Gilt</a></li>
              </ul>
            </div>
            
            <div class="footer-section">
              <h4>Account</h4>
              <ul>
                <li><a routerLink="/signin">Sign In</a></li>
                <li><a routerLink="/signup">Sign Up</a></li>
              </ul>
            </div>
          </div>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; Hamza Maadar - {{ currentYear }} Gilt Calculator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--card-background);
      border-top: 1px solid var(--border-color);
      padding: 3rem 0 1.5rem;
      margin-top: 2rem;
    }
    
    .footer-content {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-bottom: 2rem;
    }
    
    .footer-brand {
      flex: 0 0 100%;
      max-width: 100%;
      margin-bottom: 2rem;
    }
    
    .footer-brand h3 {
      color: var(--primary-color);
      margin-bottom: 0.5rem;
    }
    
    .footer-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      flex: 0 0 100%;
      max-width: 100%;
    }
    
    .footer-section {
      flex: 0 0 48%;
      max-width: 48%;
      margin-bottom: 1.5rem;
    }
    
    .footer-section h4 {
      margin-bottom: 1rem;
    }
    
    .footer-section ul {
      list-style: none;
      padding: 0;
    }
    
    .footer-section li {
      margin-bottom: 0.5rem;
    }
    
    .footer-section a {
      color: var(--text-color);
      text-decoration: none;
      transition: color 0.2s;
    }
    
    .footer-section a:hover {
      color: var(--primary-color);
    }
    
    .footer-bottom {
      text-align: center;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }
    
    @media (min-width: 768px) {
      .footer-brand {
        flex: 0 0 30%;
        max-width: 30%;
        margin-bottom: 0;
      }
      
      .footer-links {
        flex: 0 0 65%;
        max-width: 65%;
      }
      
      .footer-section {
        flex: 0 0 auto;
        max-width: none;
      }
    }
  `]
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
}