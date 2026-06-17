import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule, MatListModule, MatMenuModule, MatDividerModule],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav mode="side" opened class="sidebar">
        <div class="sidebar-header">
          <mat-icon class="brand-logo">train</mat-icon>
          <span class="brand-text">AssetVault</span>
        </div>
        
        <mat-nav-list class="nav-list">
          <div class="nav-section-title">MAIN</div>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active-link"><mat-icon>dashboard</mat-icon> Dashboard</a>
          
          <div class="nav-section-title">ORGANIZATION</div>
          <a mat-list-item routerLink="/divisions" routerLinkActive="active-link"><mat-icon>domain</mat-icon> Divisions</a>
          <a mat-list-item routerLink="/departments" routerLinkActive="active-link"><mat-icon>category</mat-icon> Departments</a>
          <a mat-list-item routerLink="/employees" routerLinkActive="active-link"><mat-icon>badge</mat-icon> Employees</a>
          
          <div class="nav-section-title">OPERATIONS</div>
          <a mat-list-item routerLink="/categories" routerLinkActive="active-link"><mat-icon>category</mat-icon> Categories</a>
          <a mat-list-item routerLink="/assets" routerLinkActive="active-link"><mat-icon>inventory_2</mat-icon> Assets</a>
          <a mat-list-item routerLink="/scanner" routerLinkActive="active-link"><mat-icon>qr_code_scanner</mat-icon> QR Scanner</a>
          <a mat-list-item routerLink="/assignments" routerLinkActive="active-link"><mat-icon>assignment_ind</mat-icon> Assignments</a>
          <a mat-list-item routerLink="/my-requests" routerLinkActive="active-link"><mat-icon>receipt_long</mat-icon> My Requests</a>
          <a mat-list-item routerLink="/approvals" routerLinkActive="active-link"><mat-icon>fact_check</mat-icon> Approvals Hub</a>
          
          <div class="nav-section-title">COMPLIANCE</div>
          <a mat-list-item routerLink="/audits" routerLinkActive="active-link"><mat-icon>security</mat-icon> Audits</a>
          <a mat-list-item routerLink="/analytics" routerLinkActive="active-link"><mat-icon>analytics</mat-icon> Analytics</a>
          <a mat-list-item routerLink="/reports" routerLinkActive="active-link"><mat-icon>summarize</mat-icon> Reports / Export</a>
          <a mat-list-item routerLink="/settings" routerLinkActive="active-link"><mat-icon>settings</mat-icon> Settings</a>
        </mat-nav-list>
      </mat-sidenav>
      
      <mat-sidenav-content class="main-content">
        <mat-toolbar class="topbar">
          <button mat-icon-button (click)="sidenav.toggle()" class="menu-btn">
            <mat-icon>menu</mat-icon>
          </button>
          
          <div class="breadcrumb">
            <span class="muted">AssetVault /</span> <strong>Workspace</strong>
          </div>

          <span class="spacer"></span>
          
          <button mat-flat-button class="scan-btn" routerLink="/scanner">
            <mat-icon>qr_code_scanner</mat-icon> SCAN ASSET
          </button>

          <button mat-icon-button class="notification-btn">
            <mat-icon>notifications</mat-icon>
            <span class="badge">3</span>
          </button>
          
          <div class="user-profile" [matMenuTriggerFor]="userMenu">
            <div class="avatar">AD</div>
            <div class="user-info">
              <span class="user-name">System Admin</span>
              <span class="user-role">Super Admin</span>
            </div>
            <mat-icon>expand_more</mat-icon>
          </div>
          
          <mat-menu #userMenu="matMenu" class="custom-menu">
            <button mat-menu-item><mat-icon>person</mat-icon> My Profile</button>
            <button mat-menu-item><mat-icon>settings</mat-icon> Settings</button>
            <mat-divider></mat-divider>
            <button mat-menu-item (click)="logout()" class="logout-text"><mat-icon color="warn">logout</mat-icon> Logout</button>
          </mat-menu>
        </mat-toolbar>
        
        <div class="page-wrapper">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
      background-color: var(--rail-light-bg);
    }
    
    .sidebar {
      width: 260px;
      background-color: var(--rail-navy);
      color: var(--rail-gray-text);
      border-right: none;
      box-shadow: 4px 0 10px rgba(0,0,0,0.1);
    }
    
    .sidebar-header {
      height: 64px;
      display: flex;
      align-items: center;
      padding: 0 24px;
      background-color: var(--rail-navy-light);
      color: white;
      border-bottom: 1px solid rgba(255,255,255,0.05);
    }
    
    .brand-logo {
      color: var(--rail-orange);
      margin-right: 12px;
      font-size: 28px;
      width: 28px;
      height: 28px;
    }
    
    .brand-text {
      font-size: 20px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    
    .nav-list {
      padding-top: 10px;
    }
    
    .nav-section-title {
      font-size: 11px;
      font-weight: 700;
      color: rgba(255,255,255,0.4);
      letter-spacing: 1.2px;
      padding: 20px 24px 8px;
    }
    
    ::ng-deep .nav-list .mdc-list-item .mdc-list-item__primary-text {
      color: #E2E8F0 !important;
      font-weight: 500;
    }
    
    ::ng-deep .nav-list .mdc-list-item:hover .mdc-list-item__primary-text {
      color: white !important;
    }

    ::ng-deep .nav-list .active-link .mdc-list-item__primary-text {
      color: var(--rail-orange) !important;
      font-weight: 600;
    }

    ::ng-deep .nav-list .mdc-list-item {
      border-radius: 0 24px 24px 0;
      margin-right: 16px;
      transition: all 0.2s ease;
    }
    
    ::ng-deep .nav-list .mdc-list-item .mat-icon {
      color: #A0AEC0;
      margin-right: 16px;
      transition: all 0.2s ease;
    }
    
    ::ng-deep .nav-list .active-link {
      background-color: rgba(255, 107, 0, 0.1) !important;
      color: var(--rail-orange) !important;
      border-left: 4px solid var(--rail-orange);
    }
    
    ::ng-deep .nav-list .active-link .mat-icon {
      color: var(--rail-orange) !important;
    }
    
    .topbar {
      background-color: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      z-index: 10;
      position: relative;
    }
    
    .menu-btn {
      color: var(--rail-navy);
      margin-right: 16px;
    }
    
    .breadcrumb {
      font-size: 14px;
      color: var(--rail-navy);
    }
    .breadcrumb .muted {
      color: var(--rail-gray-text);
    }
    
    .spacer {
      flex: 1 1 auto;
    }
    
    .notification-btn {
      color: var(--rail-gray-text);
      position: relative;
      margin-right: 16px;
    }
    
    .badge {
      position: absolute;
      top: 6px;
      right: 6px;
      background-color: #ef4444;
      color: white;
      font-size: 10px;
      font-weight: bold;
      width: 16px;
      height: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      border: 2px solid white;
    }
    
    .user-profile {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 24px;
      transition: background 0.2s;
    }
    
    .user-profile:hover {
      background: var(--rail-light-bg);
    }
    
    .avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: var(--rail-navy-light);
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 600;
      font-size: 14px;
      margin-right: 12px;
    }
    
    .user-info {
      display: flex;
      flex-direction: column;
      margin-right: 8px;
    }
    
    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--rail-navy);
      line-height: 1.2;
    }
    
    .user-role {
      font-size: 11px;
      color: var(--rail-gray-text);
    }
    
    .user-profile mat-icon {
      color: var(--rail-gray-text);
    }
    
    .logout-text {
      color: #ef4444;
    }
    
    .page-wrapper {
      padding: 24px;
      height: calc(100vh - 64px);
      overflow-y: auto;
      box-sizing: border-box;
    }
  `]
})
export class LayoutComponent {
  constructor(private auth: AuthService, private router: Router) {}
  
  logout() { 
    this.auth.logout(); 
    this.router.navigate(['/login']);
  }
}



