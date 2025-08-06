import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './product-details.html',
  styleUrls: ['./product-details.css']
})
export class ProductDetails {
  product = {
    name: 'Product 1',
    price: 100,
    description: 'A great product',
    imageUrl: 'https://via.placeholder.com/320'
  };
}
