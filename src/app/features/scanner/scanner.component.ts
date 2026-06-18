import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';
import { ApiService } from '../../core/services/api.service';
import { PublicAssetService } from '../public-asset/public-asset.service';

@Component({
  selector: 'app-scanner',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, ZXingScannerModule],
  template: `
    <div class="dashboard-header" style="margin-bottom: 25px;">
      <div>
        <h1 class="page-title" style="margin: 0; color: var(--rail-navy); font-size: 32px; font-weight: 700;">QR Scanner</h1>
        <p class="page-subtitle" style="margin: 5px 0 0; color: var(--text-muted);">Scan an Asset ID QR Code to instantly view its details</p>
      </div>
    </div>

    <div style="display: flex; justify-content: center; align-items: center;">
      <mat-card class="glass-card" style="padding: 20px; border-radius: 16px; width: 100%; max-width: 500px; text-align: center;">
        
        <div *ngIf="hasPermission === false" style="padding: 20px; color: #ef4444;">
          <mat-icon style="font-size: 48px; width: 48px; height: 48px;">gpp_bad</mat-icon>
          <h3>Permission Denied</h3>
          <p>Please grant camera permissions in your browser settings to use the scanner.</p>
        </div>

        <div *ngIf="hasDevices === false" style="padding: 20px; color: #ef4444;">
          <mat-icon style="font-size: 48px; width: 48px; height: 48px;">no_photography</mat-icon>
          <h3>No Camera Found</h3>
          <p>Please ensure you have a webcam connected.</p>
        </div>
        
        <div *ngIf="!scannerEnabled && hasPermission !== false && hasDevices !== false" style="padding: 20px;">
           <button mat-flat-button color="primary" (click)="startScanner()" style="padding: 10px 30px; font-size: 16px;">
             <mat-icon>camera_alt</mat-icon> Start Camera
           </button>
        </div>

        <div *ngIf="scannerEnabled && hasDevices !== false && hasPermission !== false">
          <div style="position: relative; border-radius: 12px; overflow: hidden; background: #000; min-height: 300px; display: flex; justify-content: center; align-items: center;">
            <zxing-scanner 
              [enable]="scannerEnabled" 
              [device]="currentDevice"
              (camerasFound)="onCamerasFound($event)"
              (camerasNotFound)="onCamerasNotFound()"
              (scanSuccess)="onScanSuccess($event)"
              (permissionResponse)="onHasPermission($event)"
              [formats]="allowedFormats">
            </zxing-scanner>
            
            <div *ngIf="!hasDevices && hasPermission" style="position: absolute; color: white;">
              Initializing camera...
            </div>
            
            <!-- Scanning Overlay Grid -->
            <div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border: 2px solid rgba(37, 99, 235, 0.5); pointer-events: none;">
               <div style="position: absolute; top: 50%; left: 10%; right: 10%; height: 2px; background: rgba(239, 68, 68, 0.8); box-shadow: 0 0 10px red;"></div>
            </div>
          </div>
          
          <div *ngIf="availableDevices && availableDevices.length > 1" style="margin-top: 15px;">
             <select (change)="onDeviceSelect($event)" style="padding: 8px; border-radius: 4px; border: 1px solid #ccc; width: 100%;">
                <option *ngFor="let device of availableDevices" [value]="device.deviceId">
                  {{ device.label || 'Camera ' + device.deviceId.substring(0, 5) }}
                </option>
             </select>
          </div>

          <p style="margin-top: 15px; color: #64748b;">
            <mat-icon style="vertical-align: middle; font-size: 18px; width: 18px; height: 18px;">info</mat-icon> Point camera at the asset QR code.
          </p>
        </div>
        

      </mat-card>
    </div>
  `
})
export class ScannerComponent implements OnInit {
  hasDevices: boolean | null = null;
  hasPermission: boolean | null = null;
  scannerEnabled: boolean = false;
  availableDevices: MediaDeviceInfo[] = [];
  currentDevice: MediaDeviceInfo | undefined;
  allowedFormats = [BarcodeFormat.QR_CODE];

  constructor(private router: Router, private api: ApiService, private publicAssetService: PublicAssetService) {}

  ngOnInit() {}
  
  startScanner() {
    this.scannerEnabled = true;
  }

  onHasPermission(has: boolean) {
    this.hasPermission = has;
  }
  
  onCamerasNotFound() {
    this.hasDevices = false;
  }

  onCamerasFound(devices: MediaDeviceInfo[]): void {
    this.hasDevices = devices && devices.length > 0;
    this.availableDevices = devices;
    
    if (this.hasDevices) {
      const backCamera = devices.find(d => /back|rear|environment/i.test(d.label));
      this.currentDevice = backCamera || devices[0];
    }
  }

  onDeviceSelect(event: any): void {
    const deviceId = event.target.value;
    this.currentDevice = this.availableDevices.find(x => x.deviceId === deviceId);
  }

  onScanSuccess(result: string): void {
    if (result && result.trim().length > 0) {
      console.log('Scanned QR:', result);
      
      let assetIdStr = result.trim();
      
      // If it's a URL (e.g. http://localhost:4200/public/assets/AST-1234), extract the last part
      if (assetIdStr.includes('/public/assets/')) {
        const parts = assetIdStr.split('/public/assets/');
        assetIdStr = parts[parts.length - 1];
      }

      this.scannerEnabled = false; // Stop camera before routing or API call

      // Try to parse it as a direct numeric ID first
      const numericId = parseInt(assetIdStr, 10);
      if (!isNaN(numericId) && assetIdStr === numericId.toString()) {
        this.router.navigate(['/assets', numericId]);
      } else {
        // It's likely an alphanumeric assetCode like AST-XXXXX. 
        // We must fetch the numeric ID from the backend using the public endpoint.
        this.publicAssetService.getAssetDetails(assetIdStr).subscribe({
          next: (asset: any) => {
            if (asset && asset.id) {
               this.router.navigate(['/assets', asset.id]);
            } else {
               alert('Asset not found for code: ' + assetIdStr);
            }
          },
          error: () => {
            alert('Invalid QR Code Scanned or Asset Not Found: ' + result);
          }
        });
      }
    }
  }
}
