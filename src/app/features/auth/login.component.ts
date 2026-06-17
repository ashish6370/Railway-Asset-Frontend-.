import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="login-wrapper">
      <div class="overlay"></div>
      <div class="login-container">
        <div class="glass-card login-card">
          <div class="brand-header">
            <mat-icon class="brand-icon">train</mat-icon>
            <h1>AssetVault</h1>
            <p>Railway Asset & Inventory Management</p>
          </div>
          
          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
            <mat-form-field appearance="outline" class="full-width custom-field">
              <mat-label>Email Address</mat-label>
              <mat-icon matPrefix>email</mat-icon>
              <input matInput formControlName="email" type="email" placeholder="admin@assetvault.com">
              <mat-error *ngIf="loginForm.get('email')?.hasError('required')">Email is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width custom-field">
              <mat-label>Password</mat-label>
              <mat-icon matPrefix>lock</mat-icon>
              <input matInput formControlName="password" type="password" placeholder="••••••••">
              <mat-error *ngIf="loginForm.get('password')?.hasError('required')">Password is required</mat-error>
            </mat-form-field>

            <div class="form-actions">
              <button mat-flat-button class="submit-btn full-width" type="submit" [disabled]="loginForm.invalid">
                ACCESS SYSTEM
              </button>
            </div>
            
            <div class="footer-links">
              <a href="#">Forgot Password?</a>
              <a href="#">Contact Support</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .login-wrapper {
      height: 100vh;
      width: 100vw;
      display: flex;
      justify-content: center;
      align-items: center;
      background-image: url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80');
      background-size: cover;
      background-position: center;
      position: relative;
    }
    .overlay {
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: linear-gradient(135deg, rgba(10, 25, 47, 0.9) 0%, rgba(10, 25, 47, 0.4) 100%);
      z-index: 1;
    }
    .login-container {
      position: relative;
      z-index: 2;
      width: 100%;
      max-width: 450px;
      padding: 20px;
    }
    .login-card {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      padding: 40px;
      border-radius: 16px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.3);
      border: 1px solid rgba(255,255,255,0.2);
    }
    .brand-header {
      text-align: center;
      margin-bottom: 40px;
    }
    .brand-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: var(--rail-orange);
      margin-bottom: 10px;
    }
    .brand-header h1 {
      margin: 0;
      color: var(--rail-navy);
      font-size: 28px;
      font-weight: 700;
      letter-spacing: -0.5px;
    }
    .brand-header p {
      margin: 5px 0 0 0;
      color: var(--rail-gray-text);
      font-size: 14px;
    }
    .login-form {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .submit-btn {
      background-color: var(--rail-orange);
      color: white;
      padding: 10px 0;
      font-size: 16px;
      font-weight: 600;
      letter-spacing: 1px;
      border-radius: 8px;
      transition: all 0.3s ease;
    }
    .submit-btn:hover:not([disabled]) {
      background-color: var(--rail-orange-hover);
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(255, 107, 0, 0.4);
    }
    ::ng-deep .custom-field .mat-mdc-text-field-wrapper {
      background-color: transparent;
    }
    ::ng-deep .custom-field .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__leading,
    ::ng-deep .custom-field .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__notch,
    ::ng-deep .custom-field .mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-notched-outline__trailing {
      border-color: #E0E0E0;
    }
    ::ng-deep .custom-field .mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__leading,
    ::ng-deep .custom-field .mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__notch,
    ::ng-deep .custom-field .mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline__trailing {
      border-color: var(--rail-orange) !important;
      border-width: 2px;
    }
    ::ng-deep .custom-field label.mdc-floating-label {
      color: var(--rail-gray-text);
    }
    ::ng-deep .custom-field.mat-focused label.mdc-floating-label {
      color: var(--rail-orange) !important;
    }
    ::ng-deep .custom-field .mat-icon {
      color: var(--rail-gray-text);
      margin-right: 8px;
    }
    ::ng-deep .custom-field.mat-focused .mat-icon {
      color: var(--rail-orange);
    }
    .footer-links {
      display: flex;
      justify-content: space-between;
      margin-top: 25px;
      font-size: 13px;
    }
    .footer-links a {
      color: var(--rail-gray-text);
      text-decoration: none;
      transition: color 0.3s;
    }
    .footer-links a:hover {
      color: var(--rail-navy);
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['admin@assetvault.com', Validators.required],
      password: ['admin123', Validators.required]
    });
  }
  onSubmit() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value).subscribe(
        () => this.router.navigate(['/dashboard']),
        err => alert('Login Failed')
      );
    }
  }
}

