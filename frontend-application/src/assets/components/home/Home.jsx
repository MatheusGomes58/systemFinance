// src/Home.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../css/Home.css';

const Home = () => {
    const { auth } = useAuth();

    return (
        <div className="home-container">
            <h1>Welcome to the Home Page</h1>
            {auth.username && (
                <>
                    <p>Username: {auth.username}</p>
                    <p>Token: {auth.token}</p>
                </>
            )}
        </div>
    );
};

export default Home;
