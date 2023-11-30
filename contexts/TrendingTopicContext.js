// TrendingTopicsContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import getTrendingTopics from '../handlers/trending_topics/getTrendingTopics';

AMOUNT_TRENDING_TOPIC = 7

const TrendingTopicsContext = createContext();

export const TrendingTopicsProvider = ({ children }) => {
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [loadingMoreTrendingTopics, setLoadingMoreTrendingTopics] = useState(false);
  const [refreshingTrendingTopics, setRefreshingTrendingTopics] = useState(false);
  const [offsetTrendingTopics, setOffsetTrendingTopics] = useState(0);
  const [reachedEndTrendingTopics, setReachedEndTrendingTopics] = useState(false);

  const handleGetMoreTrendingTopics = async (offsetTrendingTopics, refresh) => {
    if (loadingMoreTrendingTopics || (reachedEndTrendingTopics && !refresh)) return;

    try {
        setLoadingMoreTrendingTopics(true);
        setRefreshingTrendingTopics(refresh);

        if (!offsetTrendingTopics){
            offsetTrendingTopics = 0;
        }
        const fetched = await getTrendingTopics(AMOUNT_TRENDING_TOPIC, offsetTrendingTopics, 50);

        if (fetched && fetched.length > 0) {
          if (reachedEndTrendingTopics){
             setTrendingTopics((prevTrendingTopics) => [...prevTrendingTopics, ...fetched]);
             setOffsetTrendingTopics(offsetTrendingTopics + AMOUNT_TRENDING_TOPIC);
             setReachedEndTrendingTopics(false);
          }
          else {
              setTrendingTopics(fetched);
              setRefreshingTrendingTopics(false);
              setReachedEndTrendingTopics(false);
          }
        } else {
          setReachedEndTrendingTopics(true);
        }
    } catch (error) {
        console.error('Error while loading more trending topics:', error);
    } finally {
        setLoadingMoreTrendingTopics(false);
    }
  };

  useEffect(() => {
    const interval = 6000;
    
    handleGetMoreTrendingTopics(0, true);
    const intervalId = setInterval(() => handleGetMoreTrendingTopics(offsetTrendingTopics, false), interval);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <TrendingTopicsContext.Provider value={{
        trendingTopics,
        loadingMoreTrendingTopics,
        refreshingTrendingTopics,
        handleGetMoreTrendingTopics,
        setReachedEndTrendingTopics,
        }}>
      {children}
    </TrendingTopicsContext.Provider>
  );
};

export const useTrendingTopics = () => {
    return useContext(TrendingTopicsContext);
};
