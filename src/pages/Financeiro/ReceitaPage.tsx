import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Grid, Tabs, Tab, Chip, CircularProgress, Alert, MenuItem, FormControl, InputLabel, TextField, Select
} from '@mui/material';
import { formatCurrency } from '../../utils/format';
import { formatDateBR } from '../../utils/dateUtils';
import { paymentService } from '../../services/paymentService';

const statusOptions = [
  { label: 'Todos', value: '' },
  { label: 'Aguardando', value: 'a_receber' },
  { label: 'Atrasado', value: 'atrasado' },
  { label: 'Pago', value: 'paid' },
];

const statusLabel = (status: string) => {
  switch (status) {
    case 'paid': return 'Pago';
    case 'a_receber': return 'Aguardando';
    case 'atrasado': return 'Atrasado';
    default: return status;
  }
};

const statusColor = (status: string) => {
  switch (status) {
    case 'paid': return 'success';
    case 'a_receber': return 'warning';
    case 'atrasado': return 'error';
    default: return 'default';
  }
};

const getMonthName = (month: number) => [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
][month - 1];

export const ReceitaPage: React.FC = () => {
  const today = new Date();
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [year, setYear] = useState(today.getFullYear());
  const [status, setStatus] = useState('');
  const [receitas, setReceitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await paymentService.getPayments();
        setReceitas(res.payments || []);
      } catch (e: any) {
        setError(e.message || 'Erro ao buscar receitas');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [month, year, status]);

  // Filtro de status e data (corrigido para tratar due_date como string ISO)
  const filteredReceitas = receitas.filter(r => {
    if (!r.due_date) return false;
    const date = new Date(r.due_date);
    const monthMatch = date.getMonth() + 1 === month;
    const yearMatch = date.getFullYear() === year;
    const statusMatch = status ? r.status === status : true;
    return monthMatch && yearMatch && statusMatch;
  });

  // Totais reais - considerar apenas receitas filtradas
  const totalBruto = filteredReceitas.reduce((sum, r) => sum + Number(r.amount || 0), 0);
  // Os demais totais (despesas, fixas, comissão, imposto, lucro) podem ser mockados ou calculados se houver dados
  const totalDespesas = 0;
  const totalFixas = 0;
  const totalComissao = 0;
  const totalImposto = 0;
  const totalLucro = totalBruto - totalDespesas - totalFixas - totalComissao - totalImposto;

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Tabs value={0}>
          <Tab label="Receita" />
          <Tab label="Despesas" disabled />
          <Tab label="Contas Fixas" disabled />
        </Tabs>
        <Box sx={{ flex: 1 }} />
        <FormControl size="small" sx={{ minWidth: 120, mr: 2 }}>
          <InputLabel>Mês</InputLabel>
          <Select value={month} label="Mês" onChange={e => setMonth(Number(e.target.value))}>
            {[...Array(12)].map((_, i) => (
              <MenuItem key={i + 1} value={i + 1}>{getMonthName(i + 1)}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          label="Ano"
          type="number"
          size="small"
          value={year}
          onChange={e => setYear(Number(e.target.value))}
          sx={{ width: 100, mr: 2 }}
        />
      </Box>
      <Paper sx={{ p: 2, mb: 2 }}>
        {statusOptions.map(opt => (
          <Button
            key={opt.value}
            variant={status === opt.value ? 'contained' : 'outlined'}
            color={status === opt.value ? 'primary' : 'inherit'}
            sx={{ mr: 1, mb: { xs: 1, sm: 0 } }}
            onClick={() => setStatus(opt.value)}
          >
            {opt.label}
          </Button>
        ))}
      </Paper>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Vencimento</TableCell>
                    <TableCell>Contrato</TableCell>
                    <TableCell>Valor</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Consultor</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredReceitas.map((r, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{r.due_date ? formatDateBR(r.due_date) : ''}</TableCell>
                      <TableCell>{r.rental_id ? `Nº ${r.rental_id.slice(0, 5)}` : ''}</TableCell>
                      <TableCell>{formatCurrency(r.amount)}</TableCell>
                      <TableCell>{r.client_name || '-'}</TableCell>
                      <TableCell>{r.seller_name || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={statusLabel(r.status)}
                          color={statusColor(r.status)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ mb: 2 }}>Relatório de {getMonthName(month)}</Typography>
              <Typography variant="body1" sx={{ color: 'green', fontWeight: 600 }}>{formatCurrency(totalBruto)} Receitas (bruto)</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Soma de parcelamentos recebidos no mês.</Typography>
              <Typography variant="body1" sx={{ color: 'red', fontWeight: 600 }}>{formatCurrency(totalDespesas)} Despesas</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Soma dos despesas lançadas no mês.</Typography>
              <Typography variant="body1" sx={{ fontWeight: 600 }}>{formatCurrency(totalFixas)} Contas Fixas</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Soma dos custos fixos com vencimento no mês.</Typography>
              <Typography variant="body1" sx={{ color: '#d84315', fontWeight: 600 }}>{formatCurrency(totalComissao)} Comissões</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>Soma dos valores de contratos vendidos no mês.</Typography>
              <Typography variant="body1" sx={{ color: '#6d4c41', fontWeight: 600 }}>{formatCurrency(totalImposto)} Impostos</Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>% sobre o valor total de cada reserva lançada no mês.</Typography>
              <Typography variant="body1" sx={{ color: 'blue', fontWeight: 700, fontSize: 20 }}>= {formatCurrency(totalLucro)} Lucro de {getMonthName(month)}</Typography>
              <Typography variant="body2">(bruto - custos - comissões - salários - impostos - contas)</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}; 