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
  IconButton,
  Chip,
  Grid,
  CircularProgress,
  Alert,
  Breadcrumbs,
  Link,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  FilterList as FilterIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { financeiroService, Receita, Despesa } from '../../services/financeiroService';
import { formatCurrency, formatDate } from '../../utils/dateUtils';

const statusLabels = {
  paid: 'Pago',
  pending: 'Aguardando',
  overdue: 'Atrasado',
};

const statusColors = {
  paid: 'success',
  pending: 'warning',
  overdue: 'error',
} as const;

const monthNames = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const FinanceiroPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'receitas' | 'despesas'>('receitas');
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [receitas, setReceitas] = useState<Receita[]>([]);
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [totals, setTotals] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMenuAnchor, setActionMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedReceita, setSelectedReceita] = useState<Receita | null>(null);

  const fetchReceitas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await financeiroService.getReceitas({
        month: currentMonth,
        year: currentYear,
        status: statusFilter || undefined,
      });
      
      setReceitas(response.data.receitas);
      setTotals(response.data.totals);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados financeiros');
    } finally {
      setLoading(false);
    }
  };

  const fetchDespesas = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await financeiroService.getDespesas({
        month: currentMonth,
        year: currentYear,
      });
      
      setDespesas(response.data.despesas);
      setTotals(response.data.totals);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados financeiros');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'receitas') {
      fetchReceitas();
    } else {
      fetchDespesas();
    }
  }, [currentMonth, currentYear, statusFilter, activeTab]);

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

  const handleTabChange = (event: React.SyntheticEvent, newValue: 'receitas' | 'despesas') => {
    setActiveTab(newValue);
    setStatusFilter(''); // Reset filter when changing tabs
  };

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status);
  };

  const handleActionMenuClick = (event: React.MouseEvent<HTMLElement>, receita: Receita) => {
    setActionMenuAnchor(event.currentTarget);
    setSelectedReceita(receita);
  };

  const handleActionMenuClose = () => {
    setActionMenuAnchor(null);
    setSelectedReceita(null);
  };

  const handleViewContract = (rentalId: string) => {
    navigate(`/rentals/${rentalId}/contract`);
    handleActionMenuClose();
  };

  const handleMarkAsPaid = async (receitaId: string) => {
    try {
      await financeiroService.updateReceitaStatus(receitaId, 'paid');
      await fetchReceitas();
      handleActionMenuClose();
    } catch (err: any) {
      console.error('Erro ao marcar como pago:', err);
    }
  };

  const handleMarkAsPending = async (receitaId: string) => {
    try {
      await financeiroService.updateReceitaStatus(receitaId, 'pending');
      await fetchReceitas();
      handleActionMenuClose();
    } catch (err: any) {
      console.error('Erro ao marcar como aguardando:', err);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const renderReceitasTab = () => (
    <>
      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Breadcrumbs separator="|" sx={{ mb: 2 }}>
          <Link
            component="button"
            variant="body2"
            onClick={() => handleStatusFilter('')}
            sx={{ 
              textDecoration: 'none',
              fontWeight: statusFilter === '' ? 'bold' : 'normal',
              color: statusFilter === '' ? 'primary.main' : 'text.primary',
            }}
          >
            <FilterIcon fontSize="small" sx={{ mr: 0.5 }} />
            Todos
          </Link>
          <Link
            component="button"
            variant="body2"
            onClick={() => handleStatusFilter('pending')}
            sx={{ 
              textDecoration: 'none',
              fontWeight: statusFilter === 'pending' ? 'bold' : 'normal',
              color: statusFilter === 'pending' ? 'primary.main' : 'text.primary',
            }}
          >
            <FilterIcon fontSize="small" sx={{ mr: 0.5 }} />
            Aguardando
          </Link>
          <Link
            component="button"
            variant="body2"
            onClick={() => handleStatusFilter('overdue')}
            sx={{ 
              textDecoration: 'none',
              fontWeight: statusFilter === 'overdue' ? 'bold' : 'normal',
              color: statusFilter === 'overdue' ? 'primary.main' : 'text.primary',
            }}
          >
            <FilterIcon fontSize="small" sx={{ mr: 0.5 }} />
            Atrasado
          </Link>
          <Link
            component="button"
            variant="body2"
            onClick={() => handleStatusFilter('paid')}
            sx={{ 
              textDecoration: 'none',
              fontWeight: statusFilter === 'paid' ? 'bold' : 'normal',
              color: statusFilter === 'paid' ? 'primary.main' : 'text.primary',
            }}
          >
            <FilterIcon fontSize="small" sx={{ mr: 0.5 }} />
            Pago
          </Link>
        </Breadcrumbs>

        {/* Navegação do mês */}
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
      </Paper>

      {/* Conteúdo principal */}
      <Grid container spacing={2}>
        {/* Tabela */}
        <Grid item xs={12} md={9}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width="1%">Vencimento</TableCell>
                  <TableCell width="1%" sx={{ whiteSpace: 'nowrap' }}>Contrato</TableCell>
                  <TableCell width="15%">Valor</TableCell>
                  <TableCell width="35%">Cliente</TableCell>
                  <TableCell width="50%">Consultor</TableCell>
                  <TableCell width="1%"></TableCell>
                  <TableCell width="1%"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {receitas.map((receita) => (
                  <TableRow key={receita.id}>
                    <TableCell>{formatDate(receita.due_date)}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          Nº {receita.rental_id.slice(-4)}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleViewContract(receita.rental_id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell>{formatCurrency(parseFloat(receita.amount))}</TableCell>
                    <TableCell>{receita.client_name}</TableCell>
                    <TableCell>{receita.seller_name}</TableCell>
                    <TableCell>
                      <Chip
                        label={statusLabels[receita.status]}
                        color={statusColors[receita.status]}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleActionMenuClick(e, receita)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Relatório lateral */}
        <Grid item xs={12} md={3}>
          {renderReportPanel()}
        </Grid>
      </Grid>
    </>
  );

  const renderDespesasTab = () => (
    <>
      {/* Navegação do mês */}
      <Paper sx={{ p: 2, mb: 2 }}>
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
      </Paper>

      {/* Conteúdo principal */}
      <Grid container spacing={2}>
        {/* Tabela */}
        <Grid item xs={12} md={9}>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell width="1%">Vencimento</TableCell>
                  <TableCell width="1%" sx={{ whiteSpace: 'nowrap' }}>Contrato</TableCell>
                  <TableCell width="8%" sx={{ whiteSpace: 'nowrap' }}>Valor</TableCell>
                  <TableCell width="70%">Fatura</TableCell>
                  <TableCell width="20%">Carro</TableCell>
                  <TableCell width="1%"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {despesas.map((despesa) => (
                  <TableRow key={despesa.rental_id}>
                    <TableCell>{formatDate(despesa.event_date)}</TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" fontWeight="bold">
                          Nº {despesa.rental_id.slice(-4)}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleViewContract(despesa.rental_id)}
                        >
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: 'nowrap' }}>
                      {formatCurrency(parseFloat(despesa.total_expenses))}
                    </TableCell>
                    <TableCell>
                      {formatDate(despesa.event_date)} - {despesa.client_name} - {formatCurrency(parseFloat(despesa.total_expenses))}
                    </TableCell>
                    <TableCell>{despesa.vehicle_name || ''}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => handleViewContract(despesa.rental_id)}
                      >
                        <MoreVertIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Relatório lateral */}
        <Grid item xs={12} md={3}>
          {renderReportPanel()}
        </Grid>
      </Grid>
    </>
  );

  const renderReportPanel = () => (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Relatório de {monthNames[currentMonth - 1]}
      </Typography>
      
      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ color: 'success.main', fontWeight: 'bold' }}>
          {formatCurrency(totals.receitasPagas || 0)} Receitas (bruto)
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Soma de parcelamentos recebidos no mês.
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ color: 'error.main', fontWeight: 'bold' }}>
          {formatCurrency(totals.totalDespesas || 0)} Despesas {activeTab === 'despesas' ? '←' : ''}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Soma das despesas lançadas no mês.
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          {formatCurrency(totals.totalContasFixas || 0)} Contas Fixas
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Soma dos custos fixos com vencimento no mês.
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ color: 'info.main', fontWeight: 'bold' }}>
          {formatCurrency(totals.totalComissoes || 0)} Comissões
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Soma dos valores de contratos vendidos no mês.
        </Typography>
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="body1" sx={{ color: 'info.main', fontWeight: 'bold' }}>
          {formatCurrency(totals.totalImpostos || 0)} Impostos
        </Typography>
        <Typography variant="body2" color="text.secondary">
          % sobre o valor total de cada reserva lançada no mês.
        </Typography>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: totals.totalLucro >= 0 ? 'success.main' : 'error.main' }}>
          = {formatCurrency(totals.totalLucro || 0)}
        </Typography>
        <Typography variant="body1">
          Lucro de {monthNames[currentMonth - 1]}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          (bruto - custos - comissões - salários - impostos - contas)
        </Typography>
      </Box>
    </Paper>
  );

  return (
    <Box sx={{ p: 2 }}>
      {/* Tabs */}
      <Paper sx={{ mb: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ArrowUpwardIcon fontSize="small" />
                Receitas
              </Box>
            } 
            value="receitas" 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ArrowDownwardIcon fontSize="small" />
                Despesas
              </Box>
            } 
            value="despesas" 
          />
        </Tabs>
      </Paper>

      {/* Conteúdo das abas */}
      {activeTab === 'receitas' ? renderReceitasTab() : renderDespesasTab()}

      {/* Menu de ações */}
      <Menu
        anchorEl={actionMenuAnchor}
        open={Boolean(actionMenuAnchor)}
        onClose={handleActionMenuClose}
      >
        <MenuItem onClick={() => selectedReceita && handleMarkAsPaid(selectedReceita.id)}>
          Marcar como Pago
        </MenuItem>
        <MenuItem onClick={() => selectedReceita && handleMarkAsPending(selectedReceita.id)}>
          Marcar como Aguardando
        </MenuItem>
        <MenuItem onClick={() => selectedReceita && handleViewContract(selectedReceita.rental_id)}>
          Ver Contrato
        </MenuItem>
      </Menu>
    </Box>
  );
}; 