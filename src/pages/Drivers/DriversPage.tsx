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
import { Driver } from '../../types';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import driverService from '../../services/driverService';

export const DriversPage: React.FC = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });
  const [menuAnchorEls, setMenuAnchorEls] = useState<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await driverService.getDrivers();
      setDrivers(response.drivers || []);
    } catch (err: any) {
      console.error('Erro ao carregar motoristas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab: string) => {
    if (tab === 'novo') navigate('/drivers/new');
  };

  const handleShowOnlyActive = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowOnlyActive(e.target.checked);
  };

  const handleEdit = (id: string) => {
    navigate(`/drivers/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    setDriverToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!driverToDelete) return;
    try {
      await driverService.deleteDriver(driverToDelete);
      setSnackbar({
        open: true,
        message: 'Motorista excluído com sucesso!',
        severity: 'success',
      });
      fetchDrivers();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erro ao excluir motorista',
        severity: 'error',
      });
    } finally {
      setDeleteDialogOpen(false);
      setDriverToDelete(null);
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

  const filteredDrivers = showOnlyActive
    ? drivers.filter((d) => d.status === 'active')
    : drivers;

  if (loading) {
    return <LoadingSpinner message="Carregando motoristas..." />;
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
          Motoristas
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
                <TableCell width="40%" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Motorista</TableCell>
                <TableCell width="20%" sx={{ display: { xs: 'none', md: 'table-cell' } }}>Telefone</TableCell>
                <TableCell width="25%" sx={{ display: { xs: 'none', lg: 'table-cell' } }}>CNH</TableCell>
                <TableCell width="15%" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Status</TableCell>
                <TableCell width="1%"></TableCell>
                {/* Mobile header */}
                <TableCell sx={{ display: { xs: 'table-cell', sm: 'none' } }}>Motorista</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDrivers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">Nenhum motorista encontrado</TableCell>
                </TableRow>
              ) : (
                filteredDrivers.map((driver) => (
                  <TableRow key={driver.id} hover>
                    {/* Linha verde para ativos */}
                    <TableCell sx={{ 
                      p: '0 !important', 
                      width: 8, 
                      background: driver.status === 'active' ? '#27ae5f' : '#ccc',
                      minWidth: 8
                    }}></TableCell>
                    
                    {/* Desktop columns */}
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      <Button
                        variant="text"
                        sx={{ color: '#333', textTransform: 'none', p: 0, minWidth: 0 }}
                        onClick={() => handleEdit(driver.id)}
                      >
                        {driver.name}
                      </Button>
                    </TableCell>
                    <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>{driver.phone || ''}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>{driver.license_number || 'Não informado'}</TableCell>
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      {driver.status === 'active' ? 'Ativo' : 'Inativo'}
                    </TableCell>
                    
                    {/* Mobile column */}
                    <TableCell sx={{ display: { xs: 'table-cell', sm: 'none' } }}>
                      <Box>
                        <Button
                          variant="text"
                          sx={{ color: '#333', textTransform: 'none', p: 0, minWidth: 0, fontWeight: 600 }}
                          onClick={() => handleEdit(driver.id)}
                        >
                          {driver.name}
                        </Button>
                        <Box sx={{ fontSize: '0.875rem', color: '#666', mt: 0.5 }}>
                          {driver.phone && <div>Tel: {driver.phone}</div>}
                          {driver.license_number && <div>CNH: {driver.license_number}</div>}
                          <div>Status: {driver.status === 'active' ? 'Ativo' : 'Inativo'}</div>
                        </Box>
      </Box>
                    </TableCell>
                    
                    <TableCell align="center">
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, driver.id)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={menuAnchorEls[driver.id]}
                        open={Boolean(menuAnchorEls[driver.id])}
                        onClose={() => handleMenuClose(driver.id)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      >
                        <MenuItem onClick={() => { handleEdit(driver.id); handleMenuClose(driver.id); }}>Editar</MenuItem>
                        <MenuItem onClick={() => { handleDelete(driver.id); handleMenuClose(driver.id); }}>Excluir</MenuItem>
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
        message="Tem certeza que deseja excluir este motorista? Esta ação não pode ser desfeita."
        onConfirm={confirmDelete}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setDriverToDelete(null);
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