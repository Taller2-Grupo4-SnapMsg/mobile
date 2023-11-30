// Main.js (or index.js)
import React from 'react';
import { UserProvider } from './contexts/UserContext';
import { TrendingTopicsProvider } from './contexts/TrendingTopicContext';
import AppComponent from './AppComponent';

export default function App() {
  return (
    <UserProvider>
      <TrendingTopicsProvider>
        <AppComponent />
      </TrendingTopicsProvider>
    </UserProvider>
  );
}
