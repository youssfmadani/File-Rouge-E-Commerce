import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './scroll-to-top.html',
  styleUrls: ['./scroll-to-top.css']
})
export class ScrollToTopComponent implements OnInit, OnDestroy {
  isVisible = false;
  private scrollThreshold = 300;

  @HostListener('window:scroll')
  onWindowScroll() {
    this.isVisible = window.scrollY > this.scrollThreshold;
  }

  ngOnInit() {
    // Component initialization
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}
