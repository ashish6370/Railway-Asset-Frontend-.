import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { ProcurementDialogComponent, MaintenanceDialogComponent } from './request-dialogs.component';

@Component({
  selector: 'app-my-requests',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">My Requests</h1>
        <p class="page-subtitle">Submit and track your procurement and maintenance requests.</p>
      </div>
      <div class="header-actions">
        <button mat-stroked-button color="primary" class="action-btn" (click)="openMaintenanceDialog()">
          <mat-icon>build</mat-icon> Request Maintenance
        </button>
        <button mat-flat-button color="primary" class="action-btn" (click)="openProcurementDialog()">
          <mat-icon>add_shopping_cart</mat-icon> Request New Asset
        </button>
      </div>
    </div>

    <mat-card class="glass-card table-card">
      <div class="table-container">
        <table mat-table [dataSource]="data" class="custom-table" style="width: 100%;">
          
          <ng-container matColumnDef="type">
            <th mat-header-cell *matHeaderCellDef> Type </th>
            <td mat-cell *matCellDef="let element"> 
              <mat-icon style="vertical-align: middle; margin-right: 5px; color: #64748b;">
                {{ element.type === 'PROCUREMENT' ? 'shopping_cart' : 'build' }}
              </mat-icon>
              {{element.type}} 
            </td>
          </ng-container>

          <ng-container matColumnDef="itemName">
            <th mat-header-cell *matHeaderCellDef> Item / Asset </th>
            <td mat-cell *matCellDef="let element"> 
              <strong>{{element.itemName}}</strong>
              <div *ngIf="element.assetSerialNumber" style="font-size: 11px; color: #64748b;">SN: {{element.assetSerialNumber}}</div>
            </td>
          </ng-container>

          <ng-container matColumnDef="requestDate">
            <th mat-header-cell *matHeaderCellDef> Request Date </th>
            <td mat-cell *matCellDef="let element"> {{element.requestDate | date:'mediumDate'}} </td>
          </ng-container>

          <ng-container matColumnDef="estimatedCost">
            <th mat-header-cell *matHeaderCellDef> Est. Cost </th>
            <td mat-cell *matCellDef="let element"> {{element.estimatedCost ? ('₹' + element.estimatedCost) : '-'}} </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Status </th>
            <td mat-cell *matCellDef="let element"> 
              <span class="status-badge" [ngClass]="element.status">
                {{element.status}}
              </span> 
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
      <div *ngIf="data.length === 0" class="empty-state">
        <mat-icon>receipt_long</mat-icon>
        <p>You haven't submitted any requests yet.</p>
      </div>
    </mat-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; }
    .page-title { margin: 0; color: var(--rail-navy); font-size: 32px; font-weight: 700; }
    .page-subtitle { margin: 5px 0 0; color: var(--text-muted); }
    .header-actions { display: flex; gap: 15px; }
    .action-btn { border-radius: 8px; padding: 0 20px; height: 42px; }
    .status-badge.PENDING_APPROVAL { background: rgba(245, 158, 11, 0.2); color: #d97706; }
    .status-badge.APPROVED { background: rgba(16, 185, 129, 0.2); color: #059669; }
    .status-badge.REJECTED { background: rgba(239, 68, 68, 0.2); color: #dc2626; }
    .empty-state { text-align: center; padding: 40px; color: #94a3b8; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 10px; }
  `]
})
export class MyRequestsComponent implements OnInit {
  data: any[] = [];
  displayedColumns: string[] = ['type', 'itemName', 'requestDate', 'estimatedCost', 'status'];
  
  // Hardcode userId 1 for demo purposes
  currentUserId = 1;

  constructor(private api: ApiService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    this.api.getMyRequests(this.currentUserId).subscribe({
      next: (res) => this.data = res,
      error: () => this.snackBar.open('Failed to load requests', 'Close', { duration: 3000 })
    });
  }

  openProcurementDialog() {
    const dialogRef = this.dialog.open(ProcurementDialogComponent, { width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.userId = this.currentUserId;
        this.api.submitProcurementRequest(result).subscribe({
          next: () => {
            this.snackBar.open('Procurement request submitted!', 'Close', { duration: 3000 });
            this.loadRequests();
          },
          error: (err) => this.snackBar.open('Error submitting request', 'Close', { duration: 3000 })
        });
      }
    });
  }

  openMaintenanceDialog() {
    const dialogRef = this.dialog.open(MaintenanceDialogComponent, { width: '500px', data: { userId: this.currentUserId } });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        result.userId = this.currentUserId;
        this.api.submitMaintenanceRequest(result).subscribe({
          next: () => {
            this.snackBar.open('Maintenance request submitted!', 'Close', { duration: 3000 });
            this.loadRequests();
          },
          error: (err) => this.snackBar.open('Error submitting request', 'Close', { duration: 3000 })
        });
      }
    });
  }
}
