import { StyleSheet, FlatList, View, Pressable, RefreshControl} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import React, {useState, useEffect} from 'react'; 
import LoadingMoreIndicator from "../../../components/LoadingMoreIndicator";
import { useUser } from '../../../contexts/UserContext';
import {
  DarkTheme,
  ThemeProvider,
} from '@react-navigation/native';
import getUserRecommendation from "../../../handlers/user_recomendation/getUserRecommendation"
import RecommendedUser from "./RecommendedUser"
import { handleFollowButtonInList } from '../../../functions/Buttons/handleFollowButtonInList';

const AMOUNT_NOTIFICATIONS = 10;

const UserRecommendation = () => {
    const { loggedInUser } = useUser();
    const colorScheme = useColorScheme();
    const navigation = useNavigation();
    const [users, setUsers] = useState([]);
    const [offset, setOffset] = useState(0);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [reachedEnd, setReachedEnd] = useState(false);

    const [followingStatus, setFollowingStatus] = useState({});
    const [isFetchingMap, setIsFetchingMap] = useState({});

    const handlePressPlus = () => {
      navigation.navigate('NewPost');
    };

    const handleGetMoreUsers = async (offset, refresh) => {
        if (loadingMore || (reachedEnd && !refresh)) return;
        
        try {
            setLoadingMore(true);
            setRefreshing(refresh);
        
            const fetchedUsers = await getUserRecommendation(AMOUNT_NOTIFICATIONS, offset, navigation);

            if (fetchedUsers && fetchedUsers.length > 0) {
              if (refresh) {
                  setUsers(fetchedUsers);
                  setRefreshing(false);
                  setReachedEnd(false);
              } else {
                  setUsers((prevUsers) => [...prevUsers, ...fetchedUsers]);
              }
              setOffset(offset + AMOUNT_POST);
            } else {
              setReachedEnd(true);
            }
        } catch (error) {
            console.error('Error while loading more users:', error);
        } finally {
            setLoadingMore(false);
        }
    };

    const handleFollowButton = async (itemEmail) => {
      await handleFollowButtonInList(setIsFetchingMap, setFollowingStatus, followingStatus, itemEmail);
    };

    useEffect(() => {  
      handleGetMoreUsers(0, true)
     }, []);

    
   return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DarkTheme}>
      <View style={styles.container}>
        <FlatList
          data={users}
          renderItem={({ item }) => {
            return <RecommendedUser 
                    item={item}
                    loggedInUser={loggedInUser}
                    navigation={navigation}
                    isFetchingMap={isFetchingMap}
                    followingStatus={followingStatus}
                    handleFollowButton={handleFollowButton}/>

            }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => handleGetMoreUsers(0, true)}
              colors={['#947EB0']}
            />
          }
          onEndReached={() => handleGetMoreUsers(offset, false)}
          onEndReachedThreshold={0.1}
          />
        {loadingMore && <LoadingMoreIndicator />}
      </View>
    </ThemeProvider>
   );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  notificationContainer: {
    borderRadius: 8,
  },
  itemContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },

  image: {
    width: 56,
    height: 56,
    borderRadius: 50,
  },
  textContainer: {
    marginLeft: 16,
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  usernameText: {
    fontSize: 14,
    color: '#6B5A8E',
  },
  followButton: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 50,
    backgroundColor: '#6B5A8E',
  },
  followButtonText: {
    color: 'white',
  },
  bioText: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },

});

export default UserRecommendation;