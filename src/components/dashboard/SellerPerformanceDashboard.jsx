import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
  Button,
} from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';
import SellerPerformanceCard from './SellerPerformanceCard';
import { api } from '../../services/api';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorAlert from '../common/ErrorAlert';

const SellerPerformanceDashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSellerPerformance = async (month, year) => {
    try {
      setLoading(true);
      const response = await api.get('/api/dashboard/seller-performance', {
        params: { month: month + 1, year }
      });
      setSellers(response.data.data);
      setError(null);
    } catch (err) {
      setError('Erro ao carregar dados dos vendedores');
      console.error('Error fetching seller performance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSellerPerformance(selectedDate.getMonth(), selectedDate.getFullYear());
  }, [selectedDate]);

  const handleMonthChange = (direction) => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const getMonthName = (date) => {
    const months = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <Container maxWidth="xl">
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="h5" gutterBottom>
            Performance dos Vendedores
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<ArrowBack />}
              onClick={() => handleMonthChange('prev')}
            >
              Anterior
            </Button>
            <Typography variant="h6" sx={{ minWidth: 200, textAlign: 'center' }}>
              {getMonthName(selectedDate)}
            </Typography>
            <Button
              variant="outlined"
              endIcon={<ArrowForward />}
              onClick={() => handleMonthChange('next')}
            >
              Próximo
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {sellers.map((seller) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={seller.seller_id}>
              <SellerPerformanceCard seller={seller} />
            </Grid>
          ))}
        </Grid>

        {sellers.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="textSecondary">
              Nenhum vendedor encontrado para o período selecionado
          </Typography>
        </Box>
        )}
      </Paper>
    </Container>
  );
};

export default SellerPerformanceDashboard; 