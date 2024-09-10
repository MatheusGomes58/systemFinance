import React, { useState, useRef, useEffect } from 'react';
import '../../css/SearchBar.css';
import { FaSearch, FaTimes, FaBox, FaUser, FaUsers, FaFileInvoice, FaChevronDown } from 'react-icons/fa';

const SearchBar = ({ placeholder = "Search...", onSearch, onClear }) => {
    const [inputValue, setInputValue] = useState('');
    const [selectedSuggestion, setSelectedSuggestion] = useState(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef(null);
    const timerRef = useRef(null);

    const data = [
        { label: "Products", icon: <FaBox /> },
        { label: "Users", icon: <FaUser /> },
        { label: "Customers", icon: <FaUsers /> },
        { label: "Estimates", icon: <FaFileInvoice /> }
    ];

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputValue(value);

        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
            handleSearch(selectedSuggestion?.label || '');
        }, 500);
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
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            handleClear();
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
        setShowSuggestions((prev) => !prev);
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
                <button className="suggestions-btn" onClick={toggleSuggestions}>
                    {selectedSuggestion && (
                        <div className="selected-suggestion">
                            {selectedSuggestion.icon} {selectedSuggestion.label}
                        </div>
                    )}
                    <FaChevronDown />
                </button>
                <input
                    type="text"
                    placeholder={placeholder}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    readOnly={isInputDisabled}
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

