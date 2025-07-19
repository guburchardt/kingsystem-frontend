import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  Alert,
  Snackbar,
  Chip,
  Tab,
  Tabs,
  Menu,
  MenuItem,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  Grid,
  Drawer,
  useTheme,
  useMediaQuery,
  Divider,
  styled,
} from '@mui/material';
import {
  Add as AddIcon,
  FilterList as FilterListIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  MoreVert as MoreVertIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  MonetizationOn as MonetizationOnIcon,
  Chat as ChatIcon,
  ContactPhone as ContactPhoneIcon,
  Instagram as InstagramIcon,
  Person as PersonIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { Rental } from '../../types';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import rentalService from '../../services/rentalService';
import vehicleService from '../../services/vehicleService';
import { formatDateBR, formatCurrencyBR } from '../../utils/dateUtils';
import { useAuth } from '../../contexts/AuthContext';

interface ColorFilterCounts {
  todas: number;
  cinza: number;
  vermelho: number; // Pagamentos atrasados
  azul: number;
  verde: number;
  azulClaro: number;
  rosa: number;
  laranja: number;
  roxo: number; // Limo Bus quitado
  roxoClaro: number; // Limo Bus pendente
  hoje: number;
  concluidas: number;
}

// Sistema de cores pastéis para melhor leitura
const StyledTableRow = styled(TableRow, {
  shouldForwardProp: (prop) => prop !== 'rowClass',
})<{ rowClass: string }>(({ rowClass }) => {
  const getRowStyles = () => {
    switch (rowClass) {
      case 'cinza': // 1. Locações que data do evento passou
        return {
          backgroundColor: '#e9ecef', // Cinza pastel
          color: '#495057',
          '& .MuiTableCell-root': {
            color: '#495057',
            borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
            padding: '8px',
            fontSize: '0.875rem',
          },
          '& a': {
            color: '#495057',
            textDecoration: 'none',
            fontWeight: 'normal',
          },
        };
      case 'vermelho': // 2. Pagamentos atrasados (ALTA PRIORIDADE) - COR CHAMATIVA
        return {
          backgroundColor: '#ffebee', // Vermelho muito claro mas vibrante
          color: '#c62828',
          border: '2px solid #f44336', // Borda vermelha chamativa
          boxShadow: '0 0 10px rgba(244, 67, 54, 0.3)', // Sombra vermelha
          '& .MuiTableCell-root': {
            color: '#c62828',
            borderBottom: '2px solid #f44336',
            padding: '8px',
            fontSize: '0.875rem',
            fontWeight: '900', // Extra bold para máximo destaque
            backgroundColor: '#ffcdd2', // Fundo ainda mais chamativo
            textShadow: '0 0 3px rgba(198, 40, 40, 0.5)', // Sombra no texto
          },
          '& a': {
            color: '#c62828',
            textDecoration: 'none',
            fontWeight: '900',
            textShadow: '0 0 3px rgba(198, 40, 40, 0.5)',
          },
        };
      case 'azul': // 3. Limo Black quitado
        return {
          backgroundColor: '#cce7ff', // Azul pastel
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
      case 'roxo': // 4. Limo Bus quitada
        return {
          backgroundColor: '#e2d5f1', // Roxo pastel
          color: '#6f42c1',
          '& .MuiTableCell-root': {
            color: '#6f42c1',
            borderBottom: '1px solid rgba(111, 66, 193, 0.1)',
            padding: '8px',
            fontSize: '0.875rem',
          },
          '& a': {
            color: '#6f42c1',
            textDecoration: 'none',
            fontWeight: 'normal',
          },
        };
      case 'verde': // 5. Locações que parcelas foram totalmente pagas
        return {
          backgroundColor: '#d4edda', // Verde pastel
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
      case 'azulClaro': // 6. Com pendência limo black
        return {
          backgroundColor: '#d1ecf1', // Azul claro pastel
          color: '#0c5460',
          '& .MuiTableCell-root': {
            color: '#0c5460',
            borderBottom: '1px solid rgba(12, 84, 96, 0.1)',
            padding: '8px',
            fontSize: '0.875rem',
          },
          '& a': {
            color: '#0c5460',
            textDecoration: 'none',
            fontWeight: 'normal',
          },
        };
      case 'roxoClaro': // 7. Com pendência limo bus
        return {
          backgroundColor: '#f3e8ff', // Roxo claro pastel
          color: '#8b5cf6',
          '& .MuiTableCell-root': {
            color: '#8b5cf6',
            borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
            padding: '8px',
            fontSize: '0.875rem',
          },
          '& a': {
            color: '#8b5cf6',
            textDecoration: 'none',
            fontWeight: 'normal',
          },
        };
      case 'rosa': // 8. Com pendência qualquer veículo
        return {
          backgroundColor: '#f8d7da', // Rosa pastel
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
      
        case 'laranja': // 9. Aguardando aprovação (pré reserva - nada pago)
          return {
            backgroundColor: '#fff3cd', // Laranja pastel
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

const getRowClass = (rental: Rental) => {
  // Ordem de precedência conforme especificado
  
  // 1. CINZA: Data do evento passou
  const eventDate = new Date(rental.event_date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  
  if (eventDate < today) {
    return 'cinza';
  }
  
  // 2. VERMELHO: Pagamentos atrasados (ALTA PRIORIDADE)
  // Verificar se tem pagamentos atrasados baseado no status de pagamento
  if (rental.payment_status === 'overdue') {
    return 'vermelho';
  }
  
  // Verificar se é limo black
  const isLimoBlack = rental.vehicle_name?.toLowerCase().includes('black') && 
                      rental.vehicle_name?.toLowerCase().includes('limo');
  
  // Verificar se é limo bus
  const isLimoBus = rental.vehicle_name?.toLowerCase().includes('bus') && 
                    rental.vehicle_name?.toLowerCase().includes('limo');
  
  // 3. AZUL: Limo Black Quitada
  if (isLimoBlack && rental.payment_status === 'paid') {
    return 'azul';
  }
  
  // 4. ROXO: Limo Bus Quitada
  if (isLimoBus && rental.payment_status === 'paid') {
    return 'roxo';
  }
  
  // 5. VERDE: Totalmente Pagas (qualquer veículo)
  if (rental.payment_status === 'paid') {
    return 'verde';
  }
  
  // LÓGICA CORRIGIDA: "C/Pendência" = Aprovado mas não pago OU com pendências
  const hasPendency = (rental.status === 'approved' && rental.payment_status === 'pending') || 
                      rental.has_pending_issues;
  
  // 6. AZUL CLARO: Limo Black Pendente (aprovado mas não pago OU com pendências)
  if (isLimoBlack && hasPendency) {
    return 'azulClaro';
  }
  
  // 7. ROXO CLARO: Limo Bus Pendente (aprovado mas não pago OU com pendências)
  if (isLimoBus && hasPendency) {
    return 'roxoClaro';
  }
  
  // 8. ROSA: Com Pendência (qualquer outro veículo - aprovado mas não pago OU com pendências)
  if (hasPendency) {
    return 'rosa';
  }
  
  // 9. LARANJA: Aguardando Aprovação (ainda não aprovado)
  if (rental.status === 'pending') {
    return 'laranja';
  }
  
  // Fallback geral
  return 'laranja';
};

const getStatusIcon = (rental: Rental) => {
  const rowClass = getRowClass(rental);
  
  switch (rowClass) {
    case 'cinza':
      return (
        <Box 
          component="span" 
          className="label label-secondary tip" 
          title="Concluída"
          sx={{ 
            bgcolor: '#6c757d', 
            color: 'white', 
            padding: '2px 6px', 
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          ✓
        </Box>
      );
    case 'vermelho':
      return (
        <Box 
          component="span" 
          className="label label-danger tip" 
          title="Pagamento Atrasado"
          sx={{ 
            bgcolor: '#dc3545', 
            color: 'white', 
            padding: '2px 6px', 
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          ⚠
        </Box>
      );
    case 'azul':
    case 'roxo':
    case 'verde':
      return (
        <Box 
          component="span" 
          className="label label-success tip" 
          title="Aprovada"
          sx={{ 
            bgcolor: '#28a745', 
            color: 'white', 
            padding: '2px 6px', 
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          ✓
        </Box>
      );
    case 'azulClaro':
    case 'roxoClaro':
    case 'rosa':
      return (
        <Box 
          component="span" 
          className="label pendencia tip" 
          title="Com Pendência"
          sx={{ 
            bgcolor: '#ffc107', 
            color: '#212529', 
            padding: '2px 6px', 
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          💰
        </Box>
      );
    case 'laranja':
    default:
      return (
        <Box 
          component="span" 
          className="label label-warning tip" 
          title="Aguardando"
          sx={{ 
            bgcolor: '#fd7e14', 
            color: 'white', 
            padding: '2px 6px', 
            borderRadius: '3px',
            fontSize: '11px',
            fontWeight: 'bold',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          📧
        </Box>
      );
  }
};

const getContactIcon = (contactMethod: string) => {
  switch (contactMethod) {
    case 'whatsapp': 
      return (
        <Box 
          component="span" 
          className="tip" 
          title="WhatsApp"
          sx={{ fontSize: '16px' }}
        >
          💬
        </Box>
      );
    case 'email': 
      return (
        <Box 
          component="span" 
          className="tip" 
          title="Email"
          sx={{ fontSize: '16px' }}
        >
          📧
        </Box>
      );
    case 'phone': 
      return (
        <Box 
          component="span" 
          className="tip" 
          title="Telefone"
          sx={{ fontSize: '16px' }}
        >
          📞
        </Box>
      );
    case 'instagram': 
      return (
        <Box 
          component="span" 
          className="tip" 
          title="Instagram"
          sx={{ fontSize: '16px' }}
        >
          📷
        </Box>
      );
    default: 
      return (
        <Box 
          component="span" 
          className="tip" 
          title="Outros"
          sx={{ fontSize: '16px' }}
        >
          👤
        </Box>
      );
  }
};

const getDayOfWeek = (date: string) => {
  const days = ['DOMINGO', 'SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'];
  const dayIndex = new Date(date).getDay();
  return days[dayIndex];
};

const formatTime = (timeString: string) => {
  if (!timeString) return '';
  return timeString.slice(0, 5); // Remove seconds
};

export const RentalsPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  // Estados principais
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [colorFilterCounts, setColorFilterCounts] = useState<ColorFilterCounts>({
    todas: 0,
    cinza: 0,
    vermelho: 0,
    azul: 0,
    verde: 0,
    azulClaro: 0,
    rosa: 0,
    laranja: 0,
    roxo: 0,
    roxoClaro: 0,
    hoje: 0,
    concluidas: 0,
  });
  
  // Estados de filtro
  const [selectedColorFilter, setSelectedColorFilter] = useState<string>('todas');
  const [currentMonth, setCurrentMonth] = useState<string>(() => {
    const now = new Date();
    return `${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
  });
  const [vehicles, setVehicles] = useState<any[]>([]);
  
  // Estados de UI
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [filterMenuAnchor, setFilterMenuAnchor] = useState<null | HTMLElement>(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [rentalToDelete, setRentalToDelete] = useState<string | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  // Estados de filtro avançado
  const [filters, setFilters] = useState({
    cpf: '',
    cnpj: '',
    codlocacao: '',
    carroId: '',
  });

  // Estado para controlar arquivos da locação selecionada
  const [rentalFiles, setRentalFiles] = useState<any[]>([]);

  // Função para verificar se o vendedor pode editar/excluir
  const canSellerEditDelete = (rental: Rental) => {
    if (isAdmin) return true; // Admin pode sempre editar/excluir
    
    // Vendedor só pode editar/excluir se a locação estiver aguardando aprovação
    return rental.status === 'pending';
  };

  // Função para verificar se o vendedor pode visualizar (sempre pode)
  const canSellerView = () => {
    return true; // Vendedor sempre pode visualizar
  };

  useEffect(() => {
    fetchRentals();
    fetchVehicles();
  }, [selectedColorFilter, currentMonth]);

  const fetchRentals = async () => {
    try {
      setLoading(true);
      const response = await rentalService.getRentals();
      const allRentalsData = response.rentals || [];
      
      // Filtrar por mês primeiro
      const [month, year] = currentMonth.split('/');
      let monthFilteredRentals = allRentalsData.filter((rental: Rental) => {
        const eventDate = new Date(rental.event_date);
        return eventDate.getMonth() + 1 === parseInt(month) && 
               eventDate.getFullYear() === parseInt(year);
      });
      
      // Calcular contadores de cores para o mês atual
      const today = new Date().toISOString().split('T')[0];
      
      const colorCounts: ColorFilterCounts = {
        todas: monthFilteredRentals.length,
        cinza: 0,
        vermelho: 0,
        azul: 0,
        verde: 0,
        azulClaro: 0,
        rosa: 0,
        laranja: 0,
        roxo: 0,
        roxoClaro: 0,
        hoje: 0,
        concluidas: 0,
      };
      
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      
      monthFilteredRentals.forEach((rental: Rental) => {
        const colorClass = getRowClass(rental);
        if (colorClass in colorCounts) {
          colorCounts[colorClass as keyof ColorFilterCounts]++;
        }
        
        // Contar eventos de hoje no mês
        if (rental.event_date === today) {
          colorCounts.hoje++;
        }
        
        // Contar eventos concluídos no mês (data do evento passou)
        const eventDate = new Date(rental.event_date);
        eventDate.setHours(0, 0, 0, 0);
        if (eventDate < todayDate) {
          colorCounts.concluidas++;
        }
      });
      
      setColorFilterCounts(colorCounts);
      
      // Aplicar filtro de cor se selecionado
      if (selectedColorFilter !== 'todas') {
        monthFilteredRentals = monthFilteredRentals.filter((rental: Rental) => {
          const colorClass = getRowClass(rental);
          return colorClass === selectedColorFilter;
        });
      }
      
      setRentals(monthFilteredRentals);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar locações');
    } finally {
      setLoading(false);
    }
  };

  const fetchVehicles = async () => {
    try {
      const response = await vehicleService.getVehicles();
      setVehicles(response.vehicles || []);
    } catch (err) {
      console.error('Erro ao carregar veículos:', err);
    }
  };

  const handleColorFilterChange = (colorFilter: string) => {
    setSelectedColorFilter(colorFilter);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const [month, year] = currentMonth.split('/').map(Number);
    let newMonth = month;
    let newYear = year;
    
    if (direction === 'prev') {
      newMonth = month === 1 ? 12 : month - 1;
      newYear = month === 1 ? year - 1 : year;
    } else {
      newMonth = month === 12 ? 1 : month + 1;
      newYear = month === 12 ? year + 1 : year;
    }
    
    setCurrentMonth(`${String(newMonth).padStart(2, '0')}/${newYear}`);
  };

  const getMonthName = (monthYear: string) => {
    const [month, year] = monthYear.split('/');
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    return `${monthNames[parseInt(month) - 1]}|${year}`;
  };

  const getColorFilterLabel = (colorKey: string) => {
    switch (colorKey) {
      case 'todas': return 'Todas';
      case 'cinza': return 'Eventos Passados';
      case 'vermelho': return 'Pagamentos Atrasados';
      case 'azul': return 'Limo Black Quitada';
      case 'roxo': return 'Limo Bus Quitada';
      case 'verde': return 'Totalmente Pagas';
      case 'azulClaro': return 'Limo Black Pendente';
      case 'roxoClaro': return 'Limo Bus Pendente';
      case 'rosa': return 'Com Pendência';
      case 'laranja': return 'Aguardando Aprovação';
      default: return colorKey;
    }
  };

  const getColorFilterColor = (colorKey: string) => {
    switch (colorKey) {
      case 'todas': return '#f8f9fa';
      case 'cinza': return '#e9ecef';
      case 'vermelho': return '#ffcdd2';
      case 'azul': return '#cce7ff';
      case 'roxo': return '#e2d5f1';
      case 'verde': return '#d4edda';
      case 'azulClaro': return '#d1ecf1';
      case 'roxoClaro': return '#f3e8ff';
      case 'rosa': return '#f8d7da';
      case 'laranja': return '#fff3cd';
      default: return '#f5f5f5';
    }
  };

  const getColorFilterTextColor = (colorKey: string) => {
    switch (colorKey) {
      case 'todas': return '#495057';
      case 'cinza': return '#495057';
      case 'vermelho': return '#c62828';
      case 'azul': return '#0056b3';
      case 'roxo': return '#6f42c1';
      case 'verde': return '#155724';
      case 'azulClaro': return '#0c5460';
      case 'roxoClaro': return '#8b5cf6';
      case 'rosa': return '#721c24';
      case 'laranja': return '#856404';
      default: return '#000';
    }
  };

  const handleEdit = async (rental: Rental) => {
    // Vendedor sempre pode acessar a página de edição para visualizar e fazer upload
    // A restrição de edição será feita na própria página baseada no status
    navigate(`/rentals/${rental.id}/edit`);
    setActionMenuAnchor(null);
  };

  const handleViewContract = (rental: Rental) => {
    navigate(`/rentals/${rental.id}/contract`);
    setActionMenuAnchor(null);
  };

  const handleApprove = async (rental: Rental) => {
    if (!isAdmin) {
      setSnackbar({
        open: true,
        message: 'Apenas administradores podem aprovar locações',
        severity: 'error'
      });
      setActionMenuAnchor(null);
      return;
    }

    try {
      await rentalService.toggleRentalStatus(rental.id);
      setSnackbar({
        open: true,
        message: 'Locação aprovada com sucesso',
        severity: 'success'
      });
      fetchRentals();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao aprovar locação';
      
      // Mostrar erro específico de validação de parcelas
      if (errorMessage.includes('Valor das parcelas')) {
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      } else {
        setSnackbar({
          open: true,
          message: errorMessage,
          severity: 'error'
        });
      }
    }
    setActionMenuAnchor(null);
  };

  const handleMarkPending = async (rental: Rental) => {
    if (!isAdmin) {
      setSnackbar({
        open: true,
        message: 'Apenas administradores podem marcar como pendente',
        severity: 'error'
      });
      setActionMenuAnchor(null);
      return;
    }

    try {
      await rentalService.updateRental(rental.id, { has_pending_issues: true });
      setSnackbar({
        open: true,
        message: 'Locação marcada como pendente',
        severity: 'success'
      });
      fetchRentals();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erro ao marcar como pendente',
        severity: 'error'
      });
    }
    setActionMenuAnchor(null);
  };

  const handleDelete = async (rental: Rental) => {
    if (!isAdmin) {
      const canDelete = canSellerEditDelete(rental);
      if (!canDelete) {
        setSnackbar({
          open: true,
          message: 'Não é possível excluir locação aprovada. Apenas locações aguardando aprovação podem ser excluídas.',
          severity: 'error'
        });
        setActionMenuAnchor(null);
        return;
      }
    }

    setRentalToDelete(rental.id);
    setDeleteDialogOpen(true);
    setActionMenuAnchor(null);
  };

  const confirmDelete = async () => {
    if (!rentalToDelete) return;

    try {
      await rentalService.deleteRental(rentalToDelete);
      setSnackbar({
        open: true,
        message: 'Locação excluída com sucesso',
        severity: 'success'
      });
      fetchRentals();
    } catch (err: any) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Erro ao excluir locação',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setRentalToDelete(null);
    }
  };

  const handleNewRental = () => {
    navigate('/rentals/new');
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar lógica de filtro avançado aqui
    console.log('Filtros aplicados:', filters);
    setFilterMenuAnchor(null);
  };

  const handleActionMenuClick = (event: React.MouseEvent<HTMLElement>, rental: Rental) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedRental(rental);
  };

  const renderActionMenu = () => {
    if (!selectedRental) return null;

    return (
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={() => setActionMenuAnchor(null)}
      >
        <MenuItem onClick={() => handleEdit(selectedRental)}>
          Editar
        </MenuItem>
        <MenuItem onClick={() => handleViewContract(selectedRental)}>
          Contrato
        </MenuItem>
        
        {/* Apenas administradores podem aprovar e marcar como pendente */}
        {isAdmin && (
          <>
            <MenuItem onClick={() => handleApprove(selectedRental)}>
              Aprovar
            </MenuItem>
            <MenuItem onClick={() => handleMarkPending(selectedRental)}>
              C/ Pendência
            </MenuItem>
          </>
        )}
        
        <MenuItem 
          onClick={() => handleDelete(selectedRental)}
          sx={{ color: 'error.main' }}
        >
          Excluir
        </MenuItem>
      </Menu>
    );
  };

  const NavigationDrawer = () => (
    <Drawer
      anchor="left"
      open={drawerOpen}
      onClose={() => setDrawerOpen(false)}
      sx={{
        '& .MuiDrawer-paper': {
          width: 300,
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Filtros</Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Filtros - {getMonthName(currentMonth)}
          </Typography>
          {[
            { key: 'todas', label: 'Todas', count: colorFilterCounts.todas },
            { key: 'vermelho', label: 'Pagamentos Atrasados', count: colorFilterCounts.vermelho },
            { key: 'laranja', label: 'Aguardando Aprovação', count: colorFilterCounts.laranja },
            { key: 'rosa', label: 'Com Pendência', count: colorFilterCounts.rosa },
            { key: 'verde', label: 'Totalmente Pagas', count: colorFilterCounts.verde },
            { key: 'azul', label: 'Limo Black Quitada', count: colorFilterCounts.azul },
            { key: 'azulClaro', label: 'Limo Black Pendente', count: colorFilterCounts.azulClaro },
            { key: 'roxo', label: 'Limo Bus Quitada', count: colorFilterCounts.roxo },
            { key: 'roxoClaro', label: 'Limo Bus Pendente', count: colorFilterCounts.roxoClaro },
            { key: 'cinza', label: 'Eventos Passados', count: colorFilterCounts.cinza },
          ].map(({ key, label, count }) => (
            <Button
              key={key}
              fullWidth
              variant={selectedColorFilter === key ? 'contained' : 'text'}
              onClick={() => {
                handleColorFilterChange(key);
                setDrawerOpen(false);
              }}
              sx={{
                justifyContent: 'space-between',
                mb: 1,
                textTransform: 'none',
                ...(selectedColorFilter === key && {
                  backgroundColor: getColorFilterColor(key),
                  color: getColorFilterTextColor(key),
                  '&:hover': {
                    backgroundColor: getColorFilterColor(key),
                    opacity: 0.8,
                  },
                }),
              }}
            >
              <span>{label}</span>
              <Chip
                label={count}
                size="small"
                sx={{
                  bgcolor: getColorFilterColor(key),
                  color: getColorFilterTextColor(key),
                  height: 20,
                  fontSize: '0.75rem',
                }}
              />
            </Button>
          ))}
        </Box>
        
        <Button
          fullWidth
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewRental}
          sx={{ mt: 2 }}
        >
          Nova Locação
        </Button>
      </Box>
    </Drawer>
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <NavigationDrawer />
      
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Locações
        </Typography>
        {!isMobile && (
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewRental}
        >
          Nova Locação
        </Button>
        )}
      </Box>

      {/* Navigation Bar */}
      <Box sx={{ mb: 3 }}>
        {!isMobile ? (
          // Desktop Navigation - Filtros por Cor (Mês Atual)
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Tabs
              value={selectedColorFilter}
              onChange={(_, value) => handleColorFilterChange(value)}
              sx={{
                '& .MuiTab-root': {
                  textTransform: 'none',
                  minWidth: 'auto',
                  px: 2,
                },
              }}
            >
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>Todas</span>
                    <Chip
                      label={colorFilterCounts.todas}
                      size="small"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.75rem',
                        bgcolor: '#f8f9fa',
                        color: '#495057'
                      }}
                    />
          </Box>
                }
                value="todas"
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>🚨 ATRASADOS</span>
                    <Chip
                      label={colorFilterCounts.vermelho}
                      size="small"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.75rem', 
                        bgcolor: '#ffcdd2', 
                        color: '#c62828',
                        fontWeight: 'bold',
                        border: '1px solid #f44336',
                        textShadow: '0 0 2px rgba(198, 40, 40, 0.5)'
                      }}
                    />
                  </Box>
                }
                value="vermelho"
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>Aguardando</span>
                    <Chip
                      label={colorFilterCounts.laranja}
                      size="small"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.75rem', 
                        bgcolor: '#fff3cd', 
                        color: '#856404' 
                      }}
                    />
            </Box>
                }
                value="laranja"
              />

              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>Com Pendência</span>
                    <Chip
                      label={colorFilterCounts.rosa}
                      size="small"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.75rem', 
                        bgcolor: '#f8d7da', 
                        color: '#721c24' 
                      }}
                    />
            </Box>
                }
                value="rosa"
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>Totalmente Pagas</span>
                    <Chip
                      label={colorFilterCounts.verde}
                      size="small"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.75rem', 
                        bgcolor: '#d4edda', 
                        color: '#155724' 
                      }}
                    />
            </Box>
                }
                value="verde"
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>Limo Black</span>
                    <Chip
                      label={colorFilterCounts.azul}
                      size="small"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.75rem', 
                        bgcolor: '#cce7ff', 
                        color: '#0056b3' 
                      }}
                    />
          </Box>
                }
                value="azul"
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>Limo Black Pendente</span>
                    <Chip
                      label={colorFilterCounts.azulClaro}
                      size="small"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.75rem', 
                        bgcolor: '#d1ecf1', 
                        color: '#0c5460' 
                      }}
                    />
        </Box>
                }
                value="azulClaro"
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>Limo Bus Quitada</span>
                    <Chip
                      label={colorFilterCounts.roxo}
                      size="small"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.75rem', 
                        bgcolor: '#e2d5f1', 
                        color: '#6f42c1' 
                      }}
                    />
                  </Box>
                }
                value="roxo"
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>Limo Bus Pendente</span>
                    <Chip
                      label={colorFilterCounts.roxoClaro}
                      size="small"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.75rem', 
                        bgcolor: '#f3e8ff', 
                        color: '#8b5cf6' 
                      }}
                    />
                  </Box>
                }
                value="roxoClaro"
              />
              <Tab
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>Eventos Passados</span>
                    <Chip
                      label={colorFilterCounts.cinza}
                      size="small"
                      sx={{ 
                        height: 20, 
                        fontSize: '0.75rem', 
                        bgcolor: '#e9ecef', 
                        color: '#495057' 
                      }}
                    />
                  </Box>
                }
                value="cinza"
              />
            </Tabs>
          </Box>
        ) : (
          // Mobile Navigation
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                '&:hover': { bgcolor: 'primary.dark' },
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">
              {getColorFilterLabel(selectedColorFilter)}
            </Typography>
          </Box>
        )}

        {/* Information Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">Eventos hoje ({getMonthName(currentMonth)}):</Typography>
            <Chip
              label={colorFilterCounts.hoje}
              size="small"
              sx={{ bgcolor: '#cce7ff', color: '#0056b3' }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2">Concluídas ({getMonthName(currentMonth)}):</Typography>
            <Chip
              label={colorFilterCounts.concluidas}
              size="small"
              sx={{ bgcolor: '#e9ecef', color: '#495057' }}
            />
          </Box>
        </Box>

        {/* Month Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <IconButton onClick={() => handleMonthChange('prev')}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ minWidth: 150, textAlign: 'center' }}>
            {getMonthName(currentMonth)}
          </Typography>
          <IconButton onClick={() => handleMonthChange('next')}>
            <ArrowForwardIcon />
          </IconButton>
          <IconButton onClick={(e) => setFilterMenuAnchor(e.currentTarget)}>
            <FilterListIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Advanced Filters Menu */}
      <Menu
        anchorEl={filterMenuAnchor}
        open={Boolean(filterMenuAnchor)}
        onClose={() => setFilterMenuAnchor(null)}
      >
        <Box sx={{ p: 2, minWidth: 300 }}>
          <Typography variant="subtitle1" sx={{ mb: 2 }}>Filtros Avançados</Typography>
          <form onSubmit={handleFilterSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="CPF"
                  value={filters.cpf}
                  onChange={(e) => setFilters({ ...filters, cpf: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="CNPJ"
                  value={filters.cnpj}
                  onChange={(e) => setFilters({ ...filters, cnpj: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Código da Locação"
                  value={filters.codlocacao}
                  onChange={(e) => setFilters({ ...filters, codlocacao: e.target.value })}
                  size="small"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth size="small">
                  <InputLabel>Veículo</InputLabel>
                  <Select
                    value={filters.carroId}
                    onChange={(e) => setFilters({ ...filters, carroId: e.target.value })}
                    label="Veículo"
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {vehicles.map((vehicle) => (
                      <MenuItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="small"
                >
                  Aplicar Filtros
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Menu>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Rentals Table - Layout do Sistema Antigo */}
      <TableContainer component={Paper} sx={{ border: '1px solid #dee2e6', boxShadow: 'none' }}>
        <Table 
          className="table table-bordered" 
          sx={{ 
            minWidth: 650, 
            '& .MuiTableCell-root': {
              border: '1px solid #dee2e6',
              padding: '8px 12px',
              fontSize: '0.875rem'
            }
          }} 
          size="small"
        >
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
              <TableCell sx={{ width: '1%', whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: '0.875rem', textAlign: 'center' }}>#</TableCell>
              <TableCell sx={{ width: '1%', whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: '0.875rem', textAlign: 'center' }}></TableCell>
              <TableCell sx={{ width: '1%', whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: '0.875rem' }}>Locado para:</TableCell>
              <TableCell sx={{ width: '1%', whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: '0.875rem' }}>Registrado:</TableCell>
              <TableCell sx={{ width: '8%', whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: '0.875rem' }}>Carro/Motorista:</TableCell>
              <TableCell sx={{ width: '28%', whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: '0.875rem' }}>Cliente/Categoria</TableCell>
              <TableCell sx={{ width: '1%', whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: '0.875rem', textAlign: 'center' }}></TableCell>
              <TableCell sx={{ width: '1%', whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: '0.875rem', textAlign: 'center' }}>Status:</TableCell>
              <TableCell sx={{ width: '1%', whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: '0.875rem', textAlign: 'center' }}></TableCell>
              <TableCell sx={{ width: '1%', whiteSpace: 'nowrap', fontWeight: 'bold', fontSize: '0.875rem', textAlign: 'center' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rentals.map((rental) => (
              <StyledTableRow
                key={rental.id}
                rowClass={getRowClass(rental)}
              >
                {/* Coluna # - ID da locação */}
                <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  <Button
                    variant="text"
                    onClick={() => navigate(`/rentals/${rental.id}`)}
                    sx={{ 
                      p: 0, 
                      minWidth: 'auto', 
                      textTransform: 'none',
                      color: 'inherit',
                      textDecoration: 'underline',
                      fontSize: '0.875rem',
                      fontWeight: 'normal',
                      '&:hover': { backgroundColor: 'transparent' }
                    }}
                  >
                    {rental.id.toString().slice(-4)}
                  </Button>
                </TableCell>

                {/* Coluna vazia com ícone de stop se pit_stop */}
                <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  {rental.pit_stop && (
                    <img src="/images/stop.svg" alt="Stop" height="36" />
                  )}
                </TableCell>

                {/* Coluna Locado para: Data, dia da semana e horário */}
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'inherit', fontSize: '0.875rem' }}>
                      {formatDateBR(rental.event_date)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'inherit', fontSize: '0.875rem' }}>
                      | {getDayOfWeek(rental.event_date)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'inherit', fontSize: '0.875rem' }}>
                      {formatTime(rental.start_time)} - {formatTime(rental.end_time)}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Coluna Registrado: Data de criação e vendedor */}
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'inherit', fontSize: '0.875rem' }}>
                      {formatDateBR(rental.created_at)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'inherit', fontSize: '0.875rem' }}>
                      {rental.seller_name}
                    </Typography>
                  </Box>
                </TableCell>

                {/* Coluna Carro/Motorista: Nome do veículo, motorista e ícone de pagamento do motorista */}
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Box>
                    <Typography variant="body2" sx={{ color: 'inherit', fontSize: '0.875rem' }}>
                      {rental.vehicle_name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2" sx={{ color: 'inherit', fontSize: '0.875rem' }}>
                        {rental.driver_name || 'Sem Motorista Registrado'}
                      </Typography>
                      {/* Ícone de motorista pago (simulando o thumbs-up do sistema antigo) */}
                      {rental.driver_name && (
                        <Box 
                          component="span" 
                          className="tip text-danger noPrint" 
                          title="Motorista está pago"
                          sx={{ color: '#dc3545', fontSize: '14px' }}
                        >
                          👍
                        </Box>
                      )}
                    </Box>
                  </Box>
                </TableCell>

                {/* Coluna Cliente/Categoria: Nome do cliente em negrito, cidade, categoria e duração */}
                <TableCell sx={{ whiteSpace: 'nowrap' }}>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'inherit', fontSize: '0.875rem' }}>
                      {rental.client_name}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'inherit', fontSize: '0.875rem' }}>
                      {rental.category} - {rental.total_hours}h
                    </Typography>
                  </Box>
                </TableCell>

                {/* Coluna vazia para observações como "Remarcado" */}
                <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  {rental.situation === 'remarcado' && (
                    <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'inherit', fontSize: '0.875rem' }}>
                      Remarcado
                    </Typography>
                  )}
                </TableCell>

                {/* Coluna Status: Ícone do status centralizado */}
                <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    {getStatusIcon(rental)}
                  </Box>
                </TableCell>

                {/* Coluna de método de contato: Ícone centralizado */}
                <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    {getContactIcon(rental.contact_method || 'person')}
                  </Box>
                </TableCell>

                {/* Coluna de ações: Menu dropdown */}
                <TableCell sx={{ whiteSpace: 'nowrap', textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleActionMenuClick(e, rental)}
                      sx={{ 
                        color: 'inherit',
                        bgcolor: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px',
                        width: 28,
                        height: 28,
                        '&:hover': {
                          bgcolor: '#e9ecef'
                        }
                      }}
                    >
                      <MoreVertIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      {renderActionMenu()}

      {rentals.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Nenhuma locação encontrada
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Não há locações para os filtros selecionados.
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleNewRental}
          >
            Nova Locação
          </Button>
        </Box>
      )}

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onCancel={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir esta locação? Esta ação não pode ser desfeita."
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}; 