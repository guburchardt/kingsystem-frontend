import React from 'react';
import { Box, Typography, CircularProgress, Paper, Grid, Tooltip } from '@mui/material';
import { formatCurrency } from '../../utils/format';

const getColorByCategory = (category) => {
  switch (category.toLowerCase()) {
    case 'ruim':
      return '#ff4444';
    case 'regular':
      return '#ffaa00';
    case 'bom':
      return '#00c853';
    case 'ótimo':
      return '#2196f3';
    case 'meta':
      return '#4caf50';
    default:
      return '#grey';
  }
};

const getProgressValue = (netSales) => {
  if (netSales >= 65000) return 100;
  if (netSales >= 50000) return 80;
  if (netSales >= 35000) return 60;
  if (netSales >= 20000) return 40;
  return 20;
};

const SellerPerformanceCard = ({ seller }) => {
  const progressValue = getProgressValue(seller.net_sales);
  const color = getColorByCategory(seller.performance_category);

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
          <CircularProgress
            variant="determinate"
            value={progressValue}
            size={80}
            thickness={4}
            sx={{ color }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Typography variant="caption" component="div" color="text.secondary">
              {seller.performance_category}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h6" align="center" gutterBottom>
          {seller.seller_name}
        </Typography>

        <Grid container spacing={1}>
          <Grid item xs={12}>
            <Tooltip title="Valor Bruto">
              <Typography variant="body2" color="text.secondary" align="center">
                Bruto: {formatCurrency(seller.gross_sales)}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <Tooltip title="Valor Líquido (após impostos)">
              <Typography variant="body2" color="text.secondary" align="center">
                Líquido: {formatCurrency(seller.net_sales)}
              </Typography>
            </Tooltip>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body2" color="text.secondary" align="center">
              Locações: {seller.total_rentals}
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default SellerPerformanceCard; 