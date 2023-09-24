import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://loginback-lg51.onrender.com';
const OK = 200;
const USER_NOT_FOUND = 404;

const getUserByToken = async () => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            console.log(token)
            const headers = {
                'Content-Type': 'application/json;charset=utf-8',
                Authorization: `Bearer ${token}`,
                //'Access-Control-Allow-Origin': '*',
            };
                            
            const response = await fetch('https://loginback-lg51.onrender.com/get_user_by_token/', {
                method: 'GET',
                headers: headers,
              });
            
            if (response.status === OK) {
                console.log(response)
                const user = await response.json();
                return user;
            } else {
                console.log(response.status)
                throw new Error('Error al obtener los datos del usuario');
            }
        } else {
            throw new Error('Token no encontrado en AsyncStorage');
        }
    } catch (error) {
        console.error('Error al obtener el usuario:', error);
        return null;
    }
};

export default getUserByToken;



