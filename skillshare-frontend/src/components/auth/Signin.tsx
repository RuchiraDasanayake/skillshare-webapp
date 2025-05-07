import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../Authentication/authContext';
import { Button, TextField, CircularProgress, Alert, Box, Typography, Divider } from '@mui/material';

declare global {
  interface Window {
    google: any;
  }
}

const Signin: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(
          document.getElementById('googleSignInDiv'),
          { theme: 'outline', size: 'large', width: '100%' }
        );
      }
    };

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleResponse = async (response: any) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('http://localhost:8080/api/auth/google-signin', {
        token: response.credential,
      });

      const { status, jwt } = res.data;

      if (status && jwt) {
        localStorage.setItem('token', jwt);
        navigate('/dashboard');
      } else {
        setError('Unexpected response from server.');
      }
    } catch (err) {
      setError('Google Signin failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/signin', formData);
      const { status, jwt } = response.data;
      if (status && jwt) {
        localStorage.setItem('token', jwt);
        navigate('/dashboard');
      } else {
        setError('Unexpected response from server.');
      }
    } catch (err) {
      setError('Signin failed. Please check your credentials and try again.');
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
          bgcolor: 'white',
          borderRadius: 3,
          boxShadow: 6,
          p: 5,
          maxWidth: 400,
          width: '100%',
        }}
      >
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom color="primary">
          Sign In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <TextField
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            margin="normal"
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            required
            variant="outlined"
            margin="normal"
            autoComplete="current-password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            sx={{ py: 1.5, borderRadius: 2, mt: 3, fontWeight: 'bold' }}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>
        </form>

        <Box sx={{ my: 4, display: 'flex', alignItems: 'center' }}>
          <Divider sx={{ flexGrow: 1 }} />
          <Typography sx={{ mx: 2, color: 'text.secondary', fontWeight: 'medium' }}>OR</Typography>
          <Divider sx={{ flexGrow: 1 }} />
        </Box>

        {/* Google Sign-In Button (do not remove) */}
        <Box id="googleSignInDiv" sx={{ width: '100%', display: 'flex', justifyContent: 'center' }} />

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Box
              component="span"
              sx={{
                color: 'primary.main',
                fontWeight: 'medium',
                cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
              onClick={() => navigate('/register')}
            >
              Sign Up
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Signin;
