import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Alert, CircularProgress } from '@mui/material';

const Signup: React.FC = () => {
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
    if (success) {
      setRedirecting(true);
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/signup', userDetails);

      if (response.status >= 200 && response.status < 300) {
        setSuccess(true);
      } else {
        setError('Signup completed but with unexpected response. Please try signing in.');
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const statusCode = err.response?.status;
        const errorMessage = err.response?.data?.message || 'Unknown error occurred';

        if (statusCode === 409) {
          setError('Email already exists. Please use a different email.');
        } else if (statusCode === 400) {
          setError(`Validation error: ${errorMessage}`);
        } else if (statusCode === 500) {
          setSuccess(true);
          setError('Your account was created, but we encountered a system error. Please try signing in.');
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

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Box
        sx={{
          bgcolor: 'background.paper',
          borderRadius: 3,
          boxShadow: 6,
          p: 5,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom color="primary">
          Create Your Account
        </Typography>

        {success && (
          <Alert severity="success" sx={{ mb: 3, textAlign: 'center' }}>
            Account created successfully!
            {redirecting && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Redirecting to login...
              </Typography>
            )}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Box sx={{ mb: 2 }}>
            <Typography component="label" htmlFor="fullName" sx={{ fontWeight: 'medium', mb: 1, display: 'block' }}>
              Full Name
            </Typography>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={userDetails.fullName}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontSize: 16,
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography component="label" htmlFor="birthDate" sx={{ fontWeight: 'medium', mb: 1, display: 'block' }}>
              Birth Date
            </Typography>
            <input
              id="birthDate"
              name="birthDate"
              type="date"
              value={userDetails.birthDate}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontSize: 16,
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography component="label" htmlFor="email" sx={{ fontWeight: 'medium', mb: 1, display: 'block' }}>
              Email
            </Typography>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={userDetails.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontSize: 16,
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
            />
          </Box>

          <Box sx={{ mb: 1 }}>
            <Typography component="label" htmlFor="password" sx={{ fontWeight: 'medium', mb: 1, display: 'block' }}>
              Password
            </Typography>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Create a strong password"
              value={userDetails.password}
              onChange={handleChange}
              required
              minLength={6}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: 6,
                border: '1px solid #cbd5e1',
                outline: 'none',
                fontSize: 16,
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.target.style.borderColor = '#3b82f6')}
              onBlur={(e) => (e.target.style.borderColor = '#cbd5e1')}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Password must be at least 6 characters
            </Typography>
          </Box>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5, borderRadius: 2, mt: 3, fontWeight: 'bold' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign Up'}
          </Button>
        </form>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Box
              component="span"
              sx={{
                color: 'primary.main',
                fontWeight: 'medium',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
              onClick={() => navigate('/login')}
            >
              Sign In
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
