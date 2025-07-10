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
import { emailService, CreateEmailData, UpdateEmailData } from '../../services/emailService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';

export const EmailFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateEmailData>({
    name: '',
    phone: '',
    email: '',
    city: '',
    contact_method: 'Email',
    status: 'pendente',
    message: '',
    internal_notes: '',
  });
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (isEdit && id) {
      loadEmail();
    }
  }, [isEdit, id]);

  const loadEmail = async () => {
    try {
      setLoading(true);
      const email = await emailService.getEmailById(id!);
      setFormData({
        name: email.name,
        phone: email.phone || '',
        email: email.email || '',
        city: email.city || '',
        contact_method: email.contact_method,
        status: email.status,
        message: email.message || '',
        internal_notes: email.internal_notes || '',
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Erro ao carregar email',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateEmailData) => (
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
        await emailService.updateEmail(id, formData as UpdateEmailData);
        setSnackbar({
          open: true,
          message: 'Email atualizado com sucesso!',
          severity: 'success',
        });
      } else {
        await emailService.createEmail(formData);
        setSnackbar({
          open: true,
          message: 'Email criado com sucesso!',
          severity: 'success',
        });
      }

      // Redirecionar após 2 segundos
      setTimeout(() => {
        navigate('/emails');
      }, 2000);
    } catch (err) {
      setSnackbar({
        open: true,
        message: isEdit ? 'Erro ao atualizar email' : 'Erro ao criar email',
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
    
    if (window.confirm('Tem certeza que deseja excluir este email?')) {
      try {
        await emailService.deleteEmail(id);
        setSnackbar({
          open: true,
          message: 'Email excluído com sucesso!',
          severity: 'success',
        });
        setTimeout(() => {
          navigate('/emails');
        }, 2000);
      } catch (err) {
        setSnackbar({
          open: true,
          message: 'Erro ao excluir email',
          severity: 'error',
        });
      }
    }
  };

  if (loading && isEdit) {
    return <LoadingSpinner message="Carregando email..." />;
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
              }} onClick={() => navigate('/emails')}>
                Caixa de Entrada
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
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, boxShadow: 1 }}>
              <Typography variant="h6" gutterBottom sx={{ 
                backgroundColor: '#2c3e50', 
                color: 'white', 
                p: 2, 
                m: -3, 
                mb: 3,
                borderRadius: '4px 4px 0 0'
              }}>
                ID: {isEdit ? id : '0'}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={5}>
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

                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    label="Telefone"
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    placeholder="(99) 99999-9999"
                    size="small"
                    sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="E-mail"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    size="small"
                    sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    label="Cidade"
                    value={formData.city}
                    onChange={handleInputChange('city')}
                    size="small"
                    sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small" required>
                    <InputLabel>Forma do Contato</InputLabel>
                    <Select
                      value={formData.contact_method}
                      onChange={handleInputChange('contact_method')}
                      label="Forma do Contato"
                      sx={{ '& .MuiSelect-select': { fontSize: '0.875rem' } }}
                    >
                      <MenuItem value="Telefone">Telefone</MenuItem>
                      <MenuItem value="Whatsapp">WhatsApp</MenuItem>
                      <MenuItem value="Email">E-mail</MenuItem>
                      <MenuItem value="Outros">Outros</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth size="small" required>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={handleInputChange('status')}
                      label="Status"
                      sx={{ '& .MuiSelect-select': { fontSize: '0.875rem' } }}
                    >
                      <MenuItem value="pendente">Pendente</MenuItem>
                      <MenuItem value="respondido">Respondido</MenuItem>
                      <MenuItem value="contratado">Contratado</MenuItem>
                      <MenuItem value="cancelado">Cancelado</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Observação Interna"
                    value={formData.internal_notes}
                    onChange={handleInputChange('internal_notes')}
                    multiline
                    rows={3}
                    size="small"
                    sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
                  />
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

          {/* Mensagem do Contato e Ações */}
          <Grid item xs={12} md={5}>
            {/* Mensagem do Contato */}
            <Paper sx={{ p: 3, mb: 2, boxShadow: 1 }}>
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
                Mensagem do Contato:
              </Typography>
              
              <TextField
                fullWidth
                multiline
                rows={6}
                value={formData.message}
                onChange={handleInputChange('message')}
                placeholder="Mensagem recebida do formulário de contato..."
                variant="outlined"
                size="small"
                sx={{ '& .MuiInputBase-root': { fontSize: '0.875rem' } }}
              />
            </Paper>

            {/* Ações Disponíveis */}
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
                  onClick={() => navigate('/emails')}
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
                    Excluir Email
                  </Button>
                )}
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