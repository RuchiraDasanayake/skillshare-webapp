import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signin: React.FC = () => {
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Use the complete API URL with the correct endpoint
      const response = await axios.post('http://localhost:8080/api/auth/signin', userDetails);
      localStorage.setItem('jwtToken', response.data.jwt); // Store JWT in localStorage
      navigate('/profile');
    } catch (error) {
      setError('Invalid email or password');
      console.error('Error during signin', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          value={userDetails.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={userDetails.password}
          onChange={handleChange}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
      <button onClick={() => navigate('/signup')}>Don't have an account? Sign Up</button>
    </div>
  );
};

export default Signin;