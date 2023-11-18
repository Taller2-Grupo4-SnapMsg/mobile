import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import SearchBar from './SearchBar';
import { useState } from 'react';
import UserSearchForMentionFlatList from './UserSearchForMentionFlatList';
import { useUser } from '../contexts/UserContext';
import { handleSearch } from '../functions/Buttons/handleSearchButton';
import { ActivityIndicator } from 'react-native';
import { handleShowMore } from '../functions/Buttons/handleShowMore';
import { Alert } from 'react-native';

export default function MentionModal({ isVisible, onClose, setSelectedMentions, selectedMentions, in_followers }) {
  const [searchText, setSearchText] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [showMoreVisible, setShowMoreVisible] = useState(false);
  const [searchingText, setSearchingText] = useState('');
  const [searched, setSearched] = useState(false);
  const [ammount, setAmmount] = useState(1);
  const [offset, setOffset] = useState(0);
  const [isFetchingMap, setIsFetchingMap] = useState({});
  const [followingStatus, setFollowingStatus] = useState({});
  const { loggedInUser } = useUser();
    
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
      in_followers,
    );
  };

  const [users, setUsers] = useState([]);

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
          in_followers,
        );
        setSearched(true); 
      } else {
        Alert.alert('Please enter a text to search');
      }

  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
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
          users.length === 0 ? (
            <View style={styles.noUsersContainer}>
              <Text>No users found.</Text>
            </View>
          ) : (
            <UserSearchForMentionFlatList
              users={users}
              showMoreVisible={showMoreVisible}
              handleShowMoreButton={handleShowMoreButton}
              setSelectedMentions={setSelectedMentions}
              selectedMentions={selectedMentions} 
            />
            )
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Feather name="x" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    height: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    width: '100%', 
    marginTop: 40,
  },
  closeButton: {
    position: 'absolute',
    top: -630,
    right: -35,
  },
});

