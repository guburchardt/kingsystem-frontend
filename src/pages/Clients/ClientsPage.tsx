import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import clientService from '../../services/clientService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

export const ClientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });
  const [menuAnchorEls, setMenuAnchorEls] = useState<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await clientService.getClients();
      setClients(response.clients || []);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab: string) => {
    if (tab === 'novo') navigate('/clients/new');
  };

  const handleShowOnlyActive = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowOnlyActive(e.target.checked);
  };

  const handleEdit = (id: string) => {
    navigate(`/clients/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    setClientToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!clientToDelete) return;
    try {
      await clientService.deleteClient(clientToDelete);
      setSnackbar({
        open: true,
        message: 'Cliente excluído com sucesso!',
        severity: 'success',
      });
      fetchClients();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.message || 'Erro ao excluir cliente',
        severity: 'error',
      });
    } finally {
      setDeleteDialogOpen(false);
      setClientToDelete(null);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchorEls((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  const handleMenuClose = (id: string) => {
    setMenuAnchorEls((prev) => ({ ...prev, [id]: null }));
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const filteredClients = showOnlyActive
    ? clients.filter((c) => c.status === 'active' || c.status === 'Ativo')
    : clients;

  if (loading) {
    return <LoadingSpinner message="Carregando clientes..." />;
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
              Clientes
            </Button>
          </li>
          <li>
              <Button variant="text" sx={{ 
                borderRadius: 0, 
                color: '#333',
                fontSize: { xs: '0.875rem', sm: '1rem' },
                minWidth: { xs: 'auto', sm: 'auto' },
                px: { xs: 1, sm: 2 }
              }} onClick={() => handleTabClick('novo')}>
              Novo Registro
            </Button>
          </li>
        </Box>
        {/* Checkbox "Mostrar somente ativos" */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            mt: { xs: 1, sm: 0 }
          }}>
          <Checkbox
            checked={showOnlyActive}
            onChange={handleShowOnlyActive}
            size="small"
            sx={{ p: 0, mr: 1 }}
            id="active"
          />
            <label htmlFor="active" style={{ 
              fontSize: 14, 
              color: '#888', 
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}>
              Mostrar somente ativos
            </label>
          </Box>
        </Box>
      </Box>

      {/* Tabela */}
      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 1 }}>
        <TableContainer>
          <Table className="table table-striped">
            <TableHead>
              <TableRow>
                <TableCell sx={{ p: 0, width: 8, background: 'none' }}></TableCell>
                <TableCell width="30%" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Cliente</TableCell>
                <TableCell width="15%" sx={{ display: { xs: 'none', md: 'table-cell' } }}>Contatos</TableCell>
                <TableCell width="28%" sx={{ display: { xs: 'none', md: 'table-cell' } }}>E-mail</TableCell>
                <TableCell width="17%" sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Cidade</TableCell>
                <TableCell width="10%" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Status</TableCell>
                <TableCell width="1%"></TableCell>
                {/* Mobile header */}
                <TableCell sx={{ display: { xs: 'table-cell', sm: 'none' } }}>Cliente</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} align="center">Nenhum cliente encontrado</TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id} hover>
                    {/* Linha verde para ativos */}
                    <TableCell sx={{ 
                      p: '0 !important', 
                      width: 8, 
                      background: client.status === 'active' ? '#27ae5f' : '#ccc',
                      minWidth: 8
                    }}></TableCell>
                    
                    {/* Desktop columns */}
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Button
                        variant="text"
                        sx={{ color: '#333', textTransform: 'none', p: 0, minWidth: 0 }}
                        onClick={() => handleEdit(client.id)}
                      >
                        {client.name}
                      </Button>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{client.phone || ''}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{client.email || ''}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{client.city || ''}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      {client.status === 'active' ? 'Ativo' : 'Inativo'}
                    </TableCell>
                    
                    {/* Mobile column */}
                    <TableCell sx={{ display: { xs: 'table-cell', sm: 'none' } }}>
                      <Box>
                        <Button
                          variant="text"
                          sx={{ color: '#333', textTransform: 'none', p: 0, minWidth: 0, fontWeight: 600 }}
                          onClick={() => handleEdit(client.id)}
                        >
                          {client.name}
                        </Button>
                        <Box sx={{ fontSize: '0.875rem', color: '#666', mt: 0.5 }}>
                          {client.phone && <div>{client.phone}</div>}
                          {client.email && <div>{client.email}</div>}
                          <div>Status: {client.status === 'active' ? 'Ativo' : 'Inativo'}</div>
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell align="center">
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, client.id)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={menuAnchorEls[client.id]}
                        open={Boolean(menuAnchorEls[client.id])}
                        onClose={() => handleMenuClose(client.id)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      >
                        <MenuItem onClick={() => { handleEdit(client.id); handleMenuClose(client.id); }}>Editar</MenuItem>
                        <MenuItem onClick={() => { handleDelete(client.id); handleMenuClose(client.id); }}>Excluir</MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setClientToDelete(null);
        }}
        confirmText="Excluir"
        cancelText="Cancelar"
        severity="error"
      />

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