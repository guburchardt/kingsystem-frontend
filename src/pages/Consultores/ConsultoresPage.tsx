import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
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
  Chip,
  Checkbox,
  styled,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

// Sistema de cores para status dos consultores
const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'rowClass',
})<{ rowClass: string }>(({ rowClass }) => {
  const getRowStyles = () => {
    switch (rowClass) {
      case 'active': // Ativo - Verde
        return {
          '& .MuiTableCell-root': {
            padding: '8px',
            fontSize: '0.875rem',
          },
          '& td:first-of-type': {
            backgroundColor: '#27ae5f',
            padding: '0px 3px !important',
            width: '8px',
          },
        };
      case 'inactive': // Inativo - Vermelho
        return {
          '& .MuiTableCell-root': {
            padding: '8px',
            fontSize: '0.875rem',
          },
          '& td:first-of-type': {
            backgroundColor: '#d65c4f',
            padding: '0px 3px !important',
            width: '8px',
          },
        };
      default:
        return {
          '& .MuiTableCell-root': {
            padding: '8px',
            fontSize: '0.875rem',
          },
        };
    }
  };

  return getRowStyles();
});

export const ConsultoresPage: React.FC = () => {
  const navigate = useNavigate();
  const [consultores, setConsultores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOnlyActive, setShowOnlyActive] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [consultorToDelete, setConsultorToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });
  const [menuAnchorEls, setMenuAnchorEls] = useState<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    fetchConsultores();
  }, []);

  const fetchConsultores = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers();
      setConsultores(response.users || []);
    } catch (err: any) {
      console.error('Erro ao carregar consultores:', err);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar consultores',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tab: string) => {
    if (tab === 'novo') navigate('/consultores/new');
  };

  const handleShowOnlyActive = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowOnlyActive(e.target.checked);
  };

  const handleEdit = (id: string) => {
    navigate(`/consultores/${id}/edit`);
  };

  const handleDelete = (id: string) => {
    setConsultorToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!consultorToDelete) return;
    try {
      await userService.deleteUser(consultorToDelete);
      setSnackbar({
        open: true,
        message: 'Consultor excluído com sucesso!',
        severity: 'success',
      });
      fetchConsultores();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erro ao excluir consultor',
        severity: 'error',
      });
    } finally {
      setDeleteDialogOpen(false);
      setConsultorToDelete(null);
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

  const getStatusLabel = (status: string) => {
    return status === 'active' ? 'Ativo' : 'Inativo';
  };

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'success' : 'error';
  };

  const filteredConsultores = showOnlyActive
    ? consultores.filter((c) => c.status === 'active')
    : consultores;

  if (loading) {
    return <LoadingSpinner message="Carregando consultores..." />;
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
                Consultores
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
                <TableCell width="90%" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Consultor</TableCell>
                <TableCell width="10%" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Status</TableCell>
                <TableCell width="1%"></TableCell>
                {/* Mobile header */}
                <TableCell sx={{ display: { xs: 'table-cell', sm: 'none' } }}>Consultor</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredConsultores.map((consultor) => (
                <StyledTableRow key={consultor.id} rowClass={consultor.status}>
                  <TableCell sx={{ p: 0, width: 8, background: 'none' }}></TableCell>
                  
                  {/* Desktop view */}
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Button
                      variant="text"
                      onClick={() => handleEdit(consultor.id)}
                      sx={{ 
                        textTransform: 'none',
                        color: 'inherit',
                        fontSize: '0.875rem',
                        fontWeight: 'normal',
                        p: 0,
                        minWidth: 'auto',
                        justifyContent: 'flex-start'
                      }}
                    >
                      {consultor.name}
                    </Button>
                  </TableCell>
                  
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Chip
                      label={getStatusLabel(consultor.status)}
                      color={getStatusColor(consultor.status) as any}
                      size="small"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, consultor.id)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={menuAnchorEls[consultor.id]}
                      open={Boolean(menuAnchorEls[consultor.id])}
                      onClose={() => handleMenuClose(consultor.id)}
                    >
                      <MenuItem onClick={() => { handleEdit(consultor.id); handleMenuClose(consultor.id); }}>
                        Editar
                      </MenuItem>
                      <MenuItem onClick={() => { handleDelete(consultor.id); handleMenuClose(consultor.id); }}>
                        Excluir
                      </MenuItem>
                    </Menu>
                  </TableCell>
                  
                  {/* Mobile view */}
                  <TableCell sx={{ display: { xs: 'table-cell', sm: 'none' } }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Button
                          variant="text"
                          onClick={() => handleEdit(consultor.id)}
                          sx={{ 
                            textTransform: 'none',
                            color: 'inherit',
                            fontSize: '0.875rem',
                            fontWeight: 'bold',
                            p: 0,
                            minWidth: 'auto'
                          }}
                        >
                          {consultor.name}
                        </Button>
                        <Chip
                          label={getStatusLabel(consultor.status)}
                          color={getStatusColor(consultor.status) as any}
                          size="small"
                        />
                      </Box>
                      <Box sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                        {consultor.email} • {consultor.role === 'admin' ? 'Admin' : 'Vendedor'}
                      </Box>
                    </Box>
                  </TableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Informações de paginação */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Box sx={{ fontSize: '0.875rem', color: 'text.secondary' }}>
          Exibindo {filteredConsultores.length} de {consultores.length} registros
        </Box>
      </Box>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este consultor?"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
      />

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