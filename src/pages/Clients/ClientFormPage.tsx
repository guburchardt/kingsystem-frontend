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

import clientService from '../../services/clientService';

const validationSchema = yup.object({
  name: yup
    .string()
    .required('Nome/Razão Social é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  document_type: yup
    .string()
    .oneOf(['cpf', 'cnpj'], 'Tipo de documento é obrigatório')
    .required('Tipo de documento é obrigatório'),
  cpf: yup
    .string()
    .when('document_type', {
      is: 'cpf',
      then: (schema) => schema
        .required('CPF é obrigatório')
        .matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00'),
      otherwise: (schema) => schema.notRequired(),
    }),
  cnpj: yup
    .string()
    .when('document_type', {
      is: 'cnpj',
      then: (schema) => schema
        .required('CNPJ é obrigatório')
        .matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, 'CNPJ deve estar no formato 00.000.000/0000-00'),
      otherwise: (schema) => schema.notRequired(),
    }),
  phone: yup
    .string()
    .required('Telefone é obrigatório')
    // eslint-disable-next-line no-useless-escape
    .matches(/^[\d\s\-()+\-]+$/, 'Telefone deve conter apenas números, espaços, hífens e parênteses'),
  mobile: yup
    .string()
    // eslint-disable-next-line no-useless-escape
    .matches(/^[\d\s\-()+\-]+$|^$/, 'Celular deve conter apenas números, espaços, hífens e parênteses'),
  email: yup
    .string()
    .email('Digite um email válido')
    .required('Email é obrigatório'),
  address: yup
    .string()
    .min(5, 'Endereço deve ter pelo menos 5 caracteres'),
  number: yup
    .string()
    .min(1, 'Número é obrigatório'),
  complement: yup
    .string(),
  neighborhood: yup
    .string()
    .min(2, 'Bairro deve ter pelo menos 2 caracteres'),
  city: yup
    .string()
    .min(2, 'Cidade deve ter pelo menos 2 caracteres'),
  zip_code: yup
    .string()
    .matches(/^\d{5}-\d{3}$|^$/, 'CEP deve estar no formato 00000-000'),
  status: yup
    .string()
    .oneOf(['active', 'inactive'], 'Status deve ser ativo ou inativo')
    .required('Status é obrigatório'),
});

