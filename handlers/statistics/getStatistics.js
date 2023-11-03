import AsyncStorage from '@react-native-async-storage/async-storage';

const OK = 200

URL_POST_BACK = "https://postsback.onrender.com"
    
const getStatistics = async (from_date_str, to_date_str) => {
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
