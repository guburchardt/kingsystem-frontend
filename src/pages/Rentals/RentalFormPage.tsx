import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Snackbar,
  Card,
  InputAdornment,
  Switch,
  FormControlLabel,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Download as DownloadIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import { Client, Vehicle, Driver } from '../../types';
import rentalService from '../../services/rentalService';
import clientService from '../../services/clientService';
import vehicleService from '../../services/vehicleService';
import driverService from '../../services/driverService';

import { RentalPayments } from '../../components/rentals/RentalPayments';
import { RentalCourtesies } from '../../components/rentals/RentalCourtesies';
import { BrazilianDateInput } from '../../components/common/BrazilianDateInput';
import { BrazilianTimeInput } from '../../components/common/BrazilianTimeInput';
import { getDayOfWeekBR } from '../../utils/dateUtils';
import { authService } from '../../services/authService';

type User = { role?: string; [key: string]: any };

const createValidationSchema = (isEditing: boolean) => {
  const baseSchema = {
    client_id: yup.string().required('Cliente é obrigatório'),
    vehicle_id: yup.string().required('Veículo é obrigatório'),
    driver_id: yup.string().required('Motorista é obrigatório'),
    event_date: yup.string().required('Data do evento é obrigatória'),
    start_time: yup.string().required('Horário de início é obrigatório'),
    end_time: yup.string().required('Horário de término é obrigatório'),
    pickup_location: yup.string().required('Local de retirada é obrigatório'),
    dropoff_location: yup.string(),
    category: yup.string(),
    payment_method: yup.string().required('Forma de pagamento é obrigatória'),
    total_value: yup.number().min(0, 'Valor total deve ser positivo').required('Valor total é obrigatório'),
    situation: yup.string(),
    payment_description: yup.string(),
    route_description: yup.string(),
    pit_stop_details: yup.string(),
    total_hours: yup.number().min(0.1, 'Horas totais obrigatórias').required('Horas totais obrigatórias'),
    base_price: yup.number().min(0, 'Preço base obrigatório').required('Preço base obrigatório'),
    net_amount: yup.number().min(0, 'Valor líquido obrigatório').required('Valor líquido obrigatório'),
    additional_costs: yup.number(),
    total_cost: yup.number(),
    pit_stop: yup.boolean(),
  };

  if (isEditing) {
    return yup.object({
      ...baseSchema,
      event_date_return: yup.string().test(
        'same-or-after-event-date',
        'Data de retorno deve ser igual ou posterior à data do evento',
        function(value) {
          const { event_date } = this.parent;
          if (!value || !event_date) return true; // Se uma das datas estiver vazia, não valida
          return new Date(value) >= new Date(event_date);
        }
      ),
    });
  }

  return yup.object(baseSchema);
};

