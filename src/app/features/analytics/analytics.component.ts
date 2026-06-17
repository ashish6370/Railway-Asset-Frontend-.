import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatProgressBarModule],
  template: `
    <div class="dashboard-header">
      <div>
        <h1 class="page-title">Analytics & Executive Reporting</h1>
        <p class="page-subtitle">Deep dive into railway asset performance and lifecycle metrics.</p>
      </div>
      <button mat-flat-button class="action-btn">
        <mat-icon>download</mat-icon> Export Report
      </button>
    </div>

    <div class="analytics-grid">
      <!-- Summary Metrics -->
      <div class="glass-card stat-card">
        <div class="stat-icon-wrapper blue-bg">
          <mat-icon>inventory_2</mat-icon>
        </div>
        <div class="stat-content">
          <h3>Total Assets</h3>
          <div class="stat-value">{{ metrics?.totalAssets || '12,450' }}</div>
          <p class="stat-trend positive"><mat-icon>trending_up</mat-icon> +5% YTD</p>
        </div>
      </div>

      <div class="glass-card stat-card">
        <div class="stat-icon-wrapper green-bg">
          <mat-icon>check_circle</mat-icon>
        </div>
        <div class="stat-content">
          <h3>Active & Deployed</h3>
          <div class="stat-value">{{ metrics?.activeAssets || '11,890' }}</div>
          <p class="stat-trend positive"><mat-icon>trending_up</mat-icon> 95.5% Utilization</p>
        </div>
      </div>

      <div class="glass-card stat-card">
        <div class="stat-icon-wrapper orange-bg">
          <mat-icon>build</mat-icon>
        </div>
        <div class="stat-content">
          <h3>In Maintenance</h3>
          <div class="stat-value">{{ metrics?.maintenanceAssets || '342' }}</div>
          <p class="stat-trend negative"><mat-icon>warning</mat-icon> 12 Critical</p>
        </div>
      </div>

      <div class="glass-card stat-card">
        <div class="stat-icon-wrapper purple-bg">
          <mat-icon>monetization_on</mat-icon>
        </div>
        <div class="stat-content">
          <h3>Total Value</h3>
          <div class="stat-value">₹1.2B</div>
          <p class="stat-trend neutral"><mat-icon>horizontal_rule</mat-icon> Stable</p>
        </div>
      </div>
    </div>

    <div class="charts-grid">
      <!-- Lifecycle Distribution -->
      <div class="glass-card chart-container">
        <h3 class="section-title">Asset Lifecycle Distribution</h3>
        <div class="progress-item">
          <div class="progress-label"><span>Active</span> <span>85%</span></div>
          <mat-progress-bar mode="determinate" value="85" color="primary"></mat-progress-bar>
        </div>
        <div class="progress-item">
          <div class="progress-label"><span>Maintenance</span> <span>10%</span></div>
          <mat-progress-bar mode="determinate" value="10" color="accent"></mat-progress-bar>
        </div>
        <div class="progress-item">
          <div class="progress-label"><span>Decommissioned</span> <span>5%</span></div>
          <mat-progress-bar mode="determinate" value="5" color="warn"></mat-progress-bar>
        </div>
      </div>

      <!-- Zone Distribution -->
      <div class="glass-card chart-container">
        <h3 class="section-title">Asset Distribution by Zone</h3>
        <div class="chart-wrapper">
          <div class="donut-chart">
            <div class="donut-hole">
              <span class="donut-text">3 Zones</span>
              <span class="donut-label">Total Coverage</span>
            </div>
          </div>
          <div class="chart-legend">
            <div class="legend-item">
              <span class="color-dot blue-dot"></span> Northern (40%)
            </div>
            <div class="legend-item">
              <span class="color-dot green-dot"></span> Western (35%)
            </div>
            <div class="legend-item">
              <span class="color-dot purple-dot"></span> Eastern (25%)
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
    }
    .page-title {
      margin: 0;
      color: var(--rail-navy);
      font-size: 28px;
      font-weight: 700;
    }
    .page-subtitle {
      margin: 5px 0 0 0;
      color: var(--rail-gray-text);
    }
    .action-btn {
      background-color: var(--rail-orange) !important;
      color: white !important;
      padding: 0 20px;
      border-radius: 8px;
    }
    .analytics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 24px;
      margin-bottom: 30px;
    }
    .stat-card {
      display: flex;
      align-items: center;
      padding: 20px;
      background: white;
    }
    .stat-icon-wrapper {
      width: 60px;
      height: 60px;
      border-radius: 12px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 20px;
    }
    .stat-icon-wrapper mat-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: white;
    }
    .blue-bg { background-color: #3b82f6; }
    .green-bg { background-color: #10b981; }
    .orange-bg { background-color: var(--rail-orange); }
    .purple-bg { background-color: #8b5cf6; }

    .stat-content h3 {
      margin: 0 0 5px 0;
      font-size: 14px;
      color: var(--rail-gray-text);
      font-weight: 500;
    }
    .stat-value {
      font-size: 28px;
      font-weight: 700;
      color: var(--rail-navy);
      margin-bottom: 5px;
    }
    .stat-trend {
      margin: 0;
      font-size: 12px;
      display: flex;
      align-items: center;
    }
    .stat-trend mat-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      margin-right: 4px;
    }
    .positive { color: #10b981; }
    .negative { color: #ef4444; }
    .neutral { color: #8b5cf6; }

    .charts-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }
    .chart-container {
      background: white;
    }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--rail-navy);
      margin: 0 0 20px 0;
    }
    .progress-item {
      margin-bottom: 20px;
    }
    .progress-label {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8px;
      font-weight: 500;
      color: var(--rail-navy);
    }
    
    /* Donut Chart Styles */
    .chart-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding-top: 20px;
    }
    .donut-chart {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: conic-gradient(
        #3b82f6 0% 40%, 
        #10b981 40% 75%, 
        #8b5cf6 75% 100%
      );
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      margin-bottom: 30px;
      transition: transform 0.3s ease;
    }
    .donut-chart:hover {
      transform: scale(1.05);
    }
    .donut-hole {
      width: 130px;
      height: 130px;
      background-color: white;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      box-shadow: inset 0 2px 5px rgba(0,0,0,0.05);
    }
    .donut-text {
      font-size: 24px;
      font-weight: 700;
      color: var(--rail-navy);
    }
    .donut-label {
      font-size: 11px;
      font-weight: 500;
      color: var(--rail-gray-text);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .chart-legend {
      display: flex;
      width: 100%;
      justify-content: space-around;
      border-top: 1px solid #f1f5f9;
      padding-top: 20px;
    }
    .legend-item {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: var(--rail-navy);
      font-weight: 500;
    }
    .color-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
    }
    .blue-dot { background-color: #3b82f6; }
    .green-dot { background-color: #10b981; }
    .purple-dot { background-color: #8b5cf6; }

    @media (max-width: 768px) {
      .charts-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AnalyticsComponent implements OnInit {
  metrics: any;
  constructor(private api: ApiService) {}
  ngOnInit() { 
    this.api.getMetrics().subscribe({
      next: (d) => this.metrics = d,
      error: (e) => console.log('Metrics API failed, using fallbacks')
    }); 
  }
}