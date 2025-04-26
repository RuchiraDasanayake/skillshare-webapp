import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup: React.FC = () => {
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
    fullName: '',
    birthDate: '',
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
      const response = await axios.post('http://localhost:8080/api/auth/signup', userDetails);
      localStorage.setItem('jwtToken', response.data.jwt); // Store JWT in localStorage
      navigate('/profile'); // Redirect to profile page after signup
    } catch (error) {
      setError('Error during signup');
      console.error('Error during signup', error);
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
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
        <input
          type="text"
          name="fullName"
          value={userDetails.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          required
        />
        <input
          type="date"
          name="birthDate"
          value={userDetails.birthDate}
          onChange={handleChange}
          placeholder="Birth Date"
          required
        />
        <button type="submit">Sign Up</button>
      </form>
      {error && <p>{error}</p>}
      <button onClick={() => navigate('/signin')}>Already have an account? Login</button>
    </div>
  );
};

export default Signup;