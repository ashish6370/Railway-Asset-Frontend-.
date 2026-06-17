import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ApiService } from '../../core/services/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-asset-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: ``
})
export class AssetFormComponent {
  assetForm: FormGroup;
  selectedImage: any;
  selectedDoc: any;

  constructor(private fb: FormBuilder, private api: ApiService, private router: Router) {
    this.assetForm = this.fb.group({
      name: ['', Validators.required],
      serialNumber: ['', Validators.required]
    });
  }

  onImageSelect(event: any) { this.selectedImage = event.target.files[0]; }
  onDocSelect(event: any) { this.selectedDoc = event.target.files[0]; }

  onSubmit() {
    if(this.assetForm.valid) {
      this.api.createAsset(this.assetForm.value).subscribe(asset => {
        if(this.selectedImage || this.selectedDoc) {
          this.api.uploadAssetFiles(asset.id, this.selectedImage, this.selectedDoc).subscribe(() => {
            this.router.navigate(['/assets']);
          });
        } else {
          this.router.navigate(['/assets']);
        }
      });
    }
  }
}

