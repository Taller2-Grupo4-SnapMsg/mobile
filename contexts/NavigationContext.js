import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const [navigation, setNavigation] = useState(null); // Inicializa con null o cualquier valor por defecto que necesites
  console.log(navigation)

  const handleNavigate = (routeName) => {
    if (navigation) {
      navigation.navigate(routeName);
    }
  };

  return (
    <NavigationContext.Provider value={{ navigation, setNavigation, handleNavigate }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);