import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import getFollowers from '../../handlers/getFollowers';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../../UserContext';
import { fetchFollowsData } from '../../handlers/Fetchings/fetchFollowData'; 
import { handleFollowButtonInList } from '../../handlers/Buttons/handleFollowButtonInList'; 
import UsersFlatList from '../../components/UsersFlatList';

export default function FollowersById() {
  const route = useRoute();
  const { user } = route.params;
  if (!user) {
    return <Text>User {user} not found!</Text>;
  }

  return <Followers user={user} />;
}

const Followers = ({ user }) => {
  const navigation = useNavigation();

  const [followers, setFollowers] = useState([]);
  const [followerStatus, setFollowersStatus] = useState({});
  const [isFetchingMap, setIsFetchingMap] = useState({});
  const { loggedInUser } = useUser();

  const [isFetching, setIsFetching] = useState(false); 
  

  useFocusEffect(
    React.useCallback(() => {
      fetchFollowsData(getFollowers, setFollowers, setFollowersStatus, setIsFetching, setIsFetchingMap, user);
    }, [user])
  );

  const handleFollowButton = async (itemEmail) => {
    await handleFollowButtonInList(setIsFetchingMap, setFollowersStatus, followerStatus, itemEmail);
  };

  return (
    <View style={styles.container}>
       {isFetching ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#6B5A8E" />
        </View>
  ) : followers.length === 0 ? (
        <Text style={styles.emptyText}>You have no followers yet!</Text>
      ) : (
        <UsersFlatList
          list={followers}
          loggedInUser={loggedInUser}
          navigation={navigation}
          isFetchingMap={isFetchingMap}
          followStatus={followerStatus}
          handleFollowButton={handleFollowButton}/>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 100,
    color: '#6B5A8E',
  },
});
