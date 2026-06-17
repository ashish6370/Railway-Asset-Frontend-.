export interface PublicAsset {
  assetId: string;
  assetCode: string;
  assetName: string;
  department: string | null;
  location: string | null;
  purchaseDate: string | null;
  purchaseLocation: string | null;
  warrantyExpiryDate: string | null;
  status: string;
  qrCodePath: string | null;
}
