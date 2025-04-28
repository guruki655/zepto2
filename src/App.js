import './App.css';

import AdminDashboard from './components/adminDashboard';
import VendorDashboard from './components/vendorDashboard.js';
import Login from './components/Login.js';
import Register from './components/Register.js';
import Home from './pages/Home.js';
import Navbar from './components/navbar.js';
import {BrowserRouter,Routes,Route} from 'react-router-dom'


function App() {
  return (
    
    <div className="App">

      <BrowserRouter>
      <Navbar/> 

      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Home" element={<Home />} />
      <Route path="/Navbar" element={<Navbar />} />
        <Route path="/AdminDashboard" element={<AdminDashboard/>}/>
        <Route path="/VendorDashboard" element={<VendorDashboard/>}/>
        <Route path="/Register" element={<Register />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
