import React, { useEffect } from 'react';
import getUserByToken from '../../handlers/getUserByToken';

const fetchLoggedInUser = async ({ setLoggedInUser }) => {
    try {
      const user = await getUserByToken(); 
      if (user) {
        setLoggedInUser(user);
      }
    } catch (error) {
      console.error('Error fetching logged-in user:', error);
    }
  };
  

export { fetchLoggedInUser };




