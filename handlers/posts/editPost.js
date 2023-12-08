import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
const OK = 200
const USER_BLOCKED = 403
const USER_NOT_FOUND = 404

URL_POST_BACK = "https://postsback.onrender.com"
    
const editPostHandler = async (post_id, image, content, hashtags, mentions, navigation) => {
    const token = await AsyncStorage.getItem('token');
    if (token){
        try {
            headers = {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json',
                'token': token,
              };
            const encodedImage = encodeURIComponent(image);
            const requestBody = {
                content: content,
                image: encodedImage,
                hashtags: hashtags,
                mentions: mentions,
            };
    
            const response = await fetch(`${URL_POST_BACK}/posts/${post_id}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(requestBody),
            });
    
            if (response.status === OK) {
                const post = await response.json();
                return post;
            } else if (response.status === USER_BLOCKED) {
                Alert.alert('User blocked', 'You have been blocked by an administrator');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SignIn' }],
                });
            } else if (response.status === USER_NOT_FOUND) {
                Alert.alert('Session expired', 'Your session has expired, please log in again');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SignIn' }],
                });
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

export default editPostHandler;