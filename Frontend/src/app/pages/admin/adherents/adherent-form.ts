import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AdherentService, Adherent } from '../../../services/adherent';
import { AdminSidebarComponent } from '../../admin/admin-sidebar';

@Component({
  selector: 'app-adherent-form',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, AdminSidebarComponent],
  templateUrl: './adherent-form.html',
  styleUrls: ['./adherent-form.css']
})
export class AdherentFormComponent implements OnInit {
  adherent: Adherent = {};
  isEditMode = false;
  loading = false;
  error: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private adherentService: AdherentService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.loadAdherent(parseInt(id, 10));
    }
  }

  loadAdherent(id: number): void {
    this.loading = true;
    this.adherentService.getAdherentById(id).subscribe({
      next: (adherent) => {
        this.adherent = adherent;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading adherent:', error);
        this.error = 'Failed to load adherent';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.loading = true;
    this.error = null;

    if (this.isEditMode) {
      // Update existing adherent
      if (this.adherent.id) {
        this.adherentService.updateAdherent(this.adherent.id, this.adherent).subscribe({
          next: () => {
            this.loading = false;
            this.router.navigate(['/admin/adherents']);
          },
          error: (error) => {
            console.error('Error updating adherent:', error);
            this.error = 'Failed to update adherent';
            this.loading = false;
          }
        });
      }
    } else {
      // Create new adherent
      this.adherentService.createAdherent(this.adherent).subscribe({
        next: () => {
          this.loading = false;
          this.router.navigate(['/admin/adherents']);
        },
        error: (error) => {
          console.error('Error creating adherent:', error);
          this.error = 'Failed to create adherent';
          this.loading = false;
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin/adherents']);
  }
}