import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../core/services/api.service';
import { CategoryDialogComponent } from './category-dialog.component';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatCardModule, MatDialogModule],
  template: `
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">Product Categories</h1>
        <p class="page-subtitle">Manage categories for your products and assets</p>
      </div>
      <div class="header-actions">
        <button mat-flat-button color="primary" class="action-btn" (click)="openAddDialog()">
          <mat-icon>add</mat-icon> Add Category
        </button>
      </div>
    </div>

    <mat-card class="glass-card">
      <table mat-table [dataSource]="categories" class="custom-table" style="width: 100%;">
        <ng-container matColumnDef="id">
          <th mat-header-cell *matHeaderCellDef> ID </th>
          <td mat-cell *matCellDef="let element"> {{element.id}} </td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef> Category Name </th>
          <td mat-cell *matCellDef="let element"> <strong>{{element.name}}</strong> </td>
        </ng-container>

        <ng-container matColumnDef="description">
          <th mat-header-cell *matHeaderCellDef> Description </th>
          <td mat-cell *matCellDef="let element"> {{element.description || 'No description provided'}} </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="['id', 'name', 'description']"></tr>
        <tr mat-row *matRowDef="let row; columns: ['id', 'name', 'description'];"></tr>
        
        <tr class="mat-row" *matNoDataRow>
          <td class="mat-cell text-center" colspan="3" style="padding: 24px; color: #64748b;">
            No categories found. Click "Add Category" to create one.
          </td>
        </tr>
      </table>
    </mat-card>
  `,
  styles: [`
    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 30px;
    }
    .page-title { margin: 0; color: var(--rail-navy); font-size: 32px; font-weight: 700; }
    .page-subtitle { margin: 5px 0 0 0; color: var(--rail-gray-text); font-size: 15px; }
    .action-btn { background-color: var(--rail-orange) !important; color: white !important; padding: 0 24px; border-radius: 8px; font-weight: 600; }
    .glass-card { background: white; border: 1px solid #e2e8f0; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border-radius: 12px; overflow: hidden; padding: 24px; }
    .text-center { text-align: center; }
  `]
})
export class CategoriesComponent implements OnInit {
  categories: any[] = [];
  
  constructor(private api: ApiService, private dialog: MatDialog) {}
  
  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.api.getCategories().subscribe(data => this.categories = data);
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.addCategory(result).subscribe({
          next: () => {
            this.loadData();
          },
          error: (err) => {
            console.error('Error adding category:', err);
            alert(this.getCategoryErrorMessage(err));
          }
        });
      }
    });
  }

  private getCategoryErrorMessage(err: any): string {
    if (err?.status === 0) {
      return 'Cannot connect to the backend. Please check that the Railway backend URL is correct and the service is running.';
    }

    const backendMessage = err?.error?.error || err?.error?.message || err?.message;
    if (backendMessage) {
      return backendMessage;
    }

    return 'Failed to add category. Please try again.';
  }
}

