import React, { useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage desde la biblioteca adecuada

const SessionContext = React.createContext();

export function useSession() {
    return useContext(SessionContext);
}

export function SessionProvider({ children }) {
    const [token, setToken] = useState();

    const login = async (credentials) => {
        try {
            // Simula una función de login (reemplaza con tu lógica real)
            const response = await fetch('tu_endpoint_de_login', {
                method: 'POST',
                body: JSON.stringify(credentials),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Error al iniciar sesión');
            }
            const data = await response.json();

            // Almacena el token en AsyncStorage
            await AsyncStorage.setItem('token', data.token);

            setToken(data.token);
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
        }
    };

    const logout = async () => {
        try {
            // Elimina el token de AsyncStorage al cerrar sesión
            await AsyncStorage.removeItem('token');
            setToken(null);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    useEffect(() => {
        const getToken = async () => {
            try {
                // Recupera el token almacenado en AsyncStorage al iniciar la aplicación
                const storedToken = await AsyncStorage.getItem('token');
                setToken(storedToken);
            } catch (error) {
                console.error('Error al recuperar el token:', error);
            }
        };
        getToken(); // Llama a la función al cargar el componente
    }, []);

    return (
        <SessionContext.Provider
            value={{ token, logout, login }}>
            {children}
        </SessionContext.Provider>
    );
}

export function WithSession({ children }) {
    const { token } = useContext(SessionContext);
    if (token) {
        return children;
    }
    return null;
}

export function WithoutSession({ children }) {
    const { token } = useContext(SessionContext);
    if (!token) {
        return children;
    }
    return null;
}