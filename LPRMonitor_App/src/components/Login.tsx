import React, { useState } from 'react';
import { Box, Button, CircularProgress, IconButton, InputAdornment, Paper, TextField, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import logo from '../assets/logo_white.png';
import useToast from '../hooks/useToast'; 
import { Visibility, VisibilityOff } from '@mui/icons-material';

const MotionLogo = motion.img;

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast(); 
  const [showPassword, setShowPassword] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await login(username, senha);
    setLoading(false);

    if (success) {
      navigate('/', { replace: true });
    } else {
      toast.error('Usuário ou senha inválidos');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#e0f2fe',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={12}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          maxWidth: 900,
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            backgroundColor: '#0f172a',
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            px: 4,
            py: 6,
            width: { xs: '100%', md: '40%' },
            textAlign: 'center',
          }}
        >
          <MotionLogo
            src={logo}
            alt="Logo"
            style={{ width: 140, marginBottom: 20 }}
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          />
          <Typography
            variant="body1"
            sx={{ color: '#cbd5e1', fontStyle: 'italic' }}
          >
            Sistema Inteligente de Monitoramento de Placas Veiculares
          </Typography>
        </Box>

        <Box sx={{ p: 4, flex: 1, bgcolor: 'white' }}>
          <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
            Login
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="Usuário"
              type="text"
              fullWidth
              required
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              slotProps={{ htmlInput: { className: 'focus:outline-none focus:ring-0' } }}
            />
            <TextField
              label="Senha"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              required
              margin="normal"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              autoComplete="current-password"
              slotProps={{ htmlInput: { className: 'focus:outline-none focus:ring-0' } }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((prev) => !prev)}
                      edge="end"
                      aria-label="toggle password visibility"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                backgroundColor: '#272932',
                borderRadius: 2,
                '&:hover': { backgroundColor: '#4c5061' },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Entrar'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;