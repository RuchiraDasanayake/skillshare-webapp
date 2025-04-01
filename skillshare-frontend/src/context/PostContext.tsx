import React, { createContext, useContext, useState } from 'react';

interface PostContextType {
  posts: any[];
  setPosts: React.Dispatch<React.SetStateAction<any[]>>;
}

const PostContext = createContext<PostContextType | undefined>(undefined);

interface PostProviderProps {
  children: React.ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
  const [posts, setPosts] = useState<any[]>([]);

  return (
    <PostContext.Provider value={{ posts, setPosts }}>
      {children}
    </PostContext.Provider>
  );
};

export const usePosts = () => {
  const context = useContext(PostContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostProvider');
  }
  return context;
};