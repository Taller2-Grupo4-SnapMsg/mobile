import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200
const USER_BLOCKED = 403
const OTHER_USER_BLOCKED = 405
const USER_NOT_FOUND = 404
URL_POST_BACK = "https://postsback.onrender.com"
    
const SendNotification = async (user_emails_that_receive, 
                                title,
                                body,
                                data) => {
    const token = await AsyncStorage.getItem('token');
    if (token){
        try {
            headers = {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json',
                'token': token,
              };
            const requestBody = {
                user_emails_that_receive: user_emails_that_receive,
                title: title,
                body: body,
                data: data,
            };
    
            const response = await fetch(`${URL_POST_BACK}/notifications/push`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody),
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

export default SendNotification;