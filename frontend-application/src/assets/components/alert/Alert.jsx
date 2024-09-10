import React from 'react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import '../../css/Alert.css';

const PopUp = ({ messages, clearMessage }) => {
    if (!messages.length) return null;

    return (
        <div className="pop-ups-container">
            {messages.map((messageObj) => (
                <div key={messageObj.id} className={`pop-up ${messageObj.type} show`}>
                    {messageObj.type === 'success' && <FaCheckCircle className="icon-success" />}
                    {messageObj.type === 'error' && <FaExclamationCircle className="icon-error" />}
                    <div className="message">{messageObj.message}</div>
                    <button className="close-btn" onClick={() => clearMessage(messageObj.id)}>&times;</button>
                </div>
            ))}
        </div>
    );
};

export default PopUp;
