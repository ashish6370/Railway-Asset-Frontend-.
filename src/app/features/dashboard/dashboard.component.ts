import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatTableModule, MatProgressBarModule],
  template: `
    <div class="dashboard-header" style="margin-bottom: 25px;">
      <div>
        <h1 class="page-title" style="margin: 0; color: var(--rail-navy); font-size: 32px; font-weight: 700;">Command Center</h1>
        <p class="page-subtitle" style="margin: 5px 0 0; color: var(--text-muted);">Real-time Railway Asset Analytics</p>
      </div>
    </div>

    <!-- Main Metrics Grid -->
    <div class="stats-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 30px;">
      
      <!-- Total Assets -->
      <mat-card class="stat-card glass-card" style="padding: 20px; border-radius: 16px; display: flex; flex-direction: row; align-items: center; gap: 15px;">
        <div style="background: rgba(37, 99, 235, 0.1); color: #2563eb; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
          <mat-icon>inventory_2</mat-icon>
        </div>
        <div>
          <h3 style="margin: 0; font-size: 13px; color: #64748b; text-transform: uppercase;">Total Assets</h3>
          <div style="font-size: 28px; font-weight: 700; color: var(--rail-navy);">{{metrics?.totalAssets || 0}}</div>
        </div>
      </mat-card>

      <!-- Monthly Cost -->
      <mat-card class="stat-card glass-card" style="padding: 20px; border-radius: 16px; display: flex; flex-direction: row; align-items: center; gap: 15px;">
        <div style="background: rgba(16, 185, 129, 0.1); color: #10b981; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
          <mat-icon>payments</mat-icon>
        </div>
        <div>
          <h3 style="margin: 0; font-size: 13px; color: #64748b; text-transform: uppercase;">Monthly Cost</h3>
          <div style="font-size: 24px; font-weight: 700; color: var(--rail-navy);">₹{{(metrics?.monthlyProcurementCost || 0) | number:'1.0-0'}}</div>
        </div>
      </mat-card>

      <!-- Pending Approvals -->
      <mat-card class="stat-card glass-card" style="padding: 20px; border-radius: 16px; display: flex; flex-direction: row; align-items: center; gap: 15px;">
        <div style="background: rgba(245, 158, 11, 0.1); color: #f59e0b; width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center;">
          <mat-icon>pending_actions</mat-icon>
        </div>
        <div>
          <h3 style="margin: 0; font-size: 13px; color: #64748b; text-transform: uppercase;">Pending Approvals</h3>
          <div style="font-size: 28px; font-weight: 700; color: var(--rail-navy);">{{metrics?.pendingApprovals || 0}}</div>
        </div>
      </mat-card>
      
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px;">
      
      <!-- Status Breakdown -->
      <mat-card class="glass-card" style="padding: 25px; border-radius: 16px;">
        <h2 style="margin-top: 0; margin-bottom: 20px; font-size: 18px; color: var(--rail-navy); display: flex; align-items: center; gap: 8px;">
          <mat-icon style="color: #64748b;">pie_chart</mat-icon> Asset Status Breakdown
        </h2>
        
        <div style="display: flex; flex-direction: column; gap: 15px;">
          <div class="status-row">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-weight: 500;">Available</span>
              <strong>{{metrics?.availableAssets || 0}}</strong>
            </div>
            <mat-progress-bar mode="determinate" [value]="getPercent(metrics?.availableAssets)" color="primary"></mat-progress-bar>
          </div>
          
          <div class="status-row">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-weight: 500;">Assigned</span>
              <strong>{{metrics?.assignedAssets || 0}}</strong>
            </div>
            <mat-progress-bar mode="determinate" [value]="getPercent(metrics?.assignedAssets)" style="--mdc-linear-progress-active-indicator-color: #10b981;"></mat-progress-bar>
          </div>
          
          <div class="status-row">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-weight: 500;">Under Maintenance</span>
              <strong>{{metrics?.maintenanceAssets || 0}}</strong>
            </div>
            <mat-progress-bar mode="determinate" [value]="getPercent(metrics?.maintenanceAssets)" style="--mdc-linear-progress-active-indicator-color: #f59e0b;"></mat-progress-bar>
          </div>
          
          <div class="status-row">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <span style="font-weight: 500;">Damaged</span>
              <strong>{{metrics?.damagedAssets || 0}}</strong>
            </div>
            <mat-progress-bar mode="determinate" [value]="getPercent(metrics?.damagedAssets)" style="--mdc-linear-progress-active-indicator-color: #ef4444;"></mat-progress-bar>
          </div>
        </div>
      </mat-card>

      <!-- Asset Value By Category -->
      <mat-card class="glass-card" style="padding: 25px; border-radius: 16px;">
        <h2 style="margin-top: 0; margin-bottom: 20px; font-size: 18px; color: var(--rail-navy); display: flex; align-items: center; gap: 8px;">
          <mat-icon style="color: #64748b;">category</mat-icon> Value by Category
        </h2>
        
        <div style="display: flex; flex-direction: column; gap: 15px; max-height: 250px; overflow-y: auto;">
          <div *ngIf="!metrics?.valueByCategory || metrics.valueByCategory.length === 0" style="color: #94a3b8; text-align: center; padding: 20px;">
            No category data available.
          </div>
          <div *ngFor="let cat of metrics?.valueByCategory" style="display: flex; justify-content: space-between; padding: 10px; background: rgba(255,255,255,0.5); border-radius: 8px;">
            <div style="font-weight: 500;">{{cat.category}}</div>
            <div style="font-weight: 700; color: var(--rail-navy);">₹{{cat.totalValue | number:'1.0-0'}}</div>
          </div>
        </div>
      </mat-card>

    </div>

    <!-- Warranties Expiring Soon -->
    <mat-card class="glass-card" style="padding: 0; border-radius: 16px; overflow: hidden;">
      <div style="padding: 20px 25px; border-bottom: 1px solid rgba(0,0,0,0.05);">
        <h2 style="margin: 0; font-size: 18px; color: var(--rail-navy); display: flex; align-items: center; gap: 8px;">
          <mat-icon style="color: #ef4444;">gavel</mat-icon> Warranties Expiring Soon (Next 30 Days)
        </h2>
      </div>
      <table mat-table [dataSource]="metrics?.expiringWarranties || []" style="width: 100%; background: transparent;">
        
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef> Asset </th>
          <td mat-cell *matCellDef="let element"> 
            <strong>{{element.name}}</strong>
            <div style="font-size: 12px; color: #64748b;">{{element.serialNumber}}</div>
          </td>
        </ng-container>

        <ng-container matColumnDef="category">
          <th mat-header-cell *matHeaderCellDef> Category </th>
          <td mat-cell *matCellDef="let element"> {{element.category?.name}} </td>
        </ng-container>

        <ng-container matColumnDef="expiry">
          <th mat-header-cell *matHeaderCellDef> Expiry Date </th>
          <td mat-cell *matCellDef="let element"> 
            <span style="color: #ef4444; font-weight: 500;">{{element.warrantyExpiry | date}}</span> 
          </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="['name', 'category', 'expiry']"></tr>
        <tr mat-row *matRowDef="let row; columns: ['name', 'category', 'expiry'];"></tr>
      </table>
      <div *ngIf="!metrics?.expiringWarranties || metrics.expiringWarranties.length === 0" style="padding: 30px; text-align: center; color: #94a3b8;">
        No assets have warranties expiring in the next 30 days.
      </div>
    </mat-card>
  `
})
export class DashboardComponent implements OnInit {
  metrics: any;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getMetrics().subscribe(res => {
      this.metrics = res;
    });
  }

  getPercent(value: number): number {
    if (!this.metrics || !this.metrics.totalAssets || this.metrics.totalAssets === 0) return 0;
    return ((value || 0) / this.metrics.totalAssets) * 100;
  }
}
