import React from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

interface LoginProps {
  username: string;
  senha: string;
  erro: string;
  setUsername: (username: string) => void;
  setSenha: (senha: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

const Login: React.FC<LoginProps> = ({ username, senha, erro, setUsername, setSenha, onSubmit }) => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 5,
          maxWidth: 400,
          width: '100%',
          borderRadius: 3,
        }}
      >
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Login
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            label="Username"
            type="username"
            fullWidth
            required
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
          <TextField
            label="Senha"
            type="password"
            fullWidth
            required
            margin="normal"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            autoComplete="current-password"
          />
          {erro && (
            <Typography color="error" variant="body2" align="center" sx={{ mt: 1 }}>
              {erro}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 3, mb: 2, borderRadius: 2 }}
          >
            Entrar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;