import React from 'react';
import { FaPlus, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import '../../css/UserTable.css';

const UserTable = ({ users, onAddUser, onViewUser, onEditUser, onDeleteUser }) => {
    return (
        <div className="user-table-container">
            <button className="add-user-button" onClick={onAddUser}>
                <FaPlus /> Add New User
            </button>
            <div className="user-container-table">
                {users.length > 0 ? (
                    <table className="user-table">
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Actions</th> {/* Nova coluna para ações */}
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.name}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <button className="action-button" onClick={() => onViewUser(user)}>
                                            <FaEye /> 
                                        </button>
                                        <button className="action-button" onClick={() => onEditUser(user)}>
                                            <FaEdit /> 
                                        </button>
                                        <button className="action-button" onClick={() => onDeleteUser(user.id)}>
                                            <FaTrash /> 
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No users found matching the search criteria.</p>
                )}
            </div>
        </div>
    );
};

export default UserTable;
