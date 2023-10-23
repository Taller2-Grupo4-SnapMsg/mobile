import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  Text, 
} from 'react-native';
import { useUser } from '../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { handleSearch } from '../../functions/Buttons/handleSearchButton';
import { handleFollowButtonInList } from '../../functions/Buttons/handleFollowButtonInList';
import { handleShowMore } from '../../functions/Buttons/handleShowMore';
import UserSearchFlatList from '../../components/UserSearchFlatList';
import SearchBar from '../../components/SearchBar';

export default function SearchUser() {
  const [searchText, setSearchText] = useState('');
  const [ammount, setAmmount] = useState(1);
  const [offset, setOffset] = useState(0);
  const [users, setUsers] = useState([]);
  const [isFetchingMap, setIsFetchingMap] = useState({});
  const [followingStatus, setFollowingStatus] = useState({});
  const { loggedInUser } = useUser();
  const navigation = useNavigation();
  const [isFetching, setIsFetching] = useState(false);
  const [showMoreVisible, setShowMoreVisible] = useState(false);
  const [searchingText, setSearchingText] = useState('');
  const [searched, setSearched] = useState(false);

  const handleSearchButton = async () => {
    if (searchText !== '') {
      handleSearch(
        searchText,
        setOffset,
        setIsFetching,
        setUsers,
        setShowMoreVisible,
        setSearchingText,
        ammount,
        setFollowingStatus,
        setIsFetchingMap,
      );
      setSearched(true); 
    } else {
      Alert.alert('Please enter a text to search');
    }
  };

  const handleFollowButton = async (itemEmail) => {
    handleFollowButtonInList(
      setIsFetchingMap,
      setFollowingStatus,
      followingStatus,
      itemEmail,
    );
  };

  const handleShowMoreButton = async () => {
    handleShowMore(
      offset,
      setOffset,
      setIsFetching,
      setUsers,
      setShowMoreVisible,
      searchingText,
      ammount,
      setFollowingStatus,
      setIsFetchingMap,
    );
  };

  return (
    <View style={styles.container}>
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearchButton={handleSearchButton}
      />
      {isFetching ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#6B5A8E" />
        </View>
      ) : users.length === 0 && searched ? (
        <View style={styles.noUsersContainer}>
          <Text>No users found.</Text>
        </View>
      ) : (
        <UserSearchFlatList
          users={users}
          loggedInUser={loggedInUser}
          handleFollowButton={handleFollowButton}
          showMoreVisible={showMoreVisible}
          handleShowMoreButton={handleShowMoreButton}
          followingStatus={followingStatus}
          isFetchingMap={isFetchingMap}
          navigation={navigation}
        />
      )}
    </View>
  );
}

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
  },
});
