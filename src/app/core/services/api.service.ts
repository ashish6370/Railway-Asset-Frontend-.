import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getZones(): Observable<any> { return this.http.get(`${this.baseUrl}/zones`); }
  getCategories(): Observable<any> { return this.http.get(`${this.baseUrl}/categories`); }
  addCategory(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/categories`, data); }
  
  getAssets(page: number, size: number, search?: string, status?: string): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if(search) params = params.set('name', search);
    if(status) params = params.set('status', status);
    return this.http.get(`${this.baseUrl}/assets`, { params });
  }

  getAssetById(id: number): Observable<any> { return this.http.get(`${this.baseUrl}/assets/` + id); }
  
  createAsset(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/assets`, data); }
  
  uploadAssetFiles(id: number, image: File, doc: File): Observable<any> {
    const formData = new FormData();
    if(image) formData.append('image', image);
    if(doc) formData.append('document', doc);
    return this.http.post(`${this.baseUrl}/assets/` + id + `/upload`, formData);
  }

  regenerateQr(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/assets/${id}/regenerate-qr`, {});
  }

  exportExcel() {
    window.open(`${this.baseUrl}/assets/export/excel`, '_blank');
  }

  // LIFECYCLES


  getTransfers(assetId: number): Observable<any> { return this.http.get(`${this.baseUrl}/lifecycles/transfers/asset/` + assetId); }
  getPendingTransfers(): Observable<any> { return this.http.get(`${this.baseUrl}/lifecycles/transfers/pending`); }
  requestTransfer(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/lifecycles/transfers`, data); }
  approveTransfer(id: number, data: any): Observable<any> { return this.http.post(`${this.baseUrl}/lifecycles/transfers/` + id + `/approve`, data); }

  getMaintenance(assetId: number): Observable<any> { return this.http.get(`${this.baseUrl}/lifecycles/maintenance/asset/` + assetId); }
  scheduleMaintenance(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/lifecycles/maintenance`, data); }
  completeMaintenance(id: number, data: any): Observable<any> { return this.http.post(`${this.baseUrl}/lifecycles/maintenance/` + id + `/complete`, data); }

  getDisposals(assetId: number): Observable<any> { return this.http.get(`${this.baseUrl}/lifecycles/disposals/asset/` + assetId); }
  getPendingDisposals(): Observable<any> { return this.http.get(`${this.baseUrl}/lifecycles/disposals/pending`); }
  requestDisposal(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/lifecycles/disposals`, data); }
  approveDisposal(id: number, data: any): Observable<any> { return this.http.post(`${this.baseUrl}/lifecycles/disposals/` + id + `/approve`, data); }

  // --- Employees ---
  getEmployees(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/employees`); }
  addEmployee(employee: any): Observable<any> { return this.http.post(`${this.baseUrl}/employees`, employee); }
  updateEmployee(id: number, employee: any): Observable<any> { return this.http.put(`${this.baseUrl}/employees/` + id, employee); }
  deleteEmployee(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/employees/` + id); }

  // --- Divisions ---
  getDivisions(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/divisions`); }
  addDivision(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/divisions`, data); }
  updateDivision(id: number, data: any): Observable<any> { return this.http.put(`${this.baseUrl}/divisions/` + id, data); }
  deleteDivision(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/divisions/` + id); }

  // --- Depots ---
  getDepots(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/depots`); }
  addDepot(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/depots`, data); }
  updateDepot(id: number, data: any): Observable<any> { return this.http.put(`${this.baseUrl}/depots/` + id, data); }
  deleteDepot(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/depots/` + id); }

  // --- Departments ---
  getDepartments(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/departments`); }
  addDepartment(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/departments`, data); }
  updateDepartment(id: number, data: any): Observable<any> { return this.http.put(`${this.baseUrl}/departments/` + id, data); }
  deleteDepartment(id: number): Observable<any> { return this.http.delete(`${this.baseUrl}/departments/` + id); }

  // --- Assignments ---
  getAssignments(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/assignments`); }
  getAssetAssignments(assetId: number): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/assignments/asset/` + assetId); }
  assignAsset(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/assignments/assign`, data); }
  returnAsset(id: number): Observable<any> { return this.http.post(`${this.baseUrl}/assignments/${id}/return`, {}); }

  // --- Requests (Maintenance & Procurement) ---
  getMyRequests(userId: number): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/requests/my-requests?userId=` + userId); }
  getPendingRequests(): Observable<any[]> { return this.http.get<any[]>(`${this.baseUrl}/requests/pending`); }
  submitMaintenanceRequest(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/requests/maintenance`, data); }
  submitProcurementRequest(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/requests/procurement`, data); }
  processMaintenanceRequest(id: number, approve: boolean): Observable<any> { return this.http.post(`${this.baseUrl}/requests/maintenance/${id}/process?approve=${approve}`, {}); }
  processProcurementRequest(id: number, approve: boolean): Observable<any> { return this.http.post(`${this.baseUrl}/requests/procurement/${id}/process?approve=${approve}`, {}); }

  // PHASE 4 & 5
  getAudits(): Observable<any> { return this.http.get(`${this.baseUrl}/audits`); }
  createAudit(data: any): Observable<any> { return this.http.post(`${this.baseUrl}/audits`, data); }
  verifyAudit(sessionId: number, assetId: number, status: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/audits/${sessionId}/verify?assetId=${assetId}&status=${status}`, {});
  }
  getMetrics(): Observable<any> { return this.http.get(`${this.baseUrl}/dashboard/metrics`); }
}