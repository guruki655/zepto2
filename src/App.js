import './App.css';
import AdminDashboard from './components/adminDashboard';
import VendorDashboard from './components/vendorDashboard.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Home from './pages/Home.js';
import Navbar from './components/navbar.js';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import ProductPage from '../src/components/productPage.js';
import ForgotPassword from './pages/forgotPassword.js';
import { CartProvider } from './contexts/cartContext.js';
import Cart from './pages/cart.js';
import PaymentComponent from './pages/payment.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/product/:id" element={<ProductPage />} />
            <Route path="/Navbar" element={<Navbar />} />
            <Route path="/AdminDashboard" element={<AdminDashboard/>}/>
            <Route path="/VendorDashboard" element={<VendorDashboard/>}/>
            <Route path="/Register" element={<Register />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/ForgotPassword" element={<ForgotPassword />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/Payment" element={<PaymentComponent />} />
          </Routes>
        </CartProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;