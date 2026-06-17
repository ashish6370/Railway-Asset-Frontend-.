import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-approvals',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatTabsModule, MatCardModule, MatIconModule, MatSnackBarModule],
  template: `
    <div class="page-header">
      <div>
        <h1 class="page-title">Approvals Hub</h1>
        <p class="page-subtitle">Review pending employee requests.</p>
      </div>
    </div>

    <mat-card class="glass-card" style="padding: 0;">
      <mat-tab-group>
        <mat-tab label="Maintenance Requests ({{maintenance.length}})">
          <div class="table-container">
            <table mat-table [dataSource]="maintenance" class="custom-table" style="width: 100%;">
              <ng-container matColumnDef="asset">
                <th mat-header-cell *matHeaderCellDef> Asset </th>
                <td mat-cell *matCellDef="let element"> {{element.itemName}} <br><small>{{element.assetSerialNumber}}</small> </td>
              </ng-container>
              <ng-container matColumnDef="requestedBy">
                <th mat-header-cell *matHeaderCellDef> Requested By </th>
                <td mat-cell *matCellDef="let element"> {{element.requestedBy}} </td>
              </ng-container>
              <ng-container matColumnDef="description">
                <th mat-header-cell *matHeaderCellDef> Description </th>
                <td mat-cell *matCellDef="let element"> {{element.justification}} </td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef style="text-align: right;"> Actions </th>
                <td mat-cell *matCellDef="let element" style="text-align: right;">
                  <button mat-button color="primary" (click)="processMaintenance(element.id, true)">Approve</button>
                  <button mat-button color="warn" (click)="processMaintenance(element.id, false)">Reject</button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['asset', 'requestedBy', 'description', 'actions']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['asset', 'requestedBy', 'description', 'actions'];"></tr>
            </table>
            <div *ngIf="maintenance.length === 0" style="padding: 20px; text-align: center; color: #64748b;">No pending maintenance requests.</div>
          </div>
        </mat-tab>

        <mat-tab label="Procurement Requests ({{procurement.length}})">
          <div class="table-container">
            <table mat-table [dataSource]="procurement" class="custom-table" style="width: 100%;">
              <ng-container matColumnDef="item">
                <th mat-header-cell *matHeaderCellDef> Item Requested </th>
                <td mat-cell *matCellDef="let element"> {{element.itemName}} </td>
              </ng-container>
              <ng-container matColumnDef="requestedBy">
                <th mat-header-cell *matHeaderCellDef> Requested By </th>
                <td mat-cell *matCellDef="let element"> {{element.requestedBy}} </td>
              </ng-container>
              <ng-container matColumnDef="cost">
                <th mat-header-cell *matHeaderCellDef> Est. Cost </th>
                <td mat-cell *matCellDef="let element"> ₹{{element.estimatedCost}} </td>
              </ng-container>
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef style="text-align: right;"> Actions </th>
                <td mat-cell *matCellDef="let element" style="text-align: right;">
                  <button mat-button color="primary" (click)="processProcurement(element.id, true)">Approve</button>
                  <button mat-button color="warn" (click)="processProcurement(element.id, false)">Reject</button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="['item', 'requestedBy', 'cost', 'actions']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['item', 'requestedBy', 'cost', 'actions'];"></tr>
            </table>
            <div *ngIf="procurement.length === 0" style="padding: 20px; text-align: center; color: #64748b;">No pending procurement requests.</div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </mat-card>
  `,
  styles: [`
    .page-header { margin-bottom: 20px; }
    .page-title { margin: 0; color: var(--rail-navy); font-size: 32px; font-weight: 700; }
    .page-subtitle { margin: 5px 0 0; color: var(--text-muted); }
  `]
})
export class ApprovalsComponent implements OnInit {
  maintenance: any[] = [];
  procurement: any[] = [];
  
  constructor(private api: ApiService, private snackBar: MatSnackBar) {}
  
  ngOnInit() { this.loadData(); }
  
  loadData() {
    this.api.getPendingRequests().subscribe(data => {
      this.maintenance = data.filter(r => r.type === 'MAINTENANCE');
      this.procurement = data.filter(r => r.type === 'PROCUREMENT');
    });
  }
  
  processMaintenance(id: number, approve: boolean) {
    this.api.processMaintenanceRequest(id, approve).subscribe(() => {
      this.snackBar.open(approve ? 'Request Approved' : 'Request Rejected', 'Close', { duration: 3000 });
      this.loadData();
    });
  }
  
  processProcurement(id: number, approve: boolean) {
    this.api.processProcurementRequest(id, approve).subscribe(() => {
      this.snackBar.open(approve ? 'Request Approved' : 'Request Rejected', 'Close', { duration: 3000 });
      this.loadData();
    });
  }
}

