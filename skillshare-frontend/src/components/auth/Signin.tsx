// src/components/auth/Signin.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../Authentication/auth.tsx';

const Signin: React.FC = () => {
  const [userDetails, setUserDetails] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:8080/api/auth/signin', userDetails);
      
      // Check if we received the JWT token
      if (!response.data.jwt) {
        throw new Error('No token received');
      }
      
      // Store token using our utility function
      setAuthToken(response.data.jwt);
      
      // Log successful authentication 
      console.log('Authentication successful, token stored');
      
      // Navigate to home
      navigate('/home');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={userDetails.email}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="password"
        type="password"
        placeholder="Password"
        value={userDetails.password}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <button 
        type="submit" 
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default Signin;