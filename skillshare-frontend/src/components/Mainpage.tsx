// src/pages/MainPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';


const MainPage: React.FC = () => {
  const navigate = useNavigate();
  
  

  const handleSigninRedirect = () => {
    navigate('/signin');
  };

  const handleSignupRedirect = () => {
    navigate('/signup');
  };

  return (
    <div>
      <h2>Welcome to Our Platform</h2>
      <p>Choose an option to get started:</p>
      <button onClick={handleSigninRedirect}>Sign In</button>
      <button onClick={handleSignupRedirect}>Sign Up</button>
    </div>
  );
};

export default MainPage;
