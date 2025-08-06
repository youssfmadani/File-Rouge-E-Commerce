import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../../components/product-card/product-card';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.css']
})
export class ProductListComponent {
  products = [
    { name: 'Product 1', price: 100, imageUrl: 'https://via.placeholder.com/250' },
    { name: 'Product 2', price: 50, imageUrl: 'https://via.placeholder.com/250' }
  ];
}
