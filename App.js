// Main.js (or index.js)
import React from 'react';
import { UserProvider } from './UserContext';
import AppComponent from './AppComponent';

export default function App() {
  
  return (
    <UserProvider>
      <AppComponent />
    </UserProvider>
  );
}
