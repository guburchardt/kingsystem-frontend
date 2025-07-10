import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Paper, IconButton, Button, Chip, Dialog, DialogTitle, DialogContent, TextField,
  DialogActions, Select, MenuItem, InputLabel, FormControl, Alert, CircularProgress, Stack,
  Divider, Tooltip, Badge, Avatar, ListItem, ListItemAvatar, ListItemText
} from '@mui/material';
import { 
  Add as AddIcon, 
  Delete as DeleteIcon, 
  Edit as EditIcon, 
  Paid as PaidIcon,
  CloudUpload as CloudUploadIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Download as DownloadIcon,
  AttachFile as AttachFileIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  FileUpload as FileUploadIcon
} from '@mui/icons-material';
import { Payment } from '../../types';
import paymentService from '../../services/paymentService';
import rentalService from '../../services/rentalService';
import { format } from 'date-fns';
import { useAuth } from '../../contexts/AuthContext';
import { BrazilianDateInput } from '../common/BrazilianDateInput';

interface RentalPaymentsProps {
  rentalId: string;
  disabled?: boolean;
}

const paymentForms = [ 'pix', 'dinheiro', 'credito', 'debito', 'transferencia', 'cheque', 'permuta', 'outros' ];

export const RentalPayments: React.FC<RentalPaymentsProps> = memo(({ rentalId, disabled = false }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [openReceiptDialog, setOpenReceiptDialog] = useState(false);
  const [openPaymentUploadDialog, setOpenPaymentUploadDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Partial<Payment>>({});
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const { user } = useAuth();

  const isAdmin = user?.role === 'admin';

  const fetchPayments = useCallback(async () => {
    // Don't load data if rentalId is not valid
    if (!rentalId || rentalId === 'undefined' || rentalId === 'null') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');
      const data = await paymentService.getRentalPayments(rentalId);
      setPayments(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar parcelas');
      setPayments([]);
    } finally {
      setLoading(false);
    }
  }, [rentalId]);

  useEffect(() => {
    // Don't load data if rentalId is not valid
    if (!rentalId || rentalId === 'undefined' || rentalId === 'null') {
      setLoading(false);
      return;
    }

    // Load data immediately without debounce
    fetchPayments();
  }, [rentalId]); // Remove fetchPayments from dependencies to prevent infinite loops

  const handleOpenDialog = (payment?: Payment) => {
    setIsEditing(!!payment);
    if (payment) {
      // Keep due_date in ISO format (YYYY-MM-DD) for BrazilianDateInput
      const formattedDate = new Date(payment.due_date).toISOString().split('T')[0];
      setCurrentPayment({ 
        ...payment, 
        due_date: formattedDate
      });
    } else {
      // Set today's date for new payment in ISO format
      const today = new Date().toISOString().split('T')[0];
      setCurrentPayment({ 
        due_date: today, 
        amount: 0, 
        payment_form: 'pix' 
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentPayment({});
  };

  const handleOpenUploadDialog = (payment: Payment) => {
    setCurrentPayment(payment);
    setOpenUploadDialog(true);
    setUploadFile(null);
  };

  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
    setCurrentPayment({});
    setUploadFile(null);
  };

  const handleOpenReceiptDialog = (payment: Payment) => {
    setCurrentPayment(payment);
    setOpenReceiptDialog(true);
  };

  const handleCloseReceiptDialog = () => {
    setOpenReceiptDialog(false);
    setCurrentPayment({});
  };

  const handleOpenPaymentUploadDialog = (payment: Payment) => {
    setCurrentPayment(payment);
    setOpenPaymentUploadDialog(true);
    setUploadFile(null);
  };

  const handleClosePaymentUploadDialog = () => {
    setOpenPaymentUploadDialog(false);
    setCurrentPayment({});
    setUploadFile(null);
  };

  const handleSavePayment = async () => {
    try {
      if (!currentPayment.amount || currentPayment.amount <= 0) {
        setError('Valor deve ser maior que zero');
        return;
      }

      if (!currentPayment.due_date) {
        setError('Data de vencimento é obrigatória');
        return;
      }

      const payment_form = currentPayment.payment_form || 'pix';

      if (isEditing) {
        await paymentService.updatePayment(currentPayment.id!, {
          amount: currentPayment.amount,
          due_date: currentPayment.due_date,
          method: payment_form
        });
      } else {
        await paymentService.createPayment({
          rental_id: rentalId,
          amount: currentPayment.amount,
          due_date: currentPayment.due_date,
          payment_form: payment_form,
          status: 'a_receber'
        });
      }

      handleCloseDialog();
      fetchPayments();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar parcela');
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta parcela?')) {
      try {
        await paymentService.deletePayment(paymentId);
        fetchPayments();
      } catch (err: any) {
        setError(err.message || 'Erro ao excluir parcela');
      }
    }
  };

  const handleMarkAsPaid = async (paymentId: string) => {
     if (window.confirm('Confirmar o pagamento desta parcela?')) {
      try {
        await paymentService.updatePayment(paymentId, { 
          status: 'paid', 
          payment_date: new Date().toISOString() 
        });
        fetchPayments();
      } catch (err: any) {
        setError(err.message || 'Erro ao confirmar pagamento');
      }
    }
  };

  const handleUploadReceipt = async () => {
    if (!uploadFile || !currentPayment.id) {
      setError('Selecione um arquivo para upload');
      return;
    }

    try {
      setUploadLoading(true);
      await paymentService.uploadReceipt(currentPayment.id, uploadFile);
      handleCloseUploadDialog();
      fetchPayments();
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload do comprovante');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleUploadPaymentFile = async () => {
    if (!uploadFile || !currentPayment.id) {
      setError('Selecione um arquivo para upload');
      return;
    }

    try {
      setUploadLoading(true);
      await rentalService.uploadPaymentFile(rentalId, currentPayment.id, uploadFile);
      handleClosePaymentUploadDialog();
      fetchPayments();
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer upload do comprovante');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleConfirmPayment = async (paymentId: string) => {
    if (window.confirm('Confirmar este pagamento? Esta ação não pode ser desfeita.')) {
      try {
        await paymentService.confirmPayment(paymentId);
        fetchPayments();
      } catch (err: any) {
        setError(err.message || 'Erro ao confirmar pagamento');
      }
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    const reason = window.prompt('Motivo da rejeição:');
    if (reason) {
      try {
        await paymentService.rejectPayment(paymentId, reason);
        fetchPayments();
      } catch (err: any) {
        setError(err.message || 'Erro ao rejeitar pagamento');
      }
    }
  };

  const handleRecalculateStatus = async () => {
    try {
      setLoading(true);
      await paymentService.refreshRentalPaymentStatus(rentalId);
      await fetchPayments();
    } catch (err: any) {
      setError(err.message || 'Erro ao recalcular status');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReceipt = (receiptUrl: string, paymentAmount: number, dueDate: string, paymentId?: string) => {
    // Create download link
    const link = document.createElement('a');
    link.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/uploads/${receiptUrl}`;
    
    // Get payment index for filename
    const paymentIndex = paymentId ? payments.findIndex(p => p.id === paymentId) + 1 : '';
    const parcelaText = paymentIndex ? `parcela-${paymentIndex}-` : '';
    
    link.download = `comprovante-${parcelaText}${format(new Date(dueDate), 'dd-MM-yyyy')}-R$${paymentAmount.toFixed(2)}.${receiptUrl.split('.').pop()}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIcon = (filename: string) => {
    const extension = filename?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension || '')) {
      return <ImageIcon />;
    } else if (extension === 'pdf') {
      return <DescriptionIcon />;
    }
    return <AttachFileIcon />;
  };

  const getStatusChip = (payment: Payment) => {
    const statusConfig = {
      'paid': { label: 'Pago', color: 'success' as const, icon: <CheckCircleIcon /> },
      'atrasado': { label: 'Atrasado', color: 'error' as const, icon: <CancelIcon /> },
      'aberto': { label: 'Aberto', color: 'warning' as const, icon: <EditIcon /> },
      'pendente': { label: 'Pendente', color: 'info' as const, icon: <CloudUploadIcon /> },
      'a_receber': { label: 'A Receber', color: 'default' as const, icon: <CheckIcon /> },
    };

    const config = statusConfig[payment.status as keyof typeof statusConfig] || statusConfig.a_receber;
    
    return (
      <Chip 
        label={config.label}
        color={config.color}
        size="small"
        icon={config.icon}
        variant={payment.status === 'pendente' ? 'filled' : 'outlined'}
      />
    );
  };

  const getReceiptInfo = (payment: Payment) => {
    if (!payment.receipt_url) {
      return (
        <Box display="flex" alignItems="center" justifyContent="center">
          <Tooltip title="Sem comprovante">
            <IconButton size="small" disabled>
              <AttachFileIcon fontSize="small" color="disabled" />
            </IconButton>
          </Tooltip>
        </Box>
      );
    }

    return (
      <Box display="flex" alignItems="center" gap={0.5}>
        <Tooltip title={`Comprovante desta parcela: R$ ${Number(payment.amount).toFixed(2)} - ${format(new Date(payment.due_date), 'dd/MM/yyyy')}`}>
          <IconButton 
            size="small" 
            color="primary"
            onClick={() => handleOpenReceiptDialog(payment)}
          >
            <Badge color="success" variant="dot">
              {getFileIcon(payment.receipt_url)}
            </Badge>
          </IconButton>
        </Tooltip>
        
        <Tooltip title={`Baixar comprovante - R$ ${Number(payment.amount).toFixed(2)}`}>
          <IconButton 
            size="small" 
            color="primary"
            onClick={() => handleDownloadReceipt(payment.receipt_url!, payment.amount, payment.due_date, payment.id)}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    );
  };

  // Don't render if rentalId is not valid
  if (!rentalId || rentalId === 'undefined' || rentalId === 'null') {
    return null;
  }

  if (loading && payments.length === 0) {
    return (
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box display="flex" justifyContent="center" p={2}>
          <CircularProgress />
        </Box>
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      {/* Legenda dos status */}
      <Alert severity="info" sx={{ mb: 2 }}>
        <Box display="flex" flexDirection="column" gap={1}>
          <Typography variant="subtitle2" fontWeight="bold">Status dos Pagamentos:</Typography>
          <Box display="flex" flexWrap="wrap" gap={1}>
            <Chip label="Aberto" color="warning" size="small" />
            <Typography variant="caption">Valor das parcelas não atinge o valor bruto da locação.</Typography>
          </Box>
          <Box display="flex" flexWrap="wrap" gap={1}>
            <Chip label="Atrasado" color="error" size="small" />
            <Typography variant="caption">Parcela vencida e não paga.</Typography>
          </Box>
          <Box display="flex" flexWrap="wrap" gap={1}>
            <Chip label="Pendente" color="info" size="small" />
            <Typography variant="caption">Comprovante enviado, aguardando confirmação do admin.</Typography>
          </Box>
          <Box display="flex" flexWrap="wrap" gap={1}>
            <Chip label="A Receber" color="default" size="small" />
            <Typography variant="caption">Parcela aguardando pagamento (status normal).</Typography>
          </Box>
          <Box display="flex" flexWrap="wrap" gap={1}>
            <Chip label="Pago" color="success" size="small" />
            <Typography variant="caption">Parcela paga.</Typography>
          </Box>
        </Box>
      </Alert>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      
      {disabled && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            As parcelas não podem ser editadas pois esta locação já foi aprovada. 
            Você pode fazer upload de comprovantes, mas não pode adicionar ou editar parcelas.
            Para alterações, solicite ao administrador.
          </Typography>
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Parcelamento</Typography>
        <Box display="flex" gap={1}>
          {isAdmin && (
            <Tooltip title="Recalcular status de todos os pagamentos">
              <Button
                variant="outlined"
                size="small"
                onClick={handleRecalculateStatus}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={16} /> : <CheckCircleIcon />}
                sx={{ mb: 1 }}
              >
                Recalcular Status
              </Button>
            </Tooltip>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            size="small"
            sx={{ mb: 1 }}
            disabled={disabled}
          >
            Adicionar Parcela
          </Button>
        </Box>
      </Box>
      
      <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 'none' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Parcela</TableCell>
              <TableCell>Vencimento</TableCell>
              <TableCell>Forma</TableCell>
              <TableCell align="right">Valor</TableCell>
              <TableCell align="center">Status</TableCell>
              <TableCell align="center">Comprovante</TableCell>
              <TableCell align="right">Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length > 0 ? payments.map((payment, index) => (
              <TableRow key={payment.id}>
                <TableCell>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Chip 
                      label={`${index + 1}ª`}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  </Box>
                </TableCell>
                <TableCell>{format(new Date(payment.due_date), 'dd/MM/yyyy')}</TableCell>
                <TableCell>{payment.payment_form}</TableCell>
                <TableCell align="right">R$ {Number(payment.amount).toFixed(2)}</TableCell>
                <TableCell align="center">
                  {getStatusChip(payment)}
                  {payment.rejection_reason && (
                    <Tooltip title={`Rejeitado: ${payment.rejection_reason}`}>
                      <IconButton size="small" color="error">
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell align="center">
                  {getReceiptInfo(payment)}
                </TableCell>
                <TableCell align="right">
                  <Box display="flex" gap={0.5}>
                    {/* Botão de upload de comprovante de parcela - para todos os usuários */}
                    {(payment.status === 'a_receber' || payment.status === 'atrasado') && (
                      <Tooltip title="Enviar Comprovante da Parcela">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenPaymentUploadDialog(payment)}
                          color="primary"
                        >
                          <FileUploadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {/* Botão de upload de comprovante - apenas para vendedores */}
                    {!isAdmin && (payment.status === 'a_receber' || payment.status === 'atrasado') && (
                      <Tooltip title="Enviar Comprovante (Sistema Antigo)">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenUploadDialog(payment)}
                          color="secondary"
                        >
                          <CloudUploadIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                    
                    {/* Botões de confirmação/rejeição - apenas para admin */}
                    {isAdmin && payment.status === 'pendente' && (
                      <>
                        <Tooltip title="Confirmar Pagamento">
                          <IconButton 
                            size="small" 
                            onClick={() => handleConfirmPayment(payment.id)}
                            color="success"
                          >
                            <CheckIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Rejeitar Pagamento">
                          <IconButton 
                            size="small" 
                            onClick={() => handleRejectPayment(payment.id)}
                            color="error"
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                    
                    {/* Botão de marcar como pago - apenas para admin */}
                    {isAdmin && (payment.status === 'a_receber' || payment.status === 'atrasado') && (
                      <Tooltip title="Marcar como Pago">
                    <IconButton 
                      size="small" 
                      onClick={() => handleMarkAsPaid(payment.id)} 
                          color="success"
                    >
                          <PaidIcon fontSize="small" />
                    </IconButton>
                      </Tooltip>
                  )}
                  
                    {/* Botão de editar - admin pode editar qualquer, vendedor apenas não-pagos */}
                    {(isAdmin || (payment.status !== 'paid')) && (
                      <Tooltip title="Editar Parcela">
                    <IconButton 
                      size="small" 
                      onClick={() => handleOpenDialog(payment)}
                          color="primary"
                          disabled={disabled}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                      </Tooltip>
                  )}
                  
                    {/* Botão de excluir - admin pode excluir qualquer, vendedor apenas não-pagos */}
                    {(isAdmin || (payment.status !== 'paid')) && (
                      <Tooltip title="Excluir Parcela">
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeletePayment(payment.id)}
                          color="error"
                          disabled={disabled}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" color="textSecondary">
                    Nenhuma parcela cadastrada
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog para adicionar/editar parcela */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditing ? 'Editar Parcela' : 'Adicionar Parcela'}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField
            label="Valor"
            type="number"
            fullWidth
            value={currentPayment.amount || ''}
              onChange={(e) => setCurrentPayment({...currentPayment, amount: parseFloat(e.target.value) || 0})}
              inputProps={{ step: 0.01, min: 0 }}
            />
            
            <BrazilianDateInput
              label="Data de Vencimento"
              value={currentPayment.due_date || ''}
              onChange={(value) => setCurrentPayment({...currentPayment, due_date: value})}
              error={false}
              helperText=""
            />
            
            <FormControl fullWidth>
              <InputLabel>Forma de Pagamento</InputLabel>
            <Select
                value={currentPayment.payment_form || 'pix'}
                onChange={(e) => setCurrentPayment({...currentPayment, payment_form: e.target.value})}
                label="Forma de Pagamento"
              >
                {paymentForms.map(form => (
                  <MenuItem key={form} value={form}>
                    {form.charAt(0).toUpperCase() + form.slice(1)}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button onClick={handleSavePayment} variant="contained">
            {isEditing ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para upload de comprovante */}
      <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <CloudUploadIcon />
            Enviar Comprovante de Pagamento
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Parcela:</strong> {payments.findIndex(p => p.id === currentPayment.id) + 1}ª parcela
              </Typography>
              <Typography variant="body2">
                <strong>Valor:</strong> R$ {Number(currentPayment.amount || 0).toFixed(2)} 
              </Typography>
              <Typography variant="body2">
                <strong>Vencimento:</strong> {currentPayment.due_date ? format(new Date(currentPayment.due_date), 'dd/MM/yyyy') : ''}
              </Typography>
              <Typography variant="body2">
                <strong>Forma de Pagamento:</strong> {currentPayment.payment_form}
              </Typography>
            </Alert>
            
            <Box
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                }
              }}
              onClick={() => document.getElementById('receipt-upload')?.click()}
            >
              <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Clique para selecionar o comprovante
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Formatos aceitos: JPG, PNG, PDF (máx. 10MB)
              </Typography>
              {uploadFile && (
                <Box sx={{ mt: 2, p: 1, backgroundColor: 'success.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="success.dark" fontWeight="bold">
                    📎 {uploadFile.name}
                  </Typography>
                  <Typography variant="caption" color="success.dark">
                    {(uploadFile.size / 1024).toFixed(1)} KB
                  </Typography>
                </Box>
              )}
            </Box>
            
            <input
              id="receipt-upload"
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>Cancelar</Button>
          <Button 
            onClick={handleUploadReceipt} 
            variant="contained"
            disabled={!uploadFile || uploadLoading}
            startIcon={uploadLoading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
          >
            {uploadLoading ? 'Enviando...' : 'Enviar Comprovante'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para visualizar comprovante */}
      <Dialog open={openReceiptDialog} onClose={handleCloseReceiptDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            {currentPayment.receipt_url && getFileIcon(currentPayment.receipt_url)}
            Comprovante de Pagamento
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2}>
            <Box sx={{ p: 2, backgroundColor: 'grey.100', borderRadius: 1 }}>
              <Typography variant="h6" gutterBottom>
                {payments.findIndex(p => p.id === currentPayment.id) + 1}ª Parcela - Detalhes
              </Typography>
              <Typography><strong>Valor:</strong> R$ {Number(currentPayment.amount || 0).toFixed(2)}</Typography>
              <Typography><strong>Vencimento:</strong> {currentPayment.due_date ? format(new Date(currentPayment.due_date), 'dd/MM/yyyy') : ''}</Typography>
              <Typography><strong>Forma de Pagamento:</strong> {currentPayment.payment_form}</Typography>
              <Typography><strong>Status:</strong> {currentPayment.status}</Typography>
              {currentPayment.payment_date && (
                <Typography><strong>Data do Pagamento:</strong> {format(new Date(currentPayment.payment_date), 'dd/MM/yyyy HH:mm')}</Typography>
              )}
            </Box>

            {currentPayment.receipt_url && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>Arquivo do Comprovante</Typography>
                <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: 1, backgroundColor: 'background.paper' }}>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {getFileIcon(currentPayment.receipt_url)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={currentPayment.receipt_url}
                      secondary="Clique para baixar o arquivo"
                    />
                    <IconButton 
                      color="primary" 
                      onClick={() => handleDownloadReceipt(currentPayment.receipt_url!, currentPayment.amount || 0, currentPayment.due_date || '', currentPayment.id)}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </ListItem>
                </Box>
              </Box>
            )}

            {currentPayment.rejection_reason && (
              <Alert severity="error">
                <Typography variant="subtitle2">Motivo da Rejeição:</Typography>
                <Typography>{currentPayment.rejection_reason}</Typography>
              </Alert>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReceiptDialog}>Fechar</Button>
          {currentPayment.receipt_url && (
            <Button 
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownloadReceipt(currentPayment.receipt_url!, currentPayment.amount || 0, currentPayment.due_date || '', currentPayment.id)}
            >
              Baixar Comprovante
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Dialog para upload de comprovante de parcela específica */}
      <Dialog open={openPaymentUploadDialog} onClose={handleClosePaymentUploadDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" alignItems="center" gap={1}>
            <FileUploadIcon />
            Enviar Comprovante da Parcela
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Parcela:</strong> {payments.findIndex(p => p.id === currentPayment.id) + 1}ª parcela
              </Typography>
              <Typography variant="body2">
                <strong>Valor:</strong> R$ {Number(currentPayment.amount || 0).toFixed(2)} 
              </Typography>
              <Typography variant="body2">
                <strong>Vencimento:</strong> {currentPayment.due_date ? format(new Date(currentPayment.due_date), 'dd/MM/yyyy') : ''}
              </Typography>
              <Typography variant="body2">
                <strong>Forma de Pagamento:</strong> {currentPayment.payment_form}
              </Typography>
            </Alert>
            
            <Alert severity="warning">
              <Typography variant="body2">
                <strong>📎 Comprovante da Parcela:</strong> Este comprovante será associado especificamente a esta parcela.
              </Typography>
            </Alert>
            
            <Box
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 1,
                p: 3,
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  backgroundColor: 'action.hover',
                }
              }}
              onClick={() => document.getElementById('payment-file-upload')?.click()}
            >
              <FileUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Clique para selecionar o comprovante da parcela
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Formatos aceitos: JPG, PNG, PDF (máx. 10MB)
              </Typography>
              {uploadFile && (
                <Box sx={{ mt: 2, p: 1, backgroundColor: 'success.light', borderRadius: 1 }}>
                  <Typography variant="body2" color="success.dark" fontWeight="bold">
                    📎 {uploadFile.name}
                  </Typography>
                  <Typography variant="caption" color="success.dark">
                    {(uploadFile.size / 1024).toFixed(1)} KB
                  </Typography>
                </Box>
              )}
            </Box>
            
            <input
              id="payment-file-upload"
              type="file"
              accept="image/jpeg,image/png,image/jpg,application/pdf"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePaymentUploadDialog}>Cancelar</Button>
          <Button 
            onClick={handleUploadPaymentFile} 
            variant="contained"
            disabled={!uploadFile || uploadLoading}
            startIcon={uploadLoading ? <CircularProgress size={20} /> : <FileUploadIcon />}
          >
            {uploadLoading ? 'Enviando...' : 'Enviar Comprovante'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}); 

export default RentalPayments; 