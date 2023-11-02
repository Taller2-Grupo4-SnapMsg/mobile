import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200

URL_POST_BACK = "https://postsback.onrender.com"
    
const PostHandler = async (content, image, tags) => {
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
                hashtags: tags,
            };
    
            const response = await fetch(`${URL_POST_BACK}/posts`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody),
            });
    
            if (response.status === OK) {
                const post = await response.json();
                return post;
            } else {
                console.error('Fallo el request al back de post:', response.status);
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

export default PostHandler;