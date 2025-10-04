import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ProductListComponent } from './pages/product-list/product-list';
import { ProductDetails } from './pages/product-details/product-details';
import { Cart } from './pages/cart/cart';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Profile } from './pages/profile/profile';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard';
import { AdherentsListComponent } from './pages/admin/adherents/adherents-list';
import { AdherentFormComponent } from './pages/admin/adherents/adherent-form';
import { OrdersListComponent } from './pages/admin/orders/orders-list.component';
import { OrderFormComponent } from './pages/admin/orders/order-form.component';
import { CategoriesListComponent } from './pages/admin/categories/categories-list';
import { CategoryFormComponent } from './pages/admin/categories/category-form';
import { ProductsListComponent } from './pages/admin/products/products-list';
import { ProductFormComponent } from './pages/admin/products/product-form';
import { MyOrdersComponent } from './pages/my-orders/my-orders.component';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { guestGuard } from './guards/guest.guard';
import { AdminLayoutComponent } from './pages/admin/admin-layout';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetails },
  { path: 'cart', component: Cart },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'my-orders', component: MyOrdersComponent, canActivate: [authGuard] },
  
  // Admin routes
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent },
      
      // Adherents routes
      { path: 'adherents', component: AdherentsListComponent },
      { path: 'adherents/create', component: AdherentFormComponent },
      { path: 'adherents/edit/:id', component: AdherentFormComponent },
      
      // Orders routes
      { path: 'orders', component: OrdersListComponent },
      { path: 'orders/create', component: OrderFormComponent },
      { path: 'orders/edit/:id', component: OrderFormComponent },
      
      // Categories routes
      { path: 'categories', component: CategoriesListComponent },
      { path: 'categories/create', component: CategoryFormComponent },
      { path: 'categories/edit/:id', component: CategoryFormComponent },
      
      // Products routes
      { path: 'products', component: ProductsListComponent },
      { path: 'products/create', component: ProductFormComponent },
      { path: 'products/edit/:id', component: ProductFormComponent },
    ]
  },
  
  { path: '**', redirectTo: '' }
];