import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Breadcrumbs,
  Link,
  IconButton,
  Button,
  CircularProgress,
  Alert,
  styled,
  Chip,
  Divider,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  DirectionsCar as CarIcon,
  PictureAsPdf as PdfIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import reportService, { MonthlySalesData } from '../../services/reportService';
import { formatCurrency, formatDate } from '../../utils/dateUtils';

// Função para determinar a cor da linha baseada no veículo e status de pagamento
const getRowColor = (rental: any) => {
  const vehicleName = rental.vehicle_name?.toLowerCase() || '';
  const isPaid = parseFloat(rental.total_paid) >= parseFloat(rental.gross_amount);
  const isEventPast = new Date(rental.event_date) < new Date();
  const isApproved = rental.status === 'approved';
  
  // CINZA - Eventos Passados (data passou)
  if (isEventPast && isApproved) {
    return '#e0e0e0';
  }
  
  // AZUL - Limo Black Quitada (limo black + pago)
  if (vehicleName.includes('black') && isPaid && isApproved) {
    return '#cce7ff';
  }
  
  // ROXO - Limo Bus Quitada (limo bus + pago)
  if (vehicleName.includes('bus') && isPaid && isApproved) {
    return '#e1bee7';
  }
  
  // VERDE - Totalmente Pagas (qualquer veículo pago)
  if (isPaid && isApproved) {
    return '#d4edda';
  }
  
  // AZUL CLARO - Limo Black Pendente (limo black + pendência)
  if (vehicleName.includes('black') && !isPaid && isApproved) {
    return '#e3f2fd';
  }
  
  // ROXO CLARO - Limo Bus Pendente (limo bus + pendência)
  if (vehicleName.includes('bus') && !isPaid && isApproved) {
    return '#f3e5f5';
  }
  
  // ROSA - Com Pendência (qualquer outro veículo + pendência)
  if (!isPaid && isApproved) {
    return '#f8d7da';
  }
  
  // LARANJA - Aguardando (pré-reserva, nada pago)
  if (rental.status === 'pending') {
    return '#fff3cd';
  }
  
  return 'transparent';
};

// Styled components para cores das linhas baseadas no status
const StyledTableRow = styled(TableRow)<{ rental: any }>(({ rental }) => ({
  backgroundColor: getRowColor(rental),
  '&:hover': {
    backgroundColor: getRowColor(rental) !== 'transparent' 
      ? getRowColor(rental) 
      : 'rgba(0, 0, 0, 0.04)',
    opacity: 0.8,
  },
}));

