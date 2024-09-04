import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/logo.png';
import { useAuth } from '../../context/AuthContext';
import '../../css/Login.css';
import { FaUser, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import config from '../../config.json'; // Import your JSON config file

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSingUp, setIsSingUp] = useState(false);
    const [isForgotPassword, setForgotPassword] = useState(false);
    const { login } = useAuth();
    const [popUpMessage, setPopUpMessage] = useState('');
    const [popUpType, setPopUpType] = useState('');
    const navigate = useNavigate();

    const handlePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleLoginSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post(
                `${config.AUTHCONFIG.API_BASE_URL}${config.AUTHCONFIG.LOGIN_URL}`,
                {
                    username,
                    password,
                }
            );
    
            const { access_token, name, id } = response.data;
    
            login(access_token, username, name, id);
    
            setPopUpType('success');
            setPopUpMessage('Login successful!');
    
            // Redirect after setting the success message
            navigate('/');
    
        } catch (error) {
            console.error('Error during login:', error);
            
            // Ensure the response object is defined
            const errorMessage = error.response?.data?.detail || 'An unexpected error occurred.';
    
            setPopUpType('error');
            setPopUpMessage(errorMessage);
        }
    
        // Clear the popup message after 3 seconds
        setTimeout(() => {
            setPopUpMessage('');
        }, 3000);
    };
    

    const handleForgotPasswordSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post(`${config.AUTHCONFIG.API_BASE_URL}${config.AUTHCONFIG.FORGOT_PASSWORD_URL}`, { username });
            
            // Supondo que a resposta da API contenha a mensagem no campo `message`
            const successMessage = response.data.message || 'Password reset link sent to your email!';
            
            setPopUpType('success');
            setPopUpMessage(successMessage);
        } catch (error) {
            console.error('Error during password reset:', error);
            setPopUpType('error');
            setPopUpMessage('Failed to send password reset link.');
        }
    
        setTimeout(() => {
            setPopUpMessage('');
        }, 7000);
    };
    

    const handleSignUpSubmit = async (e) => {
        e.preventDefault();
    
        try {
            await axios.post(
                `${config.AUTHCONFIG.API_BASE_URL}${config.AUTHCONFIG.SIGN_UP_URL}`,
                { username, password }
            );
    
            setPopUpType('success');
            setPopUpMessage('Sign up successful! You can now log in.');
    
            // Optionally, you might want to reset the form or redirect the user here
            setIsSingUp(false);
    
        } catch (error) {
            console.error('Error during sign up:', error);
            
            // Provide a fallback error message if specific error details are not available
            const errorMessage = error.response?.data?.detail || 'Sign up failed. Please try again.';
            
            setPopUpType('error');
            setPopUpMessage(errorMessage);
        }
    
        // Clear the popup message after 3 seconds
        setTimeout(() => {
            setPopUpMessage('');
        }, 3000);
    };
    

    return (
        <div className="login-container">
            {!isSingUp && !isForgotPassword ? (
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
                        <a href="#" onClick={() => setIsSingUp(true)}>Sign Up</a> {/* Changed to Sign Up */}
                    </div>
                </form>
            ) : (
                <div>
                    {isSingUp ? (
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
                                <a href="#" onClick={() => setIsSingUp(false)}>Back to Login</a>
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
            {popUpMessage && (
                <div className={`pop-up ${popUpType}`}>
                    {popUpType === 'success' && <FaCheckCircle className="icon" />}
                    {popUpType === 'error' && <FaExclamationCircle className="icon" />}
                    <div className="message">{popUpMessage}</div>
                </div>
            )}
        </div>
    );
};

export default Login;
