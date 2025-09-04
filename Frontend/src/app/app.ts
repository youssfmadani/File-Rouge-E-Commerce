import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { FooterComponent } from './components/footer/footer';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top';
// Page components are lazy-routed; no need to import them here

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar,
    FooterComponent,
    ScrollToTopComponent,
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('Frontend');
}
