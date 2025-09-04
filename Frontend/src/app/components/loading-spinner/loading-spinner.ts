import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.html',
  styleUrls: ['./loading-spinner.css']
})
export class LoadingSpinnerComponent {
  @Input() overlay: boolean = false;
  @Input() text: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() animation: 'spin' | 'pulse' | 'bounce' = 'spin';
}
