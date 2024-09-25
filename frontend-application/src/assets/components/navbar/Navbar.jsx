import React, { useEffect } from 'react';
import axios from 'axios'; // Import Axios
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../../css/Navbar.css'; // Estilos específicos para o Navbar
import logo from '../../images/logo.png';

const Navbar = ({ onLogoutMessage }) => {
    const { auth, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        let response;
        try {
            // Make DELETE request to the logout endpoint
            response = await axios.delete(`http://localhost:8000/login/logout?token=${auth.token}`, {
                headers: {
                    'accept': 'application/json'
                }
            });

            localStorage.removeItem('auth');
            logout();

            // Pass the message to the parent component
            if (onLogoutMessage) {
                onLogoutMessage(response.data.message, 'success');
            }

            navigate('/login');
        } catch (error) {
            console.error('Error during logout:', error);
            onLogoutMessage(error, 'error'); // Adiciona mensagem de erro
        }
    };

    // Save auth data to localStorage whenever auth changes
    useEffect(() => {
        localStorage.setItem('auth', JSON.stringify(auth));
    }, [auth]);

    return (
        <div className="header-container">
            <div className="header-left">
                <nav>
                    <ul>
                        <li>
                            <a href="/" className='logoHeader'>
                                <img src={logo} alt="Logo" className="logo" />
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="header-right">
                {auth.username && (
                    <>
                        <span className="username">Olá, {auth.name ? auth.name : auth.username}</span>
                        <button onClick={handleLogout} className="logout-button">Logout</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Navbar;
