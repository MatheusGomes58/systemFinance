import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import Navbar from './components/navbar/Navbar';
import Login from './components/login/Login';
import Home from './components/home/Home';
import './css/App.css';

function App() {
  const location = useLocation();

  return (
    <AuthProvider>
      <div className="App">
        {location.pathname !== '/login' && <Navbar />}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
