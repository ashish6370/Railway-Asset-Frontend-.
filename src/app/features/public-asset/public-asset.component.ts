import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { PublicAssetService } from './public-asset.service';
import { PublicAsset } from './public-asset.model';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-public-asset',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './public-asset.component.html',
  styleUrls: ['./public-asset.component.scss']
})
export class PublicAssetComponent implements OnInit {
  assetId: string | null = null;
  asset: PublicAsset | null = null;
  loading: boolean = true;
  error: boolean = false;
  backendUrl = environment.hostUrl + '/';

  constructor(
    private route: ActivatedRoute,
    private publicAssetService: PublicAssetService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.assetId = params.get('assetId');
      if (this.assetId) {
        this.fetchAssetDetails(this.assetId);
      } else {
        this.error = true;
        this.loading = false;
      }
    });
  }

  fetchAssetDetails(id: string): void {
    this.loading = true;
    this.error = false;
    this.publicAssetService.getAssetDetails(id).subscribe({
      next: (data) => {
        this.asset = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to fetch asset details:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status?.toUpperCase()) {
      case 'AVAILABLE': return 'primary';
      case 'IN_USE': return 'accent';
      case 'MAINTENANCE': return 'warn';
      case 'RETIRED': return 'warn';
      default: return 'primary';
    }
  }

  getQrCodeUrl(): string {
    if (!this.asset?.qrCodePath) return '';
    if (this.asset.qrCodePath.startsWith('data:image')) return this.asset.qrCodePath;
    return `${environment.hostUrl}/${this.asset.qrCodePath}`;
  }
}
