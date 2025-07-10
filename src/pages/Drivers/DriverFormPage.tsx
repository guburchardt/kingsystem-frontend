import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Snackbar,
  IconButton,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import Drawer from '@mui/material/Drawer';

import driverService from '../../services/driverService';

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  phone: yup
    .string()
    // eslint-disable-next-line no-useless-escape
    .matches(/^[\d\s\-()+\-]+$/, 'Telefone deve conter apenas números, espaços, hífens e parênteses'),
  license_number: yup
    .string()
    .min(5, 'Número da CNH deve ter pelo menos 5 caracteres'),
  status: yup
    .string()
    .oneOf(['active', 'inactive'], 'Status deve ser ativo ou inativo')
    .required('Status é obrigatório'),
});

export const DriverFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [error, setError] = useState<string>('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });
  const [tabsDrawerOpen, setTabsDrawerOpen] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      license_number: '',
      status: 'active' as 'active' | 'inactive',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');

        if (isEditing && id) {
          await driverService.updateDriver(id, values);
          setSnackbar({
            open: true,
            message: 'Motorista atualizado com sucesso!',
            severity: 'success',
          });
        } else {
          await driverService.createDriver(values);
          setSnackbar({
            open: true,
            message: 'Motorista criado com sucesso!',
            severity: 'success',
          });
        }

        // Redirecionar após sucesso
        setTimeout(() => {
          navigate('/drivers');
        }, 1500);
      } catch (err: any) {
        setError(err.message || 'Erro ao salvar motorista');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      fetchDriver();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  const fetchDriver = async () => {
    try {
      setInitialLoading(true);
      const response = await driverService.getDriverById(id!);
      const driver = response.driver;
      
      formik.setValues({
        name: driver.name,
        phone: driver.phone || '',
        license_number: driver.license_number || '',
        status: driver.status,
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar motorista');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/drivers');
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box className="page-content" sx={{ p: { xs: 1, md: 2 } }}>
      {/* Tabs responsivas */}
      <Box className="tabbable page-tabs" sx={{ borderBottom: 1, borderColor: 'divider', mb: 2, position: 'relative' }}>
        {/* Mobile: menu hamburguer */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#e67e22', ml: 1 }}>
            {isEditing ? 'Editar Motorista' : 'Novo Motorista'}
          </Typography>
          <IconButton onClick={() => setTabsDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Drawer anchor="left" open={tabsDrawerOpen} onClose={() => setTabsDrawerOpen(false)}>
          <Box sx={{ width: 220, p: 2 }}>
            <Button fullWidth sx={{ justifyContent: 'flex-start', color: '#333', mb: 1 }} onClick={() => { setTabsDrawerOpen(false); navigate('/drivers'); }}>
              Motoristas
            </Button>
            <Button fullWidth sx={{ justifyContent: 'flex-start', color: '#e67e22', fontWeight: 600 }} disabled>
              Novo Registro
            </Button>
          </Box>
        </Drawer>
        {/* Desktop: tabs horizontais */}
        <Box component="ul" className="nav nav-tabs" sx={{ display: { xs: 'none', md: 'flex' }, p: 0, m: 0, listStyle: 'none' }}>
          <li style={{ marginRight: 8 }}>
            <Button variant="text" sx={{ borderRadius: 0, color: '#333' }} onClick={() => navigate('/drivers')}>
              Motoristas
            </Button>
          </li>
          <li className="active">
            <Button variant="text" sx={{ borderRadius: 0, borderBottom: '2px solid #e67e22', color: '#e67e22', fontWeight: 600 }} disabled>
              Novo Registro
            </Button>
          </li>
        </Box>
      </Box>

      {/* Título e botão Voltar */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mr: 2, color: '#e67e22', fontWeight: 600, textTransform: 'none' }}
        >
          Voltar
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 600, color: '#333' }}>
          {isEditing ? 'Editar Motorista' : 'Novo Motorista'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 1, md: 3 }, borderRadius: 2, boxShadow: 1, maxWidth: 900, margin: '0 auto' }}>
        <form onSubmit={formik.handleSubmit}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
            gap: 3,
            fontFamily: 'inherit',
          }}>
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Nome *"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{ fontFamily: 'inherit' }}
            />

            <TextField
              fullWidth
              id="phone"
              name="phone"
              label="Telefone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              sx={{ fontFamily: 'inherit' }}
            />

            <TextField
              fullWidth
              id="license_number"
              name="license_number"
              label="Número da CNH"
              value={formik.values.license_number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.license_number && Boolean(formik.errors.license_number)}
              helperText={formik.touched.license_number && formik.errors.license_number}
              sx={{ fontFamily: 'inherit' }}
            />

            <FormControl fullWidth>
              <InputLabel id="status-label">Status *</InputLabel>
              <Select
                labelId="status-label"
                id="status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.status && Boolean(formik.errors.status)}
                sx={{ fontFamily: 'inherit' }}
              >
                <MenuItem value="active">Ativo</MenuItem>
                <MenuItem value="inactive">Inativo</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ 
              gridColumn: { xs: '1', md: '1 / -1' },
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end',
              mt: 2,
            }}>
              <Button
                variant="outlined"
                onClick={handleBack}
                disabled={loading}
                sx={{ color: '#e67e22', borderColor: '#e67e22', fontWeight: 600, textTransform: 'none' }}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                disabled={loading || !formik.isValid}
                sx={{ background: '#e67e22', fontWeight: 600, textTransform: 'none', boxShadow: 'none', ':hover': { background: '#cf7c1b' } }}
              >
                {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 