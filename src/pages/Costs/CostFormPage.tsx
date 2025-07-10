import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
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

import costService from '../../services/costService';

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  value: yup
    .number()
    .required('Valor é obrigatório')
    .min(0.01, 'Valor deve ser maior que zero'),
});

export const CostFormPage: React.FC = () => {
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
      value: 0,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');

        if (isEditing && id) {
          await costService.updateCost(id, values);
          setSnackbar({
            open: true,
            message: 'Custo atualizado com sucesso!',
            severity: 'success',
          });
        } else {
          await costService.createCost(values);
          setSnackbar({
            open: true,
            message: 'Custo criado com sucesso!',
            severity: 'success',
          });
        }

        // Redirecionar após sucesso
        setTimeout(() => {
          navigate('/costs');
        }, 1500);
      } catch (err: any) {
        setError(err.message || 'Erro ao salvar custo');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      fetchCost();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  const fetchCost = async () => {
    try {
      setInitialLoading(true);
      const response = await costService.getCostById(id!);
      const cost = response.cost;
      
      formik.setValues({
        name: cost.name,
        value: cost.value,
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar custo');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/costs');
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
            {isEditing ? 'Editar Custo' : 'Novo Custo'}
          </Typography>
          <IconButton onClick={() => setTabsDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Drawer anchor="left" open={tabsDrawerOpen} onClose={() => setTabsDrawerOpen(false)}>
          <Box sx={{ width: 220, p: 2 }}>
            <Button fullWidth sx={{ justifyContent: 'flex-start', color: '#333', mb: 1 }} onClick={() => { setTabsDrawerOpen(false); navigate('/costs'); }}>
              Custos
            </Button>
            <Button fullWidth sx={{ justifyContent: 'flex-start', color: '#e67e22', fontWeight: 600 }} disabled>
              Novo Registro
            </Button>
          </Box>
        </Drawer>
        {/* Desktop: tabs horizontais */}
        <Box component="ul" className="nav nav-tabs" sx={{ display: { xs: 'none', md: 'flex' }, p: 0, m: 0, listStyle: 'none' }}>
          <li style={{ marginRight: 8 }}>
            <Button variant="text" sx={{ borderRadius: 0, color: '#333' }} onClick={() => navigate('/costs')}>
              Custos
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
          {isEditing ? 'Editar Custo' : 'Novo Custo'}
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
              label="Nome do Custo *"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{ fontFamily: 'inherit' }}
            />

            <TextField
              fullWidth
              id="value"
              name="value"
              label="Valor (R$) *"
              type="number"
              value={formik.values.value}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.value && Boolean(formik.errors.value)}
              helperText={formik.touched.value && formik.errors.value}
              inputProps={{ min: 0, step: 0.01 }}
              sx={{ fontFamily: 'inherit' }}
            />

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