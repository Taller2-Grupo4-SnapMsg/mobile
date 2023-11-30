import React from 'react';
import followUser from '../../handlers/followUser';
import unfollowUser from '../../handlers/unfollowUser';


export async function handleFollowButtonInList(
    setIsFetchingMap,
    setFollowStatus,
    followStatus,
    itemEmail,
    navigation
){
    setIsFetchingMap((prevIsFetchingMap) => ({
      ...prevIsFetchingMap,
      [itemEmail]: true,
    }));

    if (followStatus[itemEmail]) {
      await unfollowUser(itemEmail, navigation);
    } else {
      await followUser(itemEmail, navigation);
    }

    setFollowStatus((prevStatus) => ({
      ...prevStatus,
      [itemEmail]: !prevStatus[itemEmail],
    }));

    setIsFetchingMap((prevIsFetchingMap) => ({
      ...prevIsFetchingMap,
      [itemEmail]: false,
    }));
  };
