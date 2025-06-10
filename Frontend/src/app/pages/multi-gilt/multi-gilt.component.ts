import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-multi-gilt',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container">
      <header class="page-header">
        <h1>Multi Gilt Comparison</h1>
        <p>Upload multiple gilts data for batch calculation and comparison</p>
      </header>
      
      <div class="card upload-card">
        <div class="upload-zone" 
             [class.dragging]="isDragging"
             (dragover)="onDragOver($event)"
             (dragleave)="onDragLeave($event)"
             (drop)="onDrop($event)">
          
          <input
            type="file"
            #fileInput
            (change)="onFileSelected($event)"
            accept=".csv,.xlsx,.xls"
            class="file-input"
          >
          
          <div class="upload-content">
            <span class="material-icons upload-icon">cloud_upload</span>
            <h3>Drag & Drop your file here</h3>
            <p>or</p>
            <button class="btn btn-primary" (click)="fileInput.click()">
              Browse Files
            </button>
            <p class="file-types">Supported formats: CSV, Excel (.xlsx, .xls)</p>
          </div>
        </div>
        
        <div *ngIf="selectedFile" class="selected-file">
          <div class="file-info">
            <span class="material-icons">description</span>
            <span class="file-name">{{ selectedFile.name }}</span>
            <span class="file-size">({{ formatFileSize(selectedFile.size) }})</span>
          </div>
          <button class="btn btn-outline remove-file" (click)="removeFile()">
            <span class="material-icons">close</span>
          </button>
        </div>
      </div>
      
      <div class="action-buttons" *ngIf="selectedFile">
        <button class="btn btn-primary" (click)="calculate()">
          <span class="material-icons">calculate</span>
          Calculate
        </button>
        <button class="btn btn-outline" (click)="reset()">
          <span class="material-icons">refresh</span>
          Reset
        </button>
      </div>
      
      <div class="upload-requirements card">
        <h3>File Requirements</h3>
        <ul>
          <li>File must contain the following columns:
            <ul>
              <li>ISIN (required)</li>
              <li>Coupon Rate (required)</li>
              <li>Issue Date (required)</li>
              <li>Maturity Date (required)</li>
              <li>Name (optional)</li>
            </ul>
          </li>
          <li>Maximum file size: 5MB</li>
          <li>First row should contain column headers</li>
        </ul>
        
        <div class="template-download">
          <p>Need help getting started?</p>
          <button class="btn btn-outline" (click)="downloadTemplate()">
            <span class="material-icons">download</span>
            Download Template
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .upload-card {
      max-width: 800px;
      margin: 0 auto 2rem;
    }
    
    .upload-zone {
      border: 2px dashed var(--border-color);
      border-radius: 8px;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;
      cursor: pointer;
      position: relative;
    }
    
    .upload-zone.dragging {
      border-color: var(--primary-color);
      background-color: rgba(25, 118, 210, 0.05);
    }
    
    .file-input {
      display: none;
    }
    
    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    
    .upload-icon {
      font-size: 4rem;
      color: var(--primary-color);
      margin-bottom: 1rem;
    }
    
    .file-types {
      font-size: 0.9rem;
      color: var(--text-color);
      opacity: 0.7;
    }
    
    .selected-file {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 1rem;
      padding: 1rem;
      background-color: rgba(25, 118, 210, 0.05);
      border-radius: 4px;
    }
    
    .file-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .file-name {
      font-weight: 500;
    }
    
    .file-size {
      color: var(--text-color);
      opacity: 0.7;
    }
    
    .remove-file {
      padding: 0.25rem;
      min-width: unset;
    }
    
    .action-buttons {
      display: flex;
      justify-content: center;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .action-buttons .btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
    }
    
    .upload-requirements {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .upload-requirements h3 {
      color: var(--primary-color);
      margin-bottom: 1rem;
    }
    
    .upload-requirements ul {
      list-style-type: none;
      padding-left: 0;
    }
    
    .upload-requirements ul ul {
      padding-left: 1.5rem;
      margin: 0.5rem 0;
    }
    
    .upload-requirements li {
      margin-bottom: 0.5rem;
      position: relative;
      padding-left: 1.5rem;
    }
    
    .upload-requirements li::before {
      content: '•';
      position: absolute;
      left: 0;
      color: var(--primary-color);
    }
    
    .template-download {
      margin-top: 2rem;
      text-align: center;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }
    
    .template-download p {
      margin-bottom: 1rem;
    }
    
    .template-download .btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .selected-file,
    .action-buttons {
      animation: fadeIn 0.3s ease-out;
    }
  `]
})
export class MultiGiltComponent {
  isDragging = false;
  selectedFile: File | null = null;
  
  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }
  
  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }
  
  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }
  
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }
  
  handleFile(file: File) {
    // Check file type
    const validTypes = ['.csv', '.xlsx', '.xls'];
    const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    
    if (!validTypes.includes(fileExtension)) {
      alert('Please upload a valid CSV or Excel file');
      return;
    }
    
    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should not exceed 5MB');
      return;
    }
    
    this.selectedFile = file;
  }
  
  removeFile() {
    this.selectedFile = null;
  }
  
  calculate() {
    if (!this.selectedFile) return;
    
    // Here you would implement the actual file processing and calculation
    console.log('Processing file:', this.selectedFile.name);
  }
  
  reset() {
    this.selectedFile = null;
  }
  
  downloadTemplate() {
    // Here you would implement the template download logic
    console.log('Downloading template...');
  }
  
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}