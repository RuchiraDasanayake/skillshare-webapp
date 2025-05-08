// src/components/auth/AuthResponse.tsx
import React from 'react';

interface AuthResponseProps {
  token: string;
  status: boolean;
}

const AuthResponse: React.FC<AuthResponseProps> = ({ token, status }) => {
  return (
    <div>
      {status ? (
        <div>
          <h2>Welcome!</h2>
          <p>Your JWT Token: {token}</p>
        </div>
      ) : (
        <p>Authentication failed</p>
      )}
    </div>
  );
};

export default AuthResponse;
