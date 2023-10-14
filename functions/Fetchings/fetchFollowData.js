import React from 'react';
import checkIfFollowing from '../../handlers/checkIfFollowing';

export async function fetchFollowsData(
    getFollowersFn,
    setFollowersFn,
    setFollowersStatusFn,
    setIsFetchingFn,
    setIsFetchingMapFn,
    user
  ) {
    try {
      setIsFetchingFn(true); // Set isFetching to true when starting to fetch
      setIsFetchingMapFn({});
      const fetchedFollowers = await getFollowersFn(user.email);
      setFollowersFn(fetchedFollowers);
      const initialFollowerStatus = {};
      const followersEmails = fetchedFollowers.map((follower) => follower.email);
  
      const followStatusPromises = followersEmails.map(async (followerEmail) => {
        setIsFetchingMapFn((prevIsFetchingMap) => ({
          ...prevIsFetchingMap,
          [followerEmail]: true,
        }));
  
        const isUserFollower = await checkIfFollowing(followerEmail);
  
        setIsFetchingMapFn((prevIsFetchingMap) => ({
          ...prevIsFetchingMap,
          [followerEmail]: false,
        }));
  
        return { email: followerEmail, isFollowing: isUserFollower };
      });
  
      const followerStatusArray = await Promise.all(followStatusPromises);
  
      followerStatusArray.forEach((status) => {
        initialFollowerStatus[status.email] = status.isFollowing;
      });
  
      setFollowersStatusFn(initialFollowerStatus);
    } catch (error) {
      console.error('Error al obtener los followings:', error);
    } finally {
      setIsFetchingFn(false); // Set isFetching to false when done fetching
    }
  };


