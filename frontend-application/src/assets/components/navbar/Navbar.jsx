// src/components/Navbar.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../css/Navbar.css'; // Estilos específicos para o Navbar
import logo from '../../images/logo.png';

const Navbar = () => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="header-container">
            <div className="header-left">
                <img src={logo} alt="Logo" className="logo" />
                <nav>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/estimates">Estimates</a></li>
                        <li><a href="/products">Products</a></li>
                        <li><a href="/customers">Customers</a></li>
                        <li><a href="/users">Users</a></li>
                    </ul>
                </nav>
            </div>
            <div className="header-right">
                {auth.username && (
                    <>
                        <span className="username">Olá, {auth.name? auth.name : auth.username}</span>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
