import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatTabsModule, 
    MatIconModule, 
    MatButtonModule, 
    MatInputModule, 
    MatFormFieldModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">System Settings</h1>
        <p class="page-subtitle">Manage global configuration, preferences, and system behavior.</p>
      </div>
      <button mat-flat-button color="primary" class="save-btn" (click)="saveSettings()">
        <mat-icon>save</mat-icon> Save Changes
      </button>
    </div>

    <mat-card class="settings-card glass-card">
      <mat-tab-group animationDuration="0ms">
        
        <!-- General Settings -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">domain</mat-icon> General
          </ng-template>
          <div class="tab-content">
            <h3>Organization Details</h3>
            <div class="form-grid">
              <mat-form-field appearance="outline">
                <mat-label>Organization Name</mat-label>
                <input matInput value="Indian Railways" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Support Email</mat-label>
                <input matInput value="support@railway.gov.in" />
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Default Currency</mat-label>
                <mat-select value="INR">
                  <mat-option value="INR">₹ INR (Indian Rupee)</mat-option>
                  <mat-option value="USD">$ USD (US Dollar)</mat-option>
                  <mat-option value="EUR">€ EUR (Euro)</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Time Zone</mat-label>
                <mat-select value="IST">
                  <mat-option value="IST">(UTC+05:30) Indian Standard Time</mat-option>
                  <mat-option value="UTC">(UTC+00:00) Universal Time Coordinated</mat-option>
                </mat-select>
              </mat-form-field>
            </div>
          </div>
        </mat-tab>

        <!-- Notification Settings -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">notifications</mat-icon> Notifications
          </ng-template>
          <div class="tab-content">
            <h3>Email & System Alerts</h3>
            <div class="toggle-list">
              <div class="toggle-item">
                <div class="toggle-text">
                  <strong>New Asset Requests</strong>
                  <p>Send an email to admins when a new asset request is created.</p>
                </div>
                <mat-slide-toggle checked="true" color="primary"></mat-slide-toggle>
              </div>
              <div class="toggle-item">
                <div class="toggle-text">
                  <strong>Maintenance Alerts</strong>
                  <p>Notify technicians when maintenance is scheduled.</p>
                </div>
                <mat-slide-toggle checked="true" color="primary"></mat-slide-toggle>
              </div>
              <div class="toggle-item">
                <div class="toggle-text">
                  <strong>Warranty Expiry</strong>
                  <p>Send alerts 30 days before an asset's warranty expires.</p>
                </div>
                <mat-slide-toggle checked="false" color="primary"></mat-slide-toggle>
              </div>
            </div>
          </div>
        </mat-tab>

        <!-- Security Settings -->
        <mat-tab>
          <ng-template mat-tab-label>
            <mat-icon class="tab-icon">security</mat-icon> Security
          </ng-template>
          <div class="tab-content">
            <h3>Authentication & Access</h3>
            <div class="toggle-list">
              <div class="toggle-item">
                <div class="toggle-text">
                  <strong>Two-Factor Authentication (2FA)</strong>
                  <p>Require 2FA for all administrative accounts.</p>
                </div>
                <mat-slide-toggle checked="false" color="primary"></mat-slide-toggle>
              </div>
              <div class="toggle-item">
                <div class="toggle-text">
                  <strong>Session Timeout</strong>
                  <p>Automatically log users out after 30 minutes of inactivity.</p>
                </div>
                <mat-slide-toggle checked="true" color="primary"></mat-slide-toggle>
              </div>
            </div>
            
            <h3 style="margin-top: 30px;">Data Backups</h3>
            <button mat-stroked-button color="primary">
              <mat-icon>cloud_download</mat-icon> Trigger Manual Database Backup
            </button>
          </div>
        </mat-tab>

      </mat-tab-group>
    </mat-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; }
    .page-title { margin: 0; color: var(--rail-navy); font-size: 32px; font-weight: 700; }
    .page-subtitle { margin: 5px 0 0; color: var(--text-muted); }
    .save-btn { border-radius: 8px; padding: 0 20px; height: 42px; }
    
    .settings-card { padding: 0; overflow: hidden; border-radius: 12px; }
    .tab-icon { vertical-align: middle; margin-right: 8px; font-size: 20px; width: 20px; height: 20px; }
    
    .tab-content { padding: 30px; }
    .tab-content h3 { color: var(--rail-navy); font-weight: 600; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; }
    
    .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    mat-form-field { width: 100%; }
    
    .toggle-list { display: flex; flex-direction: column; gap: 20px; }
    .toggle-item { display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
    .toggle-text strong { display: block; color: var(--rail-navy); margin-bottom: 4px; }
    .toggle-text p { margin: 0; color: #64748b; font-size: 13px; }
  `]
})
export class SettingsComponent {
  
  constructor(private snackBar: MatSnackBar) {}

  saveSettings() {
    this.snackBar.open('Settings saved successfully!', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }
}