export const ClientFormPage: React.FC = () => {
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
      document_type: 'cpf' as 'cpf' | 'cnpj',
      cpf: '',
      cnpj: '',
      phone: '',
      mobile: '',
      email: '',
      address: '',
      number: '',
      complement: '',
      neighborhood: '',
      city: '',
      zip_code: '',
      status: 'active' as 'active' | 'inactive',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');

        // Preparar dados para envio
        const clientData = {
          ...values,
          // Limpar o campo que não está sendo usado
          cpf: values.document_type === 'cpf' ? values.cpf : '',
          cnpj: values.document_type === 'cnpj' ? values.cnpj : '',
        };

        if (isEditing && id) {
          await clientService.updateClient(id, clientData);
          setSnackbar({
            open: true,
            message: 'Cliente atualizado com sucesso!',
            severity: 'success',
          });
        } else {
          await clientService.createClient(clientData);
          setSnackbar({
            open: true,
            message: 'Cliente criado com sucesso!',
            severity: 'success',
          });
        }

        // Redirecionar após sucesso
        setTimeout(() => {
          navigate('/clients');
        }, 1500);
      } catch (err: any) {
        setError(err.message || 'Erro ao salvar cliente');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isEditing && id) {
      fetchClient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  const fetchClient = async () => {
    try {
      setInitialLoading(true);
      const response = await clientService.getClientById(id!);
      const client = response.client;
      
      // Determinar o tipo de documento baseado nos dados existentes
      const documentType = client.cpf ? 'cpf' : client.cnpj ? 'cnpj' : 'cpf';
      
      formik.setValues({
        name: client.name,
        document_type: documentType,
        cpf: client.cpf || '',
        cnpj: client.cnpj || '',
        phone: client.phone,
        mobile: client.mobile || '',
        email: client.email || '',
        address: client.address || '',
        number: client.number || '',
        complement: client.complement || '',
        neighborhood: client.neighborhood || '',
        city: client.city || '',
        zip_code: client.zip_code || '',
        status: client.status,
      });
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar cliente');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/clients');
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
            Novo Cliente
          </Typography>
          <IconButton onClick={() => setTabsDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Drawer anchor="left" open={tabsDrawerOpen} onClose={() => setTabsDrawerOpen(false)}>
          <Box sx={{ width: 220, p: 2 }}>
            <Button fullWidth sx={{ justifyContent: 'flex-start', color: '#333', mb: 1 }} onClick={() => { setTabsDrawerOpen(false); navigate('/clients'); }}>
              Clientes
            </Button>
            <Button fullWidth sx={{ justifyContent: 'flex-start', color: '#e67e22', fontWeight: 600 }} disabled>
              Novo Registro
            </Button>
          </Box>
        </Drawer>
        {/* Desktop: tabs horizontais */}
        <Box component="ul" className="nav nav-tabs" sx={{ display: { xs: 'none', md: 'flex' }, p: 0, m: 0, listStyle: 'none' }}>
          <li style={{ marginRight: 8 }}>
            <Button variant="text" sx={{ borderRadius: 0, color: '#333' }} onClick={() => navigate('/clients')}>
              Clientes
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
          {isEditing ? 'Editar Cliente' : 'Novo Cliente'}
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
            {/* Campos do formulário - mantidos, mas com padding e fontes ajustados pelo Paper e Box */}
            <TextField
              fullWidth
              id="name"
              name="name"
              label="Nome/Razão Social *"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={{ fontFamily: 'inherit' }}
            />
            <FormControl fullWidth>
              <InputLabel id="document-type-label">Tipo de Documento *</InputLabel>
              <Select
                labelId="document-type-label"
                id="document_type"
                name="document_type"
                value={formik.values.document_type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.document_type && Boolean(formik.errors.document_type)}
                sx={{ fontFamily: 'inherit' }}
              >
                <MenuItem value="cpf">CPF</MenuItem>
                <MenuItem value="cnpj">CNPJ</MenuItem>
              </Select>
            </FormControl>
            {formik.values.document_type === 'cpf' ? (
              <TextField
                fullWidth
                id="cpf"
                name="cpf"
                label="CPF *"
                value={formik.values.cpf}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.cpf && Boolean(formik.errors.cpf)}
                helperText={formik.touched.cpf && formik.errors.cpf}
                placeholder="000.000.000-00"
                sx={{ fontFamily: 'inherit' }}
              />
            ) : (
              <TextField
                fullWidth
                id="cnpj"
                name="cnpj"
                label="CNPJ *"
                value={formik.values.cnpj}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.cnpj && Boolean(formik.errors.cnpj)}
                helperText={formik.touched.cnpj && formik.errors.cnpj}
                placeholder="00.000.000/0000-00"
                sx={{ fontFamily: 'inherit' }}
              />
            )}
            <TextField
              fullWidth
              id="phone"
              name="phone"
              label="Telefone *"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
              sx={{ fontFamily: 'inherit' }}
            />
            <TextField
              fullWidth
              id="mobile"
              name="mobile"
              label="Celular"
              value={formik.values.mobile}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.mobile && Boolean(formik.errors.mobile)}
              helperText={formik.touched.mobile && formik.errors.mobile}
              sx={{ fontFamily: 'inherit' }}
            />
            <TextField
              fullWidth
              id="email"
              name="email"
              label="E-mail *"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
              sx={{ fontFamily: 'inherit' }}
            />
            <Box sx={{ gridColumn: { xs: '1', md: '1 / -1' } }}>
              <TextField
                fullWidth
                id="address"
                name="address"
                label="Endereço"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
                sx={{ fontFamily: 'inherit' }}
              />
            </Box>
            <TextField
              fullWidth
              id="number"
              name="number"
              label="Número"
              value={formik.values.number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.number && Boolean(formik.errors.number)}
              helperText={formik.touched.number && formik.errors.number}
              sx={{ fontFamily: 'inherit' }}
            />
            <TextField
              fullWidth
              id="complement"
              name="complement"
              label="Complemento"
              value={formik.values.complement}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.complement && Boolean(formik.errors.complement)}
              helperText={formik.touched.complement && formik.errors.complement}
              sx={{ fontFamily: 'inherit' }}
            />
            <TextField
              fullWidth
              id="neighborhood"
              name="neighborhood"
              label="Bairro"
              value={formik.values.neighborhood}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.neighborhood && Boolean(formik.errors.neighborhood)}
              helperText={formik.touched.neighborhood && formik.errors.neighborhood}
              sx={{ fontFamily: 'inherit' }}
            />
            <TextField
              fullWidth
              id="city"
              name="city"
              label="Cidade"
              value={formik.values.city}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.city && Boolean(formik.errors.city)}
              helperText={formik.touched.city && formik.errors.city}
              sx={{ fontFamily: 'inherit' }}
            />
            <TextField
              fullWidth
              id="zip_code"
              name="zip_code"
              label="CEP"
              value={formik.values.zip_code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.zip_code && Boolean(formik.errors.zip_code)}
              helperText={formik.touched.zip_code && formik.errors.zip_code}
              placeholder="00000-000"
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