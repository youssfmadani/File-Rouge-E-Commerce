# Backend-Frontend Integration Guide

## 🚀 Current Status
✅ **Backend**: Running on http://localhost:8081  
✅ **Frontend**: Running on http://localhost:64496  
✅ **Database**: MySQL connected  
✅ **API Integration**: Active  

## 🔧 Technical Stack Integration

### Backend (Spring Boot)
- **Port**: 8081
- **Database**: MySQL (localhost:3306/Ecommerce)
- **API Base**: http://localhost:8081/api

### Frontend (Angular)
- **Port**: 64496 (auto-assigned)
- **API Configuration**: Points to http://localhost:8081

### Available API Endpoints

#### Authentication
- `POST /api/auth/login` - User login

#### Adherents (Customers)
- `GET /api/adherents` - Get all adherents
- `GET /api/adherents/{id}` - Get adherent by ID
- `GET /api/adherents/email/{email}` - Get adherent by email ✨ NEW
- `POST /api/adherents` - Create adherent
- `PUT /api/adherents/{id}` - Update adherent
- `DELETE /api/adherents/{id}` - Delete adherent

#### Products
- `GET /api/produits` - Get all products
- `GET /api/produits/{id}` - Get product by ID
- `POST /api/produits` - Create product
- `PUT /api/produits/{id}` - Update product
- `DELETE /api/produits/{id}` - Delete product

#### Orders
- `GET /api/commandes` - Get all orders
- `GET /api/commandes/{id}` - Get order by ID
- `POST /api/commandes` - Create order
- `PUT /api/commandes/{id}` - Update order
- `DELETE /api/commandes/{id}` - Delete order

#### Administrators
- `GET /api/administrateurs` - Get all administrators
- `GET /api/administrateurs/{id}` - Get administrator by ID
- `POST /api/administrateurs` - Create administrator
- `PUT /api/administrateurs/{id}` - Update administrator
- `DELETE /api/administrateurs/{id}` - Delete administrator

## 🎯 Integration Features

### 1. Authentication Flow
- ✅ Login with backend verification
- ✅ JWT token storage
- ✅ Role-based access (USER/ADMIN)
- ✅ Automatic redirect to profile dashboard
- ✅ HTTP interceptor for authentication headers

### 2. User Profile Integration
- ✅ Fetch user data from backend by email
- ✅ Fallback to mock data for development
- ✅ Real-time profile dashboard
- ✅ Error handling and loading states

### 3. Product Management
- ✅ Load products from backend API
- ✅ Fallback to mock data if backend unavailable
- ✅ Product search and filtering
- ✅ CRUD operations support
- ✅ Image URL mapping between frontend/backend formats

### 4. Order Management
- ✅ Order service integration
- ✅ Backend API communication
- ✅ Order status tracking
- ✅ Customer order history

## 🔄 Data Flow

```
Frontend (Angular) ↔ HTTP/REST ↔ Backend (Spring Boot) ↔ JPA ↔ MySQL Database
     |                                      |
     |                                      |
   Services                            Controllers
   - AuthService                      - AuthController
   - UserService                      - AdherentController  
   - ProductService                   - ProduitController
   - OrderService                     - CommandeController
```

## 🛠 How to Test the Integration

### 1. Authentication Test
1. Navigate to http://localhost:64496/login
2. Enter any email and password
3. Should redirect to profile dashboard
4. Backend authentication is attempted first, falls back to local auth

### 2. Profile Loading Test
1. After login, you should see profile data
2. Check browser network tab for API calls to:
   - `GET /api/adherents/email/{email}`
   - Fallback data if backend call fails

### 3. Product Loading Test
1. Navigate to http://localhost:64496/products
2. Check network tab for API calls to:
   - `GET /api/produits`
   - Should see loading spinner → products list

### 4. API Health Check
Direct API test: http://localhost:8081/api/auth/login
```json
POST Body:
{
  "email": "test@example.com",
  "password": "password"
}
```

## 📝 Development Commands

### Start Backend
```bash
cd Backend
./mvnw spring-boot:run
```

### Start Frontend  
```bash
cd Frontend
ng serve
```

### Build Frontend
```bash
cd Frontend
ng build
```

## 🔒 CORS Configuration
- Backend configured to accept requests from multiple origins
- Supports both localhost:4200 (default) and dynamic ports
- Credentials enabled for authentication

## 🐛 Troubleshooting

### Backend Not Starting
- Check if port 8081 is available
- Verify MySQL is running on localhost:3306
- Check database credentials in application.properties

### Frontend API Calls Failing
- Verify backend is running on port 8081
- Check CORS configuration
- Check browser network tab for actual error responses

### Authentication Issues
- Clear localStorage: `localStorage.clear()`
- Check JWT tokens in localStorage
- Verify AuthService configuration

## 🎉 Success Indicators
- ✅ Backend shows "Started BackendApplication" in logs
- ✅ Frontend builds and serves without errors  
- ✅ Login redirects to profile dashboard
- ✅ Profile shows user information (real or mock)
- ✅ Products page loads data from backend
- ✅ API calls visible in browser network tab

## 🚀 Next Steps
1. **Add more sample data** to backend database
2. **Implement cart functionality** with backend persistence
3. **Add product image upload** feature
4. **Implement real user registration** 
5. **Add order creation and tracking**
6. **Implement admin dashboard** with backend integration