import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Link,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '@fontsource/open-sans';

const validationSchema = yup.object({
  email: yup
    .string()
    .email('Digite um email válido')
    .required('Email é obrigatório'),
  password: yup
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .required('Senha é obrigatória'),
});

export const LoginPage: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setError('');
        const { error } = await signIn(values.email, values.password);
        if (error) {
          setError(error.message || 'Erro ao fazer login');
        } else {
          navigate('/dashboard');
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao fazer login');
      }
    },
  });

  return (
    <Box
      sx={{
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        backgroundImage: {
          xs: 'none',
          md: 'url(/images/IMG_5205.JPG)'
        },
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        fontFamily: 'Open Sans, sans-serif',
      }}
    >
      {/* Lado esquerdo - Mensagem de segurança */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: { xs: 'flex-start', md: 'center' },
          alignItems: { xs: 'flex-start', md: 'flex-start' },
          color: 'white',
          p: { xs: 2, md: 4 },
          minHeight: { xs: '120px', md: '100vh' },
          background: {
            xs: 'url(/images/IMG_5205.JPG) center/cover no-repeat',
            md: 'none',
          },
          fontFamily: 'Open Sans, sans-serif',
        }}
      >
        <Box sx={{ mt: 2, ml: 2 }}>
          <Typography variant="body2" sx={{ color: 'white', fontWeight: 400, fontFamily: 'Open Sans, sans-serif' }}>
            Por motivos de segurança seu IP foi gravado no servidor.<br />
            <b>Versão 2025</b>
          </Typography>
        </Box>
      </Box>

      {/* Lado direito - Login */}
      <Box
        sx={{
          flex: 1,
          minHeight: { xs: 'auto', md: '100vh' },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'white',
          fontFamily: 'Open Sans, sans-serif',
          py: { xs: 4, md: 0 },
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: { xs: 2, sm: 3, md: 6 },
            width: { xs: '100%', sm: 350, md: 400 },
            maxWidth: 420,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            fontFamily: 'Open Sans, sans-serif',
          }}
        >
          <Box sx={{ mb: 2, width: '100%', textAlign: 'center' }}>
            <img
              src={process.env.PUBLIC_URL + '/images/logo.png'}
              alt="King Logo"
              style={{ maxWidth: 180, height: 'auto' }}
            />
            <Typography variant="body2" sx={{ mt: 2, fontFamily: 'Open Sans, sans-serif' }}>
              Para acessar, faça o login:
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2, fontFamily: 'Open Sans, sans-serif' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={formik.handleSubmit} sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              fullWidth
              id="email"
              name="email"
              label="Usuário"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              autoComplete="email"
              autoFocus
              InputProps={{ style: { fontFamily: 'Open Sans, sans-serif' } }}
              InputLabelProps={{ style: { fontFamily: 'Open Sans, sans-serif' } }}
            />
            <TextField
              margin="normal"
              fullWidth
              id="password"
              name="password"
              label="Senha"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={formik.touched.password && formik.errors.password}
              autoComplete="current-password"
              InputProps={{ style: { fontFamily: 'Open Sans, sans-serif' } }}
              InputLabelProps={{ style: { fontFamily: 'Open Sans, sans-serif' } }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, fontFamily: 'Open Sans, sans-serif' }}
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                'Entrar'
              )}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link href="#" variant="body2" sx={{ fontFamily: 'Open Sans, sans-serif' }}>
                Esqueceu sua senha?
              </Link>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}; 