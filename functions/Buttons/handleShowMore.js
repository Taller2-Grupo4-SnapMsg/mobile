import React from 'react';
import searchUserByUsername from '../../handlers/searchUserByUsername';
import checkIfFollowing from '../../handlers/checkIfFollowing';

export async function handleShowMore(
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
  navigation,
) {
  const newOffset = offset + ammount; 
  setOffset(newOffset);
  setIsFetching(true);
  try {
    const response = await searchUserByUsername(searchingText, newOffset, ammount, in_followers, navigation);
    if (response) {
      if (response.length < ammount) {
        setShowMoreVisible(false);
      }

      const users_emails = response.map((user) => user.email);
      const followStatusPromises = users_emails.map(async (user_email) => {
        setIsFetchingMap((prevIsFetchingMap) => ({
          ...prevIsFetchingMap,
          [user_email]: true,
        }));

        const isUserFollowing = await checkIfFollowing(user_email);

        setIsFetchingMap((prevIsFetchingMap) => ({
          ...prevIsFetchingMap,
          [user_email]: false,
        }));

        setFollowingStatus((prevFollowingStatus) => ({
          ...prevFollowingStatus,
          [user_email]: isUserFollowing,
        }));

        return { email: user_email, isFollowing: isUserFollowing };
      });

      const followingStatusArray = await Promise.all(followStatusPromises);

      setUsers((prevUsers) => [...prevUsers, ...response]);
    }
  } catch (error) {
    console.error('Error in search:', error);
  } finally {
    setIsFetching(false);
  }
}
