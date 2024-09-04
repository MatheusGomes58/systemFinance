// src/Home.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext'; // Importar useAuth
import { useNavigate } from 'react-router-dom';
import '../../css/Home.css';

const Home = () => {
    const { auth, logout } = useAuth(); // Acessar o contexto de autenticação
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login'); // Redirecionar para a página de login após o logout
    };

    return (
        <div className="home-container">
            <h1>Welcome to the Home Page</h1>
            {auth.username && (
                <>
                    <p>Username: {auth.username}</p>
                    <p>Token: {auth.token}</p>
                </>
            )}
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Home;
