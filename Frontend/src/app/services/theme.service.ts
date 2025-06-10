import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private darkMode = new BehaviorSubject<boolean>(false);
  darkMode$ = this.darkMode.asObservable();

  initTheme() {
    // Check if user has already chosen a theme
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      // Apply saved theme
      this.darkMode.next(savedTheme === 'dark');
      this.applyTheme(savedTheme === 'dark');
    } else {
      // Check user's system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.darkMode.next(prefersDark);
      this.applyTheme(prefersDark);
    }
  }

  toggleTheme() {
    const newValue = !this.darkMode.value;
    this.darkMode.next(newValue);
    this.applyTheme(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
  }

  private applyTheme(isDark: boolean) {
    const theme = isDark ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }
}