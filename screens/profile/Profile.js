import React, { useEffect, useState } from 'react';
import getFollowersByUsername from '../../handlers/getFollowersByUsername';
import getFollowingByUsername from '../../handlers/getFollowingByUsername';
import DeletePost from '../../handlers/posts/deletePost';
import AlertBottomBanner from "../../components/communicating_info/AlertBottomBanner"
import { useNavigation } from '@react-navigation/native';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';
import followUser from '../../handlers/followUser';
import unfollowUser from '../../handlers/unfollowUser';
import { fetchFollowsCount } from '../../functions/Fetchings/fetchFollowsCount';
import { fetchFollowStatus } from '../../functions/Fetchings/fetchFollowStatus';
import checkIfFollowing from '../../handlers/checkIfFollowing';
import checkIfFollower from '../../handlers/checkIfFollower';
import ProfileBanner from '../../components/ProfileBanner';
import { AntDesign } from '@expo/vector-icons';
import getPostsProfile from '../../handlers/posts/getPostsProfile';
import Post from '../../components/posts/Post';
import Repost from '../../components/posts/Repost';
import { useUser } from '../../contexts/UserContext';
import LoadingMoreIndicator from '../../components/LoadingMoreIndicator';
import DeleteRepost from '../../handlers/posts/deleteRepost';
import { fetchSnaps } from '../../functions/Fetchings/fetchSnaps';
import { Text } from 'react-native';
import Modal from 'react-native-modal';
import {
  View,
  FlatList,
  RefreshControl,
  Pressable,
} from 'react-native';
import PurpleButton from '../../components/PurpleButton';
import { StyleSheet } from 'react-native';
import getFavoritePosts from '../../handlers/posts/getFavoritePosts';
AMOUNT_POST = 10
SOFT_GREEN = "#B4D3B2"
SOFT_RED = "#FF5733"
TIMEOUT_ALERT = 2000


function formatDate(date) {
  return date.replace("T", "_").split(".")[0];
}

export default function Profile() {
  const { loggedInUser } = useUser();
  const route = useRoute();
  const { user_param } = route.params || {};
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [alertMessageRepost, setAlertMessage] = useState('');
  const [alerMessageRepostColor, setAlertMessageColor] = useState(true);
  const navigation = useNavigation();
  const [isUserBlocked, setIsUserBlocked] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (route.params && Object.keys(user_param).length !== 0) {
          setUser(user_param);
          const fetchedPosts = await getPostsProfile(formatDate(new Date().toISOString()), AMOUNT_POST, user_param.email, false, loggedInUser.email, navigation);       
          if (fetchedPosts && fetchedPosts[0] === "User blocked") {
            setIsUserBlocked( () => true);
          }
        } else {
          setUser(loggedInUser);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error al obtener usuario:', error);
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [loggedInUser, user_param]);
  
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Spinner
          visible={isLoading}
          textStyle={{ color: '#FFF' }}
        />
      </View>
    );
  }
  return ( isUserBlocked ?
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, color: 'gray' }}>This user is blocked</Text>
    </View> :
    <ProfileUser user={user} />
  ); 
}


