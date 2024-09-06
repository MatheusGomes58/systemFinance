import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { FaListUl, FaKeyboard, FaRegHandPointer } from 'react-icons/fa'; // Importing icons
import '../../css/Home.css';
import SearchBar from '../../components/searchbar/SearchBar';
import Pagination from '../../components/pagination/Pagination';
import { Table, handleSearch } from '../../components/tables/Table';
import config from '../../../config.json';

const Home = () => {
    const { auth } = useAuth();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(9);
    const [searchQuery, setSearchQuery] = useState(false);
    const [query, setQuery] = useState({});
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [totalItems, setTotalItems] = useState(0);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const token = auth.token;
        try {
            const response = await axios.get(`${config.AUTHCONFIG.API_BASE_URL}${config.AUTHCONFIG.SIGN_UP_URL}?token=${token}`);
            const usersData = response.data;
            setUsers(usersData);
            setFilteredUsers(usersData);
            setTotalItems(usersData.length);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                window.location.href = '/login';
            }
        }
    };

    const handleClear = () => {
        setSearchQuery(false);
        setFilteredUsers(users);
        setTotalItems(users.length);
        setCurrentPage(1);
        setQuery({});
    };

    const handlePageChange = (page, perPage) => {
        setCurrentPage(page);
        setItemsPerPage(perPage);
    };

    const handleAddUser = () => {
        const newUser = {
            id: users.length + 1,
            username: 'new_user',
            name: 'New User',
            email: 'newuser@example.com'
        };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setTotalItems(updatedUsers.length);
    };

    const handleSearchWrapper = (query) => {
        handleSearch(query, users, setFilteredUsers, setTotalItems, setCurrentPage, setSearchQuery, setQuery);
    };

    const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="home-container">
            <div className={'headerPage ' + (searchQuery ? true : false)}>
                {!searchQuery && <h1>What are you looking for?</h1>}
                {!searchQuery && <p>Use the search field to search for products, estimates, users or customers</p>}
                <SearchBar onSearch={handleSearchWrapper} onClear={handleClear} />
            </div>
            <div className={searchQuery ? "home-content" : "home-context"}>
                {searchQuery ? (
                    <Table
                        query={query}
                        paginatedUsers={paginatedUsers}
                        handleAddUser={handleAddUser}
                    />
                ) : (
                    <div className="card-container">
                        <div className='card-col'>
                            <div className="card">
                                <FaRegHandPointer className='icon' />
                            </div>
                            <p className="card-text">Select the type of search you want to make</p>
                        </div>
                        <div className="card-col">
                            <div className="card">
                                <FaKeyboard className='icon' />
                            </div>
                            <p className="card-text">Enter the data you want to search for</p>
                        </div>
                        <div className="card-col">
                            <div className="card">
                                <FaListUl className='icon' />
                            </div>
                            <p className="card-text">Select the result required from your results</p>
                        </div>
                    </div>
                )}
            </div>
            <div className="home-footer">
                <div className="home-footer-container">
                    <p>© 2024 September. All rights reserved.</p>
                </div>
                {searchQuery && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default Home;
