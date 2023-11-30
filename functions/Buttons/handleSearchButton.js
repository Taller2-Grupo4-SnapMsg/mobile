import React from 'react';
import searchUserByUsername from '../../handlers/searchUserByUsername';
import checkIfFollowing from '../../handlers/checkIfFollowing';

export async function handleSearch (
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
    navigation,
) {
    const newOffset = 0;
    setOffset(newOffset); 
    setIsFetching(true); 
    const user_to_search = searchText;
    
    setSearchingText(user_to_search);
    try {
        const response = await searchUserByUsername(user_to_search, newOffset, ammount, in_followers, navigation);
        if (response) {
        if (response.length < ammount) {
            setShowMoreVisible(false);
        }
        const initialFollowingStatus = {};
        const users_emails = response.map((user) => user.email);

        const followStatusPromises = users_emails.map(async (user_email) => {
            setIsFetchingMap((prevIsFetchingMap) => ({
            ...prevIsFetchingMap,
            [user_email]: true,
            }));

            const isUserFollowing = await checkIfFollowing(user_email, navigation);

            setIsFetchingMap((prevIsFetchingMap) => ({
            ...prevIsFetchingMap,
            [user_email]: false,
            }));

            initialFollowingStatus[user_email] = isUserFollowing;

            return { email: user_email, isFollowing: isUserFollowing };
        });

        const followingStatusArray = await Promise.all(followStatusPromises);

        setFollowingStatus(initialFollowingStatus);

        setUsers(response);
        setShowMoreVisible(true);
        } else {
        setUsers([]); 
        setShowMoreVisible(false); 
        }
    } catch (error) {
        console.error('Error in search:', error);
    } finally {
        setIsFetching(false); 
    }
};
    
