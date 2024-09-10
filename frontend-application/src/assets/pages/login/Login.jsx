import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/logo.png';
import { useAuth } from '../../context/AuthContext';
import '../../css/Login.css';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import config from '../../../config.json';

const Login = ({ addPopUpMessage }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSignUp, setIsSignUp] = useState(false); // Correção no nome do estado
    const [isForgotPassword, setForgotPassword] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                `${config.AUTHCONFIG.API_BASE_URL}${config.AUTHCONFIG.LOGIN_URL}`,
                { username, password }
            );

            const { access_token, name, id } = response.data;

            login(access_token, username, name, id);

            addPopUpMessage('Login successful!', 'success'); // Adiciona mensagem de sucesso

            navigate('/');
        } catch (error) {
            console.error('Error during login:', error);
            const errorMessage = error.response?.data?.detail || 'An unexpected error occurred.';
            addPopUpMessage(errorMessage, 'error'); // Adiciona mensagem de erro
        }
    };

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${config.AUTHCONFIG.API_BASE_URL}${config.AUTHCONFIG.FORGOT_PASSWORD_URL}`, { username });
            const successMessage = response.data.message || 'Password reset link sent to your email!';
            addPopUpMessage(successMessage, 'success'); // Adiciona mensagem de sucesso
        } catch (error) {
            console.error('Error during password reset:', error);
            addPopUpMessage('Failed to send password reset link.', 'error'); // Adiciona mensagem de erro
        }
    };

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.post(
                `${config.AUTHCONFIG.API_BASE_URL}${config.AUTHCONFIG.SIGN_UP_URL}`,
                { username, password }
            );

            addPopUpMessage('Sign up successful! You can now log in.', 'success'); // Adiciona mensagem de sucesso
            setIsSignUp(false);
        } catch (error) {
            console.error('Error during sign up:', error);
            const errorMessage = error.response?.data?.detail || 'Sign up failed. Please try again.';
            addPopUpMessage(errorMessage, 'error'); // Adiciona mensagem de erro
        }
    };

    return (
        <div className="login-container">
            {!isSignUp && !isForgotPassword ? (
                <form className="login-form" onSubmit={handleLoginSubmit}>
                    <img src={logo} alt="Logo" className="login-banner" />
                    <div className="input-container">
                        <label htmlFor="username">
                            <FaUser className="icon" />
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="input-container">
                        <label htmlFor="password">
                            <FaLock className="icon" />
                            Password
                        </label>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <div className="password-toggle" onClick={handlePasswordVisibility}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>
                    <div className="links">
                        <a href="#" onClick={() => setForgotPassword(true)}>Forgot Password?</a>
                    </div>
                    <button type="submit">Login</button>
                    <div className="links">
                        New user?
                        <a href="#" onClick={() => setIsSignUp(true)}>Sign Up</a>
                    </div>
                </form>
            ) : (
                <div>
                    {isSignUp ? (
                        <form className="login-form" onSubmit={handleSignUpSubmit}>
                            <img src={logo} alt="Logo" className="login-banner" />
                            <div className="input-container">
                                <label htmlFor="username">
                                    <FaUser className="icon" />
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div className="input-container">
                                <label htmlFor="password">
                                    <FaLock className="icon" />
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <button type="submit">Sign Up</button>
                            <div className="links">
                                <a href="#" onClick={() => setIsSignUp(false)}>Back to Login</a>
                            </div>
                        </form>
                    ) : (
                        <form className="login-form" onSubmit={handleForgotPasswordSubmit}>
                            <img src={logo} alt="Logo" className="login-banner" />
                            <div className="input-container">
                                <label htmlFor="username">
                                    <FaUser className="icon" />
                                    Username
                                </label>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <button type="submit">Send Reset Link</button>
                            <div className="links">
                                <a href="#" onClick={() => setForgotPassword(false)}>Back to Login</a>
                            </div>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
};

export default Login;

