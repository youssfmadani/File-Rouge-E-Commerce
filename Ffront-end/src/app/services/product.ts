
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(this.productsUrl, product).pipe(
      map(p => this.mapBackendProduct(p)),
      catchError(error => {
        console.error('Error creating product:', error);
        return throwError(error);
      })
    );
  }

  updateProduct(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.productsUrl}/${id}`, product).pipe(
      map(p => this.mapBackendProduct(p)),
      catchError(error => {
        console.error('Error updating product:', error);
        
        let errorMessage = 'Failed to update product';
        if (error.status === 400) {
          errorMessage = 'Invalid product data. Please check all fields are filled correctly.';
        } else if (error.status === 404) {
          errorMessage = 'Product not found.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }
        return throwError(new Error(errorMessage));
      })
    );
  }


  // Map frontend product format to backend format
  private mapFrontendProduct(product: Product): any {
    // Send the product as is, like other services do
    return product;
  }
