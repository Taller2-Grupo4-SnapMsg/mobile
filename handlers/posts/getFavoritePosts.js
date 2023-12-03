import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
const OK = 200;
const USER_BLOCKED = 403;
const USER_NOT_FOUND = 404;
const OTHER_USER_BLOCKED = 405;

URL_POST_BACK = "https://postsback.onrender.com"

const getFavoritePosts = async (mail, oldest_date, n, navigation, loggedInUserMail) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            const headers = {
                "Content-Type": "application/json",
                'accept': 'application/json',
                'token': token,
            };
            date_str = oldest_date.replace(' ', '_');
            const response = await fetch(`${URL_POST_BACK}/favorites/profile/${mail}/oldest_date/${date_str}/amount/${n}`, {
                method: 'GET',
                headers: headers,
            });
            if (response.status === OK) {
                const post = await response.json();
                return post;
            } else if (response.status === OTHER_USER_BLOCKED) {
                if (loggedInUserMail === mail) {
                    console.log('User blocked');
                    Alert.alert('User blocked', 'You have been blocked by an administrator');
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'SignIn' }],
                    });
                }
            } else if (response.status === USER_NOT_FOUND) {
                Alert.alert('Session expired', 'Your session has expired, please log in again');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SignIn' }],
                });
            } else if (response.status === USER_BLOCKED) {
                Alert.alert('User blocked', 'You have been blocked by an administrator');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SignIn' }],
                });
            }
        }else {
            throw new Error('Token no encontrado en AsyncStorage');
        }
    } catch (error) {
        console.error('Error al obtener los posts del usuario:', error);
        return null;
    }
}

export default getFavoritePosts;