import React, { useState, useRef, useEffect } from 'react';
import '../../css/SearchBar.css';
import { FaSearch, FaTimes, FaBox, FaUser, FaUsers, FaFileInvoice } from 'react-icons/fa';

const SearchBar = ({ placeholder = "Search...", onSearch, onClear }) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [backspaceCount, setBackspaceCount] = useState(0); // Adiciona o contador de backspace
    const inputRef = useRef(null);

    const data = [
        { label: "Products", icon: <FaBox /> },
        { label: "Users", icon: <FaUser /> },
        { label: "Customers", icon: <FaUsers /> },
        { label: "Estimates", icon: <FaFileInvoice /> }
    ];

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);
        if (value.length > 0) {
            handleSearch(selectedSuggestion?.label || '');
            setBackspaceCount(0); // Reseta o contador quando houver valor no input
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setSelectedSuggestion(suggestion);
        setShowSuggestions(false);
        handleSearch(suggestion.label);
    };

    const handleSearch = (suggestion) => {
        onSearch(
            JSON.stringify({
                [suggestion || '']: inputValue
            })
        );
    };

    const handleClear = () => {
        setInputValue('');
        setSelectedSuggestion(null);
        setShowSuggestions(false);
        onClear();
        setBackspaceCount(0); // Reseta o contador ao limpar
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Backspace') {
            if (inputValue === '') {
                // Se o input estiver vazio, contamos as vezes que o backspace é pressionado
                if (backspaceCount === 0) {
                    setBackspaceCount(1); // Primeira vez que o backspace é pressionado, nada acontece
                } else {
                    setSelectedSuggestion(null); // Segunda vez, remove a sugestão
                    handleClear();
                    setBackspaceCount(0); // Reseta o contador
                }
            } else {
                // Quando o input ainda tem algum valor, apagamos normalmente e resetamos o contador
                setInputValue(inputValue.slice(0, -1));
                setBackspaceCount(0); // Reseta o contador se houver input
            }
        } else {
            setBackspaceCount(0); // Reseta o contador se outra tecla for pressionada
        }
    };

    const handleClickOutside = (e) => {
        if (!e.target.closest('.search-bar-container')) {
            setShowSuggestions(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    const toggleSuggestions = () => {
        if (inputValue || selectedSuggestion) {
            setShowSuggestions(prev => !prev);
        }
    };

    const isInputDisabled = !selectedSuggestion;

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [selectedSuggestion]);

    return (
        <div className="search-bar-container">
            <div className="search-bar">
                {selectedSuggestion && (
                    <div className="selected-suggestion">
                        {selectedSuggestion.icon} {selectedSuggestion.label}
                    </div>
                )}
                <input
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    onClick={toggleSuggestions}
                    onKeyDown={handleKeyDown} // Alterado para handleKeyDown
                    readOnly={isInputDisabled}
                    onFocus={() => setShowSuggestions(true)}
                    ref={inputRef}
                />
                <button className="clear-btn" onClick={handleClear}>
                    <FaTimes />
                </button>
                <button className="search-btn" onClick={() => handleSearch(selectedSuggestion?.label)}>
                    <FaSearch />
                </button>
            </div>
            {showSuggestions && (
                <ul className="suggestions">
                    <li className="searching-for">I'm looking for...</li>
                    {data.map((suggestion, index) => (
                        <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                            {suggestion.icon} {suggestion.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchBar;
