import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, IconButton, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem,
  CircularProgress, Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Cost, RentalCost } from '../../types';
import costService from '../../services/costService';

interface RentalCostsProps {
  rentalId: string;
}

export const RentalCosts: React.FC<RentalCostsProps> = memo(({ rentalId }) => {
  const [costs, setCosts] = useState<RentalCost[]>([]);
  const [availableCosts, setAvailableCosts] = useState<Cost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [newCost, setNewCost] = useState<{ costId: string; quantity: number }>({
    costId: '',
    quantity: 1,
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const [rentalCostsData, availableCostsData] = await Promise.all([
        costService.getRentalCosts(rentalId),
        costService.getCosts(),
      ]);
      setCosts(rentalCostsData.rentalCosts || []);
      setAvailableCosts(availableCostsData.costs || []);
    } catch (err: any) {
      console.error('Error fetching costs:', err);
      setError(err.message || 'Erro ao carregar custos');
    } finally {
      setLoading(false);
    }
  }, [rentalId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
    fetchData();
    }, 100); // Debounce de 100ms
    
    return () => clearTimeout(timeoutId);
  }, [fetchData]);

  const handleOpenAddDialog = () => {
    setNewCost({ costId: '', quantity: 1 });
    setOpenAddDialog(true);
  };

  const handleCloseAddDialog = () => {
    setOpenAddDialog(false);
  };

  const handleAddCost = async () => {
    if (!newCost.costId || newCost.quantity <= 0) {
      alert('Selecione um custo e informe uma quantidade válida.');
      return;
    }
    try {
      await costService.addRentalCost(
        rentalId,
        newCost.costId,
        newCost.quantity
      );
      // A resposta da adição não tem o 'name' e 'value', então buscamos novamente
      fetchData(); 
      handleCloseAddDialog();
    } catch (err: any) {
      setError(err.message || 'Erro ao adicionar custo');
    }
  };

  const handleDeleteCost = async (rentalCostId: string) => {
    if (window.confirm('Tem certeza que deseja remover este custo?')) {
      try {
        await costService.removeRentalCost(rentalId, rentalCostId);
        setCosts(costs.filter((c) => c.id !== rentalCostId));
      } catch (err: any) {
        setError(err.message || 'Erro ao remover custo');
      }
    }
  };

  const totalCosts = (costs || []).reduce((acc, cost) => acc + Number(cost.total_value), 0);

  if (loading && costs.length === 0) {
    return (
      <Paper sx={{ p: 2, mt: 2 }}>
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, mt: 2 }}>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Custos</Typography>
        <Typography variant="h6">Total: R$ {totalCosts.toFixed(2)}</Typography>
      </Box>
      <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 'none' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="center">Qtd.</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(costs || []).length > 0 ? costs.map((cost) => (
              <TableRow key={cost.id}>
                <TableCell>{cost.name} (R$ {Number(cost.value).toFixed(2)})</TableCell>
                <TableCell align="center">{cost.quantity}</TableCell>
                <TableCell align="right">R$ {Number(cost.total_value).toFixed(2)}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleDeleteCost(cost.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={4} align="center">Nenhum custo adicionado.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Button startIcon={<AddIcon />} onClick={handleOpenAddDialog} fullWidth variant="outlined" sx={{ mt: 2 }}>
        Adicionar Custo
      </Button>

      {/* Add Cost Dialog */}
      <Dialog open={openAddDialog} onClose={handleCloseAddDialog}>
        <DialogTitle>Adicionar Novo Custo</DialogTitle>
        <DialogContent sx={{ minWidth: '400px' }}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="cost-select-label">Custo</InputLabel>
            <Select
              labelId="cost-select-label"
              value={newCost.costId}
              onChange={(e) => setNewCost({ ...newCost, costId: e.target.value })}
            >
              {availableCosts.map((cost) => (
                <MenuItem key={cost.id} value={cost.id}>
                  {cost.name} - R$ {Number(cost.value).toFixed(2)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Quantidade"
            type="number"
            fullWidth
            margin="normal"
            value={newCost.quantity}
            onChange={(e) => setNewCost({ ...newCost, quantity: parseInt(e.target.value, 10) || 1 })}
            inputProps={{ min: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddDialog}>Cancelar</Button>
          <Button onClick={handleAddCost} variant="contained">Adicionar</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}); 