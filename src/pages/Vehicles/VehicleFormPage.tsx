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

import vehicleService from '../../services/vehicleService';

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  capacity: yup
    .number()
    .required('Capacidade é obrigatória')
    .min(1, 'Capacidade deve ser pelo menos 1')
    .max(50, 'Capacidade não pode ser maior que 50'),
  status: yup
    .string()
    .oneOf(['active', 'inactive'], 'Status deve ser ativo ou inativo')
    .required('Status é obrigatório'),
});

export const VehicleFormPage: React.FC = () => {
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
      capacity: 4,
      status: 'active' as 'active' | 'inactive',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');

        if (isEditing && id) {
          await vehicleService.updateVehicle(id, values);
          setSnackbar({
            open: true,
            message: 'Veículo atualizado com sucesso!',
            severity: 'success',
          });
        } else {
          await vehicleService.createVehicle(values);
          setSnackbar({
            open: true,
            message: 'Veículo criado com sucesso!',
            severity: 'success',
          });
        }

        // Redirecionar após sucesso
        setTimeout(() => {
          navigate('/vehicles');
        }, 1500);
      } catch (err: any) {
        setError(err.message || 'Erro ao salvar veículo');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      fetchVehicle();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  const fetchVehicle = async () => {
    try {
      setInitialLoading(true);
      const response = await vehicleService.getVehicleById(id!);
      const vehicle = response.vehicle;
      
      formik.setValues({
        name: vehicle.name,
        capacity: vehicle.capacity,
        status: vehicle.status,
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar veículo');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/vehicles');
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
            {isEditing ? 'Editar Veículo' : 'Novo Veículo'}
          </Typography>
          <IconButton onClick={() => setTabsDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Drawer anchor="left" open={tabsDrawerOpen} onClose={() => setTabsDrawerOpen(false)}>
          <Box sx={{ width: 220, p: 2 }}>
            <Button fullWidth sx={{ justifyContent: 'flex-start', color: '#333', mb: 1 }} onClick={() => { setTabsDrawerOpen(false); navigate('/vehicles'); }}>
              Carros
            </Button>
            <Button fullWidth sx={{ justifyContent: 'flex-start', color: '#e67e22', fontWeight: 600 }} disabled>
              Novo Registro
            </Button>
          </Box>
        </Drawer>
        {/* Desktop: tabs horizontais */}
        <Box component="ul" className="nav nav-tabs" sx={{ display: { xs: 'none', md: 'flex' }, p: 0, m: 0, listStyle: 'none' }}>
          <li style={{ marginRight: 8 }}>
            <Button variant="text" sx={{ borderRadius: 0, color: '#333' }} onClick={() => navigate('/vehicles')}>
              Carros
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
          {isEditing ? 'Editar Veículo' : 'Novo Veículo'}
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
              label="Nome do Veículo *"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{ fontFamily: 'inherit' }}
            />

            <TextField
              fullWidth
              id="capacity"
              name="capacity"
              label="Capacidade *"
              type="number"
              value={formik.values.capacity}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.capacity && Boolean(formik.errors.capacity)}
              helperText={formik.touched.capacity && formik.errors.capacity}
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