import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Alert,
  CircularProgress,
  Snackbar,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { Cost } from '../../types';
import costService from '../../services/costService';

export const CostsPage: React.FC = () => {
  const navigate = useNavigate();
  const [costs, setCosts] = useState<Cost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });
  const [menuAnchorEls, setMenuAnchorEls] = useState<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    fetchCosts();
  }, []);

  const fetchCosts = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await costService.getCosts();
      setCosts(data.costs);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar custos');
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab: string) => {
    if (tab === 'novo') {
      navigate('/costs/new');
    }
  };

  const handleEditCost = (cost: Cost) => {
    navigate(`/costs/${cost.id}/edit`);
  };

  const handleDeleteCost = async (costId: string) => {
      try {
        await costService.deleteCost(costId);
        setSnackbar({
          open: true,
          message: 'Custo excluído com sucesso!',
          severity: 'success',
        });
        fetchCosts();
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: err.message || 'Erro ao excluir custo',
          severity: 'error',
        });
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
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
                Custos
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
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tabela */}
      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 1 }}>
        <TableContainer>
          <Table className="table table-striped">
            <TableHead>
              <TableRow>
                <TableCell width="70%" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Nome</TableCell>
                <TableCell width="25%" align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Valor (R$)</TableCell>
                <TableCell width="5%"></TableCell>
                {/* Mobile header */}
                <TableCell sx={{ display: { xs: 'table-cell', sm: 'none' } }}>Custo</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {costs && costs.length > 0 ? (
                costs.map((cost) => (
                  <TableRow key={cost.id} hover>
                    {/* Desktop columns */}
                    <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      {cost.name}
                    </TableCell>
                    <TableCell align="right" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                      R$ {Number(cost.value).toFixed(2)}
                    </TableCell>
                    
                    {/* Mobile column */}
                    <TableCell sx={{ display: { xs: 'table-cell', sm: 'none' } }}>
                      <Box>
                        <Box sx={{ fontWeight: 600, color: '#333' }}>
                          {cost.name}
                        </Box>
                        <Box sx={{ fontSize: '0.875rem', color: '#666', mt: 0.5 }}>
                          Valor: R$ {Number(cost.value).toFixed(2)}
                        </Box>
                      </Box>
                    </TableCell>
                    
                    <TableCell align="center">
                      <IconButton size="small" onClick={(e) => handleMenuOpen(e, cost.id)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu
                        anchorEl={menuAnchorEls[cost.id]}
                        open={Boolean(menuAnchorEls[cost.id])}
                        onClose={() => handleMenuClose(cost.id)}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      >
                        <MenuItem onClick={() => { handleEditCost(cost); handleMenuClose(cost.id); }}>
                          <EditIcon fontSize="small" sx={{ mr: 1 }} /> Editar
                        </MenuItem>
                        <MenuItem onClick={() => { handleDeleteCost(cost.id); handleMenuClose(cost.id); }}>
                          <DeleteIcon fontSize="small" sx={{ mr: 1 }} /> Excluir
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Nenhum custo encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
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