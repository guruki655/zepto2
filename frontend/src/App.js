import './App.css';
import Navbar from './components/navbar.js';
import Footer from './components/footer.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/cartContext.js';
import React, { Suspense, lazy } from 'react';
import PrivateRoute from './components/privateroute.js';

const AdminDashboard = lazy(() => import('./components/adminDashboard'));
const VendorDashboard = lazy(() => import('./components/vendorDashboard.js'));
const Login = lazy(() => import('./components/Login.js'));
const Register = lazy(() => import('./components/Register.js'));
const Home = lazy(() => import('./pages/Home.js'));
const ProductPage = lazy(() => import('./components/productPage.js'));
const ForgotPassword = lazy(() => import('./pages/forgotPassword.js'));
const Cart = lazy(() => import('./pages/cart.js'));
const PaymentComponent = lazy(() => import('./pages/payment.js'));
const OrderHistory = lazy(() => import('./pages/prevOrder.js'));
const CategoryPage = lazy(() => import('./pages/category.js'));
const Success = lazy(() => import('./pages/success.js'));
const PanCorner = lazy(() => import('./pages/cancel.js'));
const Cancel = lazy(() => import('./pages/panCorner.js'));
const PaanCorner = lazy(() => import('./pages/comingsoon.js'));

function App() {
  return (
    <div className="App d-flex flex-column min-vh-100">
      <BrowserRouter>
        <CartProvider>
          <Navbar />
          <main className="flex-grow-1">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/Navbar" element={<Navbar />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/Login" element={<Login />} />
                <Route path="/ForgotPassword" element={<ForgotPassword />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/success" element={<Success />} />
                <Route path="/cancel" element={<Cancel />} />
                <Route path="/PanCorner" element={<PanCorner />} />
                <Route path="/PaanCorner" element={<PaanCorner />} />

                
                <Route
                  path="/AdminDashboard"
                  element={
                   <PrivateRoute allowedRoles={['admin']}>
      <AdminDashboard />
    </PrivateRoute>
                  }
                />
                <Route
                  path="/VendorDashboard"
                  element={
                       <PrivateRoute allowedRoles={['vendor']}>
      <VendorDashboard />
    </PrivateRoute>
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <PrivateRoute>
                      <Cart />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/Payment"
                  element={
                    <PrivateRoute>
                      <PaymentComponent />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <PrivateRoute>
                      <OrderHistory />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </CartProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
