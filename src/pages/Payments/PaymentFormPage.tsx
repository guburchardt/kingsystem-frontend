import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

export const PaymentFormPage: React.FC = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Pagamento</Typography>
      <Alert severity="info">
        O cadastro e edição de pagamentos deve ser feito diretamente na tela de edição da locação.<br />
        Para adicionar, editar ou remover parcelas, acesse uma locação e utilize o painel lateral de Parcelamento.
      </Alert>
    </Box>
  );
}; 