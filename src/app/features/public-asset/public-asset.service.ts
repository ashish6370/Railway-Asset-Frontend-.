import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PublicAsset } from './public-asset.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PublicAssetService {
  private apiUrl = `${environment.hostUrl}/public/assets`;

  constructor(private http: HttpClient) {}

  getAssetDetails(assetId: string): Observable<PublicAsset> {
    return this.http.get<PublicAsset>(`${this.apiUrl}/${assetId}`);
  }
}
