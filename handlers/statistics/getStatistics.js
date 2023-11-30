import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200
const USER_NOT_FOUND = 404
const USER_BLOCKED = 403

URL_POST_BACK = "https://postsback.onrender.com"
    
const getStatistics = async (from_date_str, to_date_str, navigation) => {
    const token = await AsyncStorage.getItem('token');
    if (token){
        try {
            headers = {
                'Content-Type': 'application/json;charset=utf-8',
                'Accept': 'application/json',
                'token': token,
              };

              const response = await fetch(`${URL_POST_BACK}/posts/statistics/from_date/${from_date_str}/to_date/${to_date_str}`, {
                method: 'GET',
                headers: headers,
              });
            
            if (response.status === OK) {
                const statistics = await response.json();
                return statistics;
            } else if (response.status === USER_NOT_FOUND) {
                Alert.alert('Error', 'I am sorry, your session has expired, please login again');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SignIn' }],
                  });
            } else if (response.status === USER_BLOCKED) {
                Alert.alert('Error', 'I am sorry, your account has been blocked, please contact us for more information');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'SignIn' }],
                  });
            } else {
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

export default getStatistics;
