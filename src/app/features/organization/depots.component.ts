import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-depots',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, FormsModule, MatSnackBarModule],
  template: `
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Depots</h1>
        <p class="page-subtitle">Manage Depots</p>
      </div>
      <div class="header-actions">
        <button mat-flat-button class="action-btn" (click)="toggleForm()">
          <mat-icon>{{ showForm ? 'close' : 'add' }}</mat-icon> {{ showForm ? 'Cancel' : 'New Depot' }}
        </button>
      </div>
    </div>

    <mat-card class="glass-card" *ngIf="showForm" style="margin-bottom: 20px; padding: 20px;">
      <h3>{{ editingId ? 'Edit' : 'Add' }} Depot</h3>
      <div class="form-grid">
        
        <mat-form-field appearance="outline">
          <mat-label>Name</mat-label>
          <input matInput [(ngModel)]="formData.name" placeholder="Name">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Code</mat-label>
          <input matInput [(ngModel)]="formData.code" placeholder="Code">
        </mat-form-field>
      </div>
      <div style="display: flex; gap: 10px; margin-top: 10px;">
        <button mat-flat-button color="primary" (click)="save()">Save</button>
        <button mat-stroked-button (click)="toggleForm()">Cancel</button>
      </div>
    </mat-card>

    <mat-card class="glass-card table-card">
      <div class="table-container">
        <table mat-table [dataSource]="data" class="custom-table" style="width: 100%;">
          
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef> ID </th>
            <td mat-cell *matCellDef="let element"> {{element.id}} </td>
          </ng-container>
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Name </th>
            <td mat-cell *matCellDef="let element"> {{element.name}} </td>
          </ng-container>
          <ng-container matColumnDef="code">
            <th mat-header-cell *matHeaderCellDef> Code </th>
            <td mat-cell *matCellDef="let element"> {{element.code}} </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button color="primary" (click)="edit(element)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="delete(element.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          <tr class="mat-row" *matNoDataRow>
            <td class="mat-cell" colspan="4" style="text-align: center; padding: 20px;">
              No data available. Add a new depot to get started.
            </td>
          </tr>
        </table>
      </div>
    </mat-card>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 30px; }
    .page-title { margin: 0; color: var(--rail-navy); font-size: 32px; font-weight: 700; }
    .page-subtitle { margin: 5px 0 0; color: var(--text-muted); }
    .action-btn { background: linear-gradient(135deg, var(--rail-orange), #ff6b00); color: white; border-radius: 8px; padding: 0 24px; height: 48px; }
    .form-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 15px; }
  `]
})
export class DepotsComponent implements OnInit {
  data: any[] = [];
  displayedColumns: string[] = ['id', 'name', 'code', 'actions'];
  showForm = false;
  editingId: number | null = null;
  formData: any = {};

  constructor(private api: ApiService, private snackBar: MatSnackBar) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getDepots().subscribe({
      next: (res) => this.data = res,
      error: (err) => this.showError('Failed to load data')
    });
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.formData = {};
      this.editingId = null;
    }
  }

  edit(item: any) {
    this.editingId = item.id;
    this.formData = { ...item };
    this.showForm = true;
  }

  save() {
    if (this.editingId) {
      this.api.updateDepot(this.editingId, this.formData).subscribe({
        next: () => {
          this.showSuccess('Updated successfully');
          this.toggleForm();
          this.loadData();
        },
        error: () => this.showError('Failed to update')
      });
    } else {
      this.api.addDepot(this.formData).subscribe({
        next: () => {
          this.showSuccess('Created successfully');
          this.toggleForm();
          this.loadData();
        },
        error: () => this.showError('Failed to create')
      });
    }
  }

  delete(id: number) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.api.deleteDepot(id).subscribe({
        next: () => {
          this.showSuccess('Deleted successfully');
          this.loadData();
        },
        error: () => this.showError('Failed to delete')
      });
    }
  }

  showSuccess(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: ['success-snackbar'] });
  }

  showError(msg: string) {
    this.snackBar.open(msg, 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
  }
}
