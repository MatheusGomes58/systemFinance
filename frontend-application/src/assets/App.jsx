import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/protectedRoute/ProtectedRoute';
import Navbar from './components/navbar/Navbar';
import Login from './pages/login/Login';
import Home from './pages/home/Home';
import PopUp from './components/alert/Alert';
import './css/App.css';

function App() {
    const [popUpMessages, setPopUpMessages] = useState([]); // Mudança para armazenar várias mensagens
    const location = useLocation();

    const addPopUpMessage = (message, type) => {
        const newMessage = { id: Date.now(), message, type }; // Cria um novo pop-up com ID único
        setPopUpMessages((prevMessages) => [...prevMessages, newMessage]);

        // Remove o pop-up após 3 segundos
        setTimeout(() => {
            setPopUpMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== newMessage.id));
        }, 3000);
    };

    const clearPopUpMessage = (id) => {
        setPopUpMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== id));
    };

    return (
        <AuthProvider>
            <div className="App">
                {location.pathname !== '/login' && <Navbar onLogoutMessage={addPopUpMessage} />}
                <Routes>
                    <Route path="/login" element={<Login addPopUpMessage={addPopUpMessage} />} />
                    <Route path="/" element={<ProtectedRoute element={<Home />} />} />
                </Routes>
                <PopUp messages={popUpMessages} clearMessage={clearPopUpMessage} />
            </div>
        </AuthProvider>
    );
}

export default App;
