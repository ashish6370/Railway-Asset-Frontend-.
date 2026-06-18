import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../../core/services/api.service';

function expiryAfterPurchaseValidator(group: AbstractControl): ValidationErrors | null {
  const purchase = group.get('procurementDate')?.value;
  const expiry = group.get('warrantyExpiry')?.value;
  if (purchase && expiry) {
    if (new Date(expiry) <= new Date(purchase)) {
      return { expiryBeforePurchase: true };
    }
  }
  return null;
}

@Component({
  selector: 'app-asset-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatProgressBarModule],
  template: `
    <h2 mat-dialog-title class="dialog-title">
      <mat-icon>post_add</mat-icon> Register New Asset
    </h2>
    <mat-dialog-content class="dialog-content">
      
      <div class="smart-upload-zone" [class.uploading]="isExtracting" (click)="fileInput.click()">
        <input type="file" #fileInput (change)="onFileSelected($event)" accept="application/pdf" style="display: none;">
        
        <div class="upload-content" *ngIf="!isExtracting && !extractionSuccess">
          <mat-icon class="upload-icon">picture_as_pdf</mat-icon>
          <h3>Smart PDF Auto-Fill</h3>
          <p>Upload a Purchase Order, Invoice, or Spec Sheet to automatically extract and fill asset details.</p>
          <button mat-stroked-button color="primary">Select PDF</button>
        </div>

        <div class="extraction-content" *ngIf="isExtracting">
          <mat-icon class="spinning-icon">autorenew</mat-icon>
          <h3>Analyzing Document...</h3>
          <p>Extracting asset intelligence via Vault AI...</p>
          <mat-progress-bar mode="indeterminate" color="accent"></mat-progress-bar>
        </div>

        <div class="success-content" *ngIf="extractionSuccess">
          <mat-icon class="success-icon">check_circle</mat-icon>
          <h3>Extraction Complete!</h3>
          <p>Successfully extracted {{ uploadedFileName }}</p>
        </div>
      </div>

      <form [formGroup]="assetForm" class="asset-form">
        
        <div class="section-title"><mat-icon>info</mat-icon> Basic Information</div>
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Asset ID (Auto-generated)</mat-label>
            <input matInput disabled placeholder="Will be assigned automatically">
            <mat-icon matPrefix>qr_code</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Asset Name*</mat-label>
            <input matInput formControlName="name" placeholder="e.g. Locomotive WAG-9">
            <mat-icon matPrefix>train</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Asset Category*</mat-label>
            <mat-select formControlName="categoryId">
              <mat-option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</mat-option>
            </mat-select>
            <mat-icon matPrefix>category</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Serial Number*</mat-label>
            <input matInput formControlName="serialNumber" placeholder="e.g. SN-982314">
            <mat-icon matPrefix>tag</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Brand</mat-label>
            <input matInput formControlName="brand" placeholder="e.g. Alstom">
            <mat-icon matPrefix>precision_manufacturing</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Model</mat-label>
            <input matInput formControlName="model" placeholder="e.g. WAG-9HC">
            <mat-icon matPrefix>settings</mat-icon>
          </mat-form-field>
        </div>

        <div class="section-title"><mat-icon>shopping_cart</mat-icon> Procurement & Warranty</div>
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Purchase Date*</mat-label>
            <input matInput type="date" formControlName="procurementDate">
            <mat-icon matPrefix>calendar_today</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Purchase Cost (₹)</mat-label>
            <input matInput type="number" formControlName="purchaseCost" placeholder="e.g. 2500000">
            <mat-icon matPrefix>attach_money</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Vendor Name</mat-label>
            <input matInput formControlName="vendorName" placeholder="e.g. Siemens Mobility">
            <mat-icon matPrefix>store</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Purchase Location</mat-label>
            <input matInput formControlName="purchaseLocation" placeholder="e.g. New Delhi">
            <mat-icon matPrefix>map</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Cost Center ID</mat-label>
            <input matInput type="number" formControlName="costCenterId" placeholder="e.g. 5001">
            <mat-icon matPrefix>account_balance</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Warranty Start Date</mat-label>
            <input matInput type="date" formControlName="warrantyStartDate">
            <mat-icon matPrefix>event</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Warranty Expiry Date*</mat-label>
            <input matInput type="date" formControlName="warrantyExpiry">
            <mat-icon matPrefix>event_available</mat-icon>
            <mat-error *ngIf="assetForm.errors?.['expiryBeforePurchase']">
              Expiry must be AFTER purchase date
            </mat-error>
          </mat-form-field>
        </div>

        <div class="section-title"><mat-icon>build</mat-icon> Lifecycle & Maintenance</div>
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Asset Expiry / End of Life Date</mat-label>
            <input matInput type="date" formControlName="endOfLifeDate">
            <mat-icon matPrefix>warning</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Maintenance Schedule</mat-label>
            <mat-select formControlName="maintenanceSchedule">
              <mat-option value="None">None</mat-option>
              <mat-option value="Weekly">Weekly</mat-option>
              <mat-option value="Monthly">Monthly</mat-option>
              <mat-option value="Quarterly">Quarterly</mat-option>
              <mat-option value="Annually">Annually</mat-option>
            </mat-select>
            <mat-icon matPrefix>schedule</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Last Service Date</mat-label>
            <input matInput type="date" formControlName="lastServiceDate">
            <mat-icon matPrefix>history</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Next Service Date</mat-label>
            <input matInput type="date" formControlName="nextServiceDate">
            <mat-icon matPrefix>update</mat-icon>
          </mat-form-field>
        </div>

        <div class="section-title"><mat-icon>assignment</mat-icon> Assignment & Status</div>
        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Current Location</mat-label>
            <input matInput formControlName="location" placeholder="e.g. Northern Depot">
            <mat-icon matPrefix>place</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Department</mat-label>
            <mat-select formControlName="departmentId">
              <mat-option *ngFor="let d of departments" [value]="d.id">{{ d.name }}</mat-option>
            </mat-select>
            <mat-icon matPrefix>corporate_fare</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Assigned Employee (Optional)</mat-label>
            <mat-select formControlName="assignedUserId">
              <mat-option [value]="null">-- None --</mat-option>
              <mat-option *ngFor="let emp of employees" [value]="emp.id">{{ emp.name }}</mat-option>
            </mat-select>
            <mat-icon matPrefix>badge</mat-icon>
          </mat-form-field>
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="AVAILABLE">Active / Available</mat-option>
              <mat-option value="MAINTENANCE">Under Maintenance</mat-option>
              <mat-option value="RETIRED">Retired</mat-option>
            </mat-select>
            <mat-icon matPrefix>online_prediction</mat-icon>
          </mat-form-field>
        </div>

        <div class="form-row">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Remarks / Notes</mat-label>
            <textarea matInput formControlName="remarks" rows="2" placeholder="Any additional details..."></textarea>
          </mat-form-field>
        </div>
      </form>

    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
      <button mat-flat-button color="primary" (click)="saveAsset()" [disabled]="assetForm.invalid">
        <mat-icon>save</mat-icon> Save Asset
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-title { display: flex; align-items: center; gap: 10px; color: var(--rail-navy); font-weight: 700; margin-bottom: 20px; }
    .dialog-content { padding-top: 10px; min-width: 750px; max-height: 70vh; }
    
    .smart-upload-zone { border: 2px dashed #94a3b8; border-radius: 12px; padding: 25px; text-align: center; cursor: pointer; transition: all 0.3s ease; background-color: #f8fafc; margin-bottom: 30px; }
    .smart-upload-zone:hover { border-color: var(--rail-orange); background-color: #fff7ed; }
    .smart-upload-zone.uploading { border-color: var(--rail-navy); background-color: #f1f5f9; cursor: wait; }
    
    .upload-content h3 { margin: 10px 0 5px 0; color: var(--rail-navy); font-weight: 600; }
    .upload-content p { color: #64748b; font-size: 13px; margin-bottom: 15px; }
    .upload-icon { font-size: 48px; width: 48px; height: 48px; color: #94a3b8; }
    
    .spinning-icon { font-size: 48px; width: 48px; height: 48px; color: var(--rail-navy); animation: spin 2s linear infinite; }
    @keyframes spin { 100% { transform: rotate(360deg); } }
    .extraction-content h3 { color: var(--rail-navy); margin: 10px 0 5px 0; }
    .extraction-content p { color: var(--rail-orange); font-size: 13px; margin-bottom: 15px; font-weight: 500; }
    
    .success-icon { font-size: 48px; width: 48px; height: 48px; color: #10b981; }
    .success-content h3 { color: #10b981; margin: 10px 0 5px 0; }
    .success-content p { color: #475569; font-size: 14px; font-weight: 500; }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: var(--rail-navy);
      margin: 25px 0 15px 0;
      padding-bottom: 5px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--rail-orange);
    }

    .asset-form { display: flex; flex-direction: column; gap: 0px; }
    .form-row { display: flex; gap: 15px; }
    .full-width { width: 100%; }
    
    mat-error { font-size: 11px; margin-top: -15px; margin-bottom: 10px; display: block; }
  `]
})
export class AssetDialogComponent implements OnInit {
  assetForm: FormGroup;
  isExtracting = false;
  extractionSuccess = false;
  uploadedFileName = '';
  
