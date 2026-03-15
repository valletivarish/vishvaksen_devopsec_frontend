/**
 * App component -- application root.
 *
 * Sets up the React Router route tree, wraps the app in the
 * AuthProvider for global auth state, and includes the ToastContainer
 * for application-wide notifications.
 *
 * Route structure:
 *   /login           -> LoginForm   (public)
 *   /register        -> RegisterForm (public)
 *   /                -> ProtectedRoute -> MainLayout (authenticated shell)
 *     /dashboard     -> Dashboard
 *     /products/*    -> Product CRUD
 *     /categories/*  -> Category CRUD
 *     /suppliers/*   -> Supplier CRUD
 *     /warehouses/*  -> Warehouse CRUD
 *     /stock-movements/* -> Stock movement CRUD
 *
 * Lazy-loading is not used here for simplicity; all page components
 * are eagerly imported so the initial bundle includes everything.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Auth context provider
import { AuthProvider } from './context/AuthContext';

// Auth components
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Layout
import MainLayout from './components/Layout/MainLayout';

// Page components -- imported eagerly for simplicity.
// These will be created in subsequent steps; the imports are
// placeholders that will resolve once the files exist.
import Dashboard from './components/Dashboard/Dashboard';
import ProductList from './components/Products/ProductList';
import ProductForm from './components/Products/ProductForm';
import CategoryList from './components/Categories/CategoryList';
import CategoryForm from './components/Categories/CategoryForm';
import SupplierList from './components/Suppliers/SupplierList';
import SupplierForm from './components/Suppliers/SupplierForm';
import WarehouseList from './components/Warehouses/WarehouseList';
import WarehouseForm from './components/Warehouses/WarehouseForm';
import StockMovementList from './components/StockMovements/StockMovementList';
import StockMovementForm from './components/StockMovements/StockMovementForm';

const App = () => {
  return (
    <BrowserRouter>
      {/* AuthProvider must be inside BrowserRouter because it uses useNavigate */}
      <AuthProvider>
        <Routes>
          {/* Public routes -- accessible without authentication */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Protected routes -- require a valid JWT session */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            {/* Default redirect: / -> /dashboard */}
            <Route index element={<Navigate to="/dashboard" replace />} />

            {/* Dashboard */}
            <Route path="dashboard" element={<Dashboard />} />

            {/* Products CRUD */}
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/edit/:id" element={<ProductForm />} />

            {/* Categories CRUD */}
            <Route path="categories" element={<CategoryList />} />
            <Route path="categories/new" element={<CategoryForm />} />
            <Route path="categories/edit/:id" element={<CategoryForm />} />

            {/* Suppliers CRUD */}
            <Route path="suppliers" element={<SupplierList />} />
            <Route path="suppliers/new" element={<SupplierForm />} />
            <Route path="suppliers/edit/:id" element={<SupplierForm />} />

            {/* Warehouses CRUD */}
            <Route path="warehouses" element={<WarehouseList />} />
            <Route path="warehouses/new" element={<WarehouseForm />} />
            <Route path="warehouses/edit/:id" element={<WarehouseForm />} />

            {/* Stock Movements */}
            <Route path="stock-movements" element={<StockMovementList />} />
            <Route path="stock-movements/new" element={<StockMovementForm />} />
          </Route>
        </Routes>

        {/* Global toast notification container */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
        />
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
