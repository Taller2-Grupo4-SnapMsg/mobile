
// Cambiar cuando este el post del feed
import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200
const USER_BLOCKED = 403
const USER_NOT_FOUND = 404

URL_POST_BACK = "https://postsback.onrender.com"

const getTrendingTopics = async (amount, offset, days) => {
    const token = await AsyncStorage.getItem('token');
    if (token){
        try {
            headers = {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json',
                'token': token,
              };
              const response = await fetch(`${URL_POST_BACK}/trending_topics?offset=${offset}&ammount=${amount}&days=${days}`, {
                method: 'GET',
                headers: headers,
              });
            if (response.status === OK) {
                const posts = await response.json();
                return posts;
            } if (response.status === USER_BLOCKED || response.status === USER_NOT_FOUND) {
                return [];
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

export default getTrendingTopics;