
// Cambiar cuando este el post del feed
import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200

URL_POST_BACK = "https://postsback.onrender.com"

const getPostsOnATrendingTopic = async (hashtag, amount, offset) => {
    const token = await AsyncStorage.getItem('token');
    if (token){
        try {
            headers = {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json',
                'token': token,
              };
              const response = await fetch(`${URL_POST_BACK}/posts/trending_topic/${hashtag}?offset=${offset}&ammount=${amount}`, {
                method: 'GET',
                headers: headers,
              });
            if (response.status === OK) {
                const posts = await response.json();
                return posts;
            } else {
                console.error('Fallo el request al back de getPosts:', response.status);
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

export default getPostsOnATrendingTopic;