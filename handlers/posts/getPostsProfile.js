import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200;

URL_POST_BACK = "https://postsback.onrender.com"

const getPostsProfile = async (user_id, oldest_date, n) => {
    try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
            const headers = {
                "Content-Type": "application/json",
                'accept': 'application/json',
                'token': token,
            };
            //console.log("user_id: ", user_id)
            date_str = oldest_date.replace(' ', '_');
            if (user_id){
                const response = await fetch(`${URL_POST_BACK}/posts/profile/${user_id}/${date_str}/amount/${n}`, {
                    method: 'GET',
                    headers: headers,
                });
                if (response.status === OK) {
                    const post = await response.json();
                    //console.log(post);
                    return post;
                } else {
                    throw new Error('Error al obtener los posts del usuario: ' ,response.status);
                }
            } else {
                const response = await fetch(`${URL_POST_BACK}/posts/profile/${date_str}/amount/${n}`, {
                    method: 'GET',
                    headers: headers,
                });
                if (response.status === OK) {
                    const post = await response.json();
                    //console.log(post);
                    return post;
                } else {
                    throw new Error('Error al obtener los posts del usuario: ' ,response.status);
                }
            }
            //console.log("response: ", response)

        } else {
            throw new Error('Token no encontrado en AsyncStorage');
        }
    } catch (error) {
        console.error('Error al obtener los posts del usuario:', error);
        return null;
    }
};

export default getPostsProfile;