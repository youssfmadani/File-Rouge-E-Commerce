import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { ProductListComponent } from './pages/product-list/product-list';
import { ProductDetails } from './pages/product-details/product-details';
import { Cart } from './pages/cart/cart';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { AdminDashboard } from './pages/admin-dashboard/admin-dashboard';
import { AdminProducts } from './pages/admin-products/admin-products';
import { Categories } from './pages/categories/categories';
import { Deals } from './pages/deals/deals';
import { About } from './pages/about/about';
import { Profile } from './pages/profile/profile';
import { UserAdminConverter } from './components/user-admin-converter/user-admin-converter';
import { authGuard } from './guards/auth.guard';
import { guestGuard } from './guards/guest.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetails },
  { path: 'cart', component: Cart, canActivate: [authGuard] },
  { path: 'login', component: Login, canActivate: [guestGuard] },
  { path: 'register', component: Register, canActivate: [guestGuard] },
  { path: 'admin', component: AdminDashboard, canActivate: [adminGuard] },
  { path: 'admin/products', component: AdminProducts, canActivate: [adminGuard] },
  { path: 'admin/users', component: UserAdminConverter },
  { path: 'categories', component: Categories },
  { path: 'deals', component: Deals },
  { path: 'about', component: About },
  { path: 'profile', component: Profile, canActivate: [authGuard] },
  { path: 'dashboard', redirectTo: '/profile' }, // Alias for customer dashboard
  { path: '**', redirectTo: '' } // Redirect unknown paths to home
];
