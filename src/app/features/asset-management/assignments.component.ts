import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';
import { AssignDialogComponent } from './assign-dialog.component';

@Component({
  selector: 'app-assignments',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatDialogModule, MatSnackBarModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Assignments History</h1>
        <p class="page-subtitle">Track chain of custody and active assignments.</p>
      </div>
      <button mat-flat-button class="action-btn" (click)="openAssignDialog()">
        <mat-icon>assignment_ind</mat-icon> ASSIGN ASSET
      </button>
    </div>

    <mat-card class="glass-card table-card">
      <div class="table-container">
        <table mat-table [dataSource]="data" class="custom-table" style="width: 100%;">
          
          <ng-container matColumnDef="assetSerialNumber">
            <th mat-header-cell *matHeaderCellDef> Asset SN </th>
            <td mat-cell *matCellDef="let element"> <strong>{{element.assetSerialNumber}}</strong> </td>
          </ng-container>

          <ng-container matColumnDef="assetName">
            <th mat-header-cell *matHeaderCellDef> Asset Name </th>
            <td mat-cell *matCellDef="let element"> {{element.assetName}} </td>
          </ng-container>

          <ng-container matColumnDef="employeeName">
            <th mat-header-cell *matHeaderCellDef> Assigned To </th>
            <td mat-cell *matCellDef="let element"> {{element.userName}} ({{element.userEmployeeId}}) </td>
          </ng-container>

          <ng-container matColumnDef="assignedDate">
            <th mat-header-cell *matHeaderCellDef> Assigned Date </th>
            <td mat-cell *matCellDef="let element"> {{element.assignedDate | date:'medium'}} </td>
          </ng-container>

          <ng-container matColumnDef="returnDate">
            <th mat-header-cell *matHeaderCellDef> Return Date </th>
            <td mat-cell *matCellDef="let element"> {{element.returnDate ? (element.returnDate | date:'medium') : '-'}} </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Status </th>
            <td mat-cell *matCellDef="let element"> 
              <span class="status-badge" [ngClass]="element.status">
                {{element.status}}
              </span> 
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let element">
              <button mat-flat-button color="warn" *ngIf="element.status === 'ACTIVE'" (click)="returnAsset(element)">
                <mat-icon>keyboard_return</mat-icon> Return
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
      <div *ngIf="data.length === 0" class="empty-state">
        <mat-icon>assignment</mat-icon>
        <p>No assignment history found.</p>
      </div>
    </mat-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; }
    .page-title { margin: 0; color: var(--rail-navy); font-size: 32px; font-weight: 700; }
    .page-subtitle { margin: 5px 0 0; color: var(--text-muted); }
    .action-btn { background: linear-gradient(135deg, var(--rail-orange), #ff6b00); color: white; border-radius: 8px; padding: 0 24px; height: 48px; }
    .status-badge.ACTIVE { background: rgba(18, 140, 126, 0.2); color: var(--rail-green); }
    .status-badge.RETURNED { background: rgba(148, 163, 184, 0.2); color: #475569; }
    .empty-state { text-align: center; padding: 40px; color: #94a3b8; }
    .empty-state mat-icon { font-size: 48px; width: 48px; height: 48px; margin-bottom: 10px; }
  `]
})
export class AssignmentsComponent implements OnInit {
  data: any[] = [];
  displayedColumns: string[] = ['assetSerialNumber', 'assetName', 'employeeName', 'assignedDate', 'returnDate', 'status', 'actions'];

  constructor(private api: ApiService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadAssignments();
  }

  loadAssignments() {
    this.api.getAssignments().subscribe({
      next: (res) => {
        // Sort descending by assignedDate
        this.data = res.sort((a, b) => new Date(b.assignedDate).getTime() - new Date(a.assignedDate).getTime());
      },
      error: (err) => {
        this.snackBar.open('Failed to load assignments', 'Close', { duration: 3000 });
      }
    });
  }

  openAssignDialog() {
    const dialogRef = this.dialog.open(AssignDialogComponent, { width: '500px' });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.assignAsset(result).subscribe({
          next: () => {
            this.snackBar.open('Asset Assigned successfully!', 'Close', { duration: 3000 });
            this.loadAssignments();
          },
          error: (err) => {
            let errorMsg = 'Failed to assign asset.';
            if (err.error && err.error.error) errorMsg = err.error.error;
            this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
          }
        });
      }
    });
  }

  returnAsset(assignment: any) {
    if (confirm('Are you sure you want to mark "' + assignment.assetName + '" as Returned?')) {
      this.api.returnAsset(assignment.id).subscribe({
        next: () => {
          this.snackBar.open('Asset Returned successfully!', 'Close', { duration: 3000 });
          this.loadAssignments();
        },
        error: (err) => {
          this.snackBar.open('Failed to return asset.', 'Close', { duration: 3000 });
        }
      });
    }
  }
}
