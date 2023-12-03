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
import { useUser } from '../../contexts/UserContext';
import { fetchFollowsData } from '../../functions/Fetchings/fetchFollowData'; 
import { handleFollowButtonInList } from '../../functions/Buttons/handleFollowButtonInList'; 
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
    await handleFollowButtonInList(setIsFetchingMap, setFollowersStatus, followerStatus, itemEmail, navigation);
  };

  return (
    <View style={styles.container}>
       {isFetching ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#6B5A8E" />
        </View>
  ) : followers && followers.length === 0 ? (
        <View style={styles.noUsersContainer}>
          <Text>No users found.</Text>
        </View>
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
  noUsersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
