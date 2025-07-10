import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import { Save as SaveIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { userService } from '../../services/userService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

interface ConsultorFormData {
  name: string;
  email: string;
  username: string;
  password?: string;
  role: 'admin' | 'seller';
  status: 'active' | 'inactive';
}

export const ConsultorFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ConsultorFormData>({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'seller',
    status: 'active',
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (isEdit && id) {
      loadConsultor();
    }
  }, [isEdit, id]);

  const loadConsultor = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserById(id!);
      const user = response.user;
      setFormData({
        name: user.name,
        email: user.email,
        username: user.username || user.email,
        password: '', // Não carregar senha por segurança
        role: user.role,
        status: user.status,
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Erro ao carregar consultor',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ConsultorFormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const value = event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    try {
      setLoading(true);

      if (isEdit && id) {
        // Para edição, não enviar senha se estiver vazia
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await userService.updateUser(id, updateData);
        setSnackbar({
          open: true,
          message: 'Consultor atualizado com sucesso!',
          severity: 'success',
        });
      } else {
        await userService.createUser(formData);
        setSnackbar({
          open: true,
          message: 'Consultor criado com sucesso!',
          severity: 'success',
        });
      }

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/consultores');
      }, 2000);
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || (isEdit ? 'Erro ao atualizar consultor' : 'Erro ao criar consultor'),
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDelete = async () => {
    if (!isEdit || !id) return;
    
    if (window.confirm('Tem certeza que deseja excluir este consultor?')) {
      try {
        await userService.deleteUser(id);
        setSnackbar({
          open: true,
          message: 'Consultor excluído com sucesso!',
          severity: 'success',
        });
        setTimeout(() => {
          navigate('/consultores');
        }, 2000);
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err.response?.data?.message || 'Erro ao excluir consultor',
          severity: 'error',
        });
      }
    }
  };

  if (loading && isEdit) {
    return <LoadingSpinner message="Carregando consultor..." />;
  }

  return (
    <Box className="page-content" sx={{ p: { xs: 1, sm: 2 } }}>
      {/* Tabs */}
      <Box className="tabbable page-tabs" sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' }, 
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: { xs: 1, sm: 0 }
        }}>
          <Box component="ul" className="nav nav-tabs" sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            p: 0, 
            m: 0, 
            listStyle: 'none',
            gap: 1
          }}>
            <li>
              <Button variant="text" sx={{ 
                borderRadius: 0, 
                color: '#333',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                minWidth: { xs: 'auto', sm: 'auto' },
                px: { xs: 1, sm: 2 }
              }} onClick={() => navigate('/consultores')}>
                Consultores
              </Button>
            </li>
            <li className="active">
              <Button variant="text" sx={{ 
                borderRadius: 0, 
                borderBottom: '2px solid #e67e22', 
                color: '#e67e22', 
                fontWeight: 600,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                minWidth: { xs: 'auto', sm: 'auto' },
                px: { xs: 1, sm: 2 }
              }} disabled>
                {isEdit ? 'Edição' : 'Novo Registro'}
              </Button>
            </li>
          </Box>
        </Box>
      </Box>

      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Formulário Principal */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, boxShadow: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                backgroundColor: '#2c3e50', 
                color: 'white', 
                p: 2, 
                m: -3, 
                mb: 3,
                borderRadius: '4px 4px 0 0'
              }}>
                {isEdit ? `Editar Consultor - ID: ${id}` : 'Novo Consultor'}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Nome"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    required
                    size="small"
                    sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small" required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={handleInputChange('status')}
                      label="Status"
                      sx={{ '& .MuiSelect-select': { fontSize: '0.875rem' } }}
                    >
                      <MenuItem value="active">Ativo</MenuItem>
                      <MenuItem value="inactive">Inativo</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="E-mail"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    required
                    size="small"
                    sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Login"
                    value={formData.username}
                    onChange={handleInputChange('username')}
                    required
                    size="small"
                    sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label={isEdit ? "Nova Senha (deixe vazio para manter)" : "Senha"}
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    required={!isEdit}
                    size="small"
                    sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth size="small" required>
                    <InputLabel>Admin</InputLabel>
                    <Select
                      value={formData.role}
                      onChange={handleInputChange('role')}
                      label="Admin"
                      sx={{ '& .MuiSelect-select': { fontSize: '0.875rem' } }}
                    >
                      <MenuItem value="seller">Não (Vendedor)</MenuItem>
                      <MenuItem value="admin">Sim (Admin)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={<SaveIcon />}
                      disabled={loading}
                      fullWidth
                      size="large"
                      sx={{ 
                        backgroundColor: '#27ae60',
                        '&:hover': { backgroundColor: '#2ecc71' },
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    >
                      {loading ? 'Salvando...' : 'Clique para Salvar'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Ações Disponíveis */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, boxShadow: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                backgroundColor: '#ecf0f1', 
                color: '#2c3e50', 
                p: 2, 
                m: -3, 
                mb: 3,
                borderRadius: '4px 4px 0 0',
                fontSize: '1rem',
                fontWeight: 600
              }}>
                Ações Disponíveis:
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="outlined"
                  startIcon={<ArrowBackIcon />}
                  onClick={() => navigate('/consultores')}
                  fullWidth
                  sx={{ 
                    borderColor: '#34495e',
                    color: '#34495e',
                    '&:hover': { 
                      borderColor: '#2c3e50',
                      backgroundColor: '#ecf0f1'
                    }
                  }}
                >
                  Voltar para Lista
                </Button>
                
                {isEdit && (
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={handleDelete}
                    fullWidth
                    sx={{ 
                      borderColor: '#e74c3c',
                      color: '#e74c3c',
                      '&:hover': { 
                        borderColor: '#c0392b',
                        backgroundColor: '#fadbd8'
                      }
                    }}
                  >
                    Excluir Consultor
                  </Button>
                )}
              </Box>
            </Paper>

            {/* Informações do Sistema */}
            <Paper sx={{ p: 3, mt: 2, boxShadow: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                backgroundColor: '#ecf0f1', 
                color: '#2c3e50', 
                p: 2, 
                m: -3, 
                mb: 3,
                borderRadius: '4px 4px 0 0',
                fontSize: '1rem',
                fontWeight: 600
              }}>
                Informações:
              </Typography>
              
              <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Admin:</strong> Acesso total ao sistema
                </Typography>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  <strong>Vendedor:</strong> Acesso limitado às suas funções
                </Typography>
                <Typography variant="body2">
                  <strong>Status Inativo:</strong> Bloqueia o acesso ao sistema
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </form>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 