
import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200

URL_POST_BACK = "https://postsback.onrender.com"
    
const getPosts = async (oldest_date, n) => {
    const token = await AsyncStorage.getItem('token');
    if (token){
        try {
            headers = {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json',
                'token': token,
              };
              date_str = oldest_date.replace(' ', '_');
              console.log("date_str:", date_str)
              const response = await fetch(`${URL_POST_BACK}/posts/feed/${date_str}/amount/${n}`, {
                method: 'GET',
                headers: headers,
              });
            console.log("response:", response)
            if (response.status === OK) {
                const post = await response.json();
                return post;
            } else {
                //console.log("aaaaaaaaaaaaaaaError en getPosts");
                console.error('Fallo el request al back de getPosts:', response.status);
            }
        } catch (error) {
            //console.log("aaaaaaaaaaaaaaaError en getPosts");
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