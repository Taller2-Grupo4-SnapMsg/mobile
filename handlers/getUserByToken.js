/*import AsyncStorage from '@react-native-async-storage/async-storage';
import jwtDecode from 'jwt-decode';

const API_BASE_URL = 'https://loginback-lg51.onrender.com';

const getUserFromToken = async () => {
    try {
        const token = await AsyncStorage.getItem('token');

        if (token) {
            const decodedToken = jwtDecode(token);
            
            const userId = decodedToken.userId;
            
            //const response = await endpoint(`API_BASE_URL${userId}`);
            
            if (response.ok) {
                const userData = await response.json();
                return userData;
            } else {
                throw new Error('Error al obtener los datos del usuario');
            }
        } else {
            throw new Error('Token no encontrado en AsyncStorage');
        }
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return null;
    }
};*/






