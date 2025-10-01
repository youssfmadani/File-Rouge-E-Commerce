import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdherentService, Adherent } from '../../../services/adherent';
import { AdminSidebarComponent } from '../../admin/admin-sidebar';

@Component({
  selector: 'app-adherents-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminSidebarComponent],
  templateUrl: './adherents-list.html',
  styleUrls: ['./adherents-list.css']
})
export class AdherentsListComponent implements OnInit {
  adherents: Adherent[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';

  constructor(
    private router: Router,
    private adherentService: AdherentService
  ) {}

  ngOnInit(): void {
    this.loadAdherents();
  }

  loadAdherents(): void {
    this.loading = true;
    this.error = null;
    
    this.adherentService.getAllAdherents().subscribe({
      next: (adherents) => {
        this.adherents = adherents;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading adherents:', error);
        this.error = 'Failed to load adherents';
        this.loading = false;
      }
    });
  }

  searchAdherents(): void {
    // Implement search functionality if needed
    // For now, we'll just reload all adherents
    this.loadAdherents();
  }

  deleteAdherent(id: number | undefined): void {
    if (id === undefined) return;
    
    if (confirm('Are you sure you want to delete this adherent?')) {
      this.adherentService.deleteAdherent(id).subscribe({
        next: () => {
          // Remove the adherent from the list
          this.adherents = this.adherents.filter(adherent => adherent.id !== id);
        },
        error: (error) => {
          console.error('Error deleting adherent:', error);
          this.error = 'Failed to delete adherent';
        }
      });
    }
  }

  makeAdmin(id: number | undefined): void {
    if (id === undefined) return;
    
    this.adherentService.makeAdmin(id).subscribe({
      next: (updatedAdherent) => {
        // Update the adherent in the list
        const index = this.adherents.findIndex(a => a.id === id);
        if (index !== -1) {
          this.adherents[index] = updatedAdherent;
        }
      },
      error: (error) => {
        console.error('Error making adherent admin:', error);
        this.error = 'Failed to make adherent admin';
      }
    });
  }

  navigateToCreate(): void {
    this.router.navigate(['/admin/adherents/create']);
  }

  navigateToEdit(id: number | undefined): void {
    if (id === undefined) return;
    this.router.navigate(['/admin/adherents/edit', id]);
  }
}