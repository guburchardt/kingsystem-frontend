import React, { useEffect, useState, useCallback } from 'react';
import { Box, Grid, Card, CardContent, Typography, Avatar, IconButton, Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, CircularProgress } from '@mui/material';
import { FilterList, ArrowBack, ArrowForward, Close } from '@mui/icons-material';
import { dashboardService } from '../../services/dashboardService';
import { useAuth } from '../../contexts/AuthContext';
import { DashboardMetrics, SalesPerformance } from '../../types';
import { API_BASE_URL, getAuthHeaders } from '../../services/api';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [sellerPerformance, setSellerPerformance] = useState<SalesPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth() + 1); // Mês atual
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  
  // Modal states
  const [rentalsModalOpen, setRentalsModalOpen] = useState(false);
  const [selectedSeller, setSelectedSeller] = useState<SalesPerformance | null>(null);
  const [sellerRentals, setSellerRentals] = useState<any[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  
  // Sales goals state
  const [salesGoals, setSalesGoals] = useState<any>(null);

  // Verificar se usuário é admin
  const isAdmin = user && (user.role === 'admin' || user.email === 'admin@kingsystem.com');

  const fetchMetrics = useCallback(async () => {
    // Só buscar métricas gerais se for admin
    if (!isAdmin) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const metricsData = await dashboardService.getMetrics();
      setMetrics(metricsData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar métricas');
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  const fetchSellerData = useCallback(async () => {
    if (isAdmin) {
      // Admin: buscar todos os vendedores
      await fetchSellerPerformance(selectedMonth, selectedYear);
      await fetchSalesGoals(selectedMonth, selectedYear);
    } else if (user && user.role === 'seller') {
      // Vendedor: buscar apenas seus próprios dados
      await fetchSellerPerformance(selectedMonth, selectedYear, user.id);
      await fetchSalesGoals(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear, user, isAdmin]);

  useEffect(() => {
    if (user) {
      fetchMetrics();
    }
  }, [fetchMetrics, user]);

  useEffect(() => {
    fetchSellerData();
  }, [fetchSellerData]);

  const fetchSellerPerformance = async (month: number, year: number, sellerId?: string) => {
    try {
      let performanceData;
      
      if (sellerId) {
        // Buscar apenas dados do vendedor específico (para vendedores)
        const response = await fetch(
          `${API_BASE_URL}/dashboard/seller-performance?month=${month}&year=${year}&sellerId=${sellerId}`,
          {
            method: 'GET',
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error('Erro ao carregar performance do vendedor');
        }

        const data = await response.json();
        performanceData = data.performance ? [data.performance] : [];
      } else {
        // Buscar todos os vendedores (admin) - usar rota específica
        const response = await fetch(
          `${API_BASE_URL}/dashboard/sales-performance?period=month&month=${month}&year=${year}`,
          {
            method: 'GET',
            headers: getAuthHeaders(),
          }
        );

        if (!response.ok) {
          throw new Error('Erro ao carregar performance dos vendedores');
        }

        const data = await response.json();
        performanceData = data.performance || [];
      }
      
      console.log('Performance data received:', performanceData);
      
      // Garantir que performanceData seja sempre um array
      if (Array.isArray(performanceData)) {
        setSellerPerformance(performanceData);
      } else {
        console.warn('Performance data is not an array:', performanceData);
        setSellerPerformance([]);
      }
    } catch (err: any) {
      console.error('Erro ao carregar performance dos vendedores:', err);
      setSellerPerformance([]); // Definir como array vazio em caso de erro
    }
  };

  const fetchSalesGoals = async (month: number, year: number) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/dashboard/sales-goals?month=${month}&year=${year}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar objetivos de vendas');
      }

      const data = await response.json();
      setSalesGoals(data.data);
    } catch (err: any) {
      console.error('Erro ao carregar objetivos de vendas:', err);
      setSalesGoals(null);
    }
  };



  const handleRentalsClick = async (seller: SalesPerformance) => {
    try {
      setModalLoading(true);
      setSelectedSeller(seller);
      
      const response = await fetch(
        `${API_BASE_URL}/dashboard/seller-rentals?sellerId=${seller.seller_id}&month=${selectedMonth}&year=${selectedYear}`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao carregar locações');
      }

      const data = await response.json();
      setSellerRentals(data.rentals || []);
      setRentalsModalOpen(true);
    } catch (err: any) {
      console.error('Erro ao carregar locações:', err);
      alert('Erro ao carregar locações do vendedor');
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewContract = async (rentalId: string) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/rentals/${rentalId}/contract`,
        {
          method: 'GET',
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error('Erro ao baixar contrato');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `contrato-${rentalId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err: any) {
      console.error('Erro ao baixar contrato:', err);
      alert('Erro ao baixar contrato. Contrato pode não estar disponível.');
    }
  };



  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'pendente': return 'warning';
      case 'respondido': return 'info';
      case 'contratado': return 'success';
      case 'cancelado': return 'error';
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      case 'pendente': return 'Pendente';
      case 'respondido': return 'Respondido';
      case 'contratado': return 'Contratado';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  const getMonthName = (month: number) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return months[month - 1];
  };

  const getPerformanceLevel = (revenue: number) => {
    if (revenue >= 65000) return { level: 'Meta', color: '#4CAF50', percentage: 100 };
    if (revenue >= 50000) return { level: 'Ótimo', color: '#8BC34A', percentage: 80 };
    if (revenue >= 35000) return { level: 'Bom', color: '#FFC107', percentage: 60 };
    if (revenue >= 20000) return { level: 'Regular', color: '#FF9800', percentage: 40 };
    return { level: 'Ruim', color: '#F44336', percentage: 20 };
  };

  const getWeeklyPerformance = (weekRevenue: number) => {
    // Meta semanal é 1/4 da meta mensal (65000/4 = 16250)
    const weeklyTarget = 16250;
    const percentage = Math.min((weekRevenue / weeklyTarget) * 100, 100);
    
    // Determinar cor baseada na porcentagem
    let color = '#f0f0f0'; // Cinza para 0%
    if (percentage >= 100) color = '#4CAF50'; // Verde para 100%+
    else if (percentage >= 80) color = '#8BC34A'; // Verde claro para 80%+
    else if (percentage >= 60) color = '#FFC107'; // Amarelo para 60%+
    else if (percentage >= 40) color = '#FF9800'; // Laranja para 40%+
    else if (percentage >= 20) color = '#FF7043'; // Laranja escuro para 20%+
    else if (percentage > 0) color = '#F44336'; // Vermelho para até 20%
    
    return {
      percentage: Math.round(percentage),
      color,
      level: percentage >= 100 ? 'Meta' : percentage >= 80 ? 'Ótimo' : percentage >= 60 ? 'Bom' : percentage >= 40 ? 'Regular' : 'Ruim'
    };
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    let newMonth = selectedMonth;
    let newYear = selectedYear;
    
    if (direction === 'prev') {
      if (selectedMonth === 1) {
        newMonth = 12;
        newYear = selectedYear - 1;
      } else {
        newMonth = selectedMonth - 1;
      }
    } else {
      if (selectedMonth === 12) {
        newMonth = 1;
        newYear = selectedYear + 1;
      } else {
        newMonth = selectedMonth + 1;
      }
    }
    
    setSelectedMonth(newMonth);
    setSelectedYear(newYear);
    
    // Recarregar dados para o novo mês
    if (isAdmin) {
      fetchSellerPerformance(newMonth, newYear);
      fetchSalesGoals(newMonth, newYear);
    } else if (user && user.role === 'seller') {
      fetchSellerPerformance(newMonth, newYear, user.id);
      fetchSalesGoals(newMonth, newYear);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography>Carregando dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Erro: {error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="page-container">
      <Box className="page-content" sx={{ p: { xs: 1, md: 2 } }}>
        <br />
        <Grid container spacing={2}>
          {/* Sidebar - Perfil do usuário */}
          <Grid item xs={12} md={2}>
            <Box sx={{ textAlign: 'center', mb: { xs: 2, md: 2 }, width: '100%' }}>
              <Avatar
                src="/images/user.png"
                sx={{ width: 70, height: 70, mx: 'auto', mb: 2 }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Olá, {user?.name || 'Usuário'}
              </Typography>
              <Typography 
                component="a" 
                href="/login" 
                sx={{ color: '#333', textDecoration: 'none', fontSize: '0.875rem' }}
              >
                Sair do Sistema
              </Typography>
              <hr style={{ margin: '15px 0' }} />
              
              {isAdmin && (
                <>
              <Typography sx={{ fontSize: '17px', mb: 2 }}>
                Demonstrativo Mês de <strong>{getMonthName(selectedMonth)}:</strong>
              </Typography>
              <hr style={{ margin: '15px 0' }} />
              {/* Objetivos de Vendas */}
              <Box sx={{ textAlign: 'left', fontSize: '12px' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                  Objetivo de Vendas (Mensal):
                </Typography>
                {salesGoals && (
                  <>
                    <Box sx={{ mb: 1, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        Desempenho Atual: {formatCurrency(salesGoals.currentRevenue)}
                      </Typography>
                      <Typography variant="caption" sx={{ display: 'block', color: salesGoals.goals[salesGoals.currentLevel]?.color }}>
                        Nível: {salesGoals.currentLevel.charAt(0).toUpperCase() + salesGoals.currentLevel.slice(1)}
                      </Typography>
                    </Box>
                    {Object.entries(salesGoals.goals).map(([level, range]: [string, any]) => (
                      <Box key={level} sx={{ mb: 0.5, display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            bgcolor: range.color,
                            borderRadius: '50%',
                            mr: 1,
                            border: salesGoals.currentLevel === level ? '2px solid #000' : 'none'
                          }}
                        />
                        <Typography variant="caption">
                          <strong>{level.charAt(0).toUpperCase() + level.slice(1)}:</strong> {formatCurrency(range.min)} {range.max === Infinity ? 'ou mais' : `à ${formatCurrency(range.max)}`}
                        </Typography>
                      </Box>
                    ))}
                  </>
                )}
                {!salesGoals && (
                  <>
                    <Box sx={{ mb: 0.5 }}>
                      <strong>Ruim:</strong> R$ 0,00 à R$ 19.999,99
                    </Box>
                    <Box sx={{ mb: 0.5 }}>
                      <strong>Regular:</strong> R$ 20.000,00 à R$ 34.999,99
                    </Box>
                    <Box sx={{ mb: 0.5 }}>
                      <strong>Bom:</strong> R$ 35.000,00 à R$ 49.999,99
                    </Box>
                    <Box sx={{ mb: 0.5 }}>
                      <strong>Ótimo:</strong> R$ 50.000,00 à R$ 64.999,99
                    </Box>
                    <Box sx={{ mb: 0.5 }}>
                      <strong>Meta:</strong> R$ 65.000,00 ou mais
                    </Box>
                  </>
                )}
              </Box>
                </>
              )}
            </Box>
          </Grid>

          {/* Conteúdo principal */}
          <Grid item xs={12} md={10}>
            {/* Métricas principais - APENAS PARA ADMIN */}
            {isAdmin && metrics && (
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 0 }}>
                    {metrics.totalClients}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Contatos</Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                    Clientes ativos
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={6} sm={4} md={2}>
                <Box sx={{ textAlign: 'center', p: 1 }}>
                  <Typography variant="h4" sx={{ fontWeight: 600, mb: 0 }}>
                    {metrics.todayRentals}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>Hoje</Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                    Eventos de hoje
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            )}

            {/* Navegação de mês */}
            <Box sx={{ textAlign: 'center', my: 3 }}>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                <Button
                  variant="text"
                  onClick={() => navigateMonth('prev')}
                  sx={{ minWidth: 'auto', p: 1 }}
                >
                  <ArrowBack /> Anterior
                </Button>
                <Typography sx={{ mx: 2, fontWeight: 600 }}>
                  {getMonthName(selectedMonth)} | {selectedYear}
                </Typography>
                <Button
                  variant="text"
                  onClick={() => navigateMonth('next')}
                  sx={{ minWidth: 'auto', p: 1 }}
                >
                  Próxima <ArrowForward />
                </Button>
              </Box>
            </Box>

            {/* Cards dos vendedores */}
            <Grid container spacing={1} justifyContent={!isAdmin ? 'center' : 'flex-start'}>
              {sellerPerformance && Array.isArray(sellerPerformance) && sellerPerformance.length > 0 ? (
                sellerPerformance.map((seller) => {
                  const performance = getPerformanceLevel(seller.net_sales || seller.total_revenue || 0);
                  return (
                    <Grid item xs={12} sm={6} lg={!isAdmin ? 6 : 2} key={seller.seller_id || seller.id}>
                      <Card sx={{ p: 1, height: '100%' }}>
                        <CardContent sx={{ p: 1, textAlign: 'center' }}>
                          {/* Avatar do vendedor */}
                          <Box sx={{ mb: 2 }}>
                            <Avatar
                              src={`/images/svg/${performance.percentage}.svg`}
                              sx={{ width: 120, height: 120, mx: 'auto' }}
                            />
                          </Box>

                          {/* Nome do vendedor */}
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            {seller.seller_name}
                          </Typography>

                          {/* Barras de progresso semanais */}
                          {[1, 2, 3, 4].map((week) => {
                            const weekData = seller.weeklyData?.find(w => w.week === week);
                            const weekRevenue = weekData?.net_sales || 0;
                            const weekPerformance = getWeeklyPerformance(weekRevenue);
                            
                            return (
                              <Box key={week} sx={{ mb: 1, fontSize: '12px' }}>
                                <Box
                                  sx={{
                                    width: '100%',
                                    height: 20,
                                    bgcolor: weekPerformance.color,
                                    borderRadius: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: weekRevenue > 0 ? 'white' : '#666',
                                    fontSize: '10px',
                                    mb: 0.5,
                                    fontWeight: 'bold'
                                  }}
                                >
                                  {weekPerformance.percentage}%
                                </Box>
                                <Typography variant="caption">
                                  {weekData?.period || `Semana ${week}`} | {formatCurrency(weekRevenue)}
                                </Typography>
                                <hr style={{ margin: '2px 0' }} />
                              </Box>
                            );
                          })}

                          {/* Estatísticas */}
                          <Typography variant="caption" sx={{ display: 'block', mt: 1, mb: 1 }}>
                            Contatos: <strong>{seller.total_rentals}</strong> | Locações: <strong>{seller.total_rentals}</strong>
                          </Typography>

                                                  {/* Valor total */}
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                          {formatCurrency(seller.net_sales || seller.total_revenue || 0)}
                        </Typography>

                          {/* Ações */}
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <IconButton size="small" onClick={() => handleRentalsClick(seller)}>
                              <FilterList />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })
              ) : (
                <Grid item xs={12}>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      {loading ? 'Carregando dados...' : 'Nenhum dado encontrado para este período.'}
                    </Typography>
                  </Box>
                </Grid>
      )}
            </Grid>
          </Grid>
        </Grid>
      </Box>



      {/* Modal de Locações */}
      <Dialog open={rentalsModalOpen} onClose={() => setRentalsModalOpen(false)} maxWidth="xl" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6">
              Locações de {selectedSeller?.seller_name} - {getMonthName(selectedMonth)}/{selectedYear}
            </Typography>
            <IconButton onClick={() => setRentalsModalOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {modalLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress size={24} />
            </Box>
          ) : sellerRentals && sellerRentals.length > 0 ? (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Data</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Veículo</TableCell>
                    <TableCell>Motorista</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Pagamento</TableCell>
                    <TableCell>Ações</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sellerRentals.map((rental) => (
                    <TableRow key={rental.id}>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {formatDate(rental.event_date)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {rental.start_time} - {rental.end_time}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {rental.client_name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {rental.client_phone}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2">
                            {rental.vehicle_name}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Capacidade: {rental.vehicle_capacity}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {rental.driver_name || 'Não definido'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {formatCurrency(rental.total_value || 0)}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            Base: {formatCurrency(rental.base_price || 0)}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusLabel(rental.status)} 
                          color={getStatusColor(rental.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getStatusLabel(rental.payment_status)} 
                          color={getStatusColor(rental.payment_status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleViewContract(rental.id)}
                        >
                          Contrato
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography>Nenhuma locação encontrada para este vendedor neste período.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRentalsModalOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}; 