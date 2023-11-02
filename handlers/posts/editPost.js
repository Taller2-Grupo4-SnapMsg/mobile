import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200

URL_POST_BACK = "https://postsback.onrender.com"
    
const editPostHandler = async (post_id, image, content, hashtags) => {
    const token = await AsyncStorage.getItem('token');
    if (token){
        try {
            headers = {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json',
                'token': token,
              };
            console.log("Image: ", image);
            const encodedImage = encodeURIComponent(image);
            console.log("Image encodeada: ", image);
            const requestBody = {
                content: content,
                image: encodedImage,
                hashtags: hashtags,
            };
    
            const response = await fetch(`${URL_POST_BACK}/posts/${post_id}`, {
                method: 'PUT',
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

export default editPostHandler;