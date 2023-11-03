import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Alert,
  FlatList,
  Text
} from 'react-native';
import { useUser } from '../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { handleSearch } from '../../functions/Buttons/handleSearchButton';
import { handleFollowButtonInList } from '../../functions/Buttons/handleFollowButtonInList';
import { handleShowMore } from '../../functions/Buttons/handleShowMore';
import UserSearchFlatList from '../../components/UserSearchFlatList';
import SearchBar from '../../components/SearchBar';
import RoundedCheckboxButton from '../../components/RoundedCheckBox';
import searchPostsByHashtag from '../../handlers/posts/searchPostsByHashtag';
import Post from '../../components/posts/Post';
import searchPostsByText from '../../handlers/posts/searchPostsByText';

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
  const [postsByHashtags, setPostsByHashtags] = useState([]);
  const [postsByText, setPostsByText] = useState([]);
  const [alertMessageRepost, setAlertMessage] = useState('');
  const [alerMessageRepostColor, setAlertMessageColor] = useState(true);
  
  const handleSearchButton = async () => {
    if (searchByUsername) {
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
    } else if (searchByHashtag) {
      if (searchText !== '') {
        setIsFetching(true); 
        posts_fetched = await searchPostsByHashtag(searchText, offset, ammount);
        setPostsByHashtags(posts_fetched);
        setSearched(true); 
        setIsFetching(false);
      } else {
        Alert.alert('Please enter a text to search');
      }
    } else if (searchByText) {
      if (searchText !== '') {
        setIsFetching(true); 
        console.log('searching text');
        posts_fetched = await searchPostsByText(searchText, offset, ammount);
        console.log('posts_fetched: ', posts_fetched);
        setPostsByText(posts_fetched);
        setSearched(true);
        setIsFetching(false); 
      } else {
        Alert.alert('Please enter a text to search');
      }
    } else {
      Alert.alert('Please select a search type');
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
  const [searchByUsername, setSearchByUsername] = useState(false);
  const [searchByHashtag, setSearchByHashtag] = useState(false);
  const [searchByText, setSearchByText] = useState(false);
  const [checkboxSelected, setCheckboxSelected] = useState(false);

  const handleSetSearchByUsername = () => {
    if (!checkboxSelected) {
      setSearchByUsername(!searchByUsername);
      setCheckboxSelected(true);
    } else if (checkboxSelected && !searchByUsername) {
      setSearchByUsername(!searchByUsername);
      setSearchByHashtag(false);
      setSearchByText(false);
    } 
  }

  const handleSetSearchByHashtag = () => {
    if (!checkboxSelected) {
      setSearchByHashtag(!searchByHashtag);
      setCheckboxSelected(true);
    } else if (checkboxSelected && !searchByHashtag) {
      setSearchByHashtag(!searchByHashtag);
      setSearchByUsername(false);
      setSearchByText(false);
    } 
  }

  const handleSetSearchByText = () => {
    if (!checkboxSelected) {
      setSearchByText(!searchByText);
      setCheckboxSelected(true);
    } else if (checkboxSelected && !searchByText) {
      setSearchByText(!searchByText);
      setSearchByUsername(false);
      setSearchByHashtag(false);
    } 
  }

  return (
    <View style={styles.container}>
      <View style={styles.checkBoxesContainer}>
        <RoundedCheckboxButton text="Users" isChecked={searchByUsername} onToggle={handleSetSearchByUsername} />
        <RoundedCheckboxButton text="Hashtags" isChecked={searchByHashtag} onToggle={handleSetSearchByHashtag} />
        <RoundedCheckboxButton text="Text" isChecked={searchByText} onToggle={handleSetSearchByText} />
      </View>
      <SearchBar
        searchText={searchText}
        setSearchText={setSearchText}
        handleSearchButton={handleSearchButton}
      />
      {isFetching ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="#6B5A8E" />
        </View>
      ) : (
        searchByUsername ? (
          users.length === 0 ? (
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
          )
        ) : searchByHashtag ? (
          postsByHashtags.length === 0 ? (
            <View style={styles.noUsersContainer}>
              <Text>No posts found.</Text>
            </View>
          ) : (
          <FlatList
          data={postsByHashtags}
          renderItem={({ item }) => {
            if (item.user_poster.email == item.user_creator.email) {
              return <Post post={item} setAlertMessage={setAlertMessage} setAlertMessageColor={setAlertMessageColor}/>;
            } 
          }}
          />
          )
        ) :  (
          postsByText.length === 0 ? (
            <View style={styles.noUsersContainer}>
              <Text>No posts found.</Text>
            </View>
          ) : (
          <FlatList
          data={postsByText}
          renderItem={({ item }) => {
            if (item.user_poster.email == item.user_creator.email) {
              return <Post post={item} setAlertMessage={setAlertMessage} setAlertMessageColor={setAlertMessageColor}/>;
            } 
          }}
          />
          )
        )
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
  checkBoxesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
});
