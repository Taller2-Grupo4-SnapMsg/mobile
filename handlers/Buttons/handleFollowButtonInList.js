import React from 'react';
import followUser from '../followUser';
import unfollowUser from '../unfollowUser';


export async function handleFollowButtonInList(
    setIsFetchingMap,
    setFollowStatus,
    followStatus,
    itemEmail
){
    setIsFetchingMap((prevIsFetchingMap) => ({
      ...prevIsFetchingMap,
      [itemEmail]: true,
    }));

    if (followStatus[itemEmail]) {
      await unfollowUser(itemEmail);
    } else {
      await followUser(itemEmail);
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
