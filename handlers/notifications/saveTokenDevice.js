import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200
const OTHER_USER_BLOCKED = 405
const USER_NOT_FOUND = 404
const USER_BLOCKED = 403
URL_POST_BACK = "https://postsback.onrender.com"
    
const SaveTokenDevice = async (device_token) => {
    const token = await AsyncStorage.getItem('token');
    if (token){
        try {
            headers = {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json',
                'token': token,
              };
    
            const response = await fetch(`${URL_POST_BACK}/notifications/save/${device_token}`, {
                method: 'POST',
                headers: headers,
            });
    
            if (response.status === OK) {
                const post = await response.json();
                return post;
            } else if (response.status === USER_BLOCKED) {
                return null;
            } else if (response.status === USER_NOT_FOUND) {
                return null;
            } else if (response.status === OTHER_USER_BLOCKED) {
                return null;
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

export default SaveTokenDevice;