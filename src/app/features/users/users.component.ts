import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ApiService } from '../../core/services/api.service';
import { EmployeeDialogComponent } from './employee-dialog.component';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="header">
      <h1>Employees</h1>
      <button mat-flat-button color="primary" (click)="openAddDialog()">
        <mat-icon>add</mat-icon> Add Employee
      </button>
    </div>

    <mat-card class="glass-card">
      <table mat-table [dataSource]="employees" style="width: 100%;">
        <ng-container matColumnDef="employeeId">
          <th mat-header-cell *matHeaderCellDef> Employee ID </th>
          <td mat-cell *matCellDef="let element"> {{element.employeeId}} </td>
        </ng-container>

        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef> Name </th>
          <td mat-cell *matCellDef="let element"> {{element.name}} </td>
        </ng-container>

        <ng-container matColumnDef="email">
          <th mat-header-cell *matHeaderCellDef> Email </th>
          <td mat-cell *matCellDef="let element"> {{element.email}} </td>
        </ng-container>

        <ng-container matColumnDef="designation">
          <th mat-header-cell *matHeaderCellDef> Designation </th>
          <td mat-cell *matCellDef="let element"> {{element.designation}} </td>
        </ng-container>

        <ng-container matColumnDef="phone">
          <th mat-header-cell *matHeaderCellDef> Phone </th>
          <td mat-cell *matCellDef="let element"> {{element.phone}} </td>
        </ng-container>

        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </table>
    </mat-card>
  `,
  styles: [`
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    h1 {
      margin: 0;
      color: var(--rail-navy);
      font-weight: 600;
    }
  `]
})
export class UsersComponent implements OnInit {
  employees: any[] = [];
  displayedColumns = ['employeeId', 'name', 'email', 'designation', 'phone'];

  constructor(private api: ApiService, private dialog: MatDialog) {}

  ngOnInit() {
    this.loadEmployees();
  }

  loadEmployees() {
    this.api.getEmployees().subscribe(data => this.employees = data);
  }

  openAddDialog() {
    const dialogRef = this.dialog.open(EmployeeDialogComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.addEmployee(result).subscribe(() => this.loadEmployees());
      }
    });
  }
}

