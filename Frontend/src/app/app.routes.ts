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
import { OrdersListComponent } from './pages/admin/orders/orders-list';
import { OrderFormComponent } from './pages/admin/orders/order-form';
import { CategoriesListComponent } from './pages/admin/categories/categories-list';
import { CategoryFormComponent } from './pages/admin/categories/category-form';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { guestGuard } from './guards/guest.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetails },
  { path: 'cart', component: Cart, canActivate: [authGuard] },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  // Admin routes
  { path: 'admin', component: AdminDashboardComponent, canActivate: [adminGuard] },
  { path: 'admin/adherents', component: AdherentsListComponent, canActivate: [adminGuard] },
  { path: 'admin/adherents/create', component: AdherentFormComponent, canActivate: [adminGuard] },
  { path: 'admin/adherents/edit/:id', component: AdherentFormComponent, canActivate: [adminGuard] },
  { path: 'admin/orders', component: OrdersListComponent, canActivate: [adminGuard] },
  { path: 'admin/orders/edit/:id', component: OrderFormComponent, canActivate: [adminGuard] },
  { path: 'admin/categories', component: CategoriesListComponent, canActivate: [adminGuard] },
  { path: 'admin/categories/create', component: CategoryFormComponent, canActivate: [adminGuard] },
  { path: 'admin/categories/edit/:id', component: CategoryFormComponent, canActivate: [adminGuard] },
  { path: '**', redirectTo: '' }
];