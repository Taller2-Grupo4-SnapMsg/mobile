// TrendingTopicsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import getTrendingTopics from '../handlers/trending_topics/getTrendingTopics';

AMOUNT_TRENDING_TOPIC = 4

const TrendingTopicsContext = createContext();

export const TrendingTopicsProvider = ({ children }) => {
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [offset, setOffset] = useState(0);
  const [reachedEnd, setReachedEnd] = useState(false);

  const handleGetMoreTrendingTopics = async (offset, refresh) => {
    console.log('handleGetMoreTrendingTopics')
    console.log('offset', offset)
    if (loadingMore || (reachedEnd && !refresh)) return;

    try {
        setLoadingMore(true);
        setRefreshing(refresh);

        if (!offset){
            offset = 0;
        }
        const fetched = await getTrendingTopics(AMOUNT_TRENDING_TOPIC, offset, 50);

        if (fetched && fetched.length > 0) {
          if (reachedEnd){
             setTrendingTopics((prevTrendingTopics) => [...prevTrendingTopics, ...fetched]);
             setOffset(offset + AMOUNT_TRENDING_TOPIC);
             setReachedEnd(false);
          }
          else {
              setTrendingTopics(fetched);
              setRefreshing(false);
              setReachedEnd(false);
          }
        } else {
          setReachedEnd(true);
        }
    } catch (error) {
        console.error('Error while loading more trending topics:', error);
    } finally {
        setLoadingMore(false);
    }
  };

  useEffect(() => {
    const interval = 6000;
    
    handleGetMoreTrendingTopics(0, true);
    const intervalId = setInterval(() => handleGetMoreTrendingTopics(offset, false), interval);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <TrendingTopicsContext.Provider value={{
        trendingTopics,
        loadingMore,
        refreshing,
        handleGetMoreTrendingTopics,
        setReachedEnd,
        }}>
      {children}
    </TrendingTopicsContext.Provider>
  );
};

export const useTrendingTopics = () => {
    return useContext(TrendingTopicsContext);
};
