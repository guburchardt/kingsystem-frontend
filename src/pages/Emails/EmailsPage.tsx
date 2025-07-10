import React, { useState, useEffect, useCallback } from 'react';
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
  FormControl,
  Select,
  Typography,
  Grid,
  Avatar,
  Tooltip,
  Checkbox,
  styled,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  WhatsApp as WhatsAppIcon,
  ContactMail as ContactIcon,
  NavigateBefore as NavigateBeforeIcon,
  NavigateNext as NavigateNextIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { emailService, Email, EmailStats } from '../../services/emailService';
import { userService } from '../../services/userService';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';

// Sistema de cores pastéis para emails baseado no status
const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'rowClass',
})<{ rowClass: string }>(({ rowClass }) => {
  const getRowStyles = () => {
    switch (rowClass) {
      case 'pendente': // Pendente - Laranja pastel
        return {
          backgroundColor: '#fff3cd',
          color: '#856404',
          '& .MuiTableCell-root': {
            color: '#856404',
            borderBottom: '1px solid rgba(133, 100, 4, 0.1)',
            padding: '8px',
            fontSize: '0.875rem',
          },
          '& a': {
            color: '#856404',
            textDecoration: 'none',
            fontWeight: 'normal',
          },
        };
      case 'respondido': // Respondido - Azul pastel
        return {
          backgroundColor: '#cce7ff',
          color: '#0056b3',
          '& .MuiTableCell-root': {
            color: '#0056b3',
            borderBottom: '1px solid rgba(0, 86, 179, 0.1)',
            padding: '8px',
            fontSize: '0.875rem',
          },
          '& a': {
            color: '#0056b3',
            textDecoration: 'none',
            fontWeight: 'normal',
          },
        };
      case 'contratado': // Contratado - Verde pastel
        return {
          backgroundColor: '#d4edda',
          color: '#155724',
          '& .MuiTableCell-root': {
            color: '#155724',
            borderBottom: '1px solid rgba(21, 87, 36, 0.1)',
            padding: '8px',
            fontSize: '0.875rem',
          },
          '& a': {
            color: '#155724',
            textDecoration: 'none',
            fontWeight: 'normal',
          },
        };
      case 'cancelado': // Cancelado - Rosa pastel
        return {
          backgroundColor: '#f8d7da',
          color: '#721c24',
          '& .MuiTableCell-root': {
            color: '#721c24',
            borderBottom: '1px solid rgba(114, 28, 36, 0.1)',
            padding: '8px',
            fontSize: '0.875rem',
          },
          '& a': {
            color: '#721c24',
            textDecoration: 'none',
            fontWeight: 'normal',
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

export const EmailsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [emails, setEmails] = useState<Email[]>([]);
  const [stats, setStats] = useState<EmailStats>({
    pendente: 0,
    respondido: 0,
    contratado: 0,
    cancelado: 0,
    total: 0,
  });
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filtros
  const [currentTab, setCurrentTab] = useState('todos');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [contactMethodFilter, setContactMethodFilter] = useState('');
  const [showOnlyPending, setShowOnlyPending] = useState(false);
  
  // Menu actions
  const [menuAnchorEls, setMenuAnchorEls] = useState<{ [key: string]: HTMLElement | null }>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const status = currentTab === 'todos' ? '' : currentTab;
      const filters = {
        status,
        contact_method: contactMethodFilter,
        month: currentMonth,
        year: currentYear,
      };

      const [emailsData, statsData] = await Promise.all([
        emailService.getEmails(filters),
        emailService.getEmailStats({ month: currentMonth, year: currentYear }),
      ]);

      let filteredEmails = emailsData;
      if (showOnlyPending) {
        filteredEmails = emailsData.filter(email => email.status === 'pendente');
      }

      setEmails(filteredEmails);
      setStats(statsData);
    } catch (err: any) {
      console.error('Erro ao carregar emails:', err);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar emails',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [currentTab, currentMonth, currentYear, contactMethodFilter, showOnlyPending]);

  useEffect(() => {
    fetchData();
    fetchUsers();
  }, [fetchData]);

  const fetchUsers = async () => {
    try {
      const usersData = await userService.getUsers();
      setUsers(usersData.users || []);
    } catch (err) {
      console.error('Error loading users:', err);
      setUsers([]);
    }
  };

  const handleTabClick = (tab: string) => {
    if (tab === 'novo') {
      navigate('/emails/new');
    } else {
      setCurrentTab(tab);
    }
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const handleContactMethodChange = (event: any) => {
    setContactMethodFilter(event.target.value);
  };

  const handleShowOnlyPending = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowOnlyPending(e.target.checked);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setMenuAnchorEls((prev) => ({ ...prev, [id]: event.currentTarget }));
  };

  const handleMenuClose = (id: string) => {
    setMenuAnchorEls((prev) => ({ ...prev, [id]: null }));
  };

  const handleEdit = (id: string) => {
    navigate(`/emails/${id}/edit`);
    handleMenuClose(id);
  };

  const handleDelete = (id: string) => {
    setEmailToDelete(id);
    setDeleteDialogOpen(true);
    handleMenuClose(id);
  };

  const confirmDelete = async () => {
    if (!emailToDelete) return;
    try {
      await emailService.deleteEmail(emailToDelete);
      setSnackbar({
        open: true,
        message: 'Email excluído com sucesso!',
        severity: 'success',
      });
      fetchData();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erro ao excluir email',
        severity: 'error',
      });
    } finally {
      setDeleteDialogOpen(false);
      setEmailToDelete(null);
    }
  };

  const handleAssignUser = async (emailId: string, userId: string) => {
    try {
      await emailService.assignEmail(emailId, userId);
      setSnackbar({
        open: true,
        message: 'Consultor atribuído com sucesso!',
        severity: 'success',
      });
      fetchData();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erro ao atribuir consultor',
        severity: 'error',
      });
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getContactIcon = (method: string) => {
    switch (method) {
      case 'Email':
        return <EmailIcon sx={{ fontSize: 16 }} />;
      case 'Telefone':
        return <PhoneIcon sx={{ fontSize: 16 }} />;
      case 'Whatsapp':
        return <WhatsAppIcon sx={{ fontSize: 16 }} />;
      default:
        return <ContactIcon sx={{ fontSize: 16 }} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'warning';
      case 'respondido':
        return 'info';
      case 'contratado':
        return 'success';
      case 'cancelado':
        return 'error';
      default:
        return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'respondido':
        return 'Respondido';
      case 'contratado':
        return 'Contratado';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  if (loading) {
    return <LoadingSpinner message="Carregando emails..." />;
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
            <li className={currentTab === 'todos' ? 'active' : ''}>
              <Button variant="text" sx={{ 
                borderRadius: 0, 
                borderBottom: currentTab === 'todos' ? '2px solid #e67e22' : 'none',
                color: currentTab === 'todos' ? '#e67e22' : '#333',
                fontWeight: currentTab === 'todos' ? 600 : 400,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                minWidth: { xs: 'auto', sm: 'auto' },
                px: { xs: 1, sm: 2 }
              }} onClick={() => handleTabClick('todos')}>
                Caixa de Entrada ({stats.total})
              </Button>
            </li>
            <li className={currentTab === 'pendente' ? 'active' : ''}>
              <Button variant="text" sx={{ 
                borderRadius: 0, 
                borderBottom: currentTab === 'pendente' ? '2px solid #e67e22' : 'none',
                color: currentTab === 'pendente' ? '#e67e22' : '#333',
                fontWeight: currentTab === 'pendente' ? 600 : 400,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                minWidth: { xs: 'auto', sm: 'auto' },
                px: { xs: 1, sm: 2 }
              }} onClick={() => handleTabClick('pendente')}>
                Pendentes ({stats.pendente})
              </Button>
            </li>
            <li className={currentTab === 'respondido' ? 'active' : ''}>
              <Button variant="text" sx={{ 
                borderRadius: 0, 
                borderBottom: currentTab === 'respondido' ? '2px solid #e67e22' : 'none',
                color: currentTab === 'respondido' ? '#e67e22' : '#333',
                fontWeight: currentTab === 'respondido' ? 600 : 400,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                minWidth: { xs: 'auto', sm: 'auto' },
                px: { xs: 1, sm: 2 }
              }} onClick={() => handleTabClick('respondido')}>
                Respondidos ({stats.respondido})
              </Button>
            </li>
            <li className={currentTab === 'contratado' ? 'active' : ''}>
              <Button variant="text" sx={{ 
                borderRadius: 0, 
                borderBottom: currentTab === 'contratado' ? '2px solid #e67e22' : 'none',
                color: currentTab === 'contratado' ? '#e67e22' : '#333',
                fontWeight: currentTab === 'contratado' ? 600 : 400,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                minWidth: { xs: 'auto', sm: 'auto' },
                px: { xs: 1, sm: 2 }
              }} onClick={() => handleTabClick('contratado')}>
                Contratados ({stats.contratado})
              </Button>
            </li>
            <li className={currentTab === 'cancelado' ? 'active' : ''}>
              <Button variant="text" sx={{ 
                borderRadius: 0, 
                borderBottom: currentTab === 'cancelado' ? '2px solid #e67e22' : 'none',
                color: currentTab === 'cancelado' ? '#e67e22' : '#333',
                fontWeight: currentTab === 'cancelado' ? 600 : 400,
                fontSize: { xs: '0.875rem', sm: '1rem' },
                minWidth: { xs: 'auto', sm: 'auto' },
                px: { xs: 1, sm: 2 }
              }} onClick={() => handleTabClick('cancelado')}>
                Cancelados ({stats.cancelado})
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

      {/* Filtros */}
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={3}>
            <FormControl fullWidth size="small">
              <Select
                value={contactMethodFilter}
                onChange={handleContactMethodChange}
                displayEmpty
                sx={{ minWidth: 120 }}
              >
                <MenuItem value="">Todos os Contatos</MenuItem>
                <MenuItem value="Email">E-mail</MenuItem>
                <MenuItem value="Telefone">Telefone</MenuItem>
                <MenuItem value="Whatsapp">WhatsApp</MenuItem>
                <MenuItem value="Outros">Outros</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <IconButton onClick={() => handleMonthChange('prev')} size="small">
                <NavigateBeforeIcon />
              </IconButton>
              <Typography variant="body2" sx={{ minWidth: 120, textAlign: 'center' }}>
                {months[currentMonth - 1]} | {currentYear}
              </Typography>
              <IconButton onClick={() => handleMonthChange('next')} size="small">
                <NavigateNextIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Checkbox
                checked={showOnlyPending}
                onChange={handleShowOnlyPending}
                size="small"
                sx={{ p: 0, mr: 1 }}
                id="pending"
              />
              <label htmlFor="pending" style={{ 
                fontSize: 14, 
                color: '#888', 
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}>
                Mostrar somente pendentes
              </label>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Tabela */}
      <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: 1 }}>
        <TableContainer>
          <Table className="table table-striped">
            <TableHead>
              <TableRow>
                <TableCell sx={{ p: 0, width: 8, background: 'none' }}></TableCell>
                <TableCell width="8%" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Data</TableCell>
                <TableCell width="3%" sx={{ display: { xs: 'none', sm: 'table-cell' } }}></TableCell>
                <TableCell width="20%" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Remetente</TableCell>
                <TableCell width="20%" sx={{ display: { xs: 'none', md: 'table-cell' } }}>Telefone/Email</TableCell>
                <TableCell width="15%" sx={{ display: { xs: 'none', md: 'table-cell' } }}>Consultor</TableCell>
                <TableCell width="20%" sx={{ display: { xs: 'none', lg: 'table-cell' } }}>Observação</TableCell>
                <TableCell width="10%" sx={{ display: { xs: 'none', sm: 'table-cell' } }}>Status</TableCell>
                <TableCell width="4%"></TableCell>
                {/* Mobile header */}
                <TableCell sx={{ display: { xs: 'table-cell', sm: 'none' } }}>Email</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {emails.map((email) => (
                <StyledTableRow key={email.id} rowClass={email.status}>
                  <TableCell sx={{ p: 0, width: 8, background: 'none' }}></TableCell>
                  
                  {/* Desktop view */}
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      {emailService.formatDate(email.created_at).substring(0, 5)}
                    </Typography>
                  </TableCell>
                  
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Tooltip title={email.contact_method}>
                      <Avatar sx={{ width: 24, height: 24, bgcolor: 'transparent' }}>
                        {getContactIcon(email.contact_method)}
                      </Avatar>
                    </Tooltip>
                  </TableCell>
                  
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold" sx={{ fontSize: '0.875rem' }}>
                        {email.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {email.city}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                        {email.phone}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {email.email}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell sx={{ display: { xs: 'none', md: 'table-cell' } }}>
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <Select
                        value={email.assigned_to || ''}
                        onChange={(e) => handleAssignUser(email.id, e.target.value)}
                        displayEmpty
                        sx={{ fontSize: '0.875rem' }}
                      >
                        <MenuItem value="">Selecione</MenuItem>
                        {users.map((user) => (
                          <MenuItem key={user.id} value={user.id}>
                            {user.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </TableCell>
                  
                  <TableCell sx={{ display: { xs: 'none', lg: 'table-cell' } }}>
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200, fontSize: '0.875rem' }}>
                      {email.internal_notes}
                    </Typography>
                  </TableCell>
                  
                  <TableCell sx={{ display: { xs: 'none', sm: 'table-cell' } }}>
                    <Chip
                      label={getStatusLabel(email.status)}
                      color={getStatusColor(email.status) as any}
                      size="small"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, email.id)}
                      size="small"
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={menuAnchorEls[email.id]}
                      open={Boolean(menuAnchorEls[email.id])}
                      onClose={() => handleMenuClose(email.id)}
                    >
                      <MenuItem onClick={() => handleEdit(email.id)}>
                        <EditIcon sx={{ mr: 1 }} />
                        Editar
                      </MenuItem>
                      <MenuItem onClick={() => handleDelete(email.id)}>
                        <DeleteIcon sx={{ mr: 1 }} />
                        Excluir
                      </MenuItem>
                    </Menu>
                  </TableCell>
                  
                  {/* Mobile view */}
                  <TableCell sx={{ display: { xs: 'table-cell', sm: 'none' } }}>
                    <Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        {getContactIcon(email.contact_method)}
                        <Typography variant="body2" fontWeight="bold">
                          {email.name}
                        </Typography>
                        <Chip
                          label={getStatusLabel(email.status)}
                          color={getStatusColor(email.status) as any}
                          size="small"
                        />
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {email.city} • {emailService.formatDate(email.created_at).substring(0, 5)}
                      </Typography>
                      <br />
                      <Typography variant="caption" color="text.secondary">
                        {email.phone} • {email.email}
                      </Typography>
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
        <Typography variant="body2" color="text.secondary">
          Exibindo {emails.length} de {emails.length} registros
        </Typography>
      </Box>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este email?"
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