function ProfileUser({ user }) {
  const { loggedInUser } = useUser(); 
  const navigation = useNavigation();
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isFollowing, setIsFollowing] = useState(null);
  const [isFollower, setIsFollower] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [posts, setPosts] = useState([]);
  const [latestDate, setLatestDate] = useState((new Date()).toISOString());
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alerMessageColor, setAlertMessageColor] = useState(true);
  const [userSnaps, setUserSnaps] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteButtonsSpinnerYes, setDeleteButtonsSpinnerYes] = useState(false);
  const [deleteButtonsSpinnerNo, setDeleteButtonsSpinnerNo] = useState(false);

  const [allPosts, setAllPosts] = useState(true);
  const [onlyFavs, setOnlyFavs] = useState(false);
  const [onlyReposts, setOnlyReposts] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useEffect(() => {
    fetchFollowsCount({ user, setFollowsCount: setFollowers, followsFunction: getFollowersByUsername });
    fetchFollowsCount({ user, setFollowsCount: setFollowing, followsFunction: getFollowingByUsername });
    fetchSnaps({ user, setSnaps: setUserSnaps });
  }, [user, refreshing]);
  
  const handleEditButton = () => {
    navigation.push('EditProfile', { user: user });
  };

  const handleFollowersButton = () => {
    if (isFollowing && isFollower || (user && loggedInUser && user.email === loggedInUser.email)) {
      navigation.push('FollowersList', { user: user });
    }
  };

  const handleFollowingButton = () => {
    if (isFollowing && isFollower|| (user && loggedInUser && user.email === loggedInUser.email)) {
      navigation.push('FollowingsList', { user: user });
    }
  };

  const handleFollowButton = async () => {
    setIsFetching(true); 
  
    if (isFollowing) {
      await unfollowUser(user.email);
    } else {
      await followUser(user.email);
    }
  
    setIsFollowing(!isFollowing); 
    fetchFollowsCount({ user, setFollowsCount: setFollowers, followsFunction: getFollowersByUsername});
    fetchFollowsCount({ user, setFollowsCount: setFollowing, followsFunction: getFollowingByUsername});
  
    setIsFetching(false); 
  };

  const handlePressEdit = (post) => {
    navigation.navigate('ProfileEditPost', { post: post});
  };


  const handlePressDelete = async () => {
      try {
        if (deletePost.user_poster.email === deletePost.user_creator.email) {
          setDeleteButtonsSpinnerYes(true);
          await DeletePost(deletePost.post_id, navigation);
        } else {
          setDeleteButtonsSpinnerYes(true);
          await DeleteRepost(deletePost.post_id, navigation);
        }
        setRefreshing(true);
        const updatedPosts = posts.filter((p) => p.post_id !== deletePost.post_id);
        setPosts(updatedPosts);
        setDeleteButtonsSpinnerYes(false);
        setDeleteModalVisible(false);
      } catch (error) {
        return;
      }
  };
  
  


  const handleGetMorePosts = async (date, refresh) => {
    if (loadingMore || (reachedEnd && !refresh)) return;

    try {
      setLoadingMore(true);
      setRefreshing(refresh);
      let fetchedPosts = null;
      if (allPosts || onlyReposts) {
        fetchedPosts = await getPostsProfile(formatDate(date), AMOUNT_POST, user.email, onlyReposts, loggedInUser.email, navigation);
      } else if (onlyFavs) {
        fetchedPosts = await getFavoritePosts(user.email, formatDate(date), AMOUNT_POST, navigation, loggedInUser.email);
      }
      if (fetchedPosts && fetchedPosts.length > 0) {
        if (refresh) {
          setPosts(fetchedPosts);
          setRefreshing(false);
          setReachedEnd(false);
        }
        else {setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);}
        setLatestDate(fetchedPosts[fetchedPosts.length - 1].created_at);
      } else {
        setReachedEnd(true);
        setRefreshing(false);
      }
    } catch (error) {
      console.error('Error while loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  };
  useEffect(() => {  
    fetchFollowStatus({ user, setStatus: setIsFollowing, followStatusFunction: checkIfFollowing, setIsFetching });
    fetchFollowStatus({ user, setStatus: setIsFollower, followStatusFunction: checkIfFollower, setIsFetching });
  }, [user]);

  useEffect(() => {  
    handleGetMorePosts((new Date()).toISOString(), true)
   }, [onlyReposts, refreshing, onlyFavs]);
  
   useFocusEffect(
    React.useCallback(() => {
      setRefreshing(true);
      setDeleteModalVisible(false);
      setAllPosts(true);
      setOnlyFavs(false);
      setOnlyReposts(false);
    }, [])
  );

  const onClose = () => {
    setDeleteButtonsSpinnerNo(true);
    setDeleteButtonsSpinnerNo(false);
    setDeleteModalVisible(false);
  }

  const [deletePost, setDeletePost] = useState(null);

  const handleSetDeleteModalVisible = (post) => {
    setDeleteModalVisible(true);
    setDeletePost(post);
  }

  return  (
    <View style={{ flex: 1 , flexDirection: 'column'}}>
      <FlatList
        ListHeaderComponent={
          <ProfileBanner user={user} isFollowing={isFollowing} isFollower={isFollower} 
          isFetching={isFetching} toggleModal={toggleModal} handleEditButton={handleEditButton} 
          handleFollowersButton={handleFollowersButton} handleFollowingButton={handleFollowingButton}
          handleFollowButton={handleFollowButton} followers={followers} following={following} isModalVisible={isModalVisible}
          loggedInUser={loggedInUser} 
          onlyReposts={onlyReposts} 
          snaps = {userSnaps}
          setOnlyReposts={setOnlyReposts}
          setOnlyFavs={setOnlyFavs}
          setAllPosts={setAllPosts}
          onlyFavs={onlyFavs}
          allPosts={allPosts}
          loadingMore={loadingMore}
          />
        }
        data={posts} 
        ListEmptyComponent={() => (
          <View style={styles.noUsersContainer}>
          <Text></Text>
        </View>
        )}
        renderItem={({ item }) => {
          if (!item) {
            return null;
          }

          if (item.user_poster && (item.user_poster.email == item.user_creator.email)) {
            return (
              <View style={{ flexDirection: 'row' , justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <Post post={item} setMessageRepost={setAlertMessage} setMessageRepostColor={setAlertMessageColor} setRefreshing={setRefreshing} style={{ flex: 1}}/>
                {user.email == loggedInUser.email && (
                <View style={{ position: 'absolute', right: 0, top: 0 , marginRight: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Pressable onPress={() => handlePressEdit(item)} style={{ marginRight: 30, marginTop: 19, marginBottom: 10}}>
                      <AntDesign name="edit" size={20} color="gray" />
                    </Pressable>

                    <Pressable onPress={() => handleSetDeleteModalVisible(item)} style={{ marginTop: 18, marginBottom: 15, marginRight: 5}}>
                      <AntDesign name="delete" size={20} color="gray" />
                    </Pressable>

                                  </View>
                </View>)}
                    <Modal
                      animationType="fade"
                      transparent={true}
                      visible={deleteModalVisible}
                      onRequestClose={onClose}
                    >
                      <View style={styles.modalBackground}>
                        <View style={styles.modalContainer}>
                          <Text style={{ textAlign: 'center' }}>Are you sure you want to delete this post?</Text>
                          <View style={styles.buttonContainer}>
                            <PurpleButton onPress={onClose} text="No" loading={deleteButtonsSpinnerNo} />
                            <PurpleButton onPress={() => handlePressDelete()} text="Yes" loading={deleteButtonsSpinnerYes} />
                          </View>
                        </View>
                      </View>
                    </Modal>
              </View>);
        } else {
          return (
            <View>
              <Repost post={item} setMessageRepost={setAlertMessage} setMessageRepostColor={setAlertMessageColor} setRefreshing={setRefreshing} style={{ flex: 1}}/>
              {/*{user.email == loggedInUser.email && (
              <View style={{ position: 'absolute', right: 0, top: 0, marginRight: 10}}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Pressable onPress={() => handlePressDelete(item)} style={{ marginTop: 18, marginBottom: 15, marginRight: 5}}>
                      <AntDesign name="delete" size={20} color="gray" />
                    </Pressable>
                </View>
              </View>)}*/}
            </View>);
        }}}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => handleGetMorePosts((new Date()).toISOString(), true)}
            colors={['#947EB0']}
          />
        }
        onEndReached={() => handleGetMorePosts(latestDate, false)}
        onEndReachedThreshold={0.1}
        />
        {alertMessage && (
          <AlertBottomBanner
            message={alertMessage}
            backgroundColor={alerMessageColor}
            timeout={TIMEOUT_ALERT}
          />
        )}
      {loadingMore && <LoadingMoreIndicator />}
      </View>
  );
}

const styles = StyleSheet.create({
  noUsersContainer: {
    paddingTop: 150,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around', 
    width: '100%', 
    marginTop: 40,
  },
  closeButton: {
    position: 'absolute',
    top: -110,
    right: -35,
  },
});
