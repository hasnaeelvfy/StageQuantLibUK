import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="container">
        <div class="navbar-content">
          <div class="navbar-brand">
            <a routerLink="/">
              <span class="logo-text">Gilt Calculator</span>
            </a>
          </div>
          
          <button class="navbar-toggle" (click)="toggleMobileMenu()" aria-label="Toggle navigation">
            <span class="material-icons">{{ isMobileMenuOpen ? 'close' : 'menu' }}</span>
          </button>
          
          <div class="navbar-menu" [class.active]="isMobileMenuOpen">
            <ul class="navbar-nav">
              <li class="nav-item">
                <a class="nav-link" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/single-gilt" routerLinkActive="active">Single Gilt</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/multi-gilt" routerLinkActive="active">Multi Gilt</a>
              </li>
            </ul>
          </div>
          
          <div class="navbar-actions">
            <button class="theme-toggle" (click)="toggleTheme()" aria-label="Toggle theme">
              <span class="material-icons">{{ (darkMode$ | async) ? 'light_mode' : 'dark_mode' }}</span>
            </button>
            
            <a class="btn btn-outline auth-btn" routerLink="/signin">Sign In</a>
            <a class="btn btn-primary auth-btn" routerLink="/signup">Sign Up</a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background-color: var(--card-background);
      box-shadow: 0 2px 8px var(--shadow-color);
      position: sticky;
      top: 0;
      z-index: 1000;
    }
    
    .navbar-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 0;
    }
    
    .navbar-brand {
      font-size: 1.5rem;
      font-weight: 700;
    }
    
    .logo-text {
      color: var(--primary-color);
      display: flex;
      align-items: center;
    }
    
    .navbar-toggle {
      display: none;
      background: none;
      border: none;
      color: var(--text-color);
      cursor: pointer;
      font-size: 1.5rem;
    }
    
    .navbar-menu {
      display: flex;
      align-items: center;
    }
    
    .navbar-nav {
      display: flex;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    
    .nav-item {
      margin: 0 1rem;
    }
    
    .nav-link {
      color: var(--text-color);
      font-weight: 500;
      padding: 0.5rem;
      text-decoration: none;
      transition: color 0.2s;
      position: relative;
    }
    
    .nav-link:hover {
      color: var(--primary-color);
    }
    
    .nav-link.active {
      color: var(--primary-color);
    }
    
    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background-color: var(--primary-color);
    }
    
    .navbar-actions {
      display: flex;
      align-items: center;
    }
    
    .theme-toggle {
      background: none;
      border: none;
      color: var(--text-color);
      cursor: pointer;
      margin-right: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      border-radius: 50%;
      transition: background-color 0.2s;
    }
    
    .theme-toggle:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .auth-btn {
      margin-left: 0.5rem;
    }
    
    @media (max-width: 768px) {
      .navbar-toggle {
        display: block;
      }
      
      .navbar-menu {
        position: fixed;
        top: 60px;
        left: 0;
        width: 100%;
        background-color: var(--card-background);
        box-shadow: 0 4px 8px var(--shadow-color);
        flex-direction: column;
        align-items: flex-start;
        padding: 1rem;
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s;
      }
      
      .navbar-menu.active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }
      
      .navbar-nav {
        flex-direction: column;
        width: 100%;
      }
      
      .nav-item {
        margin: 0.5rem 0;
        width: 100%;
      }
      
      .nav-link {
        display: block;
        padding: 0.75rem 0;
      }
      
      .navbar-actions {
        margin-left: auto;
      }
      
      .auth-btn {
        display: none;
      }
      
      .navbar-menu.active .auth-btn {
        display: block;
        margin: 0.5rem 0;
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class NavbarComponent {
  isMobileMenuOpen = false;
  darkMode$ = this.themeService.darkMode$;

  constructor(private themeService: ThemeService) {}

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}