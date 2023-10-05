// UserContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import getUserByToken from './handlers/getUserByToken';
const UserContext = createContext();

export function UserProvider({ children }) {
  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    const fetchLoggedInUser = async () => {
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

    // Call the fetchLoggedInUser function when the component mounts
    fetchLoggedInUser();
  }, []);

  return (
    <UserContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}
