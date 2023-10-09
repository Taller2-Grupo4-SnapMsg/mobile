// PostContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import getPostsByToken from '../handlers/profile/getPostsByToken'; // Reemplaza esto con tu lógica real de obtención de posts

const PostContext = createContext();

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);
  const [postsChanged, setPostsChanged] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPostsByToken();
        if (fetchedPosts) {
          setPosts(fetchedPosts);
          setPostsChanged(false); // Establecer los cambios como false después de cargar
        }
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, [postsChanged]); // Agregar postsChanged como una dependencia

  return (
    <PostContext.Provider value={{ posts, postsChanged, setPostsChanged }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePost() {
  return useContext(PostContext);
}