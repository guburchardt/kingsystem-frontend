import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  IconButton,
  Tooltip,
  CircularProgress,
  Box
} from '@mui/material';
import { Download } from '@mui/icons-material';
import { Rental } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

interface SellerContractsModalProps {
  open: boolean;
  onClose: () => void;
  sellerId: string;
  sellerName: string;
  month: number;
  year: number;
}

export const SellerContractsModal: React.FC<SellerContractsModalProps> = ({
  open,
  onClose,
  sellerId,
  sellerName,
  month,
  year
}) => {
  const [contracts, setContracts] = useState<Rental[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    };
  };

  const fetchContracts = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      const startDate = `${year}-${month.toString().padStart(2, '0')}-01`;
      const endDate = `${year}-${month.toString().padStart(2, '0')}-31`;
      
      const response = await fetch(
        `${API_BASE_URL}/api/rentals?seller_id=${sellerId}&start_date=${startDate}&end_date=${endDate}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao carregar contratos");
      }

      const data = await response.json();
      setContracts(data.rentals || []);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar contratos');
    } finally {
      setLoading(false);
    }
  }, [sellerId, month, year]);

  useEffect(() => {
    if (open && sellerId) {
      fetchContracts();
    }
  }, [open, sellerId, fetchContracts]);

  const handleDownloadContract = async (rentalId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/rentals/${rentalId}/contract`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Erro ao baixar contrato");
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
      alert('Erro ao baixar contrato');
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
      default: return 'default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'approved': return 'Aprovado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="xl" 
      fullWidth
    >
      <DialogTitle>
        <Typography variant="h6">
          Contratos de {sellerName} - {month}/{year}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Total de contratos: {contracts.length}
        </Typography>
      </DialogTitle>
      
      <DialogContent>
        {loading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" align="center" p={2}>
            {error}
          </Typography>
        ) : contracts.length === 0 ? (
          <Typography align="center" p={2}>
            Nenhum contrato encontrado para este período.
          </Typography>
        ) : (
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
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {contracts.map((contract) => (
                  <TableRow key={contract.id}>
                    <TableCell>{formatDate(contract.event_date)}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {contract.client_name || 'N/A'}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {contract.client_phone || contract.client_email || 'Sem contato'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {contract.vehicle_name || 'N/A'}
                      {contract.vehicle_capacity && (
                        <Typography variant="caption" display="block">
                          Capacidade: {contract.vehicle_capacity} pessoas
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>{contract.driver_name || 'N/A'}</TableCell>
                    <TableCell>{formatCurrency(contract.total_cost)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={getStatusLabel(contract.status)} 
                        color={getStatusColor(contract.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Tooltip title="Baixar contrato">
                        <IconButton 
                          size="small" 
                          onClick={() => handleDownloadContract(contract.id)}
                        >
                          <Download />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DialogContent>
      
      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>
      </DialogActions>
    </Dialog>
  );
}; 