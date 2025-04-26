// src/components/auth/Signup.tsx
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';

interface SignupProps {
  switchToSignin: () => void;
}

const Signup: React.FC<SignupProps> = ({ switchToSignin }) => {
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
    fullName: '',
    birthDate: '',
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8080/api/auth/signup', userDetails);
      switchToSignin(); // ✅ Go to signin form after signup
    } catch (err) {
      setError('Signup failed. Try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="fullName"
        type="text"
        placeholder="Full Name"
        value={userDetails.fullName}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
      <input
        name="birthDate"
        type="date"
        placeholder="Birth Date"
        value={userDetails.birthDate}
        onChange={handleChange}
        className="w-full border p-2 rounded"
        required
      />
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
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
        Sign Up
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default Signup;
