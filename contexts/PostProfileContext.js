// pendiente: configurar profile para que si se quiere refrescar 
//o cargar mas post del final, haga un set de la fecha y otro de las variables
//refreshing, loadingMore, reachedEnd, onlyReposts

import React, { createContext, useContext, useState, useEffect } from 'react';
import getPostsProfile from  

AMOUNT_POST = 10

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}_${hours}:${minutes}:${seconds}`;
}


export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [latestDate, setLatestDate] = useState((new Date()).toISOString());
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [reachedEnd, setReachedEnd] = useState(false);
  const [onlyReposts, setOnlyReposts] = useState(false);

  useEffect(() => {
    const handleGetMorePosts = async (date, refresh) => {
      if (loadingMore || (reachedEnd && !refresh)) return;
  
      try {
        setLoadingMore(true);
        setRefreshing(refresh);
        const fetchedPosts = await getPostsProfile(formatDate(date), AMOUNT_POST, user.email, onlyReposts);
        if (fetchedPosts && fetchedPosts.length > 0) {
          if (refresh) {
            setPosts(fetchedPosts);
            setRefreshing(false);
            setReachedEnd(false);
          }
          else {setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);}
          setLatestDate(fetchedPosts[fetchedPosts.length - 1].created_at);
        } else {
          setReachedEnd(true);
          setRefreshing(false);
        }
      } catch (error) {
        console.error('Error while loading more posts:', error);
      } finally {
        setLoadingMore(false);
      }
    };
    handleGetMorePosts(date, refresh);
  }, [onlyReposts, refreshing, loadingMore, reachedEnd]);

  return (
    <PostContext.Provider value={{ posts, 
                                  loadingMore,
                                  setLatestDate, 
                                  setRefreshing,
                                  setLoadingMore,
                                  setReachedEnd,
                                  setOnlyReposts }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePostProfile() {
  return useContext(PostContext);
}