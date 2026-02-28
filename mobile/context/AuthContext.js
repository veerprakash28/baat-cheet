import React, { createContext, useState, useEffect, useContext } from 'react';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

const AuthContext = createContext();

// Replace with your local IP for physical device testing
export const API_URL = 'http://localhost:5000/api';

// Cross-platform storage helper (SecureStore on native, localStorage on web)
const storage = {
    getItem: async (key) => {
        if (Platform.OS === 'web') {
            return localStorage.getItem(key);
        }
        return await SecureStore.getItemAsync(key);
    },
    setItem: async (key, value) => {
        if (Platform.OS === 'web') {
            localStorage.setItem(key, value);
        } else {
            await SecureStore.setItemAsync(key, value);
        }
    },
    deleteItem: async (key) => {
        if (Platform.OS === 'web') {
            localStorage.removeItem(key);
        } else {
            await SecureStore.deleteItemAsync(key);
        }
    },
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStoredData();
    }, []);

    const loadStoredData = async () => {
        try {
            const storedToken = await storage.getItem('userToken');
            const storedUser = await storage.getItem('userData');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch (e) {
            console.log("Error loading stored auth data", e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
            if (data.success) {
                await storage.setItem('userToken', data.token);
                await storage.setItem('userData', JSON.stringify(data));
                setToken(data.token);
                setUser(data);
                return { success: true };
            }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Login failed" };
        }
    };

    const register = async (username, email, password) => {
        try {
            const { data } = await axios.post(`${API_URL}/auth/register`, { username, email, password });
            if (data.success) {
                await storage.setItem('userToken', data.token);
                await storage.setItem('userData', JSON.stringify(data));
                setToken(data.token);
                setUser(data);
                return { success: true };
            }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || "Registration failed" };
        }
    };

    const logout = async () => {
        await storage.deleteItem('userToken');
        await storage.deleteItem('userData');
        setToken(null);
        setUser(null);
    };

    const authAxios = axios.create({
        baseURL: API_URL,
    });

    authAxios.interceptors.request.use(
        async (config) => {
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return (
        <AuthContext.Provider value={{ user, token, loading, login, register, logout, authAxios }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
