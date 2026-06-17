import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-audits',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule, MatSnackBarModule],
  template: `
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Audit & Compliance Scanner</h1>
        <p class="page-subtitle">Verify railway assets using the integrated scanner</p>
      </div>
    </div>

    <div class="audit-grid">
      <!-- Scanner Column -->
      <div class="scanner-column">
        <mat-card class="glass-card custom-card">
          <div class="scanner-header">
            <h2 class="section-title"><mat-icon>qr_code_scanner</mat-icon> Asset Scanner</h2>
            <div class="status-indicator" [ngClass]="isScanning ? 'active' : 'idle'">
              <span class="dot"></span> {{ isScanning ? 'Camera Active' : 'Camera Idle' }}
            </div>
          </div>

          <div class="viewfinder-container">
            <div class="viewfinder" [class.scanning]="isScanning">
              <div class="corner top-left"></div>
              <div class="corner top-right"></div>
              <div class="corner bottom-left"></div>
              <div class="corner bottom-right"></div>
              <div *ngIf="isScanning" class="laser"></div>
              <mat-icon *ngIf="!isScanning" class="camera-icon">videocam_off</mat-icon>
            </div>
          </div>

          <div class="scanner-controls">
            <button mat-flat-button [color]="isScanning ? 'warn' : 'primary'" class="scan-btn" (click)="toggleScanner()">
              <mat-icon>{{ isScanning ? 'stop' : 'play_arrow' }}</mat-icon> 
              {{ isScanning ? 'Stop Scanner' : 'Start Scanner' }}
            </button>
          </div>

          <div class="manual-entry">
            <p class="divider"><span>OR MANUAL ENTRY</span></p>
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Scanned Asset ID / Serial</mat-label>
              <input matInput [(ngModel)]="scannedAssetId" placeholder="e.g. 1">
              <mat-icon matPrefix>center_focus_strong</mat-icon>
            </mat-form-field>
            
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Select Audit Session ID</mat-label>
              <input matInput [(ngModel)]="selectedSessionId" placeholder="e.g. 1" type="number">
              <mat-icon matPrefix>event_note</mat-icon>
            </mat-form-field>

            <button mat-flat-button class="verify-btn full-width" (click)="verifyAsset()" [disabled]="!scannedAssetId || !selectedSessionId">
              <mat-icon>verified</mat-icon> Verify Scanned Asset
            </button>
          </div>
        </mat-card>
      </div>

      <!-- Audit Sessions Column -->
      <div class="sessions-column">
        <mat-card class="glass-card custom-card">
          <div class="card-header">
            <h2 class="section-title">Active Audit Sessions</h2>
            <button mat-stroked-button color="primary"><mat-icon>add</mat-icon> New Session</button>
          </div>
          
          <table mat-table [dataSource]="audits" class="custom-table" style="width: 100%;">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef> ID </th>
              <td mat-cell *matCellDef="let element"> #{{element.id}} </td>
            </ng-container>
            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef> Session Name </th>
              <td mat-cell *matCellDef="let element"> <strong>{{element.name}}</strong> </td>
            </ng-container>
            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef> Status </th>
              <td mat-cell *matCellDef="let element">
                <span class="status-badge" [ngClass]="element.status.toLowerCase()">{{element.status}}</span>
              </td>
            </ng-container>
            <tr mat-header-row *matHeaderRowDef="['id', 'name', 'status']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['id', 'name', 'status'];"></tr>
          </table>
          
          <div *ngIf="audits.length === 0" class="empty-state">
            <mat-icon>assignment</mat-icon>
            <p>No active audit sessions found.</p>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 30px; }
    .page-title { margin: 0; color: var(--rail-navy); font-size: 32px; font-weight: 700; }
    .page-subtitle { margin: 5px 0 0 0; color: var(--rail-gray-text); font-size: 15px; }
    
    .audit-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 24px;
    }
    
    .custom-card {
      background: white;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      border-radius: 12px;
      padding: 24px;
    }

    .scanner-header, .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .section-title {
      margin: 0;
      font-size: 20px;
      color: var(--rail-navy);
      display: flex;
      align-items: center;
    }
    .section-title mat-icon { margin-right: 8px; color: var(--rail-orange); }

    .status-indicator {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 12px;
    }
    .status-indicator .dot {
      width: 8px; height: 8px; border-radius: 50%; margin-right: 6px;
    }
    .status-indicator.active { background: #dcfce7; color: #166534; }
    .status-indicator.active .dot { background: #166534; animation: blink 1s infinite; }
    .status-indicator.idle { background: #f1f5f9; color: #64748b; }
    .status-indicator.idle .dot { background: #94a3b8; }

    @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }

    .viewfinder-container {
      background: #0f172a;
      border-radius: 12px;
      padding: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 20px;
      height: 250px;
    }

    .viewfinder {
      width: 200px;
      height: 200px;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .corner { position: absolute; width: 40px; height: 40px; border: 4px solid var(--rail-orange); }
    .top-left { top: 0; left: 0; border-right: none; border-bottom: none; }
    .top-right { top: 0; right: 0; border-left: none; border-bottom: none; }
    .bottom-left { bottom: 0; left: 0; border-right: none; border-top: none; }
    .bottom-right { bottom: 0; right: 0; border-left: none; border-top: none; }

    .camera-icon { font-size: 48px; width: 48px; height: 48px; color: #475569; }

    .laser {
      width: 100%;
      height: 2px;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
      position: absolute;
      top: 0;
      animation: scan 2s linear infinite;
    }

    @keyframes scan {
      0% { top: 5%; }
      50% { top: 95%; }
      100% { top: 5%; }
    }

    .scan-btn { width: 100%; height: 48px; font-size: 16px; margin-bottom: 20px; }
    .verify-btn { background-color: var(--rail-orange) !important; color: white !important; height: 48px; font-size: 16px; }

    .divider {
      text-align: center; border-bottom: 1px solid #e2e8f0; line-height: 0.1em; margin: 20px 0; color: #94a3b8; font-size: 12px; font-weight: 600;
    }
    .divider span { background: white; padding: 0 10px; }
    .full-width { width: 100%; }

    .status-badge { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-badge.active, .status-badge.completed { background: #dcfce7; color: #166534; }
    .status-badge.planned { background: #fef9c3; color: #854d0e; }

    .empty-state { text-align: center; padding: 40px; color: #94a3b8; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 10px; opacity: 0.5; }

    @media (max-width: 900px) { .audit-grid { grid-template-columns: 1fr; } }
  `]
})
export class AuditsComponent implements OnInit {
  audits: any[] = [];
  isScanning = false;
  scannedAssetId = '';
  selectedSessionId = 1;

  constructor(private api: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit() { 
    this.api.getAudits().subscribe(d => {
      this.audits = d;
      if (d && d.length > 0) {
        this.selectedSessionId = d[0].id;
      }
    }); 
  }

  toggleScanner() {
    this.isScanning = !this.isScanning;
  }

  verifyAsset() {
    if(!this.scannedAssetId || !this.selectedSessionId) return;
    
    // In a real app, scanning the QR gives the Asset ID. Here we use the input.
    this.api.verifyAudit(this.selectedSessionId, +this.scannedAssetId, 'PRESENT').subscribe({
      next: () => {
        this.snackBar.open('Asset #' + this.scannedAssetId + ' verified successfully!', 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
        this.scannedAssetId = '';
      },
      error: (err) => {
        this.snackBar.open('Verification failed: ' + (err.error?.message || 'Asset not found'), 'Close', { duration: 3000 });
      }
    });
  }
}