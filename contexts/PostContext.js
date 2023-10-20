// PostContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import getPostsMyProfile from '../handlers/posts/getPostsMyProfile'; 

const PostContext = createContext();
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
  const [postsChanged, setPostsChanged] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPostsMyProfile(formatDate(new Date()), AMOUNT_POST);
        if (fetchedPosts) {
          setPosts(fetchedPosts);
          setPostsChanged(false);
        }
      } catch (error) {
        //console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [postsChanged]);

  return (
    <PostContext.Provider value={{ posts, postsChanged, setPostsChanged }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePost() {
  return useContext(PostContext);
}