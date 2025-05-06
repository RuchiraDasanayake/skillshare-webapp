// src/components/auth/Signup.tsx
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface SignupProps {
  switchToSignin: () => void;
}

const Signup: React.FC<SignupProps> = ({ switchToSignin }) => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    email: '',
    password: '',
    fullName: '',
    birthDate: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    // Handle redirect after success
    if (success) {
      setRedirecting(true);
      // Wait a moment to show success message before redirecting
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('http://localhost:8080/api/auth/signup', userDetails);
      
      // Check if the request was successful based on response
      if (response.status >= 200 && response.status < 300) {
        setSuccess(true);
        // Redirection is now handled by useEffect
      } else {
        // Handle unexpected success status
        setError('Signup completed but with unexpected response. Please try signing in.');
      }
    } catch (err) {
      // Handle different error scenarios
      if (axios.isAxiosError(err)) {
        // Backend returned an error response
        const statusCode = err.response?.status;
        const errorMessage = err.response?.data?.message || 'Unknown error occurred';
        
        if (statusCode === 409) {
          setError('Email already exists. Please use a different email.');
        } else if (statusCode === 400) {
          setError(`Validation error: ${errorMessage}`);
        } else if (statusCode === 500) {
          // The backend processed the request but encountered an error
          // Since you mentioned data is being stored, we'll treat this as a partial success
          setSuccess(true);
          setError('Your account was created, but we encountered a system error. Please try signing in.');
          // Redirection is now handled by useEffect
        } else {
          setError(`Signup failed: ${errorMessage}`);
        }
      } else {
        setError('Network error. Please check your connection and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Custom circular progress component
  const CircularProgress = () => (
    <div className="flex justify-center items-center my-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Your Account</h2>
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          <p className="text-center font-medium">Account created successfully!</p>
          {redirecting && (
            <>
              <p className="text-center">Redirecting to login...</p>
              <CircularProgress />
            </>
          )}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            placeholder="Enter your full name"
            value={userDetails.fullName}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">Birth Date</label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            value={userDetails.birthDate}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={userDetails.email}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Create a strong password"
            value={userDetails.password}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:ring-blue-500 focus:border-blue-500"
            required
            minLength={6}
          />
          <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
        </div>
        
        <button 
          type="submit" 
          className={`w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-200 flex justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          disabled={loading}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </button>
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded text-sm">
            {error}
          </div>
        )}
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button 
              type="button"
              onClick={() => navigate('/login')} 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Sign In
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Signup;