import React from 'react';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
} from '@mui/material';
import {
  Settings,
  Person,
  Business,
  Notifications,
  Security,
  Backup,
  Help,
} from '@mui/icons-material';

export const SettingsPage: React.FC = () => {
  const settingsSections = [
    {
      title: 'Perfil do Usuário',
      description: 'Gerenciar informações pessoais e preferências',
      icon: <Person />,
      path: '/profile',
    },
    {
      title: 'Configurações da Empresa',
      description: 'Dados da empresa, endereço e contatos',
      icon: <Business />,
      path: '/settings/company',
    },
    {
      title: 'Notificações',
      description: 'Configurar alertas e notificações do sistema',
      icon: <Notifications />,
      path: '/settings/notifications',
    },
    {
      title: 'Segurança',
      description: 'Senhas, autenticação e permissões',
      icon: <Security />,
      path: '/settings/security',
    },
    {
      title: 'Backup e Restauração',
      description: 'Configurar backup automático dos dados',
      icon: <Backup />,
      path: '/settings/backup',
    },
    {
      title: 'Ajuda e Suporte',
      description: 'Documentação e contato para suporte',
      icon: <Help />,
      path: '/settings/help',
    },
  ];

  const handleSettingClick = (setting: string) => {
    // Placeholder for settings navigation
    console.log(`Acessando configuração: ${setting}`);
    alert(`Funcionalidade "${setting}" será implementada em breve!`);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Settings sx={{ mr: 2, fontSize: 40 }} />
        <Typography variant="h4" component="h1">
          Configurações
        </Typography>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Gerencie as configurações do sistema e suas preferências pessoais.
      </Typography>

      <Paper sx={{ maxWidth: 800 }}>
        <List>
          {settingsSections.map((section, index) => (
            <React.Fragment key={index}>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleSettingClick(section.title)}>
                  <ListItemIcon sx={{ color: 'primary.main' }}>
                    {section.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={section.title}
                    secondary={section.description}
                    primaryTypographyProps={{
                      variant: 'h6',
                      sx: { fontWeight: 500 }
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {index < settingsSections.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Paper>

      <Paper sx={{ p: 3, mt: 4, maxWidth: 800 }}>
        <Typography variant="h6" gutterBottom>
          Informações do Sistema
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 2 }}>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Versão do Sistema
            </Typography>
            <Typography variant="body1">
              KingSystem v1.0.0
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Última Atualização
            </Typography>
            <Typography variant="body1">
              {new Date().toLocaleDateString('pt-BR')}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Status do Sistema
            </Typography>
            <Typography variant="body1" sx={{ color: 'success.main' }}>
              Online
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2" color="text.secondary">
              Banco de Dados
            </Typography>
            <Typography variant="body1" sx={{ color: 'success.main' }}>
              Conectado
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, mt: 4, maxWidth: 800 }}>
        <Typography variant="h6" gutterBottom>
          Próximas Funcionalidades
        </Typography>
        <Typography variant="body2" color="text.secondary">
          • Configurações avançadas de usuário<br />
          • Gestão de permissões e roles<br />
          • Configurações de email e notificações<br />
          • Backup automático configurável<br />
          • Integração com sistemas externos<br />
          • Personalização de temas e cores
        </Typography>
      </Paper>
    </Box>
  );
}; 