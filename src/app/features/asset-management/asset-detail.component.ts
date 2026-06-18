import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { environment } from '../../../environments/environment';
import { ApiService } from '../../core/services/api.service';
import { AssignDialogComponent } from './assign-dialog.component';

@Component({
  selector: 'app-asset-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatTabsModule, MatTableModule, MatIconModule, MatChipsModule, MatSnackBarModule, MatProgressBarModule],
  template: `
    <div class="page-header" *ngIf="asset">
      <div class="header-content">
        <h1 class="page-title">{{ asset.name }}</h1>
        <p class="page-subtitle">Serial Number: {{ asset.serialNumber }} • Added on {{ asset.createdAt | date }}</p>
      </div>
      <div class="header-actions">
        <mat-chip-set>
          <mat-chip [color]="asset.status === 'ACTIVE' ? 'primary' : 'warn'" highlighted>{{ asset.status }}</mat-chip>
          <mat-chip>{{ asset.conditionStatus }}</mat-chip>
        </mat-chip-set>
      </div>
    </div>

    <div class="detail-grid" *ngIf="asset">
      <!-- Left Column: Details & Tabs -->
      <div class="main-column">
        <mat-card class="glass-card custom-card">
          <mat-tab-group animationDuration="0ms">
            
            <mat-tab label="Asset Details">
              <div class="tab-content">
                <h3 class="section-title"><mat-icon>info</mat-icon> Basic Information</h3>
                <div class="detail-row"><strong>Category:</strong> <span>{{ asset.category?.name || 'N/A' }}</span></div>
                <div class="detail-row"><strong>Brand / Model:</strong> <span>{{ asset.brand || 'N/A' }} {{ asset.model || '' }}</span></div>
                <div class="detail-row"><strong>Department:</strong> <span>{{ asset.department?.name || 'N/A' }}</span></div>
                <div class="detail-row"><strong>Current Location:</strong> <span>{{ asset.location || 'N/A' }}</span></div>

                <h3 class="section-title" style="margin-top: 25px;"><mat-icon>shopping_cart</mat-icon> Procurement & Warranty</h3>
                <div class="detail-row"><strong>Purchase Date:</strong> <span>{{ asset.purchaseDate | date: 'mediumDate' || 'N/A' }}</span></div>
                <div class="detail-row"><strong>Purchase Cost:</strong> <span>₹{{ asset.purchaseCost || 'N/A' }}</span></div>
                <div class="detail-row"><strong>Vendor Name:</strong> <span>{{ asset.vendorName || 'N/A' }}</span></div>
                <div class="detail-row"><strong>Purchase Location:</strong> <span>{{ asset.purchaseLocation || 'N/A' }}</span></div>
                <div class="detail-row"><strong>Warranty Start:</strong> <span>{{ asset.warrantyStartDate | date: 'mediumDate' || 'N/A' }}</span></div>
                <div class="detail-row"><strong>Warranty Expiry:</strong> <span>{{ asset.warrantyExpiry | date: 'mediumDate' || 'N/A' }}</span></div>

                <h3 class="section-title" style="margin-top: 25px;"><mat-icon>build</mat-icon> Lifecycle & Maintenance</h3>
                <div class="detail-row"><strong>End of Life Date:</strong> <span>{{ asset.endOfLifeDate | date: 'mediumDate' || 'N/A' }}</span></div>
                <div class="detail-row"><strong>Maintenance Schedule:</strong> <span>{{ asset.maintenanceSchedule || 'None' }}</span></div>
                <div class="detail-row"><strong>Last Service:</strong> <span>{{ asset.lastServiceDate | date: 'mediumDate' || 'N/A' }}</span></div>
                <div class="detail-row"><strong>Next Service:</strong> <span>{{ asset.nextServiceDate | date: 'mediumDate' || 'N/A' }}</span></div>
              </div>
            </mat-tab>
            
            <mat-tab label="Assignments">
              <div class="tab-content">

                
                <div class="current-assignment" *ngIf="asset.status === 'ASSIGNED' && asset.assignedUser">
                  <h3>Currently Assigned To:</h3>
                  <p><strong>Name:</strong> {{ asset.assignedUser.name }}</p>
                  <p><strong>Employee ID:</strong> {{ asset.assignedUser.employeeId }}</p>
                  <p><strong>Assigned Date:</strong> {{ asset.assignedDate | date }}</p>
                </div>

                <table mat-table [dataSource]="assignments" class="custom-table" style="width: 100%; margin-top: 20px;">
                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef> Status </th>
                    <td mat-cell *matCellDef="let element">
                      <span class="status-badge" [ngClass]="element.status.toLowerCase()">{{element.status}}</span>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef> Actions </th>
                    <td mat-cell *matCellDef="let element"> 
                      <button *ngIf="element.status === 'ACTIVE'" mat-button color="warn" (click)="returnAsset(element.id)">Return Asset</button>
                    </td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="['status', 'actions']"></tr>
                  <tr mat-row *matRowDef="let row; columns: ['status', 'actions'];"></tr>
                </table>
              </div>
            </mat-tab>

            <mat-tab label="Maintenance Logs">
              <div class="tab-content">
                <div class="action-bar">
                  <button mat-flat-button class="action-btn" (click)="dummyMaintain()">
                    <mat-icon>build</mat-icon> Schedule Maintenance
                  </button>
                </div>
                <table mat-table [dataSource]="maintenance" class="custom-table" style="width: 100%;">
                  <ng-container matColumnDef="type">
                    <th mat-header-cell *matHeaderCellDef> Type </th>
                    <td mat-cell *matCellDef="let element"> {{element.maintenanceType}} </td>
                  </ng-container>
                  <ng-container matColumnDef="status">
                    <th mat-header-cell *matHeaderCellDef> Status </th>
                    <td mat-cell *matCellDef="let element">
                      <span class="status-badge" [ngClass]="element.status.toLowerCase()">{{element.status}}</span>
                    </td>
                  </ng-container>
                  <ng-container matColumnDef="actions">
                    <th mat-header-cell *matHeaderCellDef> Actions </th>
                    <td mat-cell *matCellDef="let element"> 
                      <button *ngIf="element.status === 'SCHEDULED'" mat-button color="accent" (click)="completeMaintenance(element.id)">Complete</button>
                    </td>
                  </ng-container>
                  <tr mat-header-row *matHeaderRowDef="['type', 'status', 'actions']"></tr>
                  <tr mat-row *matRowDef="let row; columns: ['type', 'status', 'actions'];"></tr>
                </table>
              </div>
            </mat-tab>

            <mat-tab label="Digital Passport">
              <div class="tab-content" *ngIf="passport">
                <div class="action-bar" style="display: flex; justify-content: space-between; align-items: center;">
                  <h3 class="section-title" style="margin: 0;">
                    <mat-icon>health_and_safety</mat-icon> Health Score: 
                    <span [style.color]="passport.healthScorePercentage > 70 ? '#166534' : (passport.healthScorePercentage > 40 ? '#b45309' : '#991b1b')">
                      {{passport.healthScorePercentage | number:'1.0-0'}}%
                    </span>
                  </h3>
                  <button mat-flat-button class="action-btn" (click)="downloadPassportPdf()">
                    <mat-icon>picture_as_pdf</mat-icon> Download PDF
                  </button>
                </div>
                
                <div class="timeline-container" style="margin-top: 20px; position: relative; padding-left: 20px; border-left: 2px solid #e2e8f0;">
                  <div class="timeline-item" *ngFor="let event of passport.timeline" style="margin-bottom: 20px; position: relative;">
                    <div class="timeline-dot" style="position: absolute; left: -27px; top: 0; width: 12px; height: 12px; border-radius: 50%; background: var(--rail-orange); border: 3px solid white; box-shadow: 0 0 0 1px var(--rail-orange);"></div>
                    <div class="timeline-date" style="font-size: 12px; color: #64748b; font-weight: 600;">{{ event.date | date:'medium' }}</div>
                    <div class="timeline-content" style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-top: 5px; border: 1px solid #e2e8f0;">
                      <div style="display: flex; justify-content: space-between;">
                        <strong style="color: var(--rail-navy);">{{ event.type }}</strong>
                        <span class="status-badge" [ngClass]="(event.status || 'UNKNOWN').toLowerCase()">{{ event.status || 'UNKNOWN' }}</span>
                      </div>
                      <p style="margin: 5px 0 0; font-size: 14px; color: #334155;">{{ event.description }}</p>
                      <small style="color: #94a3b8; display: block; margin-top: 5px;">Performed by: {{ event.performedBy }}</small>
                    </div>
                  </div>
                  <div *ngIf="!passport.timeline || passport.timeline.length === 0" style="color: #94a3b8; font-style: italic;">No historical events recorded yet.</div>
                </div>
              </div>
              <div class="tab-content" *ngIf="!passport">
                <mat-progress-bar mode="indeterminate"></mat-progress-bar>
              </div>
            </mat-tab>


          </mat-tab-group>
        </mat-card>
      </div>

      <!-- Right Column: Media & QR -->
      <div class="side-column">
        <mat-card class="glass-card custom-card text-center">
          <h3 class="section-title">Asset Image</h3>
          <img *ngIf="asset.imagePath" [src]="getAssetImageUrl()" class="asset-image">
          <div *ngIf="!asset.imagePath" class="no-image-placeholder">
            <mat-icon>image_not_supported</mat-icon>
            <p>No Image Available</p>
          </div>
        </mat-card>

        <mat-card class="glass-card custom-card text-center" style="margin-top: 24px;">
          <h3 class="section-title">QR Code</h3>
          <div class="qr-container">
            <img *ngIf="asset.qrCodeData" [src]="getQrCodeUrl()" alt="Asset QR Code" class="qr-image" style="width: 150px; height: 150px; object-fit: contain;">
            <p *ngIf="asset.qrCodeData" style="margin-top: 10px; font-weight: 600; color: #1e293b;">{{ asset.assetId }}</p>
            <div *ngIf="!asset.qrCodeData" class="no-image-placeholder">
              <mat-icon>qr_code</mat-icon>
              <p>No QR Code Generated</p>
            </div>
          </div>
          <div class="qr-actions" *ngIf="asset.qrCodeData" style="display: flex; flex-direction: column; gap: 10px; margin-top: 15px;">
            <button mat-flat-button color="primary" class="action-btn" (click)="downloadQrCode()" [disabled]="isProcessingQr">
              <mat-icon>download</mat-icon> Download
            </button>
            <button mat-flat-button color="accent" class="action-btn" (click)="printQrCode()" [disabled]="isProcessingQr">
              <mat-icon>print</mat-icon> Print Label
            </button>
            <button mat-stroked-button color="warn" class="action-btn" (click)="regenerateQrCode()" [disabled]="isProcessingQr">
              <mat-icon>refresh</mat-icon> Regenerate QR
            </button>
          </div>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 30px;
    }
    .page-title {
      margin: 0;
      color: var(--rail-navy);
      font-size: 32px;
      font-weight: 700;
    }
    .page-subtitle {
      margin: 5px 0 0 0;
      color: var(--rail-gray-text);
      font-size: 15px;
    }
    .detail-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 24px;
    }
    .custom-card {
      background: white;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      border-radius: 12px;
      overflow: hidden;
    }
    .tab-content {
      padding: 24px;
    }
    .detail-row {
      display: flex;
      padding: 12px 0;
      border-bottom: 1px solid #f1f5f9;
    }
    .detail-row strong {
      width: 150px;
      color: var(--rail-navy);
    }
    .detail-row span {
      color: #334155;
    }
    .section-title {
      margin: 0 0 15px 0;
      font-size: 18px;
      color: var(--rail-navy);
    }
    .text-center {
      text-align: center;
      padding: 24px;
    }
    .asset-image {
      width: 100%;
      max-width: 300px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    }
    .qr-container {
      background: white;
      padding: 10px;
      border-radius: 8px;
      display: inline-block;
      border: 2px dashed #cbd5e1;
    }
    .qr-image {
      width: 180px;
      height: 180px;
      display: block;
    }
    .no-image-placeholder {
      padding: 40px;
      background: #f8fafc;
      border-radius: 8px;
      color: var(--rail-gray-text);
    }
    .no-image-placeholder mat-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      opacity: 0.5;
    }
    .action-btn {
      background-color: var(--rail-orange) !important;
      color: white !important;
      border-radius: 6px;
    }
    .action-bar {
      margin-bottom: 20px;
    }
    .full-width {
      width: 100%;
    }
    .download-link {
      text-decoration: none;
    }
    .status-badge {
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
    }
    .status-badge.active, .status-badge.completed, .status-badge.available { background: #dcfce7; color: #166534; }
    .status-badge.scheduled, .status-badge.assigned { background: #fef9c3; color: #854d0e; }
    .status-badge.maintenance, .status-badge.returned { background: #fee2e2; color: #991b1b; }

    .current-assignment {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }
    .current-assignment h3 {
      margin-top: 0;
      color: var(--rail-navy);
      font-size: 16px;
      margin-bottom: 10px;
    }
    .current-assignment p {
      margin: 5px 0;
      color: #475569;
    }

    ::ng-deep .mat-mdc-tab-body-content {
      overflow: hidden !important;
    }

    @media (max-width: 900px) {
      .detail-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class AssetDetailComponent implements OnInit {
  asset: any;
  assignments: any[] = [];
  maintenance: any[] = [];
  passport: any;
  isProcessingQr = false;
  
  constructor(private route: ActivatedRoute, private api: ApiService, private dialog: MatDialog, private snackBar: MatSnackBar) {}
  
  ngOnInit() { this.loadData(); }

  getQrCodeUrl(): string {
    if (!this.asset?.qrCodeData) return '';
    if (this.asset.qrCodeData.startsWith('data:image')) return this.asset.qrCodeData;
    return `${environment.hostUrl}/${this.asset.qrCodeData}`;
  }

  getAssetImageUrl(): string {
    return `${environment.apiUrl}/files/download/${this.asset.imagePath}`;
  }

  downloadQrCode() {
    const url = this.getQrCodeUrl();
    if(!url) return;
    fetch(url)
      .then(res => res.blob())
      .then(blob => {
        const a = document.createElement('a');
        a.href = window.URL.createObjectURL(blob);
        a.download = `QR_${this.asset.assetId}.png`;
        a.click();
      })
      .catch(err => this.snackBar.open('Failed to download', 'Close', { duration: 3000 }));
  }

  printQrCode() {
    const url = this.getQrCodeUrl();
    if(!url) return;
    const printWindow = window.open('', '_blank');
    if(printWindow) {
      printWindow.document.write(`
        <html><head><title>Print Label</title>
        <style>body{text-align:center;font-family:sans-serif;margin-top:30px;} img{width:150px;height:150px;} h3{margin:10px 0 5px;} p{margin:0;font-size:14px;}</style>
        </head><body>
          <img src="${url}"/>
          <h3>${this.asset.name}</h3>
          <p>${this.asset.assetId}</p>
          <script>window.onload=function(){window.print();window.close();}</script>
        </body></html>
      `);
      printWindow.document.close();
    }
  }

  regenerateQrCode() {
    this.isProcessingQr = true;
    this.api.regenerateQr(this.asset.id).subscribe({
      next: (data: any) => {
        this.asset = data;
        this.isProcessingQr = false;
        this.snackBar.open('QR Regenerated', 'Close', { duration: 3000 });
      },
      error: () => {
        this.isProcessingQr = false;
        this.snackBar.open('Regeneration failed', 'Close', { duration: 3000 });
      }
    });
  }
  
  loadData() {
    const id = this.route.snapshot.paramMap.get('id');
    if(id) {
      this.api.getAssetById(+id).subscribe(data => this.asset = data);
      this.api.getAssetAssignments(+id).subscribe(data => this.assignments = data);
      this.api.getMaintenance(+id).subscribe(data => this.maintenance = data);
      this.api.getAssetPassport(+id).subscribe(data => this.passport = data);
    }
  }

  downloadPassportPdf() {
    if(this.asset && this.asset.id) {
      window.open(`${environment.apiUrl}/assets/${this.asset.id}/export/passport-pdf`, '_blank');
    }
  }

  openAssignDialog() {
    const dialogRef = this.dialog.open(AssignDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe(userId => {
      if (userId) {
        this.api.assignAsset({ assetId: this.asset.id, userId }).subscribe(() => this.loadData());
      }
    });
  }

  returnAssignedAsset() {
    const activeAssignment = this.assignments.find(a => a.status === 'ACTIVE');
    if (activeAssignment) {
      this.returnAsset(activeAssignment.id);
    }
  }

  returnAsset(id: number) {
    this.api.returnAsset(id).subscribe(() => this.loadData());
  }

  dummyMaintain() {
    this.api.scheduleMaintenance({ assetId: this.asset.id, maintenanceType: 'PREVENTIVE', description: 'Regular Checkup' }).subscribe(() => this.loadData());
  }
  completeMaintenance(id: number) {
    this.api.completeMaintenance(id, { cost: 150.00, performedBy: 'Tech A' }).subscribe(() => this.loadData());
  }
}

