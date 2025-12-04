import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialUsers } from '../utils/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user on mount
        const storedUser = localStorage.getItem('mcmp_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (email, password) => {
        // TODO: BACKEND - Replace with API call (e.g., POST /api/auth/login)
        // const response = await api.post('/auth/login', { email, password });

        const foundUser = initialUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

        if (foundUser) {
            // Don't store password in state/localstorage
            const { password, ...safeUser } = foundUser;
            setUser(safeUser);
            localStorage.setItem('mcmp_user', JSON.stringify(safeUser));
            return { success: true };
        } else {
            return { success: false, message: 'Invalid email or password' };
        }
    };

    const logout = () => {
        // TODO: BACKEND - Optional: Call logout endpoint (e.g., POST /api/auth/logout)
        setUser(null);
        localStorage.removeItem('mcmp_user');
    };

    const updateUser = (updatedData) => {
        // TODO: BACKEND - Replace with API call (e.g., PUT /api/users/:id)
        // await api.put(`/users/${user.id}`, updatedData);

        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
        localStorage.setItem('mcmp_user', JSON.stringify(updatedUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, updateUser, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
