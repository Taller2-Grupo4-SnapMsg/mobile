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
import {
  View,
  FlatList,
  RefreshControl,
  Pressable,
} from 'react-native';

import editPostHandler from '../../handlers/posts/editPost';
import ProfileEditPost from '../../components/ProfileEditPost';
import { AntDesign } from '@expo/vector-icons';
import getPostsMyProfile from '../../handlers/posts/getPostsMyProfile';
import Post from '../../components/Post';
import { useUser } from '../../contexts/UserContext';

AMOUNT_POST = 10

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;
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
  const [isStarting, setIsStarting] = useState(true);
  const [posts, setPosts] = useState([]);
  const [latestDate, setLatestDate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [isEditPopupVisible, setEditPopupVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

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

  const handlePressEdit = async (post) => {
    try {
      // Show the EditPopup
      setSelectedPost(post);
      setEditPopupVisible(true);
    } catch (error) {
      console.error('Error while editing the post:', error);
    }
  }

  const handleSaveEdit = async  (edited_post) => {
    // Update the post content here (you may implement your logic)
    // For demonstration, we'll just log the edited content
    try {
      // Show the EditPopup
      await editPostHandler(post);
      setEditPopupVisible(false);
    } catch (error) {
      console.error('Error while saving the edited post:', error);
    }
  };

  const handlePressDelete = async () => {
    return;
  }

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      const fetchedPosts = await getPostsMyProfile(formatDate(new Date()), AMOUNT_POST);
      if (fetchedPosts) {
        setPosts(fetchedPosts);
        setLatestDate(posts[posts.length - 1].posted_at);
      }
    } catch (error) {
      console.error('Error while loading posts:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const handleStarting = async () => {
    try {
      setIsStarting(true);
      const fetchedPosts = await getPostsMyProfile(formatDate(new Date()), AMOUNT_POST);
      if (fetchedPosts) {
        setPosts(fetchedPosts);
        setLatestDate(posts[posts.length - 1].posted_at);
      }
    } catch (error) {
      console.error('Error while loading posts:', error);
    }
    finally {
      setIsStarting(false);
    }
  };
 
  useEffect(() => {
    handleStarting();
  }, []);

  useEffect(() => {  
    fetchFollowStatus({ user, setStatus: setIsFollowing, followStatusFunction: checkIfFollowing, setIsFetching });
    fetchFollowStatus({ user, setStatus: setIsFollower, followStatusFunction: checkIfFollower, setIsFetching });
  }, [user]);
  

  return  ( 
    !isStarting && (
    <View style={{ flex: 1 }}>
      <ProfileBanner user={user} isFollowing={isFollowing} isFollower={isFollower} 
        isFetching={isFetching} toggleModal={toggleModal} handleEditButton={handleEditButton} 
        handleFollowersButton={handleFollowersButton} handleFollowingButton={handleFollowingButton}
        handleFollowButton={handleFollowButton} followers={followers} following={following} isModalVisible={isModalVisible}
        loggedInUser={loggedInUser}
      />
       <FlatList
        style={{ flex: 1, marginTop: -200, marginLeft: 10, marginRight: 10  }}
        scrollIndicatorInsets={{ right: 1 }} // Adjust the right inset as needed
        data={posts}
        renderItem={({ item }) => {
          if (!item) {
            return null;
          }
      
          return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, paddingLeft: 10, paddingRight: 30 }}>
              <Post post={item} />
              <View style={{ flexDirection: 'column', alignItems: 'flex-end', marginRight: 10 }}>
              <Pressable onPress={() => handlePressEdit(item)} style={{ marginTop: 15, marginBottom: 15 }}>
                  <AntDesign name="edit" size={24} color="gray" />
                </Pressable>
      
                <Pressable onPress={() => handlePressDelete(item)}>
                  <AntDesign name="delete" size={24} color="gray" />
                </Pressable>
              </View>
            </View>
          );
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#947EB0']} // Customize the loading spinner color(s)
          />
        }
      /> 
      <ProfileEditPost
        isVisible={isEditPopupVisible}
        onCancel={() => setEditPopupVisible(false)}
        onSave={handleSaveEdit}
      />
    </View>
  ));
}