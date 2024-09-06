// src/components/tables/Table.js

import React from 'react';
import UserTable from './UserTable';

export const handleSearch = (query, json, setFilteredUsers, setTotalItems, setCurrentPage, setSearchQuery, setQuery) => {
    // Verifica se query é uma string e converte para objeto
    if (typeof query === 'string') {
        query = JSON.parse(query);
    }
    
    let filtered = [];

    // Filtra os usuários baseados na query
    if (query.Users !== undefined) {
        const searchTerm = query.Users.toLowerCase() || '';
        filtered = json.filter(user =>
            user.username.toLowerCase().includes(searchTerm) ||
            user.name.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm)
        );
    }

    // Atualiza os estados relacionados à pesquisa
    setFilteredUsers(filtered);
    setTotalItems(filtered.length); // Total de itens filtrados
    setCurrentPage(1); // Reinicia a página para a primeira
    setSearchQuery(true);
    setQuery(query);
};

export const Table = ({ query, paginatedUsers, handleAddUser }) => {

    if (query.Users === undefined) {
        return null;
    }

    return (
        <div>
            {query.Users !== undefined && (
                <UserTable
                    users={paginatedUsers}
                    onAddUser={handleAddUser}
                />
            )}
        </div>
    );
};
