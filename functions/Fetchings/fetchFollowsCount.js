import React from 'react';

export async function fetchFollowsCount({ user, setFollowsCount, followsFunction, navigation }) {
    try {
      const fetchedFollows= await followsFunction(user.email, navigation);
      setFollowsCount(fetchedFollows);
    } catch (error) {
      console.error('Error al obtener los followers:', error);
    }
};