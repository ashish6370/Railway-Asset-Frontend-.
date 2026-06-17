import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { ApiService } from '../../core/services/api.service';

@Component({
  selector: 'app-zones',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  template: ``
})
export class ZonesComponent implements OnInit {
  zones: any[] = [];
  constructor(private api: ApiService) {}
  ngOnInit() {
    this.api.getZones().subscribe(data => this.zones = data);
  }
}

