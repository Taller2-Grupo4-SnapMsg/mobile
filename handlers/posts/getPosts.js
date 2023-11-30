
// Cambiar cuando este el post del feed
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
const OK = 200
const USER_BLOCKED = 403
const USER_NOT_FOUND = 404

URL_POST_BACK = "https://postsback.onrender.com"
    
const getPosts = async (oldest_date, n, navigation) => {
    const token = await AsyncStorage.getItem('token');
    if (token){
        try {
            headers = {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json',
                'token': token,
              };
              date_str = oldest_date.replace(' ', '_');
              const response = await fetch(`${URL_POST_BACK}/posts/feed/oldest_date/${date_str}/amount/${n}`, {
                method: 'GET',
                headers: headers,
              });
            if (response.status === OK) {
                const posts = await response.json();
                return posts;
            } else if (response.status === USER_NOT_FOUND) {
                Alert.alert('Error', 'I am sorry, your session has expired, please login again');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SignIn' }],
                  });
            } else if (response.status === USER_BLOCKED) {
                Alert.alert('Error', 'I am sorry, your account has been blocked, please contact us for more information');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SignIn' }],
                  });
            } else {
                console.error('Error al obtener posts:', response.status);
            }
        } catch (error) {

            const message =
            error.response?.data?.error ||
            error.message ||
            'Service is not available at the moment';
            console.log(message);
            throw new Error(message);
        }
    }
};

export default getPosts;