import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AdminSidebarComponent } from './admin-sidebar';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminSidebarComponent, RouterOutlet],
  template: `
    <div class="admin-layout">
      <app-admin-sidebar></app-admin-sidebar>
      <div class="admin-main">
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [`
    .admin-layout {
      display: flex;
      min-height: 100vh;
    }
    
    .admin-main {
      flex: 1;
      margin-left: 250px;
      background: var(--surface-secondary);
    }
    
    @media (max-width: 768px) {
      .admin-main {
        margin-left: 0;
      }
    }
  `]
})
export class AdminLayoutComponent {
}