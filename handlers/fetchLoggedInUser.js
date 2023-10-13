import React, { useEffect } from 'react';
import getUserByToken from '../handlers/getUserByToken';

const fetchLoggedInUser = async ({setLoggedInUser }) => {
    try {
      // Fetch the user here, e.g., using an API call or AsyncStorage
      const user = await getUserByToken(); // Replace with your actual fetch logic
  
      // Set the loggedInUser if the user is fetched successfully
      if (user) {
        setLoggedInUser(user);
      }
    } catch (error) {
      console.error('Error fetching logged-in user:', error);
    }
  };
  

export { fetchLoggedInUser };




