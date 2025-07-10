import React from 'react';
import { Box, Typography, Alert } from '@mui/material';

export const PaymentsPage: React.FC = () => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Pagamentos</Typography>
      <Alert severity="info">
        Os pagamentos devem ser gerenciados diretamente na tela de edição da locação.<br />
        Para adicionar, editar ou remover parcelas, acesse uma locação e utilize o painel lateral de Parcelamento.
      </Alert>
    </Box>
  );
}; 