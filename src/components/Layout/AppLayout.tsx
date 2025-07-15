import React, { useState } from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Menu,
  MenuItem as MuiMenuItem,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material';
import {
  AccountCircle,
  Logout,
  Dashboard,
  People,
  DirectionsCar,
  Person,
  Receipt,
  Assessment,
  Settings,
  AttachMoney,
  Menu as MenuIcon,
  Email,
  SupervisorAccount,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface SubMenuItem {
  text: string;
  path: string;
  icon?: React.ComponentType;
}

const menuItems = [
  { 
    text: 'INÍCIO', 
    icon: Dashboard, 
    path: '/dashboard',
    roles: ['admin', 'seller']
  },
  { 
    text: 'E-MAILS', 
    icon: Email, 
    path: '/emails',
    roles: ['admin', 'seller']
  },
  { 
    text: 'CLIENTES', 
    icon: People, 
    path: '/clients',
    roles: ['admin', 'seller']
  },
  { 
    text: 'LOCAÇÕES', 
    icon: Receipt, 
    path: '/rentals',
    roles: ['admin', 'seller']
  },
  { 
    text: 'CUSTOS', 
    icon: AttachMoney, 
    path: '/costs',
    roles: ['admin', 'seller']
  },
  { 
    text: 'RELATÓRIOS', 
    icon: Assessment, 
    path: '/reports',
    roles: ['admin']
  },
  { 
    text: 'MÓDULOS', 
    icon: Settings, 
    path: '/modules',
    dropdown: true,
    roles: ['admin'],
    subItems: [
      { text: 'Consultores', path: '/consultores', icon: SupervisorAccount },
      { text: 'Veículos', path: '/vehicles', icon: DirectionsCar },
      { text: 'Motoristas', path: '/drivers', icon: Person },
    ]
  },
  { 
    text: 'FINANCEIRO', 
    icon: AttachMoney, 
    path: '/financeiro',
    roles: ['admin']
  },
];

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [dropdownAnchors, setDropdownAnchors] = useState<{ [key: string]: HTMLElement | null }>({});
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => 
    item.roles?.includes(user?.role || 'seller')
  );

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileDrawerToggle = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    handleMenuClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileDrawerOpen(false); // Fechar drawer mobile após navegação
    // Fechar todos os dropdowns
    setDropdownAnchors({});
  };

  const handleDropdownOpen = (event: React.MouseEvent<HTMLElement>, itemText: string) => {
    setDropdownAnchors(prev => ({
      ...prev,
      [itemText]: event.currentTarget
    }));
  };

  const handleDropdownClose = (itemText: string) => {
    setDropdownAnchors(prev => ({
      ...prev,
      [itemText]: null
    }));
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ bgcolor: '#2c3e50', color: '#fff' }}>
        <Box
          component="img"
          src="/images/download.png"
          alt="Logo King"
          sx={{ height: 32, width: 'auto', mr: 2 }}
        />
        <Typography variant="h6" noWrap component="div">
          King System
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.path.split('?')[0]);
          
          if (item.dropdown && item.subItems) {
            return (
              <Box key={item.text}>
                <ListItem disablePadding>
                  <ListItemButton
                    sx={{
                      bgcolor: isActive ? 'rgba(44, 62, 80, 0.08)' : 'transparent',
                      color: isActive ? '#2c3e50' : 'inherit',
                      fontWeight: isActive ? 700 : 400,
                      '&:hover': {
                        bgcolor: 'rgba(44, 62, 80, 0.12)',
                      },
                    }}
                  >
                    <ListItemIcon sx={{ color: isActive ? '#2c3e50' : 'inherit' }}>
                      <item.icon />
                    </ListItemIcon>
                    <ListItemText primary={item.text} />
                  </ListItemButton>
                </ListItem>
                {item.subItems.map((subItem) => (
                  <ListItem key={subItem.path} disablePadding sx={{ pl: 4 }}>
                    <ListItemButton
                      onClick={() => handleNavigation(subItem.path)}
                      sx={{
                        fontSize: '0.875rem',
                        '&:hover': {
                          bgcolor: 'rgba(44, 62, 80, 0.08)',
                        },
                      }}
                    >
                                             {(subItem as any).icon && (
                         <ListItemIcon sx={{ minWidth: 32 }}>
                           {React.createElement((subItem as any).icon, { fontSize: 'small' })}
                         </ListItemIcon>
                       )}
                      <ListItemText 
                        primary={subItem.text}
                        sx={{ 
                          '& .MuiListItemText-primary': { 
                            fontSize: '0.875rem' 
                          } 
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </Box>
            );
          }

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleNavigation(item.path)}
                sx={{
                  bgcolor: isActive ? 'rgba(44, 62, 80, 0.08)' : 'transparent',
                  color: isActive ? '#2c3e50' : 'inherit',
                  fontWeight: isActive ? 700 : 400,
                  '&:hover': {
                    bgcolor: 'rgba(44, 62, 80, 0.12)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? '#2c3e50' : 'inherit' }}>
                  <item.icon />
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar position="fixed" sx={{ bgcolor: '#2c3e50', zIndex: 1201 }}>
        <Toolbar sx={{ minHeight: 56, display: 'flex', justifyContent: 'space-between', px: 2 }}>
          {/* Logo e navegação */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Menu hamburguer para mobile */}
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleMobileDrawerToggle}
              sx={{ display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            
            <Box
              component="img"
              src="/images/download.png"
              alt="Logo King"
              sx={{ height: 36, width: 'auto', mr: 2, cursor: 'pointer' }}
              onClick={() => navigate('/dashboard')}
            />
            
            {/* Navegação desktop */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
              {filteredMenuItems.map((item) => {
                const isActive = location.pathname.startsWith(item.path.split('?')[0]);
                
                if (item.dropdown && item.subItems) {
                  return (
                    <Box key={item.text}>
                      <Button
                        startIcon={<item.icon fontSize="small" />}
                        endIcon={<KeyboardArrowDown fontSize="small" />}
                        onClick={(e) => handleDropdownOpen(e, item.text)}
                        sx={{
                          color: isActive ? '#fff' : '#ecf0f1',
                          bgcolor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                          fontWeight: isActive ? 700 : 400,
                          borderRadius: 2,
                          px: 2,
                          textTransform: 'none',
                          '&:hover': {
                            bgcolor: 'rgba(255,255,255,0.12)',
                          },
                        }}
                      >
                        {item.text}
                      </Button>
                      <Menu
                        anchorEl={dropdownAnchors[item.text]}
                        open={Boolean(dropdownAnchors[item.text])}
                        onClose={() => handleDropdownClose(item.text)}
                        MenuListProps={{
                          'aria-labelledby': 'basic-button',
                        }}
                        sx={{
                          '& .MuiPaper-root': {
                            mt: 1,
                            minWidth: 180,
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                          }
                        }}
                      >
                        {item.subItems.map((subItem) => (
                          <MuiMenuItem 
                            key={subItem.path}
                            onClick={() => {
                              handleNavigation(subItem.path);
                              handleDropdownClose(item.text);
                            }}
                            sx={{
                              fontSize: '0.875rem',
                              py: 1,
                              px: 2,
                              '&:hover': {
                                bgcolor: 'rgba(44, 62, 80, 0.08)',
                              }
                            }}
                          >
                            {(subItem as any).icon && (
                              <ListItemIcon sx={{ minWidth: 32, mr: 1 }}>
                                {React.createElement((subItem as any).icon, { fontSize: 'small' })}
                              </ListItemIcon>
                            )}
                            {subItem.text}
                          </MuiMenuItem>
                        ))}
                      </Menu>
                    </Box>
                  );
                }

                return (
                  <Button
                    key={item.text}
                    startIcon={<item.icon fontSize="small" />}
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      color: isActive ? '#fff' : '#ecf0f1',
                      bgcolor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
                      fontWeight: isActive ? 700 : 400,
                      borderRadius: 2,
                      px: 2,
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.12)',
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                );
              })}
            </Box>
          </Box>
          
          {/* Usuário à direita */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" sx={{ color: '#fff', mr: 1, fontWeight: 500, display: { xs: 'none', sm: 'block' } }}>
              {user?.name || user?.email}
            </Typography>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuClick}
              sx={{ color: '#fff' }}
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MuiMenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                <AccountCircle fontSize="small" sx={{ mr: 1 }} /> Perfil
              </MuiMenuItem>
              <MuiMenuItem onClick={handleLogout}>
                <Logout fontSize="small" sx={{ mr: 1 }} /> Sair
              </MuiMenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Drawer para mobile */}
      <Drawer
        variant="temporary"
        open={mobileDrawerOpen}
        onClose={handleMobileDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Espaço para compensar a AppBar fixa */}
      <Toolbar sx={{ minHeight: 56 }} />
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
}; 