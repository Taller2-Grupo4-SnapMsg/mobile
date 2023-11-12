import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200

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
            console.log("SE ENTRA A MANDAR LA NOTIFICACION CON:")
            console.log(user_emails_that_receive)
            console.log(title)
            console.log(body)
            console.log(data)
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

export default SendNotification;