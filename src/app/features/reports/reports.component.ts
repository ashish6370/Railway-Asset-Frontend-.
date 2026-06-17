import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  template: `
    <div style="padding: 20px;">
      <h2>Report Center</h2>
      <div style="display: flex; gap: 10px;">
        <a mat-raised-button color="primary" href="http://localhost:8080/api/reports/pdf" target="_blank">Download PDF Summary</a>
        <a mat-raised-button color="accent" href="http://localhost:8080/api/reports/excel" target="_blank">Download Excel Dump</a>
      </div>
    </div>
  `
})
export class ReportsComponent {}