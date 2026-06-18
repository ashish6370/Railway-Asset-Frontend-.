import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../core/services/api.service';
import { AssetDialogComponent } from './asset-dialog.component';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatPaginatorModule, MatButtonModule, MatInputModule, MatIconModule, RouterModule, MatDialogModule],
  template: `
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Railway Assets</h1>
        <p class="page-subtitle">Manage, track, and audit all physical railway assets</p>
      </div>
      <div class="header-actions">
        <button mat-stroked-button class="action-btn-secondary" (click)="exportExcel()" style="margin-right: 12px;">
          <mat-icon>download</mat-icon> Export Excel
        </button>
        <button mat-flat-button class="action-btn" (click)="openAddAssetModal()">
          <mat-icon>add</mat-icon> New Asset
        </button>
      </div>
    </div>

    <mat-card class="glass-card custom-card">
      <div class="table-controls">
        <mat-form-field appearance="outline" class="search-field">
          <mat-icon matPrefix>search</mat-icon>
          <input matInput (keyup)="applyFilter($event)" placeholder="Search assets by name or serial...">
        </mat-form-field>
      </div>

        <div class="table-container">
          <table mat-table [dataSource]="assets" class="custom-table" style="width: 100%;">
            <ng-container matColumnDef="serialNumber">
              <th mat-header-cell *matHeaderCellDef> Serial Number </th>
              <td mat-cell *matCellDef="let element"> {{element.serialNumber}} </td>
            </ng-container>

            <ng-container matColumnDef="name">
              <th mat-header-cell *matHeaderCellDef> Asset Name </th>
              <td mat-cell *matCellDef="let element"> {{element.name}} </td>
            </ng-container>

            <ng-container matColumnDef="brand">
              <th mat-header-cell *matHeaderCellDef> Brand </th>
              <td mat-cell *matCellDef="let element"> {{element.brand || 'N/A'}} </td>
            </ng-container>

            <ng-container matColumnDef="model">
              <th mat-header-cell *matHeaderCellDef> Model </th>
              <td mat-cell *matCellDef="let element"> {{element.model || 'N/A'}} </td>
            </ng-container>

            <ng-container matColumnDef="location">
              <th mat-header-cell *matHeaderCellDef> Location </th>
              <td mat-cell *matCellDef="let element"> {{element.location || 'N/A'}} </td>
            </ng-container>

            <ng-container matColumnDef="assignedUser">
              <th mat-header-cell *matHeaderCellDef> Assigned Employee </th>
              <td mat-cell *matCellDef="let element"> {{element.assignedUser?.name || 'Unassigned'}} </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th mat-header-cell *matHeaderCellDef> Status </th>
              <td mat-cell *matCellDef="let element">
                <span class="status-badge" [ngClass]="element.status?.toLowerCase()">{{element.status || 'AVAILABLE'}}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th mat-header-cell *matHeaderCellDef> Actions </th>
              <td mat-cell *matCellDef="let element">
                <button mat-icon-button color="primary" [routerLink]="['/assets', element.id]">
                  <mat-icon>visibility</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="['serialNumber', 'name', 'brand', 'model', 'location', 'assignedUser', 'status', 'actions']"></tr>
            <tr mat-row *matRowDef="let row; columns: ['serialNumber', 'name', 'brand', 'model', 'location', 'assignedUser', 'status', 'actions'];"></tr>
          </table>
        </div>

      <mat-paginator [length]="totalElements" [pageSize]="10" [pageSizeOptions]="[5, 10, 20]" (page)="onPageChange($event)"></mat-paginator>
    </mat-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; }
    .page-title { margin: 0; color: var(--rail-navy); font-size: 32px; font-weight: 700; }
    .page-subtitle { margin: 5px 0 0 0; color: var(--rail-gray-text); font-size: 15px; }
    
    .action-btn { background-color: var(--rail-orange) !important; color: white !important; border-radius: 6px; }
    .action-btn-secondary { color: var(--rail-navy) !important; border-color: var(--rail-navy) !important; }

    .custom-card { background: white; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-radius: 12px; padding: 24px; }
    
    .table-controls { margin-bottom: 20px; }
    .search-field { width: 100%; max-width: 400px; }
    
    .serial-badge { background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-family: monospace; font-weight: 600; color: #475569; }
    
    .status-badge { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .status-badge.active { background: #dcfce7; color: #166534; }
    .status-badge.maintenance { background: #fef9c3; color: #854d0e; }
    .status-badge.retired { background: #fee2e2; color: #991b1b; }
    
    .table-container {
      overflow-x: auto;
      width: 100%;
    }
    .custom-table {
      min-width: 800px;
    }
  `]
})
export class AssetsComponent implements OnInit {
  assets: any[] = [];
  totalElements = 0;
  searchStr = '';

  constructor(private api: ApiService, private dialog: MatDialog) {}
  
  ngOnInit() { this.loadAssets(0, 10); }

  openAddAssetModal() {
    this.dialog.open(AssetDialogComponent, {
      width: '750px',
      disableClose: true
    }).afterClosed().subscribe(result => {
      if (result) {
        result.conditionStatus = result.conditionStatus || 'EXCELLENT';
        result.depotId = result.depotId || 1;
        
        this.api.createAsset(result).subscribe({
          next: () => {
            // Refresh table
            this.loadAssets(0, 10);
          },
          error: (err) => {
            const message = err?.error?.error || err?.error?.message || err?.message || 'Failed to save asset.';
            alert(message);
          }
        });
      }
    });
  }

  loadAssets(page: number, size: number) {
    this.api.getAssets(page, size, this.searchStr).subscribe(data => {
      this.assets = data.content;
      this.totalElements = data.totalElements;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.searchStr = filterValue.trim().toLowerCase();
    this.loadAssets(0, 10);
  }

  onPageChange(event: any) {
    this.loadAssets(event.pageIndex, event.pageSize);
  }

  exportExcel() {
    this.api.exportExcel();
  }
}

