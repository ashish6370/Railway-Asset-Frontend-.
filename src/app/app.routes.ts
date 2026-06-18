import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent) },
  { path: 'public/assets/:assetId', loadComponent: () => import('./features/public-asset/public-asset.component').then(m => m.PublicAssetComponent) },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    children: [
      { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) },
      { path: 'zones', loadComponent: () => import('./features/organization/zones.component').then(m => m.ZonesComponent) },
      { path: 'divisions', loadComponent: () => import('./features/organization/divisions.component').then(m => m.DivisionsComponent) },
      { path: 'depots', loadComponent: () => import('./features/organization/depots.component').then(m => m.DepotsComponent) },
      { path: 'departments', loadComponent: () => import('./features/organization/departments.component').then(m => m.DepartmentsComponent) },
      { path: 'users', loadComponent: () => import('./features/users/users.component').then(m => m.UsersComponent) },
      { path: 'employees', loadComponent: () => import('./features/users/employees.component').then(m => m.EmployeesComponent) },
      { path: 'categories', loadComponent: () => import('./features/asset-management/categories.component').then(m => m.CategoriesComponent) },
      { path: 'my-requests', loadComponent: () => import('./features/requests/my-requests.component').then(m => m.MyRequestsComponent) },
      { path: 'assets', loadComponent: () => import('./features/asset-management/assets.component').then(m => m.AssetsComponent) },
      { path: 'assignments', loadComponent: () => import('./features/asset-management/assignments.component').then(m => m.AssignmentsComponent) },
      { path: 'assets/:id', loadComponent: () => import('./features/asset-management/asset-detail.component').then(m => m.AssetDetailComponent) },
      { path: 'approvals', loadComponent: () => import('./features/approvals/approvals.component').then(m => m.ApprovalsComponent) },
      { path: 'audits', loadComponent: () => import('./features/audits/audits.component').then(m => m.AuditsComponent) },
      { path: 'scanner', loadComponent: () => import('./features/scanner/scanner.component').then(m => m.ScannerComponent) },
      { path: 'analytics', loadComponent: () => import('./features/analytics/analytics.component').then(m => m.AnalyticsComponent) },
      { path: 'reports', loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent) },
      { path: 'settings', loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent) }
    ]
  }
];



