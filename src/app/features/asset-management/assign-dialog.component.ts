import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-assign-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatSelectModule, MatInputModule, ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title>Assign Asset</h2>
    <mat-dialog-content>
      <form [formGroup]="form" class="assign-form">
        
        <mat-form-field appearance="outline">
          <mat-label>Select Asset (Available Only)</mat-label>
          <mat-select formControlName="assetId">
            <mat-option *ngFor="let asset of availableAssets" [value]="asset.id">
              {{ asset.name }} ({{ asset.serialNumber }})
            </mat-option>
            <mat-option *ngIf="availableAssets.length === 0" disabled>No available assets found</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Select Employee</mat-label>
          <mat-select formControlName="employeeId">
            <mat-option *ngFor="let emp of employees" [value]="emp.id">
              {{ emp.name }} ({{ emp.employeeId }})
            </mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Assignment Date</mat-label>
          <input matInput type="datetime-local" formControlName="assignedDate">
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Remarks</mat-label>
          <textarea matInput formControlName="remarks" rows="2" placeholder="e.g. For project X"></textarea>
        </mat-form-field>

      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="save()">Assign</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .assign-form {
      display: flex;
      flex-direction: column;
      gap: 10px;
      min-width: 400px;
      margin-top: 10px;
    }
  `]
})
export class AssignDialogComponent implements OnInit {
  form: FormGroup;
  employees: any[] = [];
  availableAssets: any[] = [];

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AssignDialogComponent>, private api: ApiService) {
    // Current date format for datetime-local
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    
    this.form = this.fb.group({
      assetId: ['', Validators.required],
      employeeId: ['', Validators.required],
      assignedDate: [now.toISOString().slice(0, 16), Validators.required],
      remarks: ['']
    });
  }

  ngOnInit() {
    this.api.getEmployees().subscribe(data => this.employees = data);
    
    // Fetch AVAILABLE assets
    this.api.getAssets(0, 1000, '', 'AVAILABLE').subscribe(data => {
      this.availableAssets = data.content || [];
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
