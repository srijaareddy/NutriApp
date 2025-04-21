import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Avatar,
  Grid
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Link as RouterLink } from 'react-router-dom';

const THEME_COLORS = {
  primary: '#006D77',    // Dark turquoise
  secondary: '#083D3F',  // Deeper turquoise
  accent: '#E29578',     // Coral accent
  card: 'linear-gradient(135deg, rgba(0, 109, 119, 0.95) 0%, rgba(8, 61, 63, 0.95) 100%)',
  text: '#E0E0E0',       // Light gray for text
  subtext: '#B0B0B0'     // Slightly darker gray for secondary text
};

function Signup() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
            <PersonAddIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Typography component="h1" variant="h4" sx={{ 
            mb: 3,
            color: THEME_COLORS.text,
            fontWeight: 'bold'
          }}>
            Create Account
          </Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
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
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
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
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
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
              </Grid>
            </Grid>
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
              Sign Up
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Link
                component={RouterLink}
                to="/login"
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
                Already have an account? Sign In
              </Link>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

export default Signup; 