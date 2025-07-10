import React, { useEffect, useState, useCallback, memo } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import courtesyService from '../../services/courtesyService';
import { Courtesy, RentalCourtesy } from '../../types';

interface RentalCourtesiesProps {
  rentalId: string;
  onCourtesiesChange?: (totalValue: number) => void;
  disabled?: boolean;
}

export const RentalCourtesies: React.FC<RentalCourtesiesProps> = memo(({
  rentalId,
  onCourtesiesChange,
  disabled = false,
}) => {
  const [courtesies, setCourtesies] = useState<RentalCourtesy[]>([]);
  const [availableCourtesies, setAvailableCourtesies] = useState<Courtesy[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCourtesy, setSelectedCourtesy] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [editingCourtesy, setEditingCourtesy] = useState<RentalCourtesy | null>(null);
  const [tempCourtesies, setTempCourtesies] = useState<RentalCourtesy[]>([]);

  const loadData = useCallback(async () => {
    // Don't load data if rentalId is not valid
    if (!rentalId || rentalId === 'undefined' || rentalId === 'null') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // For new rentals, only load available courtesies
      if (rentalId === 'new') {
        const allCourtesies = await courtesyService.getActiveCourtesies();
        setCourtesies([]);
        setAvailableCourtesies(allCourtesies || []);
        // Use temp courtesies for new rentals
        const total = tempCourtesies.reduce((sum, rc) => sum + (rc.total_value || 0), 0);
        onCourtesiesChange?.(total);
      } else {
      const [rentalCourtesies, allCourtesies] = await Promise.all([
        courtesyService.getRentalCourtesies(rentalId),
        courtesyService.getActiveCourtesies(),
      ]);
      
        setCourtesies(rentalCourtesies || []);
        setAvailableCourtesies(allCourtesies || []);
      
      // Calculate total and notify parent
        const total = (rentalCourtesies || []).reduce((sum, rc) => sum + (rc.total_value || 0), 0);
      onCourtesiesChange?.(total);
      }
    } catch (error) {
      console.error('Error loading courtesies:', error);
      setCourtesies([]);
      setAvailableCourtesies([]);
    } finally {
      setLoading(false);
    }
  }, [rentalId, onCourtesiesChange]);

  useEffect(() => {
    // Don't load data if rentalId is not valid
    if (!rentalId || rentalId === 'undefined' || rentalId === 'null') {
      setLoading(false);
      return;
    }

    // Load data immediately without debounce
    loadData();
  }, [rentalId]); // Remove loadData from dependencies to prevent infinite loops

  const handleAddCourtesy = async () => {
    if (!selectedCourtesy || quantity <= 0) return;

    try {
      setLoading(true);
      
      if (rentalId === 'new') {
        // For new rentals, add to temp courtesies
        const courtesy = availableCourtesies.find(c => c.id === selectedCourtesy);
        if (courtesy) {
          const newTempCourtesy: RentalCourtesy = {
            id: `temp-${Date.now()}`,
            rental_id: 'new',
            courtesy_id: selectedCourtesy,
            quantity,
            total_value: (getCourtesyPrice(courtesy) * quantity),
            created_at: new Date().toISOString(),
            courtesy
          };
          
          setTempCourtesies(prev => [...prev, newTempCourtesy]);
          
          // Calculate new total
          const newTotal = [...tempCourtesies, newTempCourtesy].reduce((sum, rc) => sum + (rc.total_value || 0), 0);
          onCourtesiesChange?.(newTotal);
        }
      } else {
        // For existing rentals, save to backend
      await courtesyService.addCourtesyToRental(rentalId, selectedCourtesy, quantity);
        await loadData();
      }
      
      // Reset form
      setSelectedCourtesy('');
      setQuantity(1);
      setDialogOpen(false);
    } catch (error) {
      console.error('Error adding courtesy:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourtesy = async () => {
    if (!editingCourtesy || quantity <= 0) return;

    try {
      setLoading(true);
      await courtesyService.updateRentalCourtesyQuantity(
        rentalId,
        editingCourtesy.courtesy_id,
        quantity
      );
      
      // Reset form
      setEditingCourtesy(null);
      setQuantity(1);
      setDialogOpen(false);
      
      // Reload data
      await loadData();
    } catch (error) {
      console.error('Error updating courtesy:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCourtesy = async (courtesyId: string) => {
    try {
      setLoading(true);
      
      if (rentalId === 'new') {
        // For new rentals, remove from temp courtesies
        setTempCourtesies(prev => {
          const newTempCourtesies = prev.filter(rc => rc.id !== courtesyId);
          const newTotal = newTempCourtesies.reduce((sum, rc) => sum + (rc.total_value || 0), 0);
          onCourtesiesChange?.(newTotal);
          return newTempCourtesies;
        });
      } else {
        // For existing rentals, remove from backend
      await courtesyService.removeCourtesyFromRental(rentalId, courtesyId);
      await loadData();
      }
    } catch (error) {
      console.error('Error removing courtesy:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditCourtesy = (rentalCourtesy: RentalCourtesy) => {
    setEditingCourtesy(rentalCourtesy);
    setSelectedCourtesy(rentalCourtesy.courtesy_id);
    setQuantity(rentalCourtesy.quantity);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingCourtesy(null);
    setSelectedCourtesy('');
    setQuantity(1);
  };

  const getCourtesyPrice = (courtesy: Courtesy): number => {
    if (courtesy.price) {
      return typeof courtesy.price === 'string' ? parseFloat(courtesy.price) : courtesy.price;
    }
    return courtesy.value || 0;
  };

  const getAvailableCourtesiesForSelect = () => {
    const currentCourtesies = rentalId === 'new' ? tempCourtesies : courtesies;
    const usedCourtesyIds = (currentCourtesies || []).map(rc => rc.courtesy_id);
    return (availableCourtesies || []).filter(c => !usedCourtesyIds.includes(c.id));
  };

  const currentCourtesies = rentalId === 'new' ? tempCourtesies : courtesies;
  const totalValue = (currentCourtesies || []).reduce((sum, rc) => sum + (Number(rc.total_value) || 0), 0);

  // Don't render if rentalId is not valid (but allow 'new' for new rentals)
  if (!rentalId || rentalId === 'undefined' || rentalId === 'null') {
    return null;
  }

  if (loading && (currentCourtesies || []).length === 0) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Cortesias</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            disabled={disabled || (getAvailableCourtesiesForSelect() || []).length === 0}
          >
            Adicionar Cortesia
          </Button>
        </Box>

        {disabled && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              As cortesias não podem ser editadas pois esta locação já foi aprovada. 
              Para alterações, solicite ao administrador.
            </Typography>
          </Alert>
        )}

        {(currentCourtesies || []).length === 0 ? (
          <Alert severity="info">
            Nenhuma cortesia adicionada
          </Alert>
        ) : (
          <Grid container spacing={2}>
            {(currentCourtesies || []).map((rentalCourtesy) => (
              <Grid item xs={12} sm={6} md={4} key={rentalCourtesy.id}>
                <Card variant="outlined">
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                      <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                          {rentalCourtesy.courtesy?.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {rentalCourtesy.courtesy?.description}
                        </Typography>
                        <Typography variant="body2">
                          Quantidade: {rentalCourtesy.quantity}
                        </Typography>
                        <Typography variant="body2" fontWeight="bold" color="primary">
                          R$ {(Number(rentalCourtesy.total_value) || 0).toFixed(2)}
                        </Typography>
                      </Box>
                      <Box>
                        <IconButton
                          size="small"
                          onClick={() => handleEditCourtesy(rentalCourtesy)}
                          disabled={disabled}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => handleRemoveCourtesy(rentalCourtesy.courtesy_id)}
                          disabled={disabled}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        {(currentCourtesies || []).length > 0 && (
          <Box mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
            <Typography variant="h6" textAlign="center">
              Total das Cortesias: R$ {(totalValue || 0).toFixed(2)}
            </Typography>
          </Box>
        )}

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
          <DialogTitle>
            {editingCourtesy ? 'Editar Cortesia' : 'Adicionar Cortesia'}
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <FormControl fullWidth>
                <InputLabel>Cortesia</InputLabel>
                <Select
                  value={selectedCourtesy}
                  onChange={(e) => setSelectedCourtesy(e.target.value)}
                  label="Cortesia"
                  disabled={!!editingCourtesy}
                >
                  {(editingCourtesy ? (availableCourtesies || []) : (getAvailableCourtesiesForSelect() || [])).map((courtesy) => (
                    <MenuItem key={courtesy.id} value={courtesy.id}>
                      {courtesy.name} - R$ {getCourtesyPrice(courtesy).toFixed(2)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Quantidade"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                inputProps={{ min: 1 }}
                fullWidth
              />

              {selectedCourtesy && (
                <Alert severity="info">
                  Valor unitário: R$ {
                    getCourtesyPrice((availableCourtesies || []).find(c => c.id === selectedCourtesy) || {} as Courtesy).toFixed(2)
                  }
                  <br />
                  Valor total: R$ {
                    (getCourtesyPrice((availableCourtesies || []).find(c => c.id === selectedCourtesy) || {} as Courtesy) * quantity).toFixed(2)
                  }
                </Alert>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancelar</Button>
            <Button
              onClick={editingCourtesy ? handleUpdateCourtesy : handleAddCourtesy}
              variant="contained"
              disabled={!selectedCourtesy || quantity <= 0 || loading}
            >
              {loading ? <CircularProgress size={20} /> : (editingCourtesy ? 'Atualizar' : 'Adicionar')}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}); 