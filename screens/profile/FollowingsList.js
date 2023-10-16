import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';
import { ActivityIndicator } from 'react-native'; 
import { useUser } from '../../contexts/UserContext';
import { handleFollowButtonInList } from '../../functions/Buttons/handleFollowButtonInList';
import UsersFlatList from '../../components/UsersFlatList';
import { fetchFollowsData } from '../../functions/Fetchings/fetchFollowData'; 
import getFollowings from '../../handlers/getFollowings';

export default function FollowingsById() {
  const route = useRoute();
  const { user } = route.params;

  if (!user) {
    return <Text>User {user} not found!</Text>;
  }

  return <Followings user={user} />;
}

const Followings = ({ user }) => {
  const navigation = useNavigation();

  const [followings, setFollowings] = useState([]);
  const [followingStatus, setFollowingStatus] = useState({});
  const [isFetchingMap, setIsFetchingMap] = useState({});
  const { loggedInUser } = useUser();

  const [isFetching, setIsFetching] = useState(false); // Set isFetching to false initially

  useFocusEffect(
    React.useCallback(() => {
      fetchFollowsData(getFollowings, setFollowings, setFollowingStatus, setIsFetching, setIsFetchingMap, user);
    }, [user])
  );


  const handleFollowButton = async (itemEmail) => {
    await handleFollowButtonInList(setIsFetchingMap, setFollowingStatus, followingStatus, itemEmail);
  };



  return (
    <View style={styles.container}>
    {isFetching ? (
      <View style={styles.spinnerContainer}>
        <ActivityIndicator size="large" color="#6B5A8E" />
      </View>
    ) : followings.length === 0 ? (
        <Text style={styles.emptyText}>You are not following anyone yet!</Text>
      ) : (
        <UsersFlatList
          list={followings}
          loggedInUser={loggedInUser}
          navigation={navigation}
          isFetchingMap={isFetchingMap}
          followStatus={followingStatus}
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
