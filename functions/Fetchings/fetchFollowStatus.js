import React from 'react';

export async function fetchFollowStatus({ user, setStatus, setIsFetching, followStatusFunction }) {
    if (user) {
        try {
          setIsFetching(true);
          const status = await followStatusFunction(user.email);
          setStatus(status);
        } catch (error) {
          console.error('Error while checking following/follower status:', error);
        } finally {
          setIsFetching(false);
        }
      }
}