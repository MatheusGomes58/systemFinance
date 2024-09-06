// src/components/Pagination.jsx
import React, { useState, useEffect } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '../../css/Pagination.css';

const Pagination = ({ totalItems, onPageChange }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9); // Valor padrão de itens por página
    const [inputPage, setInputPage] = useState(1);
    
    // Calcula o total de páginas com base no total de itens e nos itens por página
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    useEffect(() => {
        setInputPage(currentPage);
    }, [currentPage]);

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage(prev => prev - 1);
            onPageChange(currentPage - 1, itemsPerPage);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prev => prev + 1);
            onPageChange(currentPage + 1, itemsPerPage);
        }
    };

    const handleInputChange = (e) => {
        setInputPage(e.target.value);
    };

    const handleInputSubmit = (e) => {
        if (e.key === 'Enter') {
            const pageNumber = parseInt(inputPage, 10);
            if (pageNumber >= 1 && pageNumber <= totalPages) {
                setCurrentPage(pageNumber);
                onPageChange(pageNumber, itemsPerPage);
            } else {
                setInputPage(currentPage);
            }
        }
    };

    const handleItemsPerPageChange = (e) => {
        const newItemsPerPage = parseInt(e.target.value, 10);
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1); // Reseta para a primeira página quando os itens por página mudam
        onPageChange(1, newItemsPerPage); // Chama a função com a primeira página e novos itens por página
    };

    return (
        <div className="pagination-container">
            <button 
                className="pagination-button" 
                onClick={handlePrevious} 
                disabled={currentPage === 1}
                aria-label="Previous page"
            >
                <FaArrowLeft />
            </button>
            
            <span className="pagination-info">
                Page <input 
                    type="number" 
                    value={inputPage} 
                    onChange={handleInputChange} 
                    onKeyDown={handleInputSubmit} 
                    min="1" 
                    max={totalPages} 
                    className="pagination-input"
                /> of {totalPages}
            </span>
            
            <button 
                className="pagination-button" 
                onClick={handleNext} 
                disabled={currentPage === totalPages}
                aria-label="Next page"
            >
                <FaArrowRight />
            </button>

            <div className="pagination-items-per-page">
                <label htmlFor="itemsPerPage">Items per page: </label>
                <select 
                    id="itemsPerPage" 
                    value={itemsPerPage} 
                    onChange={handleItemsPerPageChange}
                >
                    <option value={9}>9</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                </select>
            </div>
        </div>
    );
};

export default Pagination;
