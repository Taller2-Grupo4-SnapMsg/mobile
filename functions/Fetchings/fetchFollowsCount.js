import React from 'react';

export async function fetchFollowsCount({ user, setFollowsCount, followsFunction }) {
    try {
      const fetchedFollows= await followsFunction(user.email);
      setFollowsCount(fetchedFollows);
    } catch (error) {
      console.error('Error al obtener los followers:', error);
    }
};