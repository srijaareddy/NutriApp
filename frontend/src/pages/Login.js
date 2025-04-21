import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Avatar
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink } from 'react-router-dom';

const THEME_COLORS = {
  primary: '#006D77',    
  secondary: '#083D3F',  
  accent: '#E29578',     
  card: 'linear-gradient(135deg, rgba(0, 109, 119, 0.95) 0%, rgba(8, 61, 63, 0.95) 100%)',
  text: '#E0E0E0',       
  subtext: '#B0B0B0'     
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      py: 12,
      background: '(30,30,30,0.9)',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'url(https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        opacity: 0.08,
        zIndex: -1
      }
    }}>
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: THEME_COLORS.card,
            borderRadius: 3,
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.3s ease',
            border: '1px solid rgba(255,255,255,0.1)',
            '&:hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)'
            }
          }}
        >
          <Avatar sx={{ 
            m: 1, 
            bgcolor: THEME_COLORS.accent,
            width: 56,
            height: 56
          }}>
            <LockOutlinedIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ 
            mb: 3,
            color: THEME_COLORS.text,
            fontWeight: 'bold'
          }}>
            Welcome Back
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  }
                },
                '& .MuiInputLabel-root, & .MuiOutlinedInput-input': {
                  color: THEME_COLORS.text
                }
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.1)'
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.2)'
                  }
                },
                '& .MuiInputLabel-root, & .MuiOutlinedInput-input': {
                  color: THEME_COLORS.text
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                background: THEME_COLORS.accent,
                '&:hover': {
                  background: THEME_COLORS.primary
                }
              }}
            >
              Sign In
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                component={RouterLink}
                to="/signup"
                variant="body1"
                sx={{
                  color: THEME_COLORS.text,
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                    color: THEME_COLORS.accent
                  }
                }}
              >
                Don't have an account? Sign Up
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Login; 