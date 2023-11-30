import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const OK = 200
const USER_BLOCKED = 403
const USER_NOT_FOUND = 404

URL_POST_BACK = "https://postsback.onrender.com"

const getPostsProfile = async (oldest_date, n, email, only_repost, navigation) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            const headers = {
                "Content-Type": "application/json",
                'accept': 'application/json',
                'token': token,
            };
            date_str = oldest_date.replace(' ', '_');
            const response = await fetch(`${URL_POST_BACK}/posts/profile/${email}/oldest_date/${date_str}/amount/${n}/only_reposts/?only_reposts=${only_repost}`, {
                method: 'GET',
                headers: headers,
            });
            if (response.status === OK) {
                const post = await response.json();
                return post;
            } else if (response.status === USER_BLOCKED) {
                Alert.alert('Error', 'I am sorry, your account has been blocked, please contact us for more information');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SignIn' }],
                  });
            } else if (response.status === USER_NOT_FOUND) {
                Alert.alert('Error', 'I am sorry, your session has expired, please login again');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SignIn' }],
                  });
            } else {
                console.error('Error al obtener los posts del usuario:', response.status);
            }
        }else {
            throw new Error('Token no encontrado en AsyncStorage');
        }
    } catch (error) {
        console.error('Error al obtener los posts del usuario:', error);
        return null;
    }
};

export default getPostsProfile;