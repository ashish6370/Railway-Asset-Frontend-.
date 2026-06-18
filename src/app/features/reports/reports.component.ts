import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dashboard-header" style="margin-bottom: 25px;">
      <div style="display: flex; gap: 10px;">
        <a mat-raised-button color="primary" [href]="apiUrl + '/reports/pdf'" target="_blank">Download PDF Summary</a>
        <a mat-raised-button color="accent" [href]="apiUrl + '/reports/excel'" target="_blank">Download Excel Dump</a>
      </div>
    </div>
  `
})
export class ReportsComponent {
  apiUrl = environment.apiUrl;
}