export const RentalFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(isEditing);
  const [error, setError] = useState<string>('');
  const [clients, setClients] = useState<Client[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [courtesiesTotal, setCourtesiesTotal] = useState<number>(0);
  const [rental, setRental] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [canEdit, setCanEdit] = useState(true); // Novo estado para controlar se pode editar
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });
  const [files, setFiles] = useState<any[]>([]);

  const formik = useFormik({
    initialValues: {
      client_id: '',
      vehicle_id: '',
      driver_id: '',
      event_date: '',
      event_date_return: '',
      start_time: '',
      end_time: '',
      pickup_location: '',
      dropoff_location: '',
      category: '',
      contact_method: 'whatsapp' as 'sms' | 'instagram' | 'person' | 'whatsapp' | 'email',
      payment_method: 'pix' as 'a_vista' | 'pagseguro' | 'credito' | 'debito' | 'cheque' | 'permuta' | 'outros' | 'cupom' | 'pix',
      total_value: 0,
      situation: '' as '' | 'adiado' | 'remarcado',
      payment_description: '',
      route_description: '',
      pit_stop_details: '',
      pit_stop: false,

      total_hours: 1,
      base_price: 0,
      net_amount: 0,
      additional_costs: 0,
      total_cost: 0,
    },
    validationSchema: createValidationSchema(isEditing),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        setError('');

        // Obter o usuário atual
        const currentUser = await authService.getCurrentUser();
        if (!currentUser.user) {
          throw new Error('Usuário não autenticado');
        }

        console.log('Frontend - values.event_date:', values.event_date);
        console.log('Frontend - values.event_date type:', typeof values.event_date);
        
        const event_day_of_week = getDayOfWeekBR(values.event_date);

        // CORTESIAS SÃO CUSTOS - diminuem o valor líquido
        // total_cost = courtesies_total (TODAS são despesas)
        const totalCosts = courtesiesTotal;
        const netAmount = values.total_value - totalCosts;

        const rentalData: any = {
          client_id: values.client_id,
          vehicle_id: values.vehicle_id,
          driver_id: values.driver_id,
          event_date: values.event_date,
          start_time: values.start_time,
          end_time: values.end_time,
          pickup_location: values.pickup_location,
          dropoff_location: values.dropoff_location || undefined,
          category: values.category || undefined,
          contact_method: values.contact_method,
          payment_method: values.payment_method,
          total_value: values.total_value,
          situation: values.situation === '' ? undefined : values.situation,
          payment_description: values.payment_description || undefined,
          route_description: values.route_description || undefined,
          pit_stop_details: values.pit_stop_details || undefined,
          pit_stop: values.pit_stop,

          total_hours: values.total_hours,
          base_price: values.base_price,
          net_amount: Math.max(0, netAmount),
          additional_costs: 0,
          total_cost: totalCosts, // Total de cortesias (custos operacionais)
          seller_id: currentUser.user.id,
          event_day_of_week,
          status: 'pending' as const,
          payment_status: 'pending' as const,
          has_pending_issues: false,
        };

        // Adicionar event_date_return apenas se estiver editando
        if (isEditing) {
          const event_date_return = values.event_date_return || values.event_date;
          rentalData.event_date_return = event_date_return;
        }

        console.log('Dados sendo enviados para atualização:', rentalData);
        console.log('Dados JSON:', JSON.stringify(rentalData, null, 2));

        if (isEditing && id) {
          await rentalService.updateRental(id, rentalData);
          setSnackbar({
            open: true,
            message: 'Locação atualizada com sucesso!',
            severity: 'success',
          });
        } else {
          const response = await rentalService.createRental(rentalData);
          setSnackbar({
            open: true,
            message: 'Locação criada com sucesso!',
            severity: 'success',
          });
          // Redireciona para a página de edição para gerenciar o restante
          navigate(`/rentals/${response.rental.id}/edit`);
          return;
        }

        setTimeout(() => {
          navigate('/rentals');
        }, 1500);
      } catch (err: any) {
        setError(err.message || 'Erro ao salvar locação');
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    if (isAuthenticated && !authLoading) {
    fetchInitialData();
    }
  }, [isAuthenticated, authLoading]);

  useEffect(() => {
    if (isEditing && id) {
      fetchRental();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  const fetchInitialData = async () => {
    try {
      const [clientsRes, vehiclesRes, driversRes] = await Promise.all([
        clientService.getActiveClients(),
        vehicleService.getActiveVehicles(),
        driverService.getActiveDrivers(),
      ]);

      setClients(clientsRes.clients);
      setVehicles(vehiclesRes.vehicles);
      setDrivers(driversRes.drivers);
    } catch (err: any) {
      setError('Erro ao carregar dados iniciais');
    }
  };

  const fetchRental = async () => {
    try {
      setInitialLoading(true);
      const response = await rentalService.getRentalById(id!);
      const rentalData = response.rental;
      setRental(rentalData);
      
      // Check if user is admin
      const userStr = localStorage.getItem('user');
      let user: User = {};
      try {
        user = userStr ? JSON.parse(userStr) : {};
      } catch (e) {
        console.log('Erro ao fazer parse do usuário:', userStr);
      }
      console.log('Usuário logado:', user);
      const isUserAdmin = user.role === 'admin';
      setIsAdmin(isUserAdmin);
      
      // Verificar se o vendedor pode editar (admin sempre pode, vendedor só se status for 'pending')
      if (!isUserAdmin) {
        // Vendedor só pode editar se a locação estiver aguardando aprovação (status 'pending')
        const canSellerEdit = rentalData.status === 'pending';
        setCanEdit(canSellerEdit);
      } else {
        setCanEdit(true); // Admin sempre pode editar
      }
      
      console.log('RentalFormPage - rentalData received:', rentalData);
      console.log('RentalFormPage - rentalData.event_date:', rentalData.event_date);
      console.log('RentalFormPage - rentalData.event_date_return:', rentalData.event_date_return);
      
      const formValues = {
        ...formik.values,
        client_id: rentalData.client_id,
        vehicle_id: rentalData.vehicle_id,
        driver_id: rentalData.driver_id,
        event_date: rentalData.event_date,
        event_date_return: rentalData.event_date_return || rentalData.event_date,
        start_time: rentalData.start_time,
        end_time: rentalData.end_time,
        pickup_location: rentalData.pickup_location,
        dropoff_location: rentalData.dropoff_location || '',
        category: rentalData.category || '',
        contact_method: rentalData.contact_method || 'whatsapp',
        payment_method: rentalData.payment_method || 'pix',
        total_value: rentalData.total_value || 0,
        situation: (rentalData.situation || '') as '' | 'adiado' | 'remarcado',
        payment_description: rentalData.payment_description || '',
        route_description: rentalData.route_description || '',
        pit_stop_details: rentalData.pit_stop_details || '',
        pit_stop: rentalData.pit_stop || false,

        total_hours: rentalData.total_hours || 1,
        base_price: rentalData.base_price || 0,
        net_amount: rentalData.net_amount || 0,
        additional_costs: rentalData.additional_costs || 0,
        total_cost: rentalData.total_cost || 0,
      };
      
      console.log('RentalFormPage - setting form values:', formValues);
      formik.setValues(formValues);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar locação');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleCourtesiesChange = (totalValue: number) => {
    setCourtesiesTotal(totalValue);
    
    // CORTESIAS SÃO CUSTOS - recalcular valor líquido
    const newNetAmount = formik.values.total_value - totalValue;
    
    formik.setFieldValue('net_amount', Math.max(0, newNetAmount));
    formik.setFieldValue('total_cost', totalValue);
  };

  const handleBack = () => {
    navigate('/rentals');
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Buscar arquivos ao carregar locação
  const fetchFiles = async () => {
    if (!id) return;
    try {
      const filesList = await rentalService.listFiles(id);
      setFiles(filesList);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Erro ao listar arquivos', severity: 'error' });
    }
  };

  useEffect(() => {
    if (isEditing && id) {
      fetchFiles();
    }
  }, [isEditing, id]);

  // Atualizar upload para múltiplos arquivos
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (!fileList || !id) return;
    setLoading(true);
    try {
      for (let i = 0; i < fileList.length; i++) {
        await rentalService.uploadFile(id, fileList[i]);
      }
      setSnackbar({ open: true, message: 'Arquivo(s) enviado(s) com sucesso!', severity: 'success' });
      await fetchFiles();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Erro ao enviar arquivo', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Download de arquivo individual
  const handleDownloadFile = async (fileId: string, fileName: string) => {
    if (!id) return;
    try {
      await rentalService.downloadFile(id, fileId, fileName);
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Erro ao baixar arquivo', severity: 'error' });
    }
  };

  // Exclusão de arquivo individual (apenas admin)
  const handleDeleteFile = async (fileId: string) => {
    if (!id) return;
    
    // Verificar se o usuário é admin
    if (!isAdmin) {
      setSnackbar({ 
        open: true, 
        message: 'Apenas administradores podem excluir comprovantes', 
        severity: 'error' 
      });
      return;
    }
    
    if (!window.confirm('Tem certeza que deseja excluir este arquivo?')) return;
    setLoading(true);
    try {
      await rentalService.deleteFile(id, fileId);
      setSnackbar({ open: true, message: 'Arquivo excluído com sucesso!', severity: 'success' });
      await fetchFiles();
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || 'Erro ao excluir arquivo', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const selectedClient = clients.find(client => client.id === formik.values.client_id);



  if (authLoading || initialLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h6" color="error">
          Você precisa estar logado para acessar esta página.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mr: 2 }}>
          Voltar
        </Button>
        <Typography variant="h4" component="h1">
          {isEditing ? 'Editar Locação' : 'Nova Locação'}
        </Typography>
      </Box>

      {/* Alerta para vendedores que não podem editar */}
      {isEditing && !isAdmin && !canEdit && (
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body1">
            <strong>Modo Visualização:</strong> Esta locação já foi aprovada. 
            Você pode visualizar os dados e fazer upload de comprovantes de pagamento, 
            mas não pode editar as informações da locação. 
            Para alterações, solicite ao administrador.
          </Typography>
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
        <Paper sx={{ p: 3 }}>
          <form onSubmit={formik.handleSubmit}>
            <Typography variant="h6" gutterBottom>Dados do Contratante</Typography>
            {selectedClient && (
              <Card variant="outlined" sx={{ mb: 2, p: 2, bgcolor: '#f9f9f9' }}>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
                  <TextField label="CPF" value={selectedClient.cpf || ''} InputProps={{ readOnly: true }} variant="filled" />
                  <TextField label="Telefone" value={selectedClient.phone} InputProps={{ readOnly: true }} variant="filled" />
                  <TextField label="Celular" value={selectedClient.mobile || ''} InputProps={{ readOnly: true }} variant="filled" />
                  <TextField label="Cidade" value={selectedClient.city || ''} InputProps={{ readOnly: true }} variant="filled" />
                  <TextField sx={{ gridColumn: 'span 2' }} label="E-mail" value={selectedClient.email || ''} InputProps={{ readOnly: true }} variant="filled" />
                  <TextField sx={{ gridColumn: 'span 2' }} label="CEP" value={selectedClient.zip_code || ''} InputProps={{ readOnly: true }} variant="filled" />
                  <TextField sx={{ gridColumn: 'span 2' }} label="Endereço" value={selectedClient.address || ''} InputProps={{ readOnly: true }} variant="filled" />
                  <TextField label="Complemento" value={selectedClient.complement || ''} InputProps={{ readOnly: true }} variant="filled" />
                  <TextField label="Bairro" value={selectedClient.neighborhood || ''} InputProps={{ readOnly: true }} variant="filled" />
                </Box>
              </Card>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
              <FormControl fullWidth>
                <InputLabel id="client-label">Cliente *</InputLabel>
                <Select 
                  labelId="client-label" 
                  id="client_id" 
                  name="client_id" 
                  value={clients.length > 0 ? formik.values.client_id : ''} 
                  onChange={formik.handleChange} 
                  error={formik.touched.client_id && Boolean(formik.errors.client_id)} 
                  disabled={!canEdit}
                >
                  {clients.map((client) => (<MenuItem key={client.id} value={client.id}>{client.name}</MenuItem>))}
                </Select>
              </FormControl>
            </Box>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Informações do Evento</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
              <BrazilianDateInput
                id="event_date"
                name="event_date"
                label="Data Partida"
                value={formik.values.event_date}
                onChange={(value) => {
                  console.log('RentalFormPage - event_date onChange called with:', value);
                  console.log('RentalFormPage - current formik values:', formik.values);
                  formik.setFieldValue('event_date', value);
                  console.log('RentalFormPage - after setFieldValue, event_date_return is:', formik.values.event_date_return);
                  // Se a data de retorno estiver vazia, preenche com a mesma data
                  if (!formik.values.event_date_return) {
                    console.log('RentalFormPage - setting event_date_return to:', value);
                    formik.setFieldValue('event_date_return', value);
                  }
                }}
                error={formik.touched.event_date && Boolean(formik.errors.event_date)}
                helperText={formik.touched.event_date && formik.errors.event_date}
                disabled={!canEdit}
              />
              {isEditing && (
                <BrazilianDateInput
                  id="event_date_return"
                  name="event_date_return"
                  label="Data Retorno (opcional)"
                  value={formik.values.event_date_return}
                  onChange={(value) => {
                    console.log('RentalFormPage - event_date_return onChange called with:', value);
                    formik.setFieldValue('event_date_return', value);
                  }}
                  error={formik.touched.event_date_return && Boolean(formik.errors.event_date_return)}
                  helperText={formik.touched.event_date_return && formik.errors.event_date_return}
                  disabled={!canEdit}
                />
              )}
              <BrazilianTimeInput
                id="start_time"
                name="start_time"
                label="Hora Início"
                value={formik.values.start_time}
                onChange={(value) => formik.setFieldValue('start_time', value)}
                error={formik.touched.start_time && Boolean(formik.errors.start_time)}
                helperText={formik.touched.start_time && formik.errors.start_time}
                disabled={!canEdit}
              />
              <BrazilianTimeInput
                id="end_time"
                name="end_time"
                label="Hora Fim"
                value={formik.values.end_time}
                onChange={(value) => formik.setFieldValue('end_time', value)}
                error={formik.touched.end_time && Boolean(formik.errors.end_time)}
                helperText={formik.touched.end_time && formik.errors.end_time}
                disabled={!canEdit}
              />

              <FormControl fullWidth>
                <InputLabel id="vehicle-label">Carro/Limousine*</InputLabel>
                <Select 
                  labelId="vehicle-label" 
                  id="vehicle_id" 
                  name="vehicle_id" 
                  value={vehicles.length > 0 ? formik.values.vehicle_id : ''} 
                  onChange={formik.handleChange} 
                  error={formik.touched.vehicle_id && Boolean(formik.errors.vehicle_id)} 
                  disabled={!canEdit}
                >
                  {vehicles.map((vehicle) => (<MenuItem key={vehicle.id} value={vehicle.id}>{vehicle.name}</MenuItem>))}
                </Select>
              </FormControl>
              <TextField 
                id="total_hours" 
                name="total_hours" 
                label="Horas Totais" 
                type="number" 
                value={formik.values.total_hours} 
                onChange={formik.handleChange} 
                error={formik.touched.total_hours && Boolean(formik.errors.total_hours)} 
                helperText={formik.touched.total_hours && formik.errors.total_hours}
                inputProps={{ min: 0.5, step: 0.5 }}
                disabled={!canEdit}
              />
              <TextField 
                id="category" 
                name="category" 
                label="Categoria do Serviço" 
                value={formik.values.category} 
                onChange={formik.handleChange} 
                disabled={!canEdit}
              />
              <FormControl fullWidth>
                <InputLabel id="driver-label">Motorista*</InputLabel>
                <Select 
                  labelId="driver-label" 
                  id="driver_id" 
                  name="driver_id" 
                  value={drivers.length > 0 ? formik.values.driver_id : ''} 
                  onChange={formik.handleChange} 
                  error={formik.touched.driver_id && Boolean(formik.errors.driver_id)} 
                  disabled={!canEdit}
                >
                  {drivers.map((driver) => (<MenuItem key={driver.id} value={driver.id}>{driver.name}</MenuItem>))}
                </Select>
              </FormControl>

              <TextField 
                sx={{ gridColumn: 'span 2' }} 
                id="pickup_location" 
                name="pickup_location" 
                label="Local de Retirada" 
                value={formik.values.pickup_location} 
                onChange={formik.handleChange} 
                error={formik.touched.pickup_location && Boolean(formik.errors.pickup_location)} 
                helperText={formik.touched.pickup_location && formik.errors.pickup_location} 
                disabled={!canEdit}
              />
              <TextField 
                sx={{ gridColumn: 'span 2' }} 
                id="dropoff_location" 
                name="dropoff_location" 
                label="Local de Entrega" 
                value={formik.values.dropoff_location} 
                onChange={formik.handleChange} 
                disabled={!canEdit}
              />
              
              <FormControl fullWidth>
                <InputLabel id="payment-method-label">Forma de Pagamento*</InputLabel>
                <Select 
                  labelId="payment-method-label" 
                  id="payment_method" 
                  name="payment_method" 
                  value={formik.values.payment_method} 
                  onChange={formik.handleChange} 
                  error={formik.touched.payment_method && Boolean(formik.errors.payment_method)}
                  disabled={!canEdit}
                >
                  <MenuItem value="a_vista">À vista</MenuItem>
                  <MenuItem value="pagseguro">PagSeguro</MenuItem>
                  <MenuItem value="credito">Crédito</MenuItem>
                  <MenuItem value="debito">Débito</MenuItem>
                  <MenuItem value="cheque">Cheque</MenuItem>
                  <MenuItem value="permuta">Permuta</MenuItem>
                  <MenuItem value="outros">Outros</MenuItem>
                  <MenuItem value="cupom">Cupom</MenuItem>
                  <MenuItem value="pix">PIX</MenuItem>
                </Select>
              </FormControl>

              <TextField 
                id="total_value" 
                name="total_value" 
                label="Valor Total (Bruto)*" 
                type="number" 
                value={formik.values.total_value} 
                onChange={(e) => {
                  const newTotalValue = parseFloat(e.target.value) || 0;
                  formik.setFieldValue('total_value', newTotalValue);
                  // RECALCULAR VALOR LÍQUIDO
                  const newNetAmount = newTotalValue - courtesiesTotal;
                  formik.setFieldValue('net_amount', Math.max(0, newNetAmount));
                }} 
                error={formik.touched.total_value && Boolean(formik.errors.total_value)} 
                helperText={formik.touched.total_value && formik.errors.total_value} 
                InputProps={{ 
                  startAdornment: <InputAdornment position="start">R$</InputAdornment> 
                }}
                inputProps={{ min: 0, step: 0.01 }}
                disabled={!canEdit}
              />

              <FormControl fullWidth>
                <InputLabel id="situation-label">Situação</InputLabel>
                <Select 
                  labelId="situation-label" 
                  id="situation" 
                  name="situation" 
                  value={formik.values.situation} 
                  onChange={formik.handleChange}
                  disabled={!canEdit}
                >
                  <MenuItem value=""><em>Nenhum</em></MenuItem>
                  <MenuItem value="adiado">Adiado</MenuItem>
                  <MenuItem value="remarcado">Remarcado</MenuItem>
                </Select>
              </FormControl>

              <TextField 
                id="payment_description" 
                name="payment_description" 
                label="Descrição do Pagamento" 
                value={formik.values.payment_description} 
                onChange={formik.handleChange} 
                disabled={!canEdit}
              />
              
              {/* BREAKDOWN DOS VALORES */}
              <TextField 
                id="net_amount" 
                name="net_amount" 
                label="Valor Líquido" 
                type="number" 
                value={formik.values.net_amount} 
                InputProps={{ 
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  readOnly: true,
                }} 
                variant="filled"
                helperText="Valor Total (Bruto) - Cortesias"
                disabled={!canEdit}
              />
              
              <TextField 
                id="total_cost" 
                name="total_cost" 
                label="Total de Cortesias" 
                type="number" 
                value={formik.values.total_cost} 
                InputProps={{ 
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                  readOnly: true,
                }} 
                variant="filled"
                helperText="Custos operacionais (cortesias)"
                disabled={!canEdit}
              />

            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Configurações de Pitstop</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mb: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formik.values.pit_stop}
                    onChange={(e) => formik.setFieldValue('pit_stop', e.target.checked)}
                    name="pit_stop"
                    color="primary"
                    disabled={!canEdit}
                  />
                }
                label="Incluir Pitstop"
                sx={{ gridColumn: 'span 1' }}
              />
            </Box>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Informações Adicionais</Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2, mt: 2 }}>
              <TextField 
                id="route_description" 
                name="route_description" 
                label="Descrição da Rota" 
                multiline 
                rows={4} 
                value={formik.values.route_description} 
                onChange={formik.handleChange} 
                sx={{ gridColumn: 'span 1' }} 
                disabled={!canEdit}
              />
              <TextField 
                id="pit_stop_details" 
                name="pit_stop_details" 
                label="Detalhes do Pitstop" 
                multiline 
                rows={4} 
                value={formik.values.pit_stop_details} 
                onChange={formik.handleChange} 
                sx={{ gridColumn: 'span 1' }}
                disabled={!formik.values.pit_stop || !canEdit}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
              <Button variant="outlined" onClick={handleBack} disabled={loading}>Cancelar</Button>
              <Button 
                type="submit" 
                variant="contained" 
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />} 
                disabled={loading || !formik.isValid || !canEdit}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </Button>
            </Box>
          </form>
        </Paper>

        <Box>
        {isEditing && id && (
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">Comprovantes</Typography>
              <Box sx={{ mt: 2 }}>
                {files.length === 0 ? (
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                    Nenhum arquivo enviado
                  </Typography>
                ) : (
                  <List dense>
                    {files.map((file) => (
                      <ListItem key={file.id} divider>
                        <ListItemText
                          primary={file.original_name}
                          secondary={`Enviado por: ${file.uploaded_by_name || 'Usuário'} em ${new Date(file.created_at).toLocaleString()}`}
                        />
                        <ListItemSecondaryAction>
                          <IconButton edge="end" aria-label="download" onClick={() => handleDownloadFile(file.rental_id, file.original_name)}>
                            <DownloadIcon />
                          </IconButton>
                          {isAdmin && (
                            <IconButton edge="end" aria-label="delete" color="error" onClick={() => handleDeleteFile(file.id)}>
                              <DeleteIcon />
                            </IconButton>
                          )}
                        </ListItemSecondaryAction>
                      </ListItem>
                    ))}
                  </List>
                )}
                <Button 
                  variant="contained" 
                  component="label" 
                  fullWidth
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? 'Enviando...' : 'Upload Arquivo(s)'}
                  <input 
                    type="file" 
                    hidden 
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                    multiple
                    onChange={handleFileUpload}
                  />
                </Button>
              </Box>
            </Paper>
          )}
          <RentalCourtesies 
            key={`courtesies-${id || 'new'}`} 
            rentalId={id || 'new'} 
            onCourtesiesChange={handleCourtesiesChange} 
            disabled={!canEdit}
          />
          {isEditing && id && (
            <RentalPayments key={`payments-${id}`} rentalId={id} disabled={!canEdit} />
          )}
          </Box>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}; 