const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const ReportsPage: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<MonthlySalesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<string>('todos');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  const fetchData = async () => {
    try {
    setLoading(true);
    setError(null);
      
      const params = {
        month: currentMonth,
        year: currentYear,
        userId: selectedUser !== 'todos' ? selectedUser : undefined,
        vehicleId: selectedVehicle || undefined,
      };
      
      const result = await reportService.getMonthlySalesReport(params);
      setData(result.data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar relatório');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentMonth, currentYear, selectedUser, selectedVehicle]);

  const handlePreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Aprovada';
      case 'pending':
        return 'Pendência';
      default:
        return status;
    }
  };

  const handlePdfClick = (rentalId: string) => {
    // Navegar para a página de contrato da locação
    navigate(`/rentals/${rentalId}/contract`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={3}>
        <Alert severity="info">Nenhum dado encontrado</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Tabs de usuários */}
      <Paper sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, p: 2 }}>
            <Button
              variant={selectedUser === 'todos' ? 'contained' : 'outlined'}
              onClick={() => setSelectedUser('todos')}
              sx={{
                backgroundColor: selectedUser === 'todos' ? '#e67e22' : 'transparent',
                borderColor: '#e67e22',
                color: selectedUser === 'todos' ? 'white' : '#e67e22',
                '&:hover': {
                  backgroundColor: selectedUser === 'todos' ? '#d35400' : 'rgba(230, 126, 34, 0.1)',
                },
              }}
            >
              Relatório ({data.totals.totalRentals})
            </Button>
            {data.users.map((user) => (
              <Button
                key={user.id}
                variant={selectedUser === user.id ? 'contained' : 'outlined'}
                onClick={() => setSelectedUser(user.id)}
                sx={{
                  backgroundColor: selectedUser === user.id ? '#e67e22' : 'transparent',
                  borderColor: '#e67e22',
                  color: selectedUser === user.id ? 'white' : '#e67e22',
                  '&:hover': {
                    backgroundColor: selectedUser === user.id ? '#d35400' : 'rgba(230, 126, 34, 0.1)',
                  },
                }}
              >
                {user.name} ({user.rental_count})
              </Button>
            ))}
          </Box>
        </Box>

        {/* Filtros */}
        <Box sx={{ p: 2 }}>
          {/* Filtro de veículos */}
          <Breadcrumbs separator="" sx={{ mb: 2 }}>
            <Button
              variant={!selectedVehicle ? 'contained' : 'text'}
              onClick={() => setSelectedVehicle('')}
              startIcon={<CarIcon />}
              size="small"
              sx={{
                backgroundColor: !selectedVehicle ? '#e67e22' : 'transparent',
                color: !selectedVehicle ? 'white' : '#e67e22',
                '&:hover': {
                  backgroundColor: !selectedVehicle ? '#d35400' : 'rgba(230, 126, 34, 0.1)',
                },
              }}
            >
              Todos os Veículos
            </Button>
            {data.vehicles.map((vehicle) => (
              <Button
                key={vehicle.id}
                variant={selectedVehicle === vehicle.id ? 'contained' : 'text'}
                onClick={() => setSelectedVehicle(vehicle.id)}
                startIcon={<CarIcon />}
                size="small"
                sx={{
                  backgroundColor: selectedVehicle === vehicle.id ? '#e67e22' : 'transparent',
                  color: selectedVehicle === vehicle.id ? 'white' : '#e67e22',
                  '&:hover': {
                    backgroundColor: selectedVehicle === vehicle.id ? '#d35400' : 'rgba(230, 126, 34, 0.1)',
                  },
                }}
              >
                {vehicle.name}
              </Button>
                ))}
          </Breadcrumbs>

          {/* Navegação mensal */}
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={handlePreviousMonth}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h6" sx={{ minWidth: '200px', textAlign: 'center' }}>
              {monthNames[currentMonth - 1]} | {currentYear}
            </Typography>
            <IconButton onClick={handleNextMonth}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Tabela de dados */}
      <Paper>
        <TableContainer>
          <Table>
              <TableHead>
                <TableRow>
                <TableCell width="1%">#</TableCell>
                <TableCell width="1%">Registro</TableCell>
                <TableCell width="1%">Status</TableCell>
                <TableCell width="1%">Consultor</TableCell>
                <TableCell width="8%">Carro</TableCell>
                <TableCell width="25%">Cliente</TableCell>
                <TableCell width="1%" align="right">Bruto=</TableCell>
                <TableCell width="1%" align="right">Despesas-</TableCell>
                <TableCell width="1%" align="right">C. Fixas-</TableCell>
                <TableCell width="1%" align="right">Comissão-</TableCell>
                <TableCell width="1%" align="right">Imposto-</TableCell>
                <TableCell width="1%" align="right">Saldo=</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {data.rentals.map((rental) => (
                <StyledTableRow key={rental.id} rental={rental}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {rental.id.slice(-4)}
                      </Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => handlePdfClick(rental.id)}
                        sx={{ color: '#e67e22' }}
                      >
                        <PdfIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>{formatDate(rental.event_date)}</TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusText(rental.status)}
                      color={getStatusColor(rental.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{rental.seller_name}</TableCell>
                  <TableCell>{rental.vehicle_name}</TableCell>
                  <TableCell>{rental.client_name}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(parseFloat(rental.gross_amount))}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(parseFloat(rental.total_expenses))}
                  </TableCell>
                  <TableCell align="right">R$ 0,00</TableCell>
                  <TableCell align="right">
                    {formatCurrency(parseFloat(rental.commission))}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(parseFloat(rental.taxes))}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(parseFloat(rental.net_profit))}
                  </TableCell>
                </StyledTableRow>
              ))}
              
              {/* Linha de totais */}
              <TableRow sx={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>
                <TableCell colSpan={6} align="right">
                  <Typography variant="body2" fontWeight="bold">Total:</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(data.totals.totalGross)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(data.totals.totalExpenses)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold">R$ 0,00</Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(data.totals.totalCommission)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(data.totals.totalTaxes)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold">
                    {formatCurrency(data.totals.totalNetProfit)}
                  </Typography>
                </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
      </Paper>

      {/* Resumo detalhado */}
      <Box sx={{ mt: 3, ml: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          TOTAL DE REGISTROS: {data.totals.totalRentals}
        </Typography>
        <Typography variant="h5" fontWeight="bold" sx={{ mt: 1 }}>
          Demonstrativo de Vendas de {monthNames[currentMonth - 1]}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Relatório obtido em {new Date().toLocaleString('pt-BR')}
        </Typography>
        
        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ color: '#28a745', fontWeight: 'bold' }}>
              {formatCurrency(data.totals.totalGross)} (Em vendas)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              (Total de vendas aprovadas no mês. Pendências mostram valor zero.)
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ color: '#dc3545', fontWeight: 'bold' }}>
              {formatCurrency(data.totals.totalExpenses)} (Despesas)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              (Total de custos + cortesias das locações. TODAS as cortesias são despesas que reduzem o lucro.)
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ color: '#dc3545', fontWeight: 'bold' }}>
              R$ 0,00 (Contas Fixas)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              (Total de contas fixas do mês.)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              (<strong>Fórmula:</strong> Total de contas fixas / número de locações)
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ color: '#dc3545', fontWeight: 'bold' }}>
              {formatCurrency(data.totals.totalCommission)} (Comissões)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              (Total de comissões à pagar aos funcionários pelas vendas aprovadas no mês.)
            </Typography>
            <Typography variant="body2" color="text.secondary">
              (<strong>Fórmula:</strong> (Valor bruto - Despesas) X 10%)
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" sx={{ color: '#dc3545', fontWeight: 'bold' }}>
              {formatCurrency(data.totals.totalTaxes)} (Impostos)
        </Typography>
            <Typography variant="body2" color="text.secondary">
              (11% sobre o valor bruto de cada reserva aprovada no mês.)
      </Typography>
            <Typography variant="body2" color="text.secondary">
              (<strong>Fórmula:</strong> Valor bruto X 11%)
              </Typography>
          </Box>

          <Box>
            <Typography variant="h5" sx={{ color: '#28a745', fontWeight: 'bold' }}>
              {formatCurrency(data.totals.totalNetProfit)} (Saldo de vendas em {monthNames[currentMonth - 1]})
              </Typography>
            <Typography variant="body2" color="text.secondary">
              (<strong>Fórmula:</strong> Valor bruto - despesas (custos + cortesias) - comissões - impostos)
        </Typography>
          </Box>
        </Box>

        {/* Legenda de cores */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Legenda de Cores:
        </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#e0e0e0' }} />
              <Typography variant="body2">CINZA - Eventos Passados</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#cce7ff' }} />
              <Typography variant="body2">AZUL - Limo Black Quitada</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#e1bee7' }} />
              <Typography variant="body2">ROXO - Limo Bus Quitada</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#d4edda' }} />
              <Typography variant="body2">VERDE - Totalmente Pagas</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#e3f2fd' }} />
              <Typography variant="body2">AZUL CLARO - Limo Black Pendente</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#f3e5f5' }} />
              <Typography variant="body2">ROXO CLARO - Limo Bus Pendente</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#f8d7da' }} />
              <Typography variant="body2">ROSA - Com Pendência</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ width: 20, height: 20, backgroundColor: '#fff3cd' }} />
              <Typography variant="body2">LARANJA - Aguardando</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}; 