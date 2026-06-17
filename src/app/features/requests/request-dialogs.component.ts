import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-procurement-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title>Request New Asset</h2>
    <mat-dialog-content>
      <form [formGroup]="form" style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
        <mat-form-field appearance="outline">
          <mat-label>Item Name</mat-label>
          <input matInput formControlName="itemName" placeholder="e.g. Dell XPS 15">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Estimated Cost (₹)</mat-label>
          <input matInput type="number" formControlName="estimatedCost" placeholder="e.g. 2000">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Justification</mat-label>
          <textarea matInput formControlName="justification" rows="3" placeholder="Explain why this is needed..."></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="submit()">Submit</button>
    </mat-dialog-actions>
  `
})
export class ProcurementDialogComponent {
  form: FormGroup;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<ProcurementDialogComponent>) {
    this.form = this.fb.group({
      itemName: ['', Validators.required],
      estimatedCost: ['', Validators.required],
      justification: ['', Validators.required]
    });
  }
  submit() { if(this.form.valid) this.dialogRef.close(this.form.value); }
}

@Component({
  selector: 'app-maintenance-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, ReactiveFormsModule],
  template: `
    <h2 mat-dialog-title>Request Maintenance</h2>
    <mat-dialog-content>
      <form [formGroup]="form" style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">
        <mat-form-field appearance="outline">
          <mat-label>Select Assigned Asset</mat-label>
          <mat-select formControlName="assetId">
            <mat-option *ngFor="let a of myAssets" [value]="a.id">{{a.name}} ({{a.serialNumber}})</mat-option>
            <mat-option *ngIf="myAssets.length === 0" disabled>No assets assigned to you.</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Maintenance Type</mat-label>
          <mat-select formControlName="maintenanceType">
            <mat-option value="CORRECTIVE">Corrective (Broken)</mat-option>
            <mat-option value="PREVENTIVE">Preventive (Routine Check)</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Issue Description</mat-label>
          <textarea matInput formControlName="description" rows="3" placeholder="Describe the problem..."></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="submit()">Submit</button>
    </mat-dialog-actions>
  `
})
export class MaintenanceDialogComponent implements OnInit {
  form: FormGroup;
  myAssets: any[] = [];
  
  constructor(
    private fb: FormBuilder, 
    private dialogRef: MatDialogRef<MaintenanceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private api: ApiService
  ) {
    this.form = this.fb.group({
      assetId: ['', Validators.required],
      maintenanceType: ['CORRECTIVE', Validators.required],
      description: ['', Validators.required]
    });
  }
  
  ngOnInit() {
    // Ideally we fetch assets currently assigned to this user.
    // For now we will fetch all assets and filter by assignedUserId.
    this.api.getAssets(0, 1000, '', 'ASSIGNED').subscribe(res => {
      this.myAssets = (res.content || []).filter((a: any) => a.assignedUser && a.assignedUser.id === this.data.userId);
    });
  }
  
  submit() { if(this.form.valid) this.dialogRef.close(this.form.value); }
}
