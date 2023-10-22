import React, { useEffect, useState } from 'react';
import getFollowersByUsername from '../../handlers/getFollowersByUsername';
import getFollowingByUsername from '../../handlers/getFollowingByUsername';
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
import {
  View,
  FlatList,
  RefreshControl,
  Pressable,
} from 'react-native';

AMOUNT_POST = 10

function formatDate(date) {
  return date.replace("T", "_").split(".")[0];
}

function RemoveMillisecondsFromDateStr(dateStr) {
  const parts = dateStr.split('.');
  if (parts.length === 2) {
    return parts[0];
  }
  return dateStr;
}

export default function Profile() {
  const { loggedInUser } = useUser();
  const route = useRoute();
  const { user_param } = route.params || {};
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (route.params && Object.keys(user_param).length !== 0) {
          setUser(user_param);
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
  return <ProfileUser user={user} />;
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
  const [onlyReposts, setOnlyReposts] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  useFocusEffect( 
    React.useCallback(() => {
      fetchFollowsCount({ user, setFollowsCount: setFollowers, followsFunction: getFollowersByUsername });
      fetchFollowsCount({ user, setFollowsCount: setFollowing, followsFunction: getFollowingByUsername });
    }, [user])
  );

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
    fetchFollowsCount({ user, setFollowsCount: setFollowers, followsFunction: getFollowersByUsername });
    fetchFollowsCount({ user, setFollowsCount: setFollowing, followsFunction: getFollowingByUsername });
  
    setIsFetching(false); 
  };

  const updatePost = (updatedPost) => {
    // Find the index of the post to be updated in the posts array
    const postIndex = posts.findIndex((p) => p.post_id === updatedPost.post_id);
  
    if (postIndex !== -1) {
      // Create a copy of the posts array with the updated post
      const updatedPosts = [...posts];
    
    // Compare the new values with the original post
    const originalPost = updatedPosts[postIndex];
    if (originalPost.text !== updatedPost.text) {
      originalPost.text = updatedPost.text;
    }
    if (originalPost.image !== updatedPost.image) {
      originalPost.image = updatedPost.image;
    }
    if (originalPost.hashtags !== updatedPost.hashtags) {
      originalPost.hashtags = updatedPost.hashtags;
    }
  
      // Update the state with the new posts array
      setPosts(updatedPosts);
    }
  };

  const handlePressEdit = (post) => {
    navigation.navigate('ProfileEditPost', { post: post, updatePost: updatePost });
  };

  const handlePressDelete = async () => {
    return;
  }

  const handleGetMorePosts = async (date, refresh) => {
    if (loadingMore || (reachedEnd && !refresh)) return;

    try {
      setLoadingMore(true);
      setRefreshing(refresh);
      const fetchedPosts = await getPostsProfile(formatDate(date), AMOUNT_POST, user.email, onlyReposts);
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
   }, [onlyReposts]);
  
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
          setOnlyReposts={setOnlyReposts}
          style={{ flex: 1}}
          />
        }
        style={{ flex: 1, maginTop: 0}}
        data={posts} 
        renderItem={({ item }) => {
          if (!item) {
            return null;
          }

          if (item.user_poster.email == item.user_creator.email) {
            return (
              <View style={{ flexDirection: 'row' , justifyContent: 'space-between', alignItems: 'flex-start'}}>
                <Post post={item} style={{ flex: 1}}/>
                {user.email == loggedInUser.email && (
                <View style={{ position: 'absolute', right: 0, top: 0 , marginRight: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Pressable onPress={() => handlePressEdit(item)} style={{ marginRight: 30, marginTop: 15, marginBottom: 10}}>
                      <AntDesign name="edit" size={24} color="gray" />
                    </Pressable>

                    <Pressable onPress={() => handlePressDelete(item)} style={{ marginTop: 15, marginBottom: 15, marginRight: 5}}>
                      <AntDesign name="delete" size={24} color="gray" />
                    </Pressable>
                  </View>
                </View>)}
              </View>);
        } else {
          return (
            <View>
              <Repost post={item} style={{ flex: 1}}/>
              {user.email == loggedInUser.email && (
              <View style={{ position: 'absolute', right: 0, top: 0, marginRight: 10}}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Pressable onPress={() => handlePressDelete(item)} style={{ marginTop: 15, marginBottom: 15, marginRight: 5}}>
                      <AntDesign name="delete" size={24} color="gray" />
                    </Pressable>
                </View>
              </View>)}
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
      {loadingMore && <LoadingMoreIndicator />}
      </View>
  );
}