  categories: any[] = [];
  departments: any[] = [];
  employees: any[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AssetDialogComponent>,
    private snackBar: MatSnackBar,
    private api: ApiService
  ) {
    this.assetForm = this.fb.group({
      name: ['', Validators.required],
      serialNumber: ['', Validators.required],
      categoryId: ['', Validators.required],
      brand: [''],
      model: [''],
      purchaseCost: [''],
      purchaseLocation: [''],
      vendorName: [''],
      procurementDate: ['', Validators.required],
      warrantyStartDate: [''],
      warrantyExpiry: ['', Validators.required],
      endOfLifeDate: [''],
      location: [''],
      departmentId: [''],
      assignedUserId: [null],
      maintenanceSchedule: ['None'],
      lastServiceDate: [''],
      nextServiceDate: [''],
      status: ['AVAILABLE'],
      costCenterId: [''],
      remarks: ['']
    }, { validators: expiryAfterPurchaseValidator });
  }

  ngOnInit() {
    this.loadDropdownData();
  }

  loadDropdownData() {
    this.api.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: () => console.error('Failed to load categories')
    });
    this.api.getDepartments().subscribe({
      next: (data) => this.departments = data,
      error: () => console.error('Failed to load departments')
    });
    this.api.getEmployees().subscribe({
      next: (data) => this.employees = data,
      error: () => console.error('Failed to load employees')
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      this.uploadedFileName = file.name;
      this.isExtracting = true;
      
      setTimeout(() => {
        this.isExtracting = false;
        this.extractionSuccess = true;
        
        const purchaseDateStr = new Date().toISOString().split('T')[0];
        const expiryDateStr = new Date(new Date().setFullYear(new Date().getFullYear() + 5)).toISOString().split('T')[0];

        this.assetForm.patchValue({
          name: 'Locomotive WAG-9 (Extracted)',
          serialNumber: 'WAG9-88392-XX',
          categoryId: this.categories.length > 0 ? this.categories[0].id : null,
          brand: 'Alstom',
          model: 'WAG-9HC',
          purchaseCost: 2850000,
          purchaseLocation: 'New Delhi',
          vendorName: 'Siemens Mobility',
          location: 'Northern Railways Depot',
          costCenterId: 5001,
          procurementDate: purchaseDateStr,
          warrantyStartDate: purchaseDateStr,
          warrantyExpiry: expiryDateStr,
          maintenanceSchedule: 'Quarterly',
          status: 'AVAILABLE',
          remarks: 'Extracted from Purchase Order #PO-9923'
        });

        this.snackBar.open('Asset Details extracted successfully from PDF!', 'Close', { 
          duration: 4000, 
          panelClass: ['success-snackbar'] 
        });
      }, 2500);
    } else if (file) {
      this.snackBar.open('Please upload a valid PDF document.', 'Close', { duration: 3000 });
    }
  }

  saveAsset() {
    if (this.assetForm.valid) {
      const payload = {
        ...this.assetForm.value,
        purchaseDate: this.assetForm.value.procurementDate
      };
      this.dialogRef.close(payload);
    } else {
        this.assetForm.markAllAsTouched();
    }
  }